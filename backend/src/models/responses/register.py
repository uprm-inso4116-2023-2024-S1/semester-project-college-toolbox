# src/models/responses/register.py
from pydantic import BaseModel
from src.models.common.user_profile import UserProfile


class RegisterResponse(BaseModel):
    profile: UserProfile | None = None
