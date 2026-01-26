from fastapi import FastAPI, Depends
from api.routers import router
from config.database import engine, Base
from starlette.middleware.cors import CORSMiddleware


app = FastAPI(title="EL ACCESS Python Backend", version="1.0.0")

# Import models here to register them with SQLAlchemy
from models import models

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "EL ACCESS Python Backend API"}