from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL

# Database configuration

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from .BusinessModel import BusinessModel
from .Document import Document
from .ExistingSolution import ExistingSolution
from .JobApplication import JobApplication
from .Resume import Resume
from .ScholarshipApplication import ScholarshipApplication
from .tuition_scheduler_models import (
    CourseSection,
    RoomSchedule,
    CourseSchedule,
    Schedule,
)
from .user import User

Base.metadata.create_all(engine)
