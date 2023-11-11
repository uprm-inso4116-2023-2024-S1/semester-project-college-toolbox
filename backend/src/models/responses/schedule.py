from typing import List, Optional
from pydantic import BaseModel
from src.models.common.schedule import GeneratedSchedule, CourseSearchSection


class GenerateSchedulesResponse(BaseModel):
    schedules: List[GeneratedSchedule]


class ValidateCourseIDResponse(BaseModel):
    is_valid: bool


class CourseSearchResponse(BaseModel):
    course_section_schedules: list[CourseSearchSection]
