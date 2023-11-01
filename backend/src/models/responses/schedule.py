from typing import List, Optional
from pydantic import BaseModel
from src.models.common.schedule import GeneratedSchedule, CustomFilter


class GenerateSchedulesResponse(BaseModel):
    schedules: List[GeneratedSchedule]


class ValidateCourseIDResponse(BaseModel):
    is_valid: bool


class SaveScheduleResponse(BaseModel):
    schedule_id: int


class CreateCustomFilterResponse(BaseModel):
    custom_filter_id: int


class GetCustomFiltersResponse(BaseModel):
    custom_filters: List[CustomFilter]


class DeleteCustomFilterResponse(BaseModel):
    status_code: int
