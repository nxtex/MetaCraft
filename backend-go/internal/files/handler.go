package files

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nxtex/metacraft/internal/storage"
)

var allowedMIME = map[string]bool{
	"image/jpeg": true, "image/png": true, "image/tiff": true,
	"audio/mpeg": true, "audio/wav": true, "audio/flac": true,
	"application/pdf": true,
	"video/mp4": true, "video/quicktime": true,
}

const maxFileSize = 100 << 20 // 100 MB

type Handler struct {
	db            *pgxpool.Pool
	storage       *storage.MinIOClient
	pythonURL     string
	rURL          string
	internalAPIKey string
}

func NewHandler(db *pgxpool.Pool, s *storage.MinIOClient, pythonURL, rURL, apiKey string) *Handler {
	return &Handler{db: db, storage: s, pythonURL: pythonURL, rURL: rURL, internalAPIKey: apiKey}
}

// ── Upload ─────────────────────────────────────────────
func (h *Handler) Upload(c *gin.Context) {
	userID := c.GetString("user_id")

	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxFileSize)
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file too large or invalid form"})
		return
	}

	fh, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file provided"})
		return
	}
	defer fh.Close()

	// Validate MIME by reading first 512 bytes
	buf := make([]byte, 512)
	n, _ := fh.Read(buf)
	detectedMIME := http.DetectContentType(buf[:n])
	if _, ok := allowedMIME[detectedMIME]; !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("unsupported file type: %s", detectedMIME)})
		return
	}
	// Reset reader
	fh.Seek(0, io.SeekStart)

	fileID := uuid.NewString()
	ext := strings.ToLower(filepath.Ext(header.Filename))
	objectKey := fmt.Sprintf("%s/%s%s", userID, fileID, ext)

	// Upload to MinIO
	if err := h.storage.Upload(c.Request.Context(), objectKey, fh, header.Size, detectedMIME); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "storage upload failed"})
		return
	}

	// Call Python service to extract metadata
	metadata, err := h.callPythonExtract(objectKey, detectedMIME)
	if err != nil {
		metadata = map[string]interface{}{"error": "metadata extraction failed"}
	}

	metaJSON, _ := json.Marshal(metadata)

	// Persist to DB
	_, err = h.db.Exec(context.Background(),
		`INSERT INTO files (id, user_id, original_name, object_key, mime_type, size_bytes, metadata, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
		fileID, userID, header.Filename, objectKey, detectedMIME, header.Size, string(metaJSON),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db insert failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"file_id":  fileID,
		"name":     header.Filename,
		"mime":     detectedMIME,
		"size":     header.Size,
		"metadata": metadata,
	})
}

// ── History ───────────────────────────────────────────
func (h *Handler) History(c *gin.Context) {
	userID := c.GetString("user_id")
	rows, err := h.db.Query(context.Background(),
		`SELECT id, original_name, mime_type, size_bytes, created_at
		 FROM files WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	defer rows.Close()

	type fileRow struct {
		ID           string    `json:"id"`
		OriginalName string    `json:"original_name"`
		MimeType     string    `json:"mime_type"`
		SizeBytes    int64     `json:"size_bytes"`
		CreatedAt    time.Time `json:"created_at"`
	}
	var result []fileRow
	for rows.Next() {
		var r fileRow
		if err := rows.Scan(&r.ID, &r.OriginalName, &r.MimeType, &r.SizeBytes, &r.CreatedAt); err != nil {
			continue
		}
		result = append(result, r)
	}
	c.JSON(http.StatusOK, result)
}

// ── GetFile ──────────────────────────────────────────
func (h *Handler) GetFile(c *gin.Context) {
	userID := c.GetString("user_id")
	fileID := c.Param("id")

	var objectKey string
	err := h.db.QueryRow(context.Background(),
		`SELECT object_key FROM files WHERE id=$1 AND user_id=$2`, fileID, userID,
	).Scan(&objectKey)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	url, err := h.storage.PresignedURL(c.Request.Context(), objectKey, 15*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate download url"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"download_url": url})
}

// ── GetMetadata ──────────────────────────────────────
func (h *Handler) GetMetadata(c *gin.Context) {
	userID := c.GetString("user_id")
	fileID := c.Param("id")

	var metaJSON string
	err := h.db.QueryRow(context.Background(),
		`SELECT metadata FROM files WHERE id=$1 AND user_id=$2`, fileID, userID,
	).Scan(&metaJSON)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}
	c.Data(http.StatusOK, "application/json", []byte(metaJSON))
}

