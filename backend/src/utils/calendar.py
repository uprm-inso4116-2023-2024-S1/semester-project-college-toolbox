import re
from icalendar import Calendar, Event, Alarm
from datetime import datetime, timedelta, timezone
import os
import textwrap
from typing import Optional, Tuple
from uuid import uuid4
from fastapi.responses import FileResponse
from src.models.tables.user import User
from src.ssh_scraper.enums import Term
from src.models.common.schedule import Semester, TimeBlock


def get_full_name(user: User) -> str:
    name = ""
    if user.FirstName:
        name += f"{user.FirstName}"
    if user.Initial:
        name += f" {user.Initial}."
    if user.FirstLastName:
        name += f" {user.FirstLastName}"
    if user.SecondLastName:
        name += f" {user.SecondLastName}"
    return name


def try_delete_file(file_name: str):
    try:
        os.remove(file_name)
    except Exception as e:
        print(f"Error deleting {file_name}: {str(e)}")


time_block_day_to_rfc = {
    "L": "MO",
    "M": "TU",
    "W": "WE",
    "J": "TH",
    "V": "FR",
    "S": "SA",
    "D": "SU",
}

weekday_str_to_int = {day_str: day_int for day_int, day_str in enumerate("LMWJVSD")}


def get_semester(term: Term, year: str) -> Semester:
    # TODO: turn this into a proper service which does a lookup of the appropriate semester given a date
    if term == Term.FIRST_SEMESTER:
        return Semester(
            title="Fall Semester Courses",
            start=datetime(int(year), 8, 1),
            end=datetime(int(year), 12, 24),
        )
    if term == Term.SECOND_SEMESTER:
        return Semester(
            title="Spring Semester Courses",
            start=datetime(int(year) + 1, 1, 1),
            end=datetime(int(year) + 1, 5, 30),
        )
    if term == Term.FIRST_SUMMER:
        return Semester(
            title="First Summer Semester Courses",
            start=datetime(int(year) + 1, 6, 1),
            end=datetime(int(year) + 1, 7, 30),
        )
    if term == Term.SECOND_SUMMER:
        return Semester(
            title="Second Summer Semester Courses",
            start=datetime(int(year) + 1, 7, 1),
            end=datetime(int(year) + 1, 8, 30),
        )


def next_weekday_date(start_date: datetime, weekday: int):
    days_ahead = weekday - start_date.weekday()
    if days_ahead < 0:
        days_ahead += 7
    return start_date + timedelta(days_ahead)


def get_building_location(room: str) -> Tuple[str, str]:
    if not room:
        return ("", "")
    room_code = re.sub(r"\d+", "", room)
    room_to_building_location = {
        "AE": ("Administración de Empresas", "https://goo.gl/maps/uS2sHKErq9muJFx6A"),
        "B": ("Edificio de Biología", "https://goo.gl/maps/zpv6MvfdXoqa7rgk8"),
        "CM": ("Coliseo Rafael A. Mangual", "https://goo.gl/maps/baEHaSvSh26HCUhE7"),
        "SH": ("Edificio Sánchez Hidalgo", "https://goo.gl/maps/8iS2bC8soAaMoBLa7"),
        "CH": ("Edificio Chardón", "https://goo.gl/maps/ddVvr6hn7ruASTyq5"),
        "P": ("Edificio Jesus T. Piñero", "https://goo.gl/maps/R6svtNVmXsYARLzg8"),
        "C": (
            "Edificio Luis de Celis (Admisiones, Decanato de Artes y Ciencias, Estudios Graduados)",
            "https://goo.gl/maps/XZx55dhZyMqDPWod8",
        ),
        "M": ("Edificio Luis Monzón", "https://goo.gl/maps/a9NSqMrefSYTd9FT7"),
        "S": ("Edificio Luis Stefani", "https://goo.gl/maps/2HMQ8G7x7mKHxhzUA"),
        "EE": (
            "Edificio Josefina Torres Torres (Enfermería)",
            "https://goo.gl/maps/YMycT3STYfGJmLnc6",
        ),
        "T": (
            "Edificio Terrats (Finanzas y Pagaduría)",
            "https://goo.gl/maps/1ELvbbPMCCDCKxvEA",
        ),
        "AZ": ("Finca Alzamora", "https://goo.gl/maps/3WfKd3Bj7rCXdBHT6"),
        "F": (
            "Física, Geología y Ciencias Marinas",
            "https://goo.gl/maps/LMNsrKzhhRJQ1ew9A",
        ),
        "GE": ("Gimnasio Ángel F. Espada", "https://goo.gl/maps/2CMaZ8948wqkYVJw5"),
        "II": (
            "Edificio de Ingeniería Industrial",
            "https://goo.gl/maps/7a9BEDauP18CeF7e7",
        ),
        "CI": ("Edificio de Ingeniería Civil", "https://goo.gl/maps/FMMqC4aSRPwTFr5n9"),
        "L": ("Edificio Antonio Luchetti", "https://goo.gl/maps/FQq3U97Ujf9CGMJz5"),
        "IQ": (
            "Edificio de Ingeniería Química",
            "https://goo.gl/maps/aunAi3yfDsh1VbQt6",
        ),
        "Q": ("Edificio de Química", "https://goo.gl/maps/ufTZdT6q52i4bTAy9"),
        "SA": ("ROTC", "https://goo.gl/maps/tqmxZpN2g138SMma8"),
    }
    if room_code not in room_to_building_location:
        return ("", "")
    return room_to_building_location[room_code]


def create_course_calendar(
    time_blocks: list[TimeBlock], ics_filename: str, semester_info: Semester
) -> FileResponse:
    cal = Calendar()
    cal.add("prodid", "-//AlejandroCruzado//Matrical//EN")
    cal.add("version", "2.0")
    cal.add("x-wr-calname", f"{semester_info.title}")
    cal.add("x-wr-timezone", "America/Puerto_Rico")
    # TODO: Add notification preferences
    for time_block in time_blocks:
        building_name, location = get_building_location(time_block.room)
        event = Event()
        event.add("uid", str(uuid4()))
        event.add(
            "summary",
            f"{time_block.course_id}-{time_block.section} @ {time_block.room}",
        )
        event.add("location", location)
        event.add(
            "description",
            textwrap.dedent(
                f"""
                Room: {time_block.room}
                Building: {building_name}
                """
            ),
        )

        first_date = next_weekday_date(
            semester_info.start, weekday_str_to_int[time_block.day]
        )
        event.add(
            "dtstart",
            first_date.replace(
                hour=time_block.start_time.hour, minute=time_block.start_time.minute
            ),
        )
        event.add(
            "dtend",
            first_date.replace(
                hour=time_block.end_time.hour, minute=time_block.end_time.minute
            ),
        )
        event.add(
            "rrule",
            {
                "freq": "weekly",
                "byday": time_block_day_to_rfc[time_block.day],
                "until": semester_info.end,
            },
        )
        event.add("dtstamp", datetime.now())
        # Add an alarm 30 minutes before the event
        alarm = Alarm()
        alarm.add("action", "DISPLAY")
        alarm.add("trigger", timedelta(minutes=-30))
        event.add_component(alarm)

        cal.add_component(event)

    with open(ics_filename, "wb") as f:
        f.write(cal.to_ical())

    return FileResponse(
        ics_filename,
        headers={"Content-Disposition": f"attachment; filename={ics_filename}"},
    )
