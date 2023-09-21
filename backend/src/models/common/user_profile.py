# src/models/common/user_profile.py
from pydantic import BaseModel


class UserProfile(BaseModel):
    fullName: str
    email: str
    profileImageUrl: str | None = None