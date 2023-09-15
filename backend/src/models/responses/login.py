# src/models/responses/login.py
from pydantic import BaseModel

class LoginResponse(BaseModel):
    UserId: str # Will hold the permanent token upon successful login
