import paramiko
import time
import re
import sys
from sqlalchemy import and_
from sqlalchemy.orm import sessionmaker
from src.models.tables import CourseSection, RoomSchedule, engine
from datetime import time as Time, datetime
import asyncio
import socket
from src.ssh_scraper.enums import Term

TASK_COUNT = 40
TIMEOUT_TIME = 60
TERMS = (
    [Term.SECOND_SEMESTER] * 5
    + [Term.FIRST_SUMMER]
    + [Term.SECOND_SUMMER]
    + [Term.FIRST_SEMESTER] * 5
)
COURSES_LIST_FILE = "src/ssh_scraper/courses.txt"

failures = set()
term_input = ""


def get_term_year(term: str = None) -> (str, int):
    now = datetime.now()
    current_term = TERMS[now.month - 1]
    if term is None:
        term = current_term.value
    year = now.year
    if current_term == Term.SECOND_SEMESTER and Term(term) == Term.SECOND_SEMESTER:
        year -= 1
    return (term, year)


async def send_input(chan, inputs: list[(str, int)]) -> str:
    output = ""
    for x in inputs:
        chan.send(x[0])
        if x[1] >= 0:
            await asyncio.sleep(x[1])
        output = chan.recv(10000)
    return re.sub(
        r"\x1B\[([0-9;]*[A-Za-z])",
        "",
        "\n".join(output.decode("ansi").split("\x1b[0m")),
    )


async def setup(chan, term: str):
    global term_input
    terms_page = await send_input(chan, [("5", -1), ("6", 1.5)])
    terms = re.findall(r"\d\=[0-9A-Za-z]+", terms_page)
    terms = {term.split("=")[1]: term.split("=")[0] for term in terms}
    term_input = terms[term]
    await send_input(chan, [(term_input, -1)])


def null_if_empty(string: str) -> str | None:
    if string == "":
        return None
    return string


def matches_regex(string: str, regex: str) -> bool:
    return re.match(regex, string) is not None


def parse_time(time: str) -> (Time, Time):
    if time is None:
        return (None, None)
    after_noon = time[-2:] == "pm"
    if after_noon:
        time = time[:-2]
    times = re.findall(r"\d{1,2}:\d{2}", time)
    parsed_times = [(-1, -1), (-1, -1)]
    for i, t in enumerate(times):
        split_t = [int(x) for x in t.split(":")]
        if split_t[0] == 12:
            split_t[0] = 0
        parsed_times[i] = (split_t[0] + (0 if not after_noon else 12), split_t[1])
    if (
        parsed_times[0][0] * 60 + parsed_times[0][1]
        > parsed_times[1][0] * 60 + parsed_times[1][1]
    ):
        parsed_times[0] = (parsed_times[0][0] - 12, parsed_times[0][1])
    return (
        Time(parsed_times[0][0], parsed_times[0][1]),
        Time(parsed_times[1][0], parsed_times[1][1]),
    )


def parse_lines(lines: str, term: str) -> dict:
    split_lines = lines.split("\n")

    course_id = split_lines[0].replace(" ", "")
    course_name = null_if_empty(split_lines[1].replace("---> ", "").strip())
    section = split_lines[2].strip()

    i = 3
    if split_lines[i] == "*":
        reserved = True
        i += 1
    else:
        reserved = False

    if "Por acuerdo" not in lines:
        rooms = []
        while (
            matches_regex(split_lines[i], r"[A-Z]+\d*[A-Z]*\s*(\d{3}[A-Z]{0,1}|[A-Z])")
            or split_lines[i].strip() == ""
        ):
            rooms.append(null_if_empty(split_lines[i].replace(" ", "")))
            i += 1

        schedules = []
        j = 0
        while matches_regex(split_lines[i], r"[LMWJV]"):
            schedules.append({"days": "", "time": ""})
            while matches_regex(split_lines[i], r"[LMWJV]"):
                schedules[j]["days"] += split_lines[i].strip()
                i += 1
            schedules[j]["time"] = split_lines[i].replace(" ", "")
            i += 1
            j += 1
        rooms += (len(schedules) - len(rooms)) * [rooms[-1]]
    else:
        rooms = [None]
        schedules = [{"days": None, "time": None}]
        i += 2

    credits = int(split_lines[i])

    professor = null_if_empty(split_lines[i + 1].strip())
    while professor is not None and "  " in professor:
        professor = professor.replace("  ", " ")

    capacity = int(split_lines[i + 2])
    usage = int(split_lines[i + 3])

    term, year = get_term_year(term)

    course_section = CourseSection(
        course_id=course_id,
        course_name=course_name,
        section=section,
        reserved=reserved,
        credits=credits,
        professor=professor,
        capacity=capacity,
        usage=usage,
        term=term,
        year=year,
    )

    room_schedules = []
    for i in range(len(schedules)):
        room = null_if_empty(rooms[i])
        days = null_if_empty(schedules[i]["days"])
        start_time, end_time = parse_time(null_if_empty(schedules[i]["time"]))
        room_schedules.append(
            RoomSchedule(
                room=room,
                days=days,
                start_time=start_time,
                end_time=end_time,
                course_section=course_section,
            )
        )

    return (course_section, room_schedules)


