# src/models/requests/login.py
from typing import Optional
from pydantic import BaseModel


class PrefixFilterRequest(BaseModel):
    prefix: str


class ExistingSolutionsFilterAllRequest(BaseModel):
    type: list[str]
    sort: list[str]
    cost: list[str]


class SchedulePrefixFilterRequest(BaseModel):
    prefix: str
    term: str
    year: int
