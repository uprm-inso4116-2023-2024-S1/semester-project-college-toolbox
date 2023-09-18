# src/models/requests/register.py
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    firstName: str
    initial: str | None
    firstLastName: str
    secondLastName: str | None
    email: str
    password: str
    profileImageUrl: str | None
