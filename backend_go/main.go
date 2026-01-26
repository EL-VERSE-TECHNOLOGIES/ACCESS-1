package main

import (
	"fmt"
	"os"

	"backend_go/handlers"
	"backend_go/models"
	"backend_go/services"
	"backend_go/utils"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Connect to database
	dsn := os.Getenv("DATABASE_URL", "host=localhost user=user password=password dbname=elaccess port=5432 sslmode=disable")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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
		// Auth routes
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
			// User routes
			protected.GET("/users/profile", handler.GetProfile)
			protected.PUT("/users/profile", handler.UpdateProfile)
			protected.GET("/users/leaderboard", handler.GetLeaderboard)

			// Task routes
			protected.GET("/tasks", handler.GetTasks)
			protected.GET("/tasks/:task_id", handler.GetTask)
			protected.POST("/tasks", handler.CreateTask)
			protected.PUT("/tasks/:task_id", handler.UpdateTask)
			protected.GET("/tasks/hot", handler.GetHotTasks)
			protected.POST("/tasks/:task_id/submit", handler.SubmitTask)
			protected.GET("/tasks/submissions", handler.GetUserSubmissions)

			// Wallet routes
			protected.GET("/wallet/balance", handler.GetBalance)
			protected.GET("/wallet/transactions", handler.GetTransactions)

			// Notification routes
			protected.GET("/notifications", handler.GetNotifications)

			// Peer help routes
			protected.GET("/peer-help/requests", handler.GetPeerHelpRequests)
			protected.POST("/peer-help/requests", handler.CreatePeerHelpRequest)
			protected.GET("/peer-help/chat/:user_id", handler.GetChatHistory)
			protected.POST("/peer-help/chat/:user_id", handler.SendMessage)

			// Dashboard route
			protected.GET("/access/dashboard", handler.GetDashboardData)
		}

		// Public routes
		api.GET("/health", handler.HealthCheck)
	}

	// Start server
	port := os.Getenv("PORT", "8000")
	fmt.Printf("Server starting on port %s\n", port)
	r.Run(":" + port)
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