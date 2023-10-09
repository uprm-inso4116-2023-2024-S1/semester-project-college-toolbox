from datetime import time, datetime
from src.ssh_scraper.enums import Term
from src.ssh_scraper.models import engine, CourseSection, RoomSchedule
from src.ssh_scraper.query_parser import parse
from sqlalchemy.orm import Session
from sqlalchemy import and_
import copy
from dataclasses import dataclass, field


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


def get_course_sections(course_id: str, term: Term, year: int) -> list[CourseSection]:
    with Session(engine) as session:
        return (
            session.query(CourseSection)
            .filter(
                and_(
                    and_(
                        CourseSection.course_id == course_id,
                        CourseSection.term == term.value,
                    ),
                    CourseSection.year == year,
                )
            )
            .all()
        )


def get_room_schedules(course_section_id: int) -> list[RoomSchedule]:
    with Session(engine) as session:
        return (
            session.query(RoomSchedule)
            .filter(RoomSchedule.course_section_id == course_section_id)
            .all()
        )


def get_course_section_time_blocks(
    course_id: str, section: str, term: Term, year: int
) -> list[TimeBlock]:
    time_blocks = []

    with Session(engine) as session:
        section = (
            session.query(CourseSection)
            .filter(
                and_(
                    and_(
                        CourseSection.course_id == course_id,
                        CourseSection.section == section,
                    ),
                    and_(CourseSection.term == term.value, CourseSection.year == year),
                )
            )
            .first()
        )
        schedules = get_room_schedules(section.id)

        for schedule in schedules:
            if schedule.days is None:
                continue
            for day in schedule.days:
                time_blocks.append(
                    TimeBlock(
                        course_id,
                        section.section,
                        schedule.room,
                        day,
                        schedule.start_time,
                        schedule.end_time,
                    )
                )

    return time_blocks


def get_section_time_blocks_by_ids(course_section_ids: list[int]) -> list[TimeBlock]:
    time_blocks = []
    section_and_schedule: list[tuple[CourseSection, list[RoomSchedule]]] = []
    with Session(engine) as session:
        for sid in course_section_ids:
            section_and_schedule.append(
                (
                    session.query(CourseSection)
                    .filter(CourseSection.id == sid)
                    .first(),
                    get_room_schedules(sid),
                )
            )

    for section, schedules in section_and_schedule:
        for schedule in schedules:
            if schedule.days is None:
                continue
            for day in schedule.days:
                time_blocks.append(
                    TimeBlock(
                        section.course_id,
                        section.section,
                        schedule.room,
                        day,
                        schedule.start_time,
                        schedule.end_time,
                    )
                )

    return time_blocks


def validate_course_id(course_id: str):
    with Session(engine) as session:
        return (
            session.query(CourseSection)
            .filter(CourseSection.course_id == course_id)
            .first()
            is not None
        )


# main call function for schedule generation
def make_all_schedules(courses: list[str], term: Term, year: int) -> list[WeekSchedule]:
    if len(courses) == 0:
        return []

    return make_all_schedules_helper(WeekSchedule(), courses, term, year, set(), 0)


# Recursively adds and removes courses and course sections using backtracking.
# This ensures that all possible schedules will be checked for validity.
# Valid meaning that there were no conflicts and that all courses were added.
# If 5 course IDs were passed by parameter, all shceudles must strictly have 5 courses.
# The function return a list of all possible schedules that were valid.
def make_all_schedules_helper(
    curr_week_schedule: WeekSchedule,
    courses: list[str],
    term: Term,
    year: int,
    courses_scheduled: set,
    index: int,
) -> list[WeekSchedule]:
    if len(courses_scheduled) == len(courses):
        return [curr_week_schedule]
    if index >= len(courses):
        return []

    all_schedules = []
    for course_section in get_course_sections(courses[index], term, year):
        time_blocks = get_course_section_time_blocks(
            course_section.course_id,
            course_section.section,
            Term(course_section.term),
            course_section.year,
        )

        updated_schedule, time_conflict_detected = add_course_to_schedule(
            curr_week_schedule, time_blocks
        )

        if not time_conflict_detected:
            courses_scheduled.add(course_section.course_id)
            all_schedules += make_all_schedules_helper(
                updated_schedule, courses, term, year, courses_scheduled, index + 1
            )
            courses_scheduled.remove(course_section.course_id)

    return all_schedules


# Adds all the time blocks to their corresponfing day for a specific course section.
# If just one time block conflicts with another section' time block (added in a previous iteration),
# the function is terminated and returns the original WeekSchedule before any changes were made.
def add_course_to_schedule(
    curr_week_schedule: WeekSchedule, course_section_time_blocks: list[TimeBlock]
) -> tuple[WeekSchedule, bool]:
    copy_week_schedule = copy.deepcopy(curr_week_schedule)

    time_conflict_flag = False

    for section_block in course_section_time_blocks:
        day = section_block.day
        if day == "L":
            time_conflict_flag = add_time_block_to_day(
                copy_week_schedule.monday, section_block
            )

        elif day == "M":
            time_conflict_flag = add_time_block_to_day(
                copy_week_schedule.tuesday, section_block
            )

        elif day == "W":
            time_conflict_flag = add_time_block_to_day(
                copy_week_schedule.wednesday, section_block
            )

        elif day == "J":
            time_conflict_flag = add_time_block_to_day(
                copy_week_schedule.thursday, section_block
            )

        elif day == "V":
            time_conflict_flag = add_time_block_to_day(
                copy_week_schedule.friday, section_block
            )

        if time_conflict_flag:
            return (curr_week_schedule, True)

    return (copy_week_schedule, False)


# Adds one time block to the specified day passed in the parameters. This function takes care of
# placing the time block in order by its time (->ascending) and checks for time conflicts if any.
def add_time_block_to_day(
    week_day: list[TimeBlock], new_section_block: TimeBlock
) -> bool:
    temp_stack = []
    time_conclict_flag = False

    while len(week_day) != 0:
        top = week_day[-1]

        if top.end_time < new_section_block.start_time:
            break

        if check_time_conflict(top, new_section_block):
            time_conclict_flag = True
            break

        temp_stack.append(week_day.pop())

    if not time_conclict_flag:
        week_day.append(new_section_block)

    while len(temp_stack) != 0:
        week_day.append(temp_stack.pop())

    return time_conclict_flag


# Return true if the time blocks conflict or overlap
def check_time_conflict(
    locked_time_block: TimeBlock, new_time_block: TimeBlock
) -> bool:
    return (
        locked_time_block.end_time > new_time_block.start_time
        and locked_time_block.start_time < new_time_block.end_time
    )


def get_section_schedules(
    query: str, term: Term, year: int
) -> list[tuple[CourseSection, list[RoomSchedule]]]:
    section_schedules = []

    with Session(engine) as session:
        parsed_query = and_(
            parse(query),
            and_(CourseSection.term == term.value, CourseSection.year == year),
        )

        section_ids = set(
            [
                course_section.id
                for course_section in session.query(CourseSection)
                .join(RoomSchedule)
                .filter(parsed_query)
                .all()
            ]
        )

        sections = []
        if section_ids is not None:
            sections = (
                session.query(CourseSection)
                .filter(CourseSection.id.in_(section_ids))
                .all()
            )

        for section in sections:
            section_schedules.append(
                (
                    section,
                    session.query(RoomSchedule)
                    .filter(RoomSchedule.course_section_id == section.id)
                    .all(),
                )
            )

    return section_schedules
