package services

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"backend_go/models"
	"github.com/google/uuid"
)

type Service struct {
	DB     *gorm.DB
	Auth   *AuthService
	User   *UserService
	Task   *TaskService
	Submission *SubmissionService
	Wallet *WalletService
	Notification *NotificationService
	PeerHelp *PeerHelpService
	Chat   *ChatService
	Support *SupportService
	Project *ProjectService
}

func NewService(db *gorm.DB) *Service {
	service := &Service{DB: db}
	service.Auth = &AuthService{DB: db}
	service.User = &UserService{DB: db}
	service.Task = &TaskService{DB: db}
	service.Submission = &SubmissionService{DB: db}
	service.Wallet = &WalletService{DB: db}
	service.Notification = &NotificationService{DB: db}
	service.PeerHelp = &PeerHelpService{DB: db}
	service.Chat = &ChatService{DB: db}
	service.Support = &SupportService{DB: db}
	service.Project = &ProjectService{DB: db}
	return service
}

// Auth Service
type AuthService struct {
	DB *gorm.DB
}

func (s *AuthService) Login(email, password string) (*models.User, error) {
	var user models.User
	result := s.DB.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &user, nil
}

// User Service
type UserService struct {
	DB *gorm.DB
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	var user models.User
	result := s.DB.First(&user, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	}
	return &user, result.Error
}

func (s *UserService) CreateUser(user models.User) (*models.User, error) {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user.PasswordHash = string(hashedPassword)

	// Hash the transaction pin if provided
	if user.TransactionPin != "" {
		hashedPin, err := bcrypt.GenerateFromPassword([]byte(user.TransactionPin), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		user.TransactionPin = string(hashedPin)
	} else {
		// Ensure it's not empty string if we expect 4 digits later
		// or handle it in validation
	}

	// Generate UUID if not provided
	if user.ID == "" {
		user.ID = uuid.New().String()
	}

	result := s.DB.Create(&user)
	return &user, result.Error
}

func (s *UserService) UpdateUser(id string, updates models.User) (*models.User, error) {
	var user models.User
	result := s.DB.First(&user, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	}

	// updates.ID = id // Ensure we're updating the right user
	result = s.DB.Model(&user).Updates(updates)
	return &user, result.Error
}

// Task Service
type TaskService struct {
	DB *gorm.DB
}

func (s *TaskService) GetTaskByID(id string) (*models.Task, error) {
	var task models.Task
	result := s.DB.Preload("Submissions").First(&task, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("task not found")
	}
	return &task, result.Error
}

func (s *TaskService) GetTasks(statusFilter string) ([]models.Task, error) {
	var tasks []models.Task
	query := s.DB.Preload("Submissions")
	
	if statusFilter != "" {
		query = query.Where("status = ?", statusFilter)
	}
	
	result := query.Find(&tasks)
	return tasks, result.Error
}

func (s *TaskService) CreateTask(task models.Task) (*models.Task, error) {
	if task.ID == "" {
		task.ID = uuid.New().String()
	}
	
	result := s.DB.Create(&task)
	return &task, result.Error
}

func (s *TaskService) UpdateTask(id string, updates models.Task) (*models.Task, error) {
	var task models.Task
	result := s.DB.First(&task, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("task not found")
	}

	result = s.DB.Model(&task).Updates(updates)
	return &task, result.Error
}

func (s *TaskService) GetHotTasks(limit int) ([]models.Task, error) {
	if limit <= 0 {
		limit = 5
	}
	
	var tasks []models.Task
	result := s.DB.Where("status = ?", "OPEN").Order("reward DESC").Limit(limit).Find(&tasks)
	return tasks, result.Error
}

// Submission Service
type SubmissionService struct {
	DB *gorm.DB
}

func (s *SubmissionService) GetSubmissionByID(id string) (*models.Submission, error) {
	var submission models.Submission
	result := s.DB.First(&submission, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("submission not found")
	}
	return &submission, result.Error
}

func (s *SubmissionService) GetSubmissionsByUser(userID string) ([]models.Submission, error) {
	var submissions []models.Submission
	result := s.DB.Where("user_id = ?", userID).Find(&submissions)
	return submissions, result.Error
}

func (s *SubmissionService) CreateSubmission(submission models.Submission) (*models.Submission, error) {
	if submission.ID == "" {
		submission.ID = uuid.New().String()
	}
	
	result := s.DB.Create(&submission)
	return &submission, result.Error
}

func (s *SubmissionService) UpdateSubmission(id string, updates models.Submission) (*models.Submission, error) {
	var submission models.Submission
	result := s.DB.First(&submission, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("submission not found")
	}

	result = s.DB.Model(&submission).Updates(updates)
	return &submission, result.Error
}

// Wallet Service
type WalletService struct {
	DB *gorm.DB
}

func (s *WalletService) GetBalance(userID string) (int, error) {
	var transaction models.WalletTransaction
	result := s.DB.Where("user_id = ?", userID).Order("created_at DESC").First(&transaction)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return 0, nil // Return 0 if no transactions exist
	}
	if result.Error != nil {
		return 0, result.Error
	}
	return transaction.BalanceAfter, nil
}

