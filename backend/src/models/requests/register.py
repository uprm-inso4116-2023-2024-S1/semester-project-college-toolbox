# src/models/requests/register.py
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    FirstName: str
    Initial: str | None
    FirstLastName: str
    SecondLastName: str | None
    Email: str
    Password: str
    ProfileImageUrl: str | None
