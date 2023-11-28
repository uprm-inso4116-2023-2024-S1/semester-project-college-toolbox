# src/models/responses/login.py
from pydantic import BaseModel
from src.models.common.user_profile import UserProfile


class LoginResponse(BaseModel):
    profile: UserProfile | None = None
    token: str | None = None
