# src/models/requests/login.py
from typing import Optional
from pydantic import BaseModel

class PrefixFilterRequest(BaseModel):
    prefix: str