from enums import Term

from utils import *

def course_section_to_str(section):
        return f"Course Id: {section.course_id}, Course Name: {section.course_name}, Section: {section.section}, Professor: {section.professor}"

def room_schedule_to_str(schedule):
    return f"Room: {schedule.room}, Days: {schedule.days}, Time: {schedule.start_time}-{schedule.end_time}"

class TestUtils:
    def setup_method(self):
        self.course_id = "PSIC3001"
        self.section = "060"
        self.term = Term.FIRST_SEMESTER
        self.year = 2023

    def test_get_course_sections(self):
        sections = get_course_sections(self.course_id, self.term, self.year)
        assert len(sections) != 0

        section = sections[0]
        assert section.course_id == self.course_id
        assert section.term == self.term.value
        assert section.year == self.year

    def test_get_room_schedules(self):
        course_section_id = get_course_sections(self.course_id, self.term, self.year)[0].id
        room_schedules = get_room_schedules(course_section_id)
        assert len(room_schedules) != 0

        room_schedule = room_schedules[0]
        assert room_schedule.course_section_id == course_section_id

    def test_get_course_section_time_blocks(self):
        blocks = get_course_section_time_blocks(self.course_id, self.section, self.term, self.year)
        assert len(blocks) != 0

        block = blocks[0]
        assert block.course_id == self.course_id
        assert block.section == self.section

    def test_validate_course_id_true(self):
        assert validate_course_id(self.course_id)

    def test_validate_course_id_false(self):
        assert not validate_course_id("INVALID")

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
        self.courses1 = ['INSO4116']
        self.courses2 = ['INSO4116', 'ININ4020']
        self.courses3 = ['INSO4116', 'ININ4020', 'MUSI3171']
        self.courses4 = ['ININ4020']

    def test_make_all_schedules_empty_courses(self):
        schedules = make_all_schedules([], Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 0

    def test_make_all_schedules_single_course_LWV(self):
        schedules = make_all_schedules(self.courses1, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 1
        assert len(schedules[0].monday) == 1
        assert len(schedules[0].tuesday) == 0
        assert len(schedules[0].wednesday) == 1
        assert len(schedules[0].thursday) == 0
        assert len(schedules[0].friday) == 1
    def test_make_all_schedules_single_course_MJ(self):
        schedules = make_all_schedules(self.courses4, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 2
        for s in schedules:
            assert len(s.monday) == 0
            assert len(s.tuesday) == 1
            assert len(s.wednesday) == 0
            assert len(s.thursday) == 1
            assert len(s.friday) == 0

    def test_multiple_courses_no_conflicts(self):
        schedules = make_all_schedules(self.courses2, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 2
        for s in schedules:
            assert len(s.monday) == 1
            assert len(s.tuesday) == 1
            assert len(s.wednesday) == 1
            assert len(s.thursday) == 1
            assert len(s.friday) == 1

    def test_multiple_courses_with_conflicts(self):
        schedules = make_all_schedules(self.courses3, Term.FIRST_SEMESTER, 2023)
        assert len(schedules) == 3
        for s in schedules:
            assert len(s.monday) == 1
            assert len(s.tuesday) == 2
            assert len(s.wednesday) == 1
            assert len(s.thursday) == 2
            assert len(s.friday) == 1
