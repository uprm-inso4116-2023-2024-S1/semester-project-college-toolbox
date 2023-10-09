from src.ssh_scraper.query_parser import parse
from datetime import time


class TestUtils:
    def test_parse_contains(self):
        section, _ = parse("course id : INSO")[0]
        assert "INSO" in section.course_id

    def test_parse_separator(self):
        section, schedules = parse("course id : CIIC, days = LW")[0]
        assert "CIIC" in section.course_id and schedules[0].days == "LW"

    def test_parse_or(self):
        section, schedules = parse("start time >= 12:00pm or section : D")[0]
        assert "D" in section.section or schedules[0].start_time >= time(12)

    def test_parse_not(self):
        section, _ = parse("not course id : INSO")[0]
        assert "INSO" not in section.course_id

    def test_parse_selector(self):
        section, _ = parse("course id = CIIC4060 | INSO4116 | CIIC4050")[0]
        assert (
            section.course_id == "CIIC4060"
            or section.course_id == "INSO4116"
            or section.course_id == "CIIC4050"
        )
