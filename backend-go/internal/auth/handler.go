package auth

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	db         *pgxpool.Pool
	jwtManager *JWTManager
}

func NewHandler(db *pgxpool.Pool, jwt *JWTManager) *Handler {
	return &Handler{db: db, jwtManager: jwt}
}

// ── Register ─────────────────────────────────────────────
type registerRequest struct {
	Name     string `json:"name"     binding:"required,min=2,max=100"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

func (h *Handler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Check duplicate
	var exists bool
	err := h.db.QueryRow(context.Background(),
		`SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`, req.Email,
	).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		return
	}

	// Hash password (bcrypt cost 12)
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "password hashing failed"})
		return
	}

	userID := uuid.NewString()
	_, err = h.db.Exec(context.Background(),
		`INSERT INTO users (id, name, email, password_hash, created_at)
		 VALUES ($1, $2, $3, $4, NOW())`,
		userID, req.Name, req.Email, string(hashed),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create user"})
		return
	}

	h.issueTokenPair(c, userID, req.Email)
}

// ── Login ───────────────────────────────────────────────
type loginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	var userID, hashedPwd string
	err := h.db.QueryRow(context.Background(),
		`SELECT id, password_hash FROM users WHERE email=$1`, req.Email,
	).Scan(&userID, &hashedPwd)
	if err != nil {
		// Constant-time response to prevent user enumeration
		bcrypt.CompareHashAndPassword([]byte("$2a$12$dummy"), []byte(req.Password))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPwd), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	h.issueTokenPair(c, userID, req.Email)
}

// ── Refresh ────────────────────────────────────────────
type refreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func (h *Handler) Refresh(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims, err := h.jwtManager.VerifyRefreshToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	// Check token not revoked
	var revoked bool
	h.db.QueryRow(context.Background(),
		`SELECT EXISTS(SELECT 1 FROM revoked_tokens WHERE jti=$1)`, claims.ID,
	).Scan(&revoked)
	if revoked {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "token revoked"})
		return
	}

	var email string
	err = h.db.QueryRow(context.Background(),
		`SELECT email FROM users WHERE id=$1`, claims.Subject,
	).Scan(&email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	h.issueTokenPair(c, claims.Subject, email)
}

// ── Logout ─────────────────────────────────────────────
func (h *Handler) Logout(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	claims, err := h.jwtManager.VerifyRefreshToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "logged out"})
		return
	}
	h.db.Exec(context.Background(),
		`INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
		claims.ID, claims.ExpiresAt.Time,
	)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

// ── Me ──────────────────────────────────────────────────
func (h *Handler) Me(c *gin.Context) {
	userID := c.GetString("user_id")

	var user struct {
		ID        string    `json:"id"`
		Name      string    `json:"name"`
		Email     string    `json:"email"`
		CreatedAt time.Time `json:"created_at"`
	}
	err := h.db.QueryRow(context.Background(),
		`SELECT id, name, email, created_at FROM users WHERE id=$1`, userID,
	).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// ── Helper ────────────────────────────────────────────
func (h *Handler) issueTokenPair(c *gin.Context, userID, email string) {
	access, err := h.jwtManager.GenerateAccessToken(userID, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}
	refresh, err := h.jwtManager.GenerateRefreshToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"access_token":  access,
		"refresh_token": refresh,
		"expires_in":    int(AccessTokenTTL.Seconds()),
	})
}
