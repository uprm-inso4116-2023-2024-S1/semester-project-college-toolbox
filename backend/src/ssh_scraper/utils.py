from collections import defaultdict
from typing import List
from src.models.common.scheduler import TimeBlock, WeekSchedule
from src.models.requests.schedule import ScheduleFilters
from src.models.responses.calendar import (
    CourseSectionSchedule,
    GeneratedSchedule,
    SpaceTimeBlock,
)
from src.ssh_scraper.enums import Term
from src.ssh_scraper.models import engine, CourseSection, RoomSchedule
from sqlalchemy.orm import Session
from sqlalchemy import and_
import copy
from dataclasses import dataclass, field

from src.utils import get_building_location

day_map = {"L": 0, "M": 1, "W": 2, "J": 3, "V": 4, "S": 5, "D": 6}


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


def get_course_by_section(
    course_id: str, section: str, term: Term, year: int
) -> list[CourseSection]:
    with Session(engine) as session:
        return (
            session.query(CourseSection)
            .filter(
                and_(
                    and_(
                        and_(
                            CourseSection.course_id == course_id,
                            CourseSection.term == term.value,
                        ),
                        CourseSection.year == year,
                    ),
                    CourseSection.section == section,
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


def convert_room_schedule_to_time_block(
    room_schedule: RoomSchedule,
) -> list[SpaceTimeBlock]:
    blocks = []
    building, location = get_building_location(room_schedule.room)
    for day in room_schedule.days:
        blocks.append(
            SpaceTimeBlock(
                room=room_schedule.room,
                building=building,
                location=location,
                day=day_map[day],
                startTime=str(room_schedule.start_time),
                endTime=str(room_schedule.end_time),
            )
        )
    return blocks


def create_course_section_schedule(
    course_section: CourseSection, room_schedules: List[RoomSchedule]
) -> CourseSectionSchedule:
    time_blocks = []
    for rs in room_schedules:
        time_blocks.extend(convert_room_schedule_to_time_block(rs))

    return CourseSectionSchedule(
        courseCode=course_section.course_id,
        courseName=course_section.course_name,
        professor=course_section.professor,
        credits=course_section.credits,
        sectionCode=course_section.section,
        sectionId=course_section.id,
        timeBlocks=time_blocks,
    )


def schedules_overlap(s1: RoomSchedule, s2: RoomSchedule) -> bool:
    # Check if the time ranges or days overlap
    return (
        not (s1.end_time < s2.start_time or s1.start_time > s2.end_time)
        and len(set(s1.days) & set(s2.days)) > 0
    )


def has_conflict(
    section_id: int,
    schedule: list[int],
    section_to_schedule: dict[int, list[RoomSchedule]],
):
    current_schedule = [section_to_schedule[s] for s in schedule]
    new_section_schedules = section_to_schedule[section_id]
    for existing_section_schedules in current_schedule:
        for existing_room_schedule in existing_section_schedules:
            for new_schedule in new_section_schedules:
                if schedules_overlap(new_schedule, existing_room_schedule):
                    return True


def generate_schedules_with_criteria(
    course_codes: list[str], term: str, year: int, filters: ScheduleFilters
) -> list[GeneratedSchedule]:
    # find the course data in the db
    section_map: dict[int, CourseSection] = {}
    section_time_map: dict[int, list[RoomSchedule]] = {}
    course_list = []
    course_to_sections = defaultdict(list)
    for code in course_codes:
        sections = []
        if "-" in code:
            # this should realistically only ever find one section
            course, section = code.split("-")
            sections = get_course_by_section(
                course_id=course, section=section, term=Term(term), year=year
            )
        else:
            sections = get_course_sections(course_id=code, term=Term(term), year=year)
        course_list.append(code.split(sep="-")[0])
        for section in sections:
            course_to_sections[course_list[-1]].append(section.id)
            section_map[section.id] = section
            section_time_map[section.id] = get_room_schedules(section.id)
    # Try to build the schedules
    generated_schedules: set[frozenset[int]] = set()
    max_schedules = min(25, filters.maxSchedules) if filters.maxSchedules else 5

    def generate_schedules_with_criteria_helper(
        sections_added=[], courses_added=set(), current_credits=0
    ):
        if len(generated_schedules) >= max_schedules:
            return
        if filters.minCredits:
            if current_credits >= filters.minCredits:
                generated_schedules.add(frozenset(sections_added))
        else:
            if len(courses_added) >= len(course_list):
                generated_schedules.add(frozenset(sections_added))

        for course in course_list:
            if course in courses_added:
                continue
            for section_id in course_to_sections[course]:
                section = section_map[section_id]
                if (
                    filters.maxCredits
                    and section.credits + current_credits > filters.maxCredits
                ):
                    return
                if not has_conflict(section_id, sections_added, section_time_map):
                    courses_added.add(course)
                    sections_added.append(section_id)
                    generate_schedules_with_criteria_helper(
                        sections_added=sections_added,
                        courses_added=courses_added,
                        current_credits=section.credits + current_credits,
                    )
                    sections_added.pop()
                    courses_added.remove(course)

    generate_schedules_with_criteria_helper()
    # convert the schedules to the backend response model
    converted_schedules = []
    for schedule in generated_schedules:
        converted_schedule = GeneratedSchedule(courses=[])
        for section_id in schedule:
            section_data = section_map[section_id]
            section_schedules = section_time_map[section_id]
            course_section_schedule = create_course_section_schedule(
                section_data, section_schedules
            )
            converted_schedule.courses.append(course_section_schedule)
        converted_schedules.append(converted_schedule)

    return converted_schedules
