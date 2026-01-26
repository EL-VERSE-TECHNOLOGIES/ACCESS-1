from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, ARRAY, Date, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from config.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    tier = Column(String(50), default='Intern')  # Intern, Lead, Management
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    is_active = Column(Boolean, default=True)
    face_verification_status = Column(String(20), default='pending')  # none, pending, verified


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    reward = Column(Integer, nullable=False)  # in cents or smallest currency unit
    difficulty = Column(String(20), nullable=False)  # bronze, silver, gold
    stack = Column(ARRAY(String))  # array of technology stacks
    status = Column(String(20), nullable=False, default='OPEN')  # OPEN, IN_PROGRESS, REVIEW, DONE
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    task_title = Column(String(255), nullable=False)
    code = Column(Text)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), nullable=False, default='pending')  # pending, reviewing, approved, rejected
    score = Column(Integer)  # 0-100 scale
    feedback = Column(Text)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))  # who reviewed
    reviewed_at = Column(DateTime(timezone=True))


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # in cents or smallest currency unit
    transaction_type = Column(String(20), nullable=False)  # credit, debit
    transaction_subtype = Column(String(50))  # task_completion, withdrawal, bonus, penalty
    description = Column(Text)
    balance_after = Column(Integer, nullable=False)  # balance after transaction
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50))  # info, success, warning, error
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PeerHelpRequest(Base):
    __tablename__ = "peer_help_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default='open')  # open, in_progress, resolved, closed
    helper_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))  # user assigned to help
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    message_type = Column(String(20), default='text')  # text, code, image


class DailyMultiplier(Base):
    __tablename__ = "daily_multipliers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    multiplier = Column(DECIMAL(3, 2), default=1.00)
    claimed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())