def format_sections_output(course: str, sections: str) -> str:
    course = course[:4] + " " + course[4:]
    if course not in sections and "* Totales" in sections:
        return "* Totales"
    i = sections.find(course)
    j = sections.find("< Oprima Enter o [PF4(9)=Fin] >")
    return sections[i:j].replace(course, "\n" + course)


async def find_sections(chan, course: str, term: str) -> list[dict]:
    output = format_sections_output(
        course, await send_input(chan, [(course, -1), ("\n", -1), ("\n", 5)])
    )[1:]
    course_with_space = course[:4] + " " + course[4:]
    if course_with_space not in output:
        return []
    start_time = time.time()
    timed_out = False
    while "* Totales" not in output:
        output += "\n" + format_sections_output(
            course, await send_input(chan, [("\n", 1)])
        )
        if time.time() - start_time > TIMEOUT_TIME:
            timed_out = True
            break
    if timed_out:
        print(f"Timed out while scraping course {course}")
        failures.add(course)
        await send_input(chan, [("9\n", -1), (term_input, -1)])
        return []

    await send_input(chan, [("\n", -1)])
    i = output.find("* Totales")
    output = output[:i]

    return [parse_lines(line, term) for line in output.split("\n\n")]


async def find_sections_multiple(courses: list[str], session, term: str):
    if len(courses) == 0:
        return

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh.connect("rumad.uprm.edu", username="estudiante", password="")

    chan = ssh.invoke_shell()
    print(f"Opened channel {hex(id(chan))}")
    await setup(chan, term)

    i = 0
    while i < len(courses):
        course = courses[i]
        try:
            term, year = get_term_year(term)
            course_section_ids = [
                course_section.id
                for course_section in session.query(CourseSection)
                .filter(
                    and_(
                        CourseSection.course_id == course,
                        and_(CourseSection.term == term, CourseSection.year == year),
                    )
                )
                .all()
            ]
            session.query(CourseSection).filter(
                CourseSection.id.in_(course_section_ids)
            ).delete()
            session.query(RoomSchedule).filter(
                RoomSchedule.course_section_id.in_(course_section_ids)
            ).delete()

            sections = await find_sections(chan, course, term)
            for section, room_schedules in sections:
                session.add(section)
                for room_schedule in room_schedules:
                    session.add(room_schedule)

            session.commit()
            i += 1
            print(f"Finished scraping course {course}")
        except socket.error:
            print(f"Socket disconnected while scraping course {course}; reconnecting")
            ssh.connect("rumad.uprm.edu", username="estudiante", password="")
            await asyncio.sleep(1)
            chan = ssh.invoke_shell()
            await setup(chan, term)
        except Exception:
            print(f"Exception occurred while scraping course {course}")
            failures.add(course)
            await send_input(chan, [("9\n", -1), (term_input, -1)])
            i += 1

    chan.close()
    ssh.close()


def split_list_into_sublists(
    input_list: list[str], num_sublists: int
) -> list[list[str]]:
    if not input_list:
        return [[]] * num_sublists

    avg_length = len(input_list) // num_sublists
    remainder = len(input_list) % num_sublists

    sublists = []
    current_index = 0

    for _ in range(num_sublists):
        sublist_length = avg_length + 1 if remainder > 0 else avg_length
        sublists.append(input_list[current_index : current_index + sublist_length])
        current_index += sublist_length
        remainder -= 1

    return sublists


async def main():
    global failures
    term = sys.argv[1] if len(sys.argv) > 1 else None

    with open(COURSES_LIST_FILE) as file:
        courses_list = split_list_into_sublists(
            [line.strip() for line in file], TASK_COUNT
        )

    start_time = time.time()

    Session = sessionmaker(bind=engine)
    with Session() as session:
        while True:
            tasks = []
            for courses in courses_list:
                tasks.append(find_sections_multiple(courses, session, term))

            await asyncio.gather(*tasks)

            if len(failures) == 0:
                break
            courses_list = split_list_into_sublists(list(failures), TASK_COUNT)
            failures = set()
            print("Scraping previously failed courses")

    print("Time elapsed: " + str(time.time() - start_time))


if __name__ == "__main__":
    asyncio.run(main())
