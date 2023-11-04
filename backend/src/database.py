# src/models/base.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from src.config import DATABASE_URL

# Database configuration

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare the delarative base
Base = declarative_base()
