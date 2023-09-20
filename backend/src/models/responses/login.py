# src/models/responses/login.py
from pydantic import BaseModel


class UserProfile(BaseModel):
    fullName: str
    email: str
    profileImageUrl: str | None = None


class LoginResponse(BaseModel):
    profile: UserProfile | None = None
