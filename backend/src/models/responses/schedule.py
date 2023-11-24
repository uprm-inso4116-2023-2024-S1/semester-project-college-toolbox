from typing import List, Optional
from pydantic import BaseModel
from src.models.common.schedule import GeneratedSchedule, CourseSearchSection


class GenerateSchedulesResponse(BaseModel):
    schedules: List[GeneratedSchedule]


class ValidateCourseIDResponse(BaseModel):
    is_valid: bool


class SaveScheduleResponse(BaseModel):
    schedule_id: int


class getSavedScheduleResponse(BaseModel):
    user_id: str
    id: int
    name: str
    term: str
    year: int
    schedule: GeneratedSchedule


class CourseSearchResponse(BaseModel):
    course_section_schedules: list[CourseSearchSection]
