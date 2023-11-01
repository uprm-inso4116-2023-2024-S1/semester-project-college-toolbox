from typing import List, Optional
from pydantic import BaseModel
from src.models.common.schedule import GeneratedSchedule


class GenerateSchedulesResponse(BaseModel):
    schedules: List[GeneratedSchedule]


class ValidateCourseIDResponse(BaseModel):
    is_valid: bool
