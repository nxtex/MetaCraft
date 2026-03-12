package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nxtex/metacraft/internal/auth"
	"github.com/nxtex/metacraft/internal/db"
	"github.com/nxtex/metacraft/internal/files"
	"github.com/nxtex/metacraft/internal/middleware"
	"github.com/nxtex/metacraft/internal/storage"
)

func main() {
	// ── Database ──────────────────────────────────────
	pool, err := db.Connect(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}
	defer pool.Close()

	// ── MinIO ──────────────────────────────────────────
	minioClient, err := storage.NewMinIO(
		os.Getenv("MINIO_ENDPOINT"),
		os.Getenv("MINIO_ACCESS_KEY"),
		os.Getenv("MINIO_SECRET_KEY"),
		os.Getenv("MINIO_BUCKET"),
	)
	if err != nil {
		log.Fatalf("MinIO connection failed: %v", err)
	}

	// ── JWT ─────────────────────────────────────────────
	jwtManager, err := auth.NewJWTManager(
		os.Getenv("JWT_PRIVATE_KEY_PATH"),
		os.Getenv("JWT_PUBLIC_KEY_PATH"),
	)
	if err != nil {
		log.Fatalf("JWT init failed: %v", err)
	}

	// ── Gin router ──────────────────────────────────────
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_ORIGIN")},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           43200,
	}))

	// ── Handlers ───────────────────────────────────────
	authHandler := auth.NewHandler(pool, jwtManager)
	filesHandler := files.NewHandler(pool, minioClient,
		os.Getenv("PYTHON_SERVICE_URL"),
		os.Getenv("R_SERVICE_URL"),
		os.Getenv("INTERNAL_API_KEY"),
	)
	authMW := middleware.NewAuthMiddleware(jwtManager)

	// ── Routes ─────────────────────────────────────────
	v1 := r.Group("/api")
	{
		a := v1.Group("/auth")
		{
			a.POST("/register", authHandler.Register)
			a.POST("/login", authHandler.Login)
			a.POST("/refresh", authHandler.Refresh)
			a.POST("/logout", authMW.RequireAuth(), authHandler.Logout)
			a.GET("/me", authMW.RequireAuth(), authHandler.Me)
		}

		f := v1.Group("/files", authMW.RequireAuth())
		{
			f.POST("/upload", filesHandler.Upload)
			f.GET("/history", filesHandler.History)
			f.GET("/:id", filesHandler.GetFile)
			f.GET("/:id/metadata", filesHandler.GetMetadata)
			f.PATCH("/:id/metadata", filesHandler.UpdateMetadata)
			f.DELETE("/:id", filesHandler.DeleteFile)
			f.POST("/batch/analyze", filesHandler.BatchAnalyze)
		}

		v1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})
	}

	log.Println("MetaCraft API listening on :8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
