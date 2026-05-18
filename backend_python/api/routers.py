from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from models.schemas import (
    User, UserCreate, UserUpdate, 
    Task, TaskCreate, TaskUpdate,
    Submission, SubmissionCreate, SubmissionUpdate,
    WalletTransaction, Notification, 
    PeerHelpRequest, PeerHelpRequestCreate, PeerHelpRequestUpdate,
    ChatMessage, ChatMessageCreate,
    LoginRequest, Token, DashboardResponse, ProgressData, StipendData
)
from services.user_service import (
    get_user, get_users, create_user, update_user,
    get_task, get_tasks, get_hot_tasks, create_task, update_task,
    get_submission, get_submissions, create_submission, update_submission,
    get_wallet_balance, get_wallet_transactions, create_wallet_transaction,
    get_notifications, create_notification, update_notification,
    get_peer_help_requests, get_peer_help_requests_by_user, create_peer_help_request, update_peer_help_request,
    get_chat_messages, create_chat_message
)
from utils.auth import authenticate_user, create_access_token, get_current_user_from_token
from datetime import timedelta
from uuid import UUID


router = APIRouter()


@router.post("/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}


@router.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"user_id": str(user.id), "email": user.email}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = create_user(db, user_data)
    return user


@router.get("/auth/me", response_model=User)
async def get_current_user(token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user


@router.get("/users/profile", response_model=User)
async def get_profile(token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user


@router.put("/users/profile", response_model=User)
async def update_profile(user_update: UserUpdate, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    updated_user = update_user(db, user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return updated_user


@router.get("/users/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    # Optimized query to fetch real leaderboard data
    from sqlalchemy import func
    from models.models import User, WalletTransaction, Submission

    results = db.query(
        User.id,
        User.name,
        User.tier,
        func.coalesce(func.sum(func.case((WalletTransaction.transaction_type == 'credit', WalletTransaction.amount), else_=0)), 0).label('points'),
        func.count(func.distinct(func.case((Submission.status == 'approved', Submission.id), else_=None))).label('tasks_completed')
    ).outerjoin(WalletTransaction, WalletTransaction.user_id == User.id)\
     .outerjoin(Submission, Submission.user_id == User.id)\
     .group_by(User.id)\
     .order_by(func.desc('points'))\
     .limit(10).all()

    leaderboard = []
    for i, r in enumerate(results):
        leaderboard.append({
            "rank": i + 1,
            "name": r.name,
            "tier": r.tier,
            "points": int(r.points),
            "tasksCompleted": int(r.tasks_completed),
            "streak": 1,
            "avatar": f"https://ui-avatars.com/api/?name={r.name}&background=random"
        })
    return leaderboard


@router.get("/tasks", response_model=List[Task])
async def read_tasks(skip: int = 0, limit: int = 100, status_filter: str = None, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    tasks = get_tasks(db, skip=skip, limit=limit, status=status_filter)
    return tasks


@router.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: UUID, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/tasks", response_model=Task)
async def create_new_task(task: TaskCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    new_task = create_task(db, task, user.id)
    return new_task


@router.put("/tasks/{task_id}", response_model=Task)
async def update_existing_task(task_id: UUID, task_update: TaskUpdate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    updated_task = update_task(db, task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.get("/tasks/hot", response_model=List[Task])
async def get_hot_task_list(token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    hot_tasks = get_hot_tasks(db)
    return hot_tasks


@router.post("/tasks/{task_id}/submit", response_model=Submission)
async def submit_task(task_id: UUID, submission: SubmissionCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    # Set the task_id from the URL parameter to ensure consistency
    submission_data = submission.copy(update={"task_id": task_id})
    new_submission = create_submission(db, submission_data, user.id)
    return new_submission


@router.get("/tasks/submissions", response_model=List[Submission])
async def get_user_submissions(skip: int = 0, limit: int = 100, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    submissions = get_submissions(db, user.id, skip=skip, limit=limit)
    return submissions


@router.get("/wallet/balance")
async def get_balance(token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    balance = get_wallet_balance(db, user.id)
    return {"balance": balance}


@router.get("/wallet/transactions", response_model=List[WalletTransaction])
async def get_transactions(skip: int = 0, limit: int = 100, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    transactions = get_wallet_transactions(db, user.id, skip=skip, limit=limit)
    return transactions


@router.get("/notifications", response_model=List[Notification])
async def get_user_notifications(skip: int = 0, limit: int = 100, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    notifications = get_notifications(db, user.id, skip=skip, limit=limit)
    return notifications


@router.get("/peer-help/requests", response_model=List[PeerHelpRequest])
async def get_peer_help_requests_list(skip: int = 0, limit: int = 100, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    requests = get_peer_help_requests(db, skip=skip, limit=limit)
    return requests


@router.post("/peer-help/requests", response_model=PeerHelpRequest)
async def create_peer_help_request_endpoint(request: PeerHelpRequestCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    new_request = create_peer_help_request(db, request, user.id)
    return new_request


@router.get("/peer-help/chat/{user_id}", response_model=List[ChatMessage])
async def get_chat_history(user_id: UUID, skip: int = 0, limit: int = 100, token: str = None, db: Session = Depends(get_db)):
    current_user = get_current_user_from_token(token, db)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    messages = get_chat_messages(db, current_user.id, user_id, skip=skip, limit=limit)
    return messages


@router.post("/peer-help/chat/{user_id}", response_model=ChatMessage)
async def send_chat_message(user_id: UUID, message: ChatMessageCreate, token: str = None, db: Session = Depends(get_db)):
    sender = get_current_user_from_token(token, db)
    if not sender:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    # Override sender_id to prevent impersonation
    message_data = message.copy(update={
        "sender_id": sender.id,
        "receiver_id": user_id
    })
    new_message = create_chat_message(db, message_data)
    return new_message


@router.get("/access/dashboard", response_model=DashboardResponse)
async def get_dashboard_data(token: str = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Get user data
    user_data = get_user(db, user.id)
    
    # Get hot tasks
    hot_tasks = get_hot_tasks(db)
    
    # Get user submissions
    submissions = get_submissions(db, user.id, skip=0, limit=10)
    
    # Get all tasks
    tasks = get_tasks(db, skip=0, limit=10)
    
    # Fetch real recent activity data from notifications
    from models.models import Notification
    notifications = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).limit(10).all()

    recent_activity = []
    for n in notifications:
        recent_activity.append({
            "type": n.type or "info",
            "title": n.title,
            "description": n.message,
            "timestamp": n.created_at.isoformat()
        })

    if not recent_activity:
        recent_activity = [
            {
                "type": "info",
                "title": "Account Initialized",
                "description": "Welcome to EL ACCESS. Your secure internship portal is now active.",
                "timestamp": user.created_at.isoformat()
            }
        ]
    
    # Create dashboard response
    dashboard_data = DashboardResponse(
        user=user_data,
        hot_tasks=hot_tasks,
        recent_activity=recent_activity,
        submissions=submissions,
        tasks=tasks
    )
    
    return dashboard_data


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "python-backend"}