package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"

	"backend_go/handlers"
	"backend_go/models"
	"backend_go/services"
	"backend_go/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Connect to database - using SQLite for development
	db, err := gorm.Open(sqlite.Open("elaccess.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(
		&models.User{},
		&models.Task{},
		&models.Submission{},
		&models.WalletTransaction{},
		&models.Notification{},
		&models.PeerHelpRequest{},
		&models.ChatMessage{},
		&models.DailyMultiplier{},
	)

	// Initialize services
	service := services.NewService(db)
	handler := handlers.NewHandler(service)

	// Setup Gin router
	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Define routes
	api := r.Group("/api")
	{
		// Auth routes (handled by Go backend)
		auth := api.Group("/auth")
		{
			auth.POST("/login", handler.Login)
			auth.POST("/register", handler.Register)
			auth.GET("/me", validateJWT(), handler.GetCurrentUser)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(validateJWT())
		{
			// User routes (handled by Go backend)
			protected.GET("/users/profile", handler.GetProfile)
			protected.PUT("/users/profile", handler.UpdateProfile)
			protected.GET("/users/leaderboard", handler.GetLeaderboard)

			// Task routes (handled by Go backend for core functionality)
			protected.GET("/tasks", handler.GetTasks)
			protected.GET("/tasks/:task_id", handler.GetTask)
			protected.POST("/tasks", handler.CreateTask)
			protected.PUT("/tasks/:task_id", handler.UpdateTask)
			protected.GET("/tasks/hot", handler.GetHotTasks)
			protected.POST("/tasks/:task_id/submit", handler.SubmitTask)
			protected.GET("/tasks/submissions", handler.GetUserSubmissions)

			// Wallet routes (handled by Go backend)
			protected.GET("/wallet/balance", handler.GetBalance)
			protected.GET("/wallet/transactions", handler.GetTransactions)

			// Dashboard route (handled by Go backend)
			protected.GET("/access/dashboard", handler.GetDashboardData)

			// Notification routes (redirected to NodeJS backend)
			protected.GET("/notifications", func(c *gin.Context) {
				redirectToBackend(c, "nodejs", "/api/notifications")
			})
			protected.POST("/notifications", func(c *gin.Context) {
				redirectToBackend(c, "nodejs", "/api/notifications")
			})

			// Peer help routes (redirected to NodeJS backend)
			protected.GET("/peer-help/requests", func(c *gin.Context) {
				redirectToBackend(c, "nodejs", "/api/peer-help/requests")
			})
			protected.POST("/peer-help/requests", func(c *gin.Context) {
				redirectToBackend(c, "nodejs", "/api/peer-help/requests")
			})
			protected.GET("/peer-help/chat/:user_id", func(c *gin.Context) {
				userID := c.Param("user_id")
				redirectToBackendWithParam(c, "nodejs", "/api/peer-help/chat/"+userID)
			})
			protected.POST("/peer-help/chat/:user_id", func(c *gin.Context) {
				userID := c.Param("user_id")
				redirectToBackendWithParam(c, "nodejs", "/api/peer-help/chat/"+userID)
			})
		}

		// Public routes
		api.GET("/health", handler.HealthCheck)

		// Data processing routes (redirected to Python backend)
		api.POST("/process-data", func(c *gin.Context) {
			redirectToBackend(c, "python", "/api/process-data")
		})
		api.POST("/analyze", func(c *gin.Context) {
			redirectToBackend(c, "python", "/api/analyze")
		})
	}

	// Start server
	port := func() string {
		if p := os.Getenv("PORT"); p != "" {
			return p
		}
		return "8000"
	}()
	fmt.Printf("Server starting on port %s\n", port)
	r.Run(":" + port)
}

// Helper function to redirect requests to other backends
func redirectToBackend(c *gin.Context, backendType, path string) {
	backendURL := getBackendURL(backendType)
	forwardRequest(c, backendURL+path)
}

func redirectToBackendWithParam(c *gin.Context, backendType, path string) {
	backendURL := getBackendURL(backendType)
	forwardRequest(c, backendURL+path)
}

func getBackendURL(backendType string) string {
	switch backendType {
	case "python":
		return os.Getenv("PYTHON_BACKEND_URL", "http://localhost:8001")
	case "nodejs":
		return os.Getenv("NODEJS_BACKEND_URL", "http://localhost:8002")
	default:
		return os.Getenv("DEFAULT_BACKEND_URL", "http://localhost:8000")
	}
}

func forwardRequest(c *gin.Context, targetURL string) {
	// Create a new request with the same method, headers, and body
	method := c.Request.Method
	body, _ := io.ReadAll(c.Request.Body)

	req, err := http.NewRequest(method, targetURL, bytes.NewBuffer(body))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create request"})
		return
	}

	// Copy all headers from the original request
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Make the request to the target backend
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to forward request"})
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Copy response status
	c.Status(resp.StatusCode)

	// Copy response body
	responseBody, _ := io.ReadAll(resp.Body)
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), responseBody)
}

// Middleware to validate JWT
func validateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := ""
		if len(authHeader) >= 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		} else {
			c.JSON(401, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)
		c.Next()
	}
}