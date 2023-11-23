# src/models/responses/existing_solution.py
from pydantic import BaseModel
from typing import Optional

# will be changed back

# class BusinessModelResponse(BaseModel):
#     ExistingSolutionId: int
#     BusinessModelType: str
#     Price: float
#     Description: str


class BusinessModelResponse(BaseModel):
    ExistingSolutionId: Optional[int] = None
    BusinessModelType: Optional[str] = None
    Price: Optional[float] = None
    Description: Optional[str] = None
