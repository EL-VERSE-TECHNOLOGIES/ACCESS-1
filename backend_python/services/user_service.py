from sqlalchemy.orm import Session
from models.models import User, Task, Submission, WalletTransaction, Notification, PeerHelpRequest, ChatMessage, DailyMultiplier
from models.schemas import UserCreate, UserUpdate, TaskCreate, TaskUpdate, SubmissionCreate, SubmissionUpdate, WalletTransactionBase, NotificationCreate, NotificationUpdate, PeerHelpRequestCreate, PeerHelpRequestUpdate, ChatMessageCreate, ChatMessageUpdate
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from utils.auth import get_password_hash


# User service functions
def get_user(db: Session, user_id: UUID) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: UUID, user_update: UserUpdate) -> Optional[User]:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user


# Task service functions
def get_task(db: Session, task_id: UUID) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Task]:
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    return query.offset(skip).limit(limit).all()


def get_hot_tasks(db: Session, limit: int = 5) -> List[Task]:
    # Get tasks that are open and sort by reward descending
    return db.query(Task).filter(Task.status == 'OPEN').order_by(Task.reward.desc()).limit(limit).all()


def create_task(db: Session, task: TaskCreate, creator_id: UUID) -> Task:
    db_task = Task(
        title=task.title,
        description=task.description,
        reward=task.reward,
        difficulty=task.difficulty,
        stack=task.stack,
        created_by=creator_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task:
        for field, value in task_update.dict(exclude_unset=True).items():
            setattr(db_task, field, value)
        db.commit()
        db.refresh(db_task)
    return db_task


# Submission service functions
def get_submission(db: Session, submission_id: UUID) -> Optional[Submission]:
    return db.query(Submission).filter(Submission.id == submission_id).first()


def get_submissions(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Submission]:
    return db.query(Submission).filter(Submission.user_id == user_id).offset(skip).limit(limit).all()


def get_submissions_by_task(db: Session, task_id: UUID) -> List[Submission]:
    return db.query(Submission).filter(Submission.task_id == task_id).all()


def create_submission(db: Session, submission: SubmissionCreate, user_id: UUID) -> Submission:
    # Get the task to get its title
    task = db.query(Task).filter(Task.id == submission.task_id).first()
    
    db_submission = Submission(
        task_id=submission.task_id,
        user_id=user_id,
        task_title=task.title if task else "Unknown Task",
        code=submission.code
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission


def update_submission(db: Session, submission_id: UUID, submission_update: SubmissionUpdate) -> Optional[Submission]:
    db_submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if db_submission:
        for field, value in submission_update.dict(exclude_unset=True).items():
            setattr(db_submission, field, value)
        db.commit()
        db.refresh(db_submission)
    return db_submission


# Wallet transaction service functions
def get_wallet_balance(db: Session, user_id: UUID) -> int:
    # Get the most recent transaction to determine current balance
    last_transaction = db.query(WalletTransaction).filter(
        WalletTransaction.user_id == user_id
    ).order_by(WalletTransaction.created_at.desc()).first()
    
    if last_transaction:
        return last_transaction.balance_after
    return 0


def get_wallet_transactions(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[WalletTransaction]:
    return db.query(WalletTransaction).filter(WalletTransaction.user_id == user_id).offset(skip).limit(limit).all()


def create_wallet_transaction(db: Session, transaction: WalletTransactionBase) -> WalletTransaction:
    # Calculate the new balance based on previous transactions
    last_balance = get_wallet_balance(db, transaction.user_id)
    new_balance = last_balance + transaction.amount if transaction.transaction_type == 'credit' else last_balance - transaction.amount
    
    db_transaction = WalletTransaction(
        user_id=transaction.user_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        transaction_subtype=transaction.transaction_subtype,
        description=transaction.description,
        balance_after=new_balance
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


# Notification service functions
def get_notifications(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).offset(skip).limit(limit).all()


def create_notification(db: Session, notification: NotificationCreate) -> Notification:
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def update_notification(db: Session, notification_id: UUID, notification_update: NotificationUpdate) -> Optional[Notification]:
    db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if db_notification:
        for field, value in notification_update.dict(exclude_unset=True).items():
            setattr(db_notification, field, value)
        db.commit()
        db.refresh(db_notification)
    return db_notification


# Peer help request service functions
def get_peer_help_requests(db: Session, skip: int = 0, limit: int = 100) -> List[PeerHelpRequest]:
    return db.query(PeerHelpRequest).offset(skip).limit(limit).all()


def get_peer_help_requests_by_user(db: Session, user_id: UUID) -> List[PeerHelpRequest]:
    return db.query(PeerHelpRequest).filter(PeerHelpRequest.user_id == user_id).all()


def create_peer_help_request(db: Session, request: PeerHelpRequestCreate, user_id: UUID) -> PeerHelpRequest:
    db_request = PeerHelpRequest(
        title=request.title,
        description=request.description,
        user_id=user_id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def update_peer_help_request(db: Session, request_id: UUID, request_update: PeerHelpRequestUpdate) -> Optional[PeerHelpRequest]:
    db_request = db.query(PeerHelpRequest).filter(PeerHelpRequest.id == request_id).first()
    if db_request:
        for field, value in request_update.dict(exclude_unset=True).items():
            setattr(db_request, field, value)
        db.commit()
        db.refresh(db_request)
    return db_request


# Chat message service functions
def get_chat_messages(db: Session, sender_id: UUID, receiver_id: UUID, skip: int = 0, limit: int = 100) -> List[ChatMessage]:
    return db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == sender_id) & (ChatMessage.receiver_id == receiver_id)) |
        ((ChatMessage.sender_id == receiver_id) & (ChatMessage.receiver_id == sender_id))
    ).order_by(ChatMessage.created_at.asc()).offset(skip).limit(limit).all()


def create_chat_message(db: Session, message: ChatMessageCreate) -> ChatMessage:
    db_message = ChatMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def update_chat_message(db: Session, message_id: UUID, message_update: ChatMessageUpdate) -> Optional[ChatMessage]:
    db_message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if db_message:
        for field, value in message_update.dict(exclude_unset=True).items():
            setattr(db_message, field, value)
        db.commit()
        db.refresh(db_message)
    return db_message


# Daily multiplier service functions
def get_daily_multiplier(db: Session, user_id: UUID, date_val: date) -> Optional[DailyMultiplier]:
    return db.query(DailyMultiplier).filter(
        DailyMultiplier.user_id == user_id,
        DailyMultiplier.date == date_val
    ).first()


def create_daily_multiplier(db: Session, user_id: UUID, date_val: date, multiplier: float) -> DailyMultiplier:
    db_multiplier = DailyMultiplier(
        user_id=user_id,
        date=date_val,
        multiplier=multiplier,
        claimed=False
    )
    db.add(db_multiplier)
    db.commit()
    db.refresh(db_multiplier)
    return db_multiplier


def claim_daily_multiplier(db: Session, user_id: UUID, date_val: date) -> Optional[DailyMultiplier]:
    multiplier = get_daily_multiplier(db, user_id, date_val)
    if multiplier and not multiplier.claimed:
        multiplier.claimed = True
        db.commit()
        db.refresh(multiplier)
    return multiplier