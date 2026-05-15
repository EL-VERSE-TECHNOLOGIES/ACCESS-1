package handlers

import (
	"net/http"
	"time"
	"backend_go/models"
	"backend_go/services"
	"backend_go/utils"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *services.Service
}

func NewHandler(service *services.Service) *Handler {
	return &Handler{Service: service}
}

// Auth handlers
func (h *Handler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func (h *Handler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.Service.Auth.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
		"token_type":   "bearer",
	})
}

func (h *Handler) Register(c *gin.Context) {
	var req struct {
		Email               string `json:"email" binding:"required,email"`
		Password            string `json:"password" binding:"required"`
		Name                string `json:"name" binding:"required"`
		CV                  string `json:"cv,omitempty"`
		TransactionPin      string `json:"transactionPin,omitempty"`
		FaceVerified        bool   `json:"faceVerified,omitempty"`
		FingerprintVerified bool   `json:"fingerprintVerified,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate transaction PIN if provided
	if req.TransactionPin != "" && len(req.TransactionPin) != 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Transaction PIN must be 4 digits"})
		return
	}

	// MANDATORY BIOMETRIC SYNC: At least one biometric verification must be completed during registration
	if !req.FaceVerified && !req.FingerprintVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Security synchronization failed: At least one biometric verification (Face or Fingerprint) is required to register."})
		return
	}

	user, err := h.Service.User.CreateUser(models.User{
		Email:                 req.Email,
		Name:                  req.Name,
		PasswordHash:          req.Password, // Password will be hashed in the service layer
		Tier:                  "Intern",     // Default to Intern for new users
		CV:                    req.CV,
		TransactionPin:        req.TransactionPin,
		FingerprintVerified:   req.FingerprintVerified,
		FaceVerificationStatus: func() string {
			if req.FaceVerified {
				return "verified"
			}
			return "pending"
		}(),
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return user without sensitive information
	responseUser := struct {
		ID                   string `json:"id"`
		Email                string `json:"email"`
		Name                 string `json:"name"`
		Tier                 string `json:"tier"`
		CreatedAt            string `json:"created_at"`
		IsActive             bool   `json:"is_active"`
		FaceVerificationStatus string `json:"face_verification_status"`
		CV                   string `json:"cv,omitempty"`
		FingerprintVerified  bool   `json:"fingerprint_verified"`
	}{
		ID:                   user.ID,
		Email:                user.Email,
		Name:                 user.Name,
		Tier:                 user.Tier,
		CreatedAt:            user.CreatedAt.String(),
		IsActive:             user.IsActive,
		FaceVerificationStatus: user.FaceVerificationStatus,
		CV:                   user.CV,
		FingerprintVerified:  user.FingerprintVerified,
	}

	c.JSON(http.StatusCreated, responseUser)
}

func (h *Handler) GetCurrentUser(c *gin.Context) {
	userID := c.GetString("userID")
	user, err := h.Service.User.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) VerifyFace(c *gin.Context) {
	userID := c.GetString("userID")

	// Update the face verification status in the database
	_, err := h.Service.User.UpdateUser(userID, models.User{
		FaceVerificationStatus: "verified",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update face verification status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Face verification synchronized and verified successfully",
		"status":  "verified",
	})
}

func (h *Handler) VerifyFingerprint(c *gin.Context) {
	userID := c.GetString("userID")

	// Update the fingerprint verification status in the database
	_, err := h.Service.User.UpdateUser(userID, models.User{
		FingerprintVerified: true,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update fingerprint verification status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Fingerprint biometric synchronized and verified successfully",
		"status":  true,
	})
}

// User handlers
func (h *Handler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")
	user, err := h.Service.User.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Name *string `json:"name"`
		Tier *string `json:"tier"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.Service.User.UpdateUser(userID, models.User{
		Name: *req.Name,
		Tier: *req.Tier,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) GetLeaderboard(c *gin.Context) {
	leaderboard := []map[string]interface{}{
		{"rank": 1, "name": "JOHN DOE", "tier": "Management", "score": 1500},
		{"rank": 2, "name": "JANE SMITH", "tier": "Lead", "score": 1200},
		{"rank": 3, "name": "BOB JOHNSON", "tier": "Intern", "score": 900},
	}

	c.JSON(http.StatusOK, leaderboard)
}

// Task handlers
func (h *Handler) GetTasks(c *gin.Context) {
	statusFilter := c.Query("status")
	tasks, err := h.Service.Task.GetTasks(statusFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *Handler) GetTask(c *gin.Context) {
	taskID := c.Param("task_id")
	task, err := h.Service.Task.GetTaskByID(taskID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *Handler) CreateTask(c *gin.Context) {
	userID := c.GetString("userID")
	var req models.Task

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.CreatedBy = &userID
	task, err := h.Service.Task.CreateTask(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (h *Handler) UpdateTask(c *gin.Context) {
	taskID := c.Param("task_id")
	var req struct {
		Title       *string  `json:"title"`
		Description *string  `json:"description"`
		Reward      *int     `json:"reward"`
		Difficulty  *string  `json:"difficulty"`
		Status      *string  `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := h.Service.Task.UpdateTask(taskID, models.Task{
		Title:       *req.Title,
		Description: *req.Description,
		Reward:      *req.Reward,
		Difficulty:  *req.Difficulty,
		Status:      *req.Status,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *Handler) GetHotTasks(c *gin.Context) {
	limit := 5
	tasks, err := h.Service.Task.GetHotTasks(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch hot tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *Handler) SubmitTask(c *gin.Context) {
	userID := c.GetString("userID")
	taskID := c.Param("task_id")
	var req struct {
		Code *string `json:"code"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := h.Service.Task.GetTaskByID(taskID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	submission, err := h.Service.Submission.CreateSubmission(models.Submission{
		TaskID:    taskID,
		UserID:    userID,
		TaskTitle: task.Title,
		Code:      req.Code,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not submit task"})
		return
	}

	c.JSON(http.StatusCreated, submission)
}

func (h *Handler) GetUserSubmissions(c *gin.Context) {
	userID := c.GetString("userID")
	submissions, err := h.Service.Submission.GetSubmissionsByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch submissions"})
		return
	}

	c.JSON(http.StatusOK, submissions)
}

// Wallet handlers
func (h *Handler) GetBalance(c *gin.Context) {
	userID := c.GetString("userID")
	balance, err := h.Service.Wallet.GetBalance(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch balance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"balance": balance})
}

func (h *Handler) GetTransactions(c *gin.Context) {
	userID := c.GetString("userID")
	transactions, err := h.Service.Wallet.GetTransactions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *Handler) Withdraw(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Amount int    `json:"amount" binding:"required"`
		Pin    string `json:"pin" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// AUTH SYNC: Check if user has completed fingerprint biometric verification
	user, err := h.Service.User.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "System error: User profile not found"})
		return
	}

	if !user.FingerprintVerified {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Security Violation: Fingerprint biometric verification is required for withdrawals."})
		return
	}

	// Verify PIN
	verified, err := h.Service.Wallet.VerifyTransactionPin(userID, req.Pin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal error during PIN verification"})
		return
	}
	if !verified {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid transaction PIN"})
		return
	}

	// Process withdrawal
	transaction, err := h.Service.Wallet.CreateTransaction(models.WalletTransaction{
		UserID:          userID,
		Amount:          req.Amount,
		TransactionType: "debit",
		Description:     func() *string { s := "Biometric Verified Withdrawal"; return &s }(),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not process withdrawal"})
		return
	}

	c.JSON(http.StatusOK, transaction)
}

// Notification handlers (proxy)
func (h *Handler) GetNotifications(c *gin.Context) {
	userID := c.GetString("userID")
	notifications, err := h.Service.Notification.GetNotifications(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

// Peer help handlers (proxy)
func (h *Handler) GetPeerHelpRequests(c *gin.Context) {
	requests, err := h.Service.PeerHelp.GetPeerHelpRequests()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch peer help requests"})
		return
	}

	c.JSON(http.StatusOK, requests)
}

func (h *Handler) CreatePeerHelpRequest(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request, err := h.Service.PeerHelp.CreatePeerHelpRequest(models.PeerHelpRequest{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create peer help request"})
		return
	}

	c.JSON(http.StatusCreated, request)
}

func (h *Handler) GetChatHistory(c *gin.Context) {
	currentUserID := c.GetString("userID")
	targetUserID := c.Param("user_id")
	messages, err := h.Service.Chat.GetChatHistory(currentUserID, targetUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch chat history"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func (h *Handler) SendMessage(c *gin.Context) {
	senderID := c.GetString("userID")
	receiverID := c.Param("user_id")
	var req struct {
		Message     string `json:"message" binding:"required"`
		MessageType string `json:"message_type" default:"text"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message, err := h.Service.Chat.SendMessage(models.ChatMessage{
		SenderID:    senderID,
		ReceiverID:  receiverID,
		Message:     req.Message,
		MessageType: req.MessageType,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not send message"})
		return
	}

	c.JSON(http.StatusCreated, message)
}

// Dashboard handler
func (h *Handler) GetDashboardData(c *gin.Context) {
	userID := c.GetString("userID")
	
	user, err := h.Service.User.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	hotTasks, err := h.Service.Task.GetHotTasks(5)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch hot tasks"})
		return
	}
	
	submissions, err := h.Service.Submission.GetSubmissionsByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch submissions"})
		return
	}
	
	tasks, err := h.Service.Task.GetTasks("")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch tasks"})
		return
	}
	
	recentActivity := []map[string]interface{}{
		{
			"type":        "task_completed",
			"title":       "Security Sync Completed",
			"description": "Your account has been successfully synchronized with biometrics.",
			"reward":      100,
			"timestamp":   time.Now().Format(time.RFC3339),
		},
		{
			"type":        "time_remaining",
			"title":       "Daily login bonus available",
			"description": "Maintain your streak for the x1.5 multiplier",
			"timestamp":   time.Now().Add(-time.Hour * 2).Format(time.RFC3339),
		},
	}

	dashboardData := map[string]interface{}{
		"user":            user,
		"hot_tasks":       hotTasks,
		"recent_activity": recentActivity,
		"submissions":     submissions,
		"tasks":           tasks,
	}

	c.JSON(http.StatusOK, dashboardData)
}

// Health check handler
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "go-backend-core",
	})
}
