# src/models/responses/register.py
from pydantic import BaseModel


class RegisterResponse(BaseModel):
    token: str
