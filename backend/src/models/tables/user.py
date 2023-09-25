# src/models/user.py
import uuid

from sqlalchemy import Column, String

from src.database import Base
from src.security import generate_salt, hash_password


# Define SQLAlchemy model for User table
class User(Base):
    __tablename__ = "User"

    UserId = Column(String, primary_key=True, default=str(uuid.uuid4()))  # Use UUID4 as the default value
    FirstName = Column(String, nullable=False)
    Initial = Column(String)
    FirstLastName = Column(String, nullable=False)
    SecondLastName = Column(String)
    Email = Column(String, unique=True, index=True, nullable=False)
    EncryptedPassword = Column(String, nullable=False)
    Salt = Column(String, nullable=False)
    ProfileImageUrl = Column(String)

    def __init__(
        self,
        FirstName,
        Initial,
        FirstLastName,
        SecondLastName,
        Email,
        Password,
        ProfileImageUrl,
    ):
        self.FirstName = FirstName
        self.Initial = Initial
        self.FirstLastName = FirstLastName
        self.SecondLastName = SecondLastName
        self.Email = Email
        self.Salt = generate_salt()
        self.EncryptedPassword = hash_password(Password, self.Salt)
        self.ProfileImageUrl = ProfileImageUrl
