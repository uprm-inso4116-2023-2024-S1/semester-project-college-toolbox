from datetime import time
from enums import Term
from models import engine, CourseSection, RoomSchedule
from sqlalchemy.orm import Session
from sqlalchemy import and_

class TimeBlock:
    def __init__(self, course_id: str, section: str, room: str, day: str, start_time: time, end_time: time):
        self.course_id = course_id
        self.section = section
        self.room = room
        self.day = day
        self.start_time = start_time
        self.end_time = end_time

    def __str__(self):
        return f"Course: {self.course_id}, Section: {self.section}, Room: {self.room}, Day: {self.day}, Start Time: {self.start_time}, End Time: {self.end_time}"

def get_course_sections(course_id: str, term: Term, year: int) -> list[CourseSection]:
    with Session(engine) as session:
        return session.query(CourseSection).filter(and_(and_(CourseSection.course_id == course_id, CourseSection.term == term.value), CourseSection.year == year)).all()

def get_room_schedules(course_section_id: int) -> list[RoomSchedule]:
    with Session(engine) as session:
        return session.query(RoomSchedule).filter(RoomSchedule.course_section_id == course_section_id).all()

def get_course_section_time_blocks(course_id: str, section: str, term: Term, year: int) -> list[TimeBlock]:
    time_blocks = []
    
    with Session(engine) as session:
        section = session.query(CourseSection).filter(and_(and_(CourseSection.course_id == course_id, CourseSection.section == section), and_(CourseSection.term == term.value, CourseSection.year == year))).first()
        schedules = get_room_schedules(section.id)

        for schedule in schedules:
            if schedule.days is None:
                continue
            for day in schedule.days:
                time_blocks.append(TimeBlock(course_id, section.section, schedule.room, day, schedule.start_time, schedule.end_time))

    return time_blocks

def validate_course_id(course_id: str):
    with Session(engine) as session:
        return session.query(CourseSection).filter(CourseSection.course_id == course_id).first() is not None
