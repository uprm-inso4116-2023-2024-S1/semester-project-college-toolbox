# src/models/requests/login.py
from pydantic import BaseModel


class ExportCalendarRequest(BaseModel):
    section_ids: list[int]
    term: str
    year: str
