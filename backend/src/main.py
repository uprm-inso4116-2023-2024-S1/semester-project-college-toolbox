# main.py
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker, declarative_base

app = FastAPI()

# Database configuration
DATABASE_URL = "postgresql://ct:password@localhost:5432/ct"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the base class
Base = declarative_base()

# Define SQLAlchemy model for Users table
class User(Base):
    __tablename__ = 'Users'

    UserId = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    FirstName = Column(String)
    Initial = Column(String)
    FirstLastName = Column(String)
    SecondLastName = Column(String)
    Email = Column(String, unique=True, index=True)

    def __init__(self, FirstName, Initial, FirstLastName, SecondLastName, Email):
        self.FirstName = FirstName
        self.Initial = Initial
        self.FirstLastName = FirstLastName
        self.SecondLastName = SecondLastName
        self.Email = Email

# Additional models can be defined here

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# Additional API endpoints for interacting with models can be added here
