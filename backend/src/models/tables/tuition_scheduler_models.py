# src/models/tables/tuition_scheduler.py
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Time, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

from src.database import Base


class CourseSection(Base):
    __tablename__ = "course_section"

    id = Column(Integer, autoincrement=True, primary_key=True)
    course_id = Column(String(50))
    course_name = Column(String(50))
    section = Column(String(10))
    reserved = Column(Boolean)
    credits = Column(Integer)
    professor = Column(String(50))
    capacity = Column(Integer)
    usage = Column(Integer)
    term = Column(String(10))
    year = Column(Integer)

    course_schedules = relationship("CourseSchedule", back_populates="course_section")


class RoomSchedule(Base):
    __tablename__ = "room_schedule"

    id = Column(Integer, autoincrement=True, primary_key=True)
    room = Column(String(50))
    days = Column(String(5))
    start_time = Column(Time)
    end_time = Column(Time)
    course_section_id = Column(Integer, ForeignKey("course_section.id"))

    course_section = relationship("CourseSection")


class Schedule(Base):
    __tablename__ = "schedule"

    id = Column(Integer, autoincrement=True, primary_key=True)
    name = Column(String(50))
    user_id = Column(String, ForeignKey("User.UserId"))

    course_schedules = relationship("CourseSchedule", back_populates="schedule")
    user = relationship("User", back_populates="schedules")


class CourseSchedule(Base):
    __tablename__ = "course_schedule"

    id = Column(Integer, autoincrement=True, primary_key=True)
    course_section_id = Column(Integer, ForeignKey("course_section.id"))
    schedule_id = Column(Integer, ForeignKey("schedule.id"))

    course_section = relationship("CourseSection", back_populates="course_schedules")
    schedule = relationship("Schedule", back_populates="course_schedules")