// ── UpdateMetadata ──────────────────────────────────
func (h *Handler) UpdateMetadata(c *gin.Context) {
	userID := c.GetString("user_id")
	fileID := c.Param("id")

	var payload map[string]interface{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	var objectKey, mimeType string
	err := h.db.QueryRow(context.Background(),
		`SELECT object_key, mime_type FROM files WHERE id=$1 AND user_id=$2`, fileID, userID,
	).Scan(&objectKey, &mimeType)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	// Call Python edit service
	updated, err := h.callPythonEdit(objectKey, mimeType, payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "metadata edit failed"})
		return
	}

	metaJSON, _ := json.Marshal(updated)
	h.db.Exec(context.Background(),
		`UPDATE files SET metadata=$1, updated_at=NOW() WHERE id=$2`, string(metaJSON), fileID,
	)
	c.JSON(http.StatusOK, updated)
}

// ── DeleteFile ────────────────────────────────────────
func (h *Handler) DeleteFile(c *gin.Context) {
	userID := c.GetString("user_id")
	fileID := c.Param("id")

	var objectKey string
	err := h.db.QueryRow(context.Background(),
		`SELECT object_key FROM files WHERE id=$1 AND user_id=$2`, fileID, userID,
	).Scan(&objectKey)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	h.storage.Delete(c.Request.Context(), objectKey)
	h.db.Exec(context.Background(), `DELETE FROM files WHERE id=$1`, fileID)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// ── BatchAnalyze ─────────────────────────────────────
func (h *Handler) BatchAnalyze(c *gin.Context) {
	userID := c.GetString("user_id")

	var body struct {
		FileIDs []string `json:"file_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch metadata for requested files
	rows, err := h.db.Query(context.Background(),
		`SELECT id, original_name, mime_type, size_bytes, metadata, created_at
		 FROM files WHERE id = ANY($1) AND user_id=$2`,
		body.FileIDs, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	defer rows.Close()

	type fileEntry struct {
		ID       string                 `json:"id"`
		Name     string                 `json:"name"`
		Mime     string                 `json:"mime"`
		Size     int64                  `json:"size"`
		Meta     map[string]interface{} `json:"metadata"`
		CreatedAt time.Time             `json:"created_at"`
	}
	var entries []fileEntry
	for rows.Next() {
		var e fileEntry
		var metaRaw string
		if err := rows.Scan(&e.ID, &e.Name, &e.Mime, &e.Size, &metaRaw, &e.CreatedAt); err != nil {
			continue
		}
		json.Unmarshal([]byte(metaRaw), &e.Meta)
		entries = append(entries, e)
	}

	// Call R service for statistical analysis
	analysis, err := h.callRAnalyze(entries)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "R analysis failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"files": entries, "analysis": analysis})
}

// ── Internal service calls ────────────────────────────
func (h *Handler) callPythonExtract(objectKey, mimeType string) (map[string]interface{}, error) {
	body, _ := json.Marshal(map[string]string{"object_key": objectKey, "mime_type": mimeType})
	req, _ := http.NewRequest("POST", h.pythonURL+"/extract", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", h.internalAPIKey)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

func (h *Handler) callPythonEdit(objectKey, mimeType string, edits map[string]interface{}) (map[string]interface{}, error) {
	body, _ := json.Marshal(map[string]interface{}{"object_key": objectKey, "mime_type": mimeType, "edits": edits})
	req, _ := http.NewRequest("POST", h.pythonURL+"/edit", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", h.internalAPIKey)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

func (h *Handler) callRAnalyze(entries interface{}) (map[string]interface{}, error) {
	body, _ := json.Marshal(map[string]interface{}{"files": entries})
	req, _ := http.NewRequest("POST", h.rURL+"/analyze", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", h.internalAPIKey)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}
