# src/models/requests/login.py
from typing import Optional
from pydantic import BaseModel


class PrefixFilterRequest(BaseModel):
    prefix: str


class ExistingSolutionsFilterRequest(BaseModel):
    solutionTypes: list[str]
    sortBy: list[str]
    priceRange: list[str]


class SchedulePrefixFilterRequest(BaseModel):
    prefix: str
    term: str
    year: int
