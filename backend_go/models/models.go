package models

import (
	"time"
	
	"gorm.io/gorm"
)

type User struct {
	ID                   string         `gorm:"type:uuid;primaryKey" json:"id"`
	Email                string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash         string         `gorm:"not null" json:"-"` // Don't expose password hash in JSON
	Name                 string         `gorm:"not null" json:"name"`
	Tier                 string         `gorm:"default:'Intern'" json:"tier"` // Intern, Lead, Management
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
	IsActive             bool           `gorm:"default:true" json:"is_active"`
	FaceVerificationStatus string       `gorm:"default:'pending'" json:"face_verification_status"` // none, pending, verified
	CV                   string         `json:"cv,omitempty"` // URL or path to CV document
	TransactionPin       string         `json:"-"` // Don't expose transaction pin in JSON
	FingerprintVerified  bool           `json:"fingerprint_verified"` // Whether user has completed fingerprint verification
	InternshipStartedAt  *time.Time     `json:"internship_started_at,omitempty"`
	Tasks                []Task         `gorm:"foreignKey:CreatedBy" json:"-"`
	Submissions          []Submission   `gorm:"foreignKey:UserID" json:"-"`
	WalletTransactions   []WalletTransaction `gorm:"foreignKey:UserID" json:"-"`
	Notifications        []Notification `gorm:"foreignKey:UserID" json:"-"`
	PeerHelpRequests     []PeerHelpRequest `gorm:"foreignKey:UserID" json:"-"`
	ReceivedMessages     []ChatMessage  `gorm:"foreignKey:ReceiverID" json:"-"`
	SentMessages         []ChatMessage  `gorm:"foreignKey:SenderID" json:"-"`
}

type Task struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"not null" json:"description"`
	Reward      int       `gorm:"not null" json:"reward"` // in cents or smallest currency unit
	Difficulty  string    `gorm:"not null" json:"difficulty"` // bronze, silver, gold
	Stack       []string  `gorm:"type:text[]" json:"stack"` // array of technology stacks
	Status      string    `gorm:"not null;default:'OPEN'" json:"status"` // OPEN, IN_PROGRESS, REVIEW, DONE
	CreatedBy   *string   `gorm:"type:uuid" json:"created_by"` // Foreign key to User
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Submissions []Submission `gorm:"foreignKey:TaskID" json:"-"`
}

type Submission struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	TaskID      string    `gorm:"type:uuid;not null" json:"task_id"`
	UserID      string    `gorm:"type:uuid;not null" json:"user_id"`
	TaskTitle   string    `gorm:"not null" json:"task_title"`
	Code        *string   `json:"code,omitempty"`
	SubmittedAt time.Time `json:"submitted_at"`
	Status      string    `gorm:"not null;default:'pending'" json:"status"` // pending, reviewing, approved, rejected
	Score       *int      `json:"score,omitempty"` // 0-100 scale
	Feedback    *string   `json:"feedback,omitempty"`
	ReviewedBy  *string   `gorm:"type:uuid" json:"reviewed_by"` // Foreign key to User who reviewed
	ReviewedAt  *time.Time `json:"reviewed_at,omitempty"`
	Task        Task      `gorm:"foreignKey:TaskID" json:"-"`
	User        User      `gorm:"foreignKey:UserID" json:"-"`
}

type WalletTransaction struct {
	ID               string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID           string    `gorm:"type:uuid;not null" json:"user_id"`
	Amount           int       `gorm:"not null" json:"amount"` // in cents or smallest currency unit
	TransactionType  string    `gorm:"not null" json:"transaction_type"` // credit, debit
	TransactionSubtype *string `json:"transaction_subtype,omitempty"` // task_completion, withdrawal, bonus, penalty
	Description      *string   `json:"description,omitempty"`
	BalanceAfter     int       `gorm:"not null" json:"balance_after"` // balance after transaction
	CreatedAt        time.Time `json:"created_at"`
	User             User      `gorm:"foreignKey:UserID" json:"-"`
}

type Notification struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"type:uuid;not null" json:"user_id"`
	Title     string    `gorm:"not null" json:"title"`
	Message   string    `gorm:"not null" json:"message"`
	Type      string    `json:"type"` // info, success, warning, error
	IsRead    bool      `gorm:"default:false" json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
}

type PeerHelpRequest struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      string    `gorm:"type:uuid;not null" json:"user_id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"not null" json:"description"`
	Status      string    `gorm:"not null;default:'open'" json:"status"` // open, in_progress, resolved, closed
	HelperID    *string   `gorm:"type:uuid" json:"helper_id"` // user assigned to help
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	ResolvedAt  *time.Time `json:"resolved_at,omitempty"`
	User        User      `gorm:"foreignKey:UserID" json:"-"`
	Helper      *User     `gorm:"foreignKey:HelperID" json:"-"`
}

type ChatMessage struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	SenderID    string    `gorm:"type:uuid;not null" json:"sender_id"`
	ReceiverID  string    `gorm:"type:uuid;not null" json:"receiver_id"`
	Message     string    `gorm:"not null" json:"message"`
	IsRead      bool      `gorm:"default:false" json:"is_read"`
	CreatedAt   time.Time `json:"created_at"`
	MessageType string    `gorm:"default:'text'" json:"message_type"` // text, code, image
	Sender      User      `gorm:"foreignKey:SenderID" json:"-"`
	Receiver    User      `gorm:"foreignKey:ReceiverID" json:"-"`
}

type DailyMultiplier struct {
	ID         string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     string    `gorm:"type:uuid;not null" json:"user_id"`
	Date       time.Time `gorm:"not null" json:"date"`
	Multiplier float64   `gorm:"default:1.00" json:"multiplier"`
	Claimed    bool      `gorm:"default:false" json:"claimed"`
	CreatedAt  time.Time `json:"created_at"`
	User       User      `gorm:"foreignKey:UserID" json:"-"`
}

type Internship struct {
	ID          string   `gorm:"type:uuid;primaryKey" json:"id"`
	Title       string   `gorm:"not null" json:"title"`
	Description string   `gorm:"not null" json:"description"`
	TechStack   []string `gorm:"type:text[]" json:"tech_stack"`
	PaymentRate string   `gorm:"not null" json:"payment_rate"` // e.g. "$10/hr" or "$15/hr"
	Type        string   `gorm:"not null" json:"type"`         // 'standard', 'coders', 'space'
	Duration    string   `json:"duration"`
	CreatedAt   time.Time `json:"created_at"`
}

// BeforeCreate hook to set default values
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Tier == "" {
		u.Tier = "Intern"
	}
	if u.FaceVerificationStatus == "" {
		u.FaceVerificationStatus = "pending"
	}
	return nil
}

func (t *Task) BeforeCreate(tx *gorm.DB) error {
	if t.Status == "" {
		t.Status = "OPEN"
	}
	return nil
}

func (s *Submission) BeforeCreate(tx *gorm.DB) error {
	if s.Status == "" {
		s.Status = "pending"
	}
	return nil
}

func (nt *Notification) BeforeCreate(tx *gorm.DB) error {
	if !nt.IsRead {
		nt.IsRead = false
	}
	return nil
}

func (phr *PeerHelpRequest) BeforeCreate(tx *gorm.DB) error {
	if phr.Status == "" {
		phr.Status = "open"
	}
	return nil
}

func (cm *ChatMessage) BeforeCreate(tx *gorm.DB) error {
	if cm.MessageType == "" {
		cm.MessageType = "text"
	}
	if !cm.IsRead {
		cm.IsRead = false
	}
	return nil
}