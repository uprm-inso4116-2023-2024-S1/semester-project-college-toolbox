# src/models/responses/register.py
from pydantic import BaseModel

class RegisterResponse(BaseModel):
    UserId: int
    FirstName: str
    Email: str
