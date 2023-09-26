from enums import Term
import unittest
from utils import *

class UtilsTestCase(unittest.TestCase):
    def setUp(self):
        self.course_id = "PSIC3001"
        self.section = "060"
        self.term = Term.FIRST_SEMESTER
        self.year = 2023
    
    def test_get_course_sections(self):
        sections = get_course_sections(self.course_id, self.term, self.year)
        self.assertNotEqual(len(sections), 0)

        section = sections[0]
        self.assertEqual(section.course_id, self.course_id)
        self.assertEqual(section.term, self.term.value)
        self.assertEqual(section.year, self.year)

    def test_get_room_schedules(self):
        course_section_id = get_course_sections(self.course_id, self.term, self.year)[0].id
        room_schedules = get_room_schedules(course_section_id)
        self.assertNotEqual(len(room_schedules), 0)

        room_schedule = room_schedules[0]
        self.assertEqual(room_schedule.course_section_id, course_section_id)

    def test_get_course_section_time_blocks(self):
        blocks = get_course_section_time_blocks(self.course_id, self.section, self.term, self.year)
        self.assertNotEqual(len(blocks), 0)

        block = blocks[0]
        self.assertEqual(block.course_id, self.course_id)
        self.assertEqual(block.section, self.section)

    def test_validate_course_id_true(self):
        self.assertTrue(validate_course_id(self.course_id))

    def test_validate_course_id_false(self):
        self.assertFalse(validate_course_id("INVALID"))

def course_section_to_str(section):
        return f"Course Id: {section.course_id}, Course Name: {section.course_name}, Section: {section.section}, Professor: {section.professor}"

def room_schedule_to_str(schedule):
    return f"Room: {schedule.room}, Days: {schedule.days}, Time: {schedule.start_time}-{schedule.end_time}"
