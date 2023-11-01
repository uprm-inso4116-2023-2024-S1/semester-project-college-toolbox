from dataclasses import dataclass, field
from datetime import time, datetime
from typing import List

from pydantic import BaseModel


@dataclass
class Semester:
    title: str
    start: datetime
    end: datetime


@dataclass
class TimeBlock:
    course_id: str
    section: str
    room: str
    day: str
    start_time: time
    end_time: time

    def __repr__(self):
        return f"{self.course_id}-{self.section} {self.start_time.strftime('%I:%M %p')} - {self.end_time.strftime('%I:%M %p')} {self.room}"


@dataclass
class WeekSchedule:
    monday: list = field(default_factory=list)
    tuesday: list = field(default_factory=list)
    wednesday: list = field(default_factory=list)
    thursday: list = field(default_factory=list)
    friday: list = field(default_factory=list)

    def __repr__(self) -> str:
        return f"L: {self.monday}\nM: {self.tuesday}\nW: {self.wednesday}\nJ: {self.thursday}\nV: {self.friday}\n"


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


class CustomFilter(BaseModel):
    id: int
    name: str
    query: str
