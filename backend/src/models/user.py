# src/models/user.py
from sqlalchemy import Column, Integer, String
from uuid import uuid4

from src.models.base import Base
from src.security import generate_salt, hash_password

# Define SQLAlchemy model for User table
class User(Base):
    __tablename__ = 'User'

    UserId = Column(Integer, primary_key=True, default=uuid4().int)
    FirstName = Column(String)
    Initial = Column(String)
    FirstLastName = Column(String)
    SecondLastName = Column(String)
    Email = Column(String, unique=True, index=True)
    EncryptedPassword = Column(String)
    Salt = Column(String)
    ProfileImageUrl = Column(String)

    def __init__(self, FirstName, Initial, FirstLastName, SecondLastName, Email, Password, ProfileImageUrl):
        self.FirstName = FirstName
        self.Initial = Initial
        self.FirstLastName = FirstLastName
        self.SecondLastName = SecondLastName
        self.Email = Email
        self.Salt = generate_salt()
        self.EncryptedPassword = hash_password(Password, self.Salt)
        self.ProfileImageUrl = ProfileImageUrl
