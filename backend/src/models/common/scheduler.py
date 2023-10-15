from dataclasses import dataclass, field
from datetime import time, datetime


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


def make_empty_list():
    return []


@dataclass
class WeekSchedule:
    monday: list = field(default_factory=make_empty_list)
    tuesday: list = field(default_factory=make_empty_list)
    wednesday: list = field(default_factory=make_empty_list)
    thursday: list = field(default_factory=make_empty_list)
    friday: list = field(default_factory=make_empty_list)

    def __repr__(self) -> str:
        return f"L: {self.monday}\nM: {self.tuesday}\nW: {self.wednesday}\nJ: {self.thursday}\nV: {self.friday}\n"
