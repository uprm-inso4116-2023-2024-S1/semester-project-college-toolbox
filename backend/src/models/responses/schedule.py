from typing import List, Optional
from pydantic import BaseModel


class SpaceTimeBlock(BaseModel):
    room: str
    building: str
    location: str
    day: int
    startTime: str
    endTime: str


class CourseSectionSchedule(BaseModel):
    courseCode: str
    courseName: str
    professor: str
    credits: int
    sectionCode: str
    sectionId: int
    timeBlocks: List[SpaceTimeBlock]


class GeneratedSchedule(BaseModel):
    courses: List[CourseSectionSchedule]


class GenerateSchedulesResponse(BaseModel):
    schedules: List[GeneratedSchedule]

class ValidateCourseIDResponse(BaseModel):
    is_valid: bool
