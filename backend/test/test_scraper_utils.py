from datetime import time
from src.ssh_scraper.enums import Term
from src.models.requests.schedule import FilteredCourse
from .test_config import test_db, engine
from src.ssh_scraper.utils import *


class TestUtils:
    def setup_method(self, test_db):
        self.course_id = "PSIC3001"
        self.section = "060"
        self.term = Term.FIRST_SEMESTER
        self.year = 2023

    def test_get_course_sections(self, test_db):
        sections = get_course_sections(self.course_id, self.term, self.year)
        assert len(sections) != 0

        section = sections[0]
        assert section.course_id == self.course_id
        assert section.term == self.term.value
        assert section.year == self.year

    def test_get_room_schedules(self, test_db):
        course_section_id = get_course_sections(self.course_id, self.term, self.year)[
            0
        ].id
        room_schedules = get_room_schedules(course_section_id)
        assert len(room_schedules) != 0

        room_schedule = room_schedules[0]
        assert room_schedule.course_section_id == course_section_id

    def test_get_course_section_time_blocks(self):
        blocks = get_course_section_time_blocks(
            self.course_id, self.section, self.term, self.year
        )
        assert len(blocks) != 0

        block = blocks[0]
        assert block.course_id == self.course_id
        assert block.section == self.section

    def test_validate_course_id_true(self, test_db):
        assert validate_course_id(self.course_id, self.term.value, self.year)

    def test_validate_course_id_false(self, test_db):
        assert not validate_course_id("INVALID", self.term.value, self.year)


# ================================
# Tests for Schedule generation
# ================================


# Courses:
#  INSO4116:
#    sections = [070 1:30pm-2:20pm LWV S113]
#
#  ININ4020
#    sections = [016 7:30am-8:45am MJ II202], [036 9:00am-10:15am MJ II202]
#
#  MUSI3171
#    sections = [036 9:00am-10:15am MJ CH114], [066 12:30pm-1:45pm MJ CH114]
#
class TestSchedulingFunctions:
    def setup_method(self):
        self.courses1 = ["INSO4116"]
        self.courses2 = ["INSO4116", "ININ4020"]
        self.courses3 = ["INSO4116", "ININ4020", "MUSI3171"]
        self.courses4 = ["ININ4020"]

    def test_make_all_schedules_empty_courses(self, test_db):
        schedules = make_all_schedules([], Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 0

    def test_make_all_schedules_single_course_LWV(self, test_db):
        schedules = make_all_schedules(self.courses1, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 1
        assert len(schedules[0].monday) == 1
        assert len(schedules[0].tuesday) == 0
        assert len(schedules[0].wednesday) == 1
        assert len(schedules[0].thursday) == 0
        assert len(schedules[0].friday) == 1

    def test_make_all_schedules_single_course_MJ(self, test_db):
        schedules = make_all_schedules(self.courses4, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 2
        for s in schedules:
            assert len(s.monday) == 0
            assert len(s.tuesday) == 1
            assert len(s.wednesday) == 0
            assert len(s.thursday) == 1
            assert len(s.friday) == 0

    def test_multiple_courses_no_conflicts(self, test_db):
        schedules = make_all_schedules(self.courses2, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 2
        for s in schedules:
            assert len(s.monday) == 1
            assert len(s.tuesday) == 1
            assert len(s.wednesday) == 1
            assert len(s.thursday) == 1
            assert len(s.friday) == 1

    def test_multiple_courses_with_conflicts(self, test_db):
        schedules = make_all_schedules(self.courses3, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 3
        for s in schedules:
            assert len(s.monday) == 1
            assert len(s.tuesday) == 2
            assert len(s.wednesday) == 1
            assert len(s.thursday) == 2
            assert len(s.friday) == 1


class TestGetSectionSechedules:
    def setup_method(self):
        self.term = Term.FIRST_SEMESTER
        self.year = 2023

    def test_contains(self, test_db):
        section, _ = get_section_schedules("course id : INSO", self.term, self.year)[0]
        assert "INSO" in section.course_id

    def test_separator(self, test_db):
        section, schedules = get_section_schedules(
            "course id : CIIC, days = LW", self.term, self.year
        )[0]
        assert "CIIC" in section.course_id and schedules[0].days == "LW"

    def test_or(self, test_db):
        section, schedules = get_section_schedules(
            "start time >= 12:00pm or section : D", self.term, self.year
        )[0]
        assert "D" in section.section or schedules[0].start_time >= time(12)

    def test_not(self, test_db):
        section, _ = get_section_schedules(
            "not course id : INSO", self.term, self.year
        )[0]
        assert "INSO" not in section.course_id

    def test_selector(self, test_db):
        section, _ = get_section_schedules(
            "course id = CIIC4060 | INSO4116 | CIIC4050", self.term, self.year
        )[0]
        assert (
            section.course_id == "CIIC4060"
            or section.course_id == "INSO4116"
            or section.course_id == "CIIC4050"
        )


class TestGetQueryFromFilters:
    def test_course_code(self, test_db):
        query = get_query_from_filters(
            FilteredCourse(code="PSIC3001", filters="professor : Gustavo G. Cortina")
        )
        assert query == "course id = PSIC3001, professor : Gustavo G. Cortina"

    def test_no_filters(self, test_db):
        query = get_query_from_filters(FilteredCourse(code="INSO4116", filters=None))
        assert query == "course id = INSO4116"

    def test_with_section(self, test_db):
        query = get_query_from_filters(
            FilteredCourse(code="PSIC3001-116", filters=None)
        )
        assert query == "(course id = PSIC3001, section = 116)"