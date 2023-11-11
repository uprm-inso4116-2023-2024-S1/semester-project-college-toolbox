# src/models/responses/existing_solution.py
from pydantic import BaseModel
from typing import List


class ExistingSolutionResponse(BaseModel):
    Name: str | None = None
    Description: str
    URL: str
    Icon: str
    Type: str
    Rating: int
    RatingCount: int
    Pros: List[str]
    Cons: List[str]
    LastUpdated: str
    HasMobile: bool
    HasWeb: bool