func (s *WalletService) GetTransactions(userID string) ([]models.WalletTransaction, error) {
	var transactions []models.WalletTransaction
	result := s.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&transactions)
	return transactions, result.Error
}

func (s *WalletService) VerifyTransactionPin(userID, pin string) (bool, error) {
	var user models.User
	result := s.DB.First(&user, "id = ?", userID)
	if result.Error != nil {
		return false, result.Error
	}

	if user.TransactionPin == "" {
		return false, errors.New("transaction pin not set")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.TransactionPin), []byte(pin))
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (s *WalletService) CreateTransaction(transaction models.WalletTransaction) (*models.WalletTransaction, error) {
	if transaction.ID == "" {
		transaction.ID = uuid.New().String()
	}
	
	// Calculate new balance based on previous transactions
	lastBalance, err := s.GetBalance(transaction.UserID)
	if err != nil {
		return nil, err
	}
	
	if transaction.TransactionType == "credit" {
		transaction.BalanceAfter = lastBalance + transaction.Amount
	} else {
		transaction.BalanceAfter = lastBalance - transaction.Amount
	}
	
	result := s.DB.Create(&transaction)
	return &transaction, result.Error
}

// Notification Service
type NotificationService struct {
	DB *gorm.DB
}

func (s *NotificationService) GetNotifications(userID string) ([]models.Notification, error) {
	var notifications []models.Notification
	result := s.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&notifications)
	return notifications, result.Error
}

func (s *NotificationService) CreateNotification(notification models.Notification) (*models.Notification, error) {
	if notification.ID == "" {
		notification.ID = uuid.New().String()
	}
	
	result := s.DB.Create(&notification)
	return &notification, result.Error
}

func (s *NotificationService) UpdateNotification(id string, updates models.Notification) (*models.Notification, error) {
	var notification models.Notification
	result := s.DB.First(&notification, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("notification not found")
	}

	result = s.DB.Model(&notification).Updates(updates)
	return &notification, result.Error
}

// Peer Help Service
type PeerHelpService struct {
	DB *gorm.DB
}

func (s *PeerHelpService) GetPeerHelpRequests() ([]models.PeerHelpRequest, error) {
	var requests []models.PeerHelpRequest
	result := s.DB.Preload("User").Preload("Helper").Find(&requests)
	return requests, result.Error
}

func (s *PeerHelpService) GetPeerHelpRequestsByUser(userID string) ([]models.PeerHelpRequest, error) {
	var requests []models.PeerHelpRequest
	result := s.DB.Where("user_id = ?", userID).Preload("User").Preload("Helper").Find(&requests)
	return requests, result.Error
}

func (s *PeerHelpService) CreatePeerHelpRequest(request models.PeerHelpRequest) (*models.PeerHelpRequest, error) {
	if request.ID == "" {
		request.ID = uuid.New().String()
	}
	
	result := s.DB.Create(&request)
	return &request, result.Error
}

