# src/models/requests/login.py
from typing import Annotated, Optional
from pydantic import BaseModel
from src.models.common.schedule import GeneratedSchedule
from fastapi import Cookie


class ExportCalendarRequest(BaseModel):
    schedule: GeneratedSchedule
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
    term: str
    year: str


class SaveScheduleRequest(BaseModel):
    course_section_ids: list[int]
    name: str
    term: str
    year: int
    auth_token: Annotated[str | None, Cookie()] = None
