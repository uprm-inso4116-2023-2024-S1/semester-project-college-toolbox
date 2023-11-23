# src/models/responses/existing_solution.py
from pydantic import BaseModel
from typing import List, Optional
from src.models.responses.business_model import BusinessModelResponse


# will be changed back

# class ExistingSolutionResponse(BaseModel):
#     Name: str | None = None
#     Description: str
#     URL: str
#     Icon: str
#     Type: List[str]
#     Rating: int
#     RatingCount: int
#     Pros: List[str]
#     Cons: List[str]
#     LastUpdated: str
#     HasMobile: bool
#     HasWeb: bool
#     BusinessModels: List[BusinessModelResponse] = []


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
