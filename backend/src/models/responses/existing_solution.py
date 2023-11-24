# src/models/responses/existing_solution.py
from pydantic import BaseModel
from typing import List
from src.models.responses.business_model import BusinessModelResponse


class ExistingSolutionResponse(BaseModel):
    Name: str | None = None
    Description: str
    URL: str
    Icon: str
    Type: List[str]
    Rating: int
    RatingCount: int
    Pros: List[str]
    Cons: List[str]
    LastUpdated: str
    HasMobile: bool
    HasWeb: bool
    BusinessModels: List[BusinessModelResponse] = []
