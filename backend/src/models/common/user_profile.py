# src/models/common/user_profile.py
from pydantic import BaseModel


class UserProfile(BaseModel):
    firstName: str
    initial: str | None = None
    firstLastName: str
    secondLastName: str | None = None
    email: str
    profileImageUrl: str | None = None