func (s *PeerHelpService) UpdatePeerHelpRequest(id string, updates models.PeerHelpRequest) (*models.PeerHelpRequest, error) {
	var request models.PeerHelpRequest
	result := s.DB.First(&request, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("peer help request not found")
	}

	result = s.DB.Model(&request).Updates(updates)
	return &request, result.Error
}

// Chat Service
type ChatService struct {
	DB *gorm.DB
}

func (s *ChatService) GetChatHistory(senderID, receiverID string) ([]models.ChatMessage, error) {
	var messages []models.ChatMessage
	result := s.DB.Where(
		"(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
		senderID, receiverID, receiverID, senderID,
	).Order("created_at ASC").Find(&messages)
	return messages, result.Error
}

func (s *ChatService) SendMessage(message models.ChatMessage) (*models.ChatMessage, error) {
	if message.ID == "" {
		message.ID = uuid.New().String()
	}
	
	result := s.DB.Create(&message)
	return &message, result.Error
}

// Support Service
type SupportService struct {
	DB *gorm.DB
}

func (s *SupportService) CreateTicket(ticket models.SupportTicket) (*models.SupportTicket, error) {
	if ticket.ID == "" {
		ticket.ID = uuid.New().String()
	}
	result := s.DB.Create(&ticket)
	return &ticket, result.Error
}

func (s *SupportService) GetTickets(userID string) ([]models.SupportTicket, error) {
	var tickets []models.SupportTicket
	result := s.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&tickets)
	return tickets, result.Error
}

func (s *SupportService) GetAllTickets() ([]models.SupportTicket, error) {
	var tickets []models.SupportTicket
	result := s.DB.Order("created_at DESC").Find(&tickets)
	return tickets, result.Error
}

func (s *SupportService) UpdateTicketStatus(id string, status string) (*models.SupportTicket, error) {
	var ticket models.SupportTicket
	result := s.DB.First(&ticket, "id = ?", id)
	if result.Error != nil {
		return nil, result.Error
	}
	ticket.Status = status
	s.DB.Save(&ticket)
	return &ticket, nil
}

// Project Service
type ProjectService struct {
	DB *gorm.DB
}

func (s *ProjectService) CreateProject(project models.ActiveProject) (*models.ActiveProject, error) {
	if project.ID == "" {
		project.ID = uuid.New().String()
	}
	result := s.DB.Create(&project)
	return &project, result.Error
}

func (s *ProjectService) GetActiveProjects() ([]models.ActiveProject, error) {
	var projects []models.ActiveProject
	result := s.DB.Where("status = ?", "active").Order("created_at DESC").Find(&projects)
	return projects, result.Error
}

func (s *ProjectService) GetAllProjects() ([]models.ActiveProject, error) {
	var projects []models.ActiveProject
	result := s.DB.Order("created_at DESC").Find(&projects)
	return projects, result.Error
}

func (s *Service) Seed() {
	// Seed tasks if empty
	var taskCount int64
	s.DB.Model(&models.Task{}).Count(&taskCount)
	if taskCount == 0 {
		tasks := []models.Task{
			{
				ID:          uuid.New().String(),
				Title:       "Security Sync Protocol",
				Description: "Implement a high-performance synchronization logic for biometric data across multi-backend instances.",
				Reward:      150,
				Difficulty:  "gold",
				Stack:       []string{"Go", "PostgreSQL", "Redis"},
				Status:      "OPEN",
			},
			{
				ID:          uuid.New().String(),
				Title:       "UI Component Overhaul",
				Description: "Refactor legacy React components to use the new Ecosystem design language and Tailwind CSS.",
				Reward:      75,
				Difficulty:  "silver",
				Stack:       []string{"React", "Next.js", "Tailwind"},
				Status:      "OPEN",
			},
			{
				ID:          uuid.New().String(),
				Title:       "API Documentation Sync",
				Description: "Update Swagger and Postman collections to match the latest backend synchronization endpoints.",
				Reward:      30,
				Difficulty:  "bronze",
				Stack:       []string{"FastAPI", "OpenAPI"},
				Status:      "OPEN",
			},
		}
		s.DB.Create(&tasks)
	}

	// Seed internships if handled in GetInternships (already has seed logic)
}