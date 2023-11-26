# src/models/responses/existing_solution.py
from pydantic import BaseModel


class BusinessModelResponse(BaseModel):
    ExistingSolutionId: int
    BusinessModelType: str
    Price: float
    Description: str
