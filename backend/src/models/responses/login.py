# src/models/responses/login.py
from pydantic import BaseModel


class UserProfile(BaseModel):
    fullName: str
    email: str
    profileImageUrl: str


class LoginResponse(BaseModel):
    token: str  # Will hold the permanent token upon successful login
    profile: UserProfile | None = None
