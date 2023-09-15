# src/models/requests/login.py
from pydantic import BaseModel

class LoginRequest(BaseModel):
    Email: str
    Password: str
