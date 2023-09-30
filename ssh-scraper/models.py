from sqlalchemy import create_engine, Column, Integer, String, Boolean, Time, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

engine = create_engine("sqlite:///sections.db")
Base = declarative_base()


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


class RoomSchedule(Base):
    __tablename__ = "room_schedule"

    id = Column(Integer, autoincrement=True, primary_key=True)
    room = Column(String(50))
    days = Column(String(5))
    start_time = Column(Time)
    end_time = Column(Time)
    course_section_id = Column(Integer, ForeignKey("course_section.id"))

    course_section = relationship("CourseSection")


if __name__ == "__main__":
    Base.metadata.create_all(engine)
