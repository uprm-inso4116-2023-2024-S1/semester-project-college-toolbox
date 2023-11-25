# src/models/requests/login.py
from typing import Optional
from pydantic import BaseModel


class PrefixFilterRequest(BaseModel):
    prefix: str


class applyAllFilterRequest(BaseModel):
    type: list[str]
    sort: list[str]
    cost: list[str]


class SchedulePrefixFilterRequest(BaseModel):
    prefix: str
