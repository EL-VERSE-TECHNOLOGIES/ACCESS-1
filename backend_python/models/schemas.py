from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    tier: Optional[str] = None


class User(UserBase):
    id: UUID
    tier: str
    is_active: bool
    face_verification_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Task schemas
class TaskBase(BaseModel):
    title: str
    description: str
    reward: int
    difficulty: str
    stack: List[str]


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reward: Optional[int] = None
    difficulty: Optional[str] = None
    status: Optional[str] = None


class Task(TaskBase):
    id: UUID
    status: str
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Submission schemas
class SubmissionBase(BaseModel):
    task_id: UUID
    task_title: str
    code: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionUpdate(BaseModel):
    status: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None


class Submission(SubmissionBase):
    id: UUID
    user_id: UUID
    submitted_at: datetime
    status: str
    score: Optional[int] = None
    feedback: Optional[str] = None
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Wallet Transaction schemas
class WalletTransactionBase(BaseModel):
    user_id: UUID
    amount: int
    transaction_type: str
    transaction_subtype: Optional[str] = None
    description: Optional[str] = None
    balance_after: int


class WalletTransaction(WalletTransactionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Notification schemas
class NotificationBase(BaseModel):
    user_id: UUID
    title: str
    message: str
    type: str


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None


class Notification(NotificationBase):
    id: UUID
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Peer Help Request schemas
class PeerHelpRequestBase(BaseModel):
    title: str
    description: str


class PeerHelpRequestCreate(PeerHelpRequestBase):
    pass


class PeerHelpRequestUpdate(BaseModel):
    status: Optional[str] = None
    helper_id: Optional[UUID] = None


class PeerHelpRequest(PeerHelpRequestBase):
    id: UUID
    user_id: UUID
    status: str
    helper_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Chat Message schemas
class ChatMessageBase(BaseModel):
    sender_id: UUID
    receiver_id: UUID
    message: str
    message_type: str = "text"


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageUpdate(BaseModel):
    is_read: Optional[bool] = None


class ChatMessage(ChatMessageBase):
    id: UUID
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Daily Multiplier schemas
class DailyMultiplierBase(BaseModel):
    user_id: UUID
    date: str
    multiplier: float
    claimed: bool


class DailyMultiplier(DailyMultiplierBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Auth schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: UUID
    email: str


# Dashboard schemas
class ProgressData(BaseModel):
    tasks_completed: int
    total_tasks: int


class StipendData(BaseModel):
    balance: int
    weekly_earnings: Optional[int] = 0
    pending_amount: Optional[int] = 0
    daily_multiplier: Optional[float] = 1.0


class DashboardResponse(BaseModel):
    user: User
    hot_tasks: List[Task]
    recent_activity: List[dict]
    submissions: List[Submission]
    tasks: List[Task]