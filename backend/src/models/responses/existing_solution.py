# src/models/responses/existing_solution.py
from pydantic import BaseModel
from typing import List
from src.models.responses.business_model import BusinessModelResponse


class ExistingSolutionResponse(BaseModel):
    Name: Optional[str] = None
    Description: Optional[str] = None
    URL: Optional[str] = None
    Icon: Optional[str] = None
    Type: Optional[List[str]] = None
    Rating: Optional[int] = None
    RatingCount: Optional[int] = None
    Pros: Optional[List[str]] = None
    Cons: Optional[List[str]] = None
    LastUpdated: Optional[str] = None
    HasMobile: Optional[bool] = None
    HasWeb: Optional[bool] = None
    BusinessModels: Optional[List[BusinessModelResponse]] = []
