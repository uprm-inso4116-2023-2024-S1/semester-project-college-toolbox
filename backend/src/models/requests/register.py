# src/models/requests/register.py
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    firstName: str
    initial: str | None = None
    firstLastName: str
    secondLastName: str | None = None
    email: str
    password: str
    profileImageUrl: str | None = None
