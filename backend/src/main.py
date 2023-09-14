# main.py
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL
from src.models.base import Base
from src.models.user import User

app = FastAPI()

# Database configuration
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# Additional API endpoints for interacting with models can be added here
