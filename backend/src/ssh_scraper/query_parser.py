from datetime import datetime, time
from src.ssh_scraper.models import CourseSection, RoomSchedule
from ply import lex
import ply.yacc as yacc
from sqlalchemy import ColumnExpressionArgument, and_, or_, not_

FIELD_TO_TABLE = {
    "course_id": "CourseSection",
    "course_name": "CourseSection",
    "section": "CourseSection",
    "credits": "CourseSection",
    "professor": "CourseSection",
    "room": "RoomSchedule",
    "days": "RoomSchedule",
    "start_time": "RoomSchedule",
    "end_time": "RoomSchedule",
}

tokens = (
    "ID",
    "NUM",
    "COLON",
    "OR",
    "EQ",
    "GT",
    "LT",
    "GE",
    "LE",
    "NE",
    "AND",
    "NOT",
    "LPAREN",
    "RPAREN",
    "ORR",
)

t_NUM = r"\d+"
t_COLON = r":"
t_OR = r"\|"
t_AND = r"\,"
t_GT = r">"
t_LT = r"<"
t_GE = r">="
t_LE = r"<="
t_NE = r"!="
t_LPAREN = r"\("
t_RPAREN = r"\)"

t_ignore = " \t"


def t_ID(t):
    r"[a-zA-Z_.][a-zA-Z0-9_.]*"
    t_upper = t.value.upper()
    if t_upper == "NOT":
        t.type = "NOT"
    elif t_upper == "OR":
        t.type = "ORR"
    return t


def t_EQ(t):
    r"="
    t.value = "=="
    return t


def t_error(t):
    raise Exception()


precedence = (
    ("left", "OR"),
    ("left", "EQ", "NE", "GT", "LT", "GE", "LE"),
    ("left", "AND"),
)


def p_query(p):
    """query : query_term AND query
    | query_term"""
    if len(p) <= 2:
        p[0] = p[1]
    else:
        p[0] = and_(p[1], p[3])


def p_query_term(p):
    """query_term : condition ORR query_term
    | condition"""
    if len(p) <= 2:
        p[0] = p[1]
    else:
        p[0] = or_(p[1], p[3])


def apply_or(conditions):
    if len(conditions) == 1:
        return conditions[0]
    return or_(
        apply_or(conditions[: len(conditions) // 2]),
        apply_or(conditions[len(conditions) // 2 :]),
    )


def p_condition(p):
    """condition : id_list operator operand_list
    | NOT condition
    | LPAREN query RPAREN"""
    if len(p) <= 3:
        p[0] = not_(p[2])
    elif p[1] == "(" and p[3] == ")":
        p[0] = p[2]
    else:
        p[1] = p[1].replace(" ", "_").lower()
        table = FIELD_TO_TABLE[p[1]]
        queries = []
        for operand in p[3]:
            if p[1] == "section" and operand.isdecimal():
                operand = f'"{operand}"'
            if p[2] == ":":
                queries.append(eval(f"{table}.{p[1]}.like('%'+{operand}+'%')"))
            else:
                queries.append(eval(f"{table}.{p[1]} {p[2]} {operand}"))
        p[0] = apply_or(queries)


def p_operator(p):
    """operator : COLON
    | EQ
    | GT
    | LT
    | GE
    | LE
    | NE"""
    p[0] = p[1]


def p_operand_list(p):
    """operand_list : operand OR operand_list
    | operand"""
    if len(p) > 2:
        p[0] = [p[1]] + p[3]
    else:
        p[0] = [p[1]]


def p_operand(p):
    """operand : NUM
    | string
    | time
    | section"""
    p[0] = p[1]


def p_string(p):
    """string : id_list"""
    p[1] = p[1].upper()
    if p[1] in ("NULL", "NONE", "NIL"):
        p[0] = "None"
    else:
        p[0] = f'"{p[1]}"'


def p_id_list(p):
    """id_list : ID id_list
    | ID"""
    if len(p) <= 2:
        p[0] = p[1]
    else:
        p[0] = p[1] + " " + p[2]


def p_time(p):
    """time : NUM COLON NUM
    | NUM COLON NUM meridiem"""
    if len(p) <= 4:
        p[0] = f"time({p[1]}, {p[3]})"
    else:
        p[0] = f"datetime.strptime('{p[1]+p[2]+p[3]+p[4]}', '%I:%M%p').time()"


def p_meridiem(p):
    """meridiem : ID"""
    if p[1].upper() == "AM" or p[1].upper() == "PM":
        p[0] = p[1].upper()


def p_section(p):
    """section : NUM ID"""
    p[0] = f'"{p[1]+p[2].upper()}"'


def p_error(p):
    raise Exception()


lexer = lex.lex()
parser = yacc.yacc()


def parse(query: str) -> ColumnExpressionArgument[bool]:
    return parser.parse(query)
