# src/main.py
from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL
from src.models.base import Base
from src.models.requests.login import LoginRequest
from src.models.requests.register import RegisterRequest
from src.models.responses.login import LoginResponse
from src.models.responses.register import RegisterResponse
from src.models.user import User
from src.security import hash_password, generate_permanent_token

app = FastAPI()

# Database configuration
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# API endpoints
# Dummy endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# User registration endpoint
@app.post("/register/", response_model=RegisterResponse)
def register_user(user_request: RegisterRequest):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.Email == user_request.Email).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        FirstName=user_request.FirstName,
        Initial=user_request.Initial,
        FirstLastName=user_request.FirstLastName,
        SecondLastName=user_request.SecondLastName,
        Email=user_request.Email,
        Password=user_request.Password,
        ProfileImageUrl=user_request.ProfileImageUrl,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

# Login endpoint
@app.post("/login/", response_model=LoginResponse)
def login_user(user_request: LoginRequest):
    db = SessionLocal()
    user = db.query(User).filter(User.Email == user_request.Email).first()
    if not user:
        db.close()
        raise HTTPException(status_code=401, detail="User not found.")
    if user.EncryptedPassword != hash_password(user_request.Password, user.Salt):
        db.close()
        raise HTTPException(status_code=401, detail="Incorrect password.")
    
    permanent_token = generate_permanent_token(user.UserId)
    db.close()
    return {"UserId": permanent_token}
