# src/models/requests/login.py
from typing import Optional
from pydantic import BaseModel


class ExportCalendarRequest(BaseModel):
    section_ids: list[int]
    term: str
    year: str


class ScheduleGenerationOptions(BaseModel):
    maxSchedules: Optional[int] = None
    minCredits: Optional[int] = None
    maxCredits: Optional[int] = None


class FilteredCourse(BaseModel):
    code: str
    filters: Optional[str] = None


class GenerateSchedulesRequest(BaseModel):
    courses: list[FilteredCourse]
    term: str
    year: int
    options: ScheduleGenerationOptions


class ValidateCourseIDRequest(BaseModel):
    course_id: str
    section: Optional[str] = None
