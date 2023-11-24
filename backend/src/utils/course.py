from src.models.requests.schedule import FilteredCourse
from src.models.common.schedule import (
    CourseSearchSection,
    CourseSearchSchedule,
)
from src.models.tables import CourseSection, RoomSchedule


class CourseQueryUtils:
    def get_query_from_filters(course: FilteredCourse) -> str:
        query = ""
        if "-" in course.code:
            code, section = course.code.split("-", 1)
            query += f"(course id = {code}, section = {section})"
        else:
            query += f"course id = {course.code}"
        if course.filters is not None and course.filters != "":
            query += f", {course.filters}"
        return query

    def create_course_search_section(
        section: CourseSection, schedules: list[RoomSchedule]
    ):
        def is_empty_schedule(schedule: RoomSchedule):
            return (
                schedule.room is None
                and schedule.days is None
                and schedule.start_time is None
                and schedule.end_time is None
            )

        return CourseSearchSection(
            courseCode=section.course_id,
            courseName=section.course_name,
            professor="" if section.professor is None else section.professor,
            credits=section.credits,
            sectionCode=section.section,
            sectionId=section.id,
            schedules=[
                CourseSearchSchedule(
                    room="" if schedule.room is None else schedule.room,
                    days="" if schedule.days is None else schedule.days,
                    startTime=""
                    if schedule.start_time is None
                    else str(schedule.start_time),
                    endTime="" if schedule.end_time is None else str(schedule.end_time),
                )
                for schedule in schedules
                if not is_empty_schedule(schedule)
            ],
        )
