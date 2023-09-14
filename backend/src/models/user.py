# user.py
from sqlalchemy import Column, Integer, String, Sequence
from src.models.base import Base

# Define SQLAlchemy model for Users table
class User(Base):
    __tablename__ = 'User'

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
