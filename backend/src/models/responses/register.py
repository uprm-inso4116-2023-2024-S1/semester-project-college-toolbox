# src/models/responses/register.py
from pydantic import BaseModel
from src.models.responses.login import UserProfile


class RegisterResponse(BaseModel):
    profile: UserProfile | None = None
