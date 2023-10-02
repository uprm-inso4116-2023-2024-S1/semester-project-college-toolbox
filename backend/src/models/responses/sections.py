from pydantic import BaseModel


class Section(BaseModel):
    section_id: int
    section_code: str
    course_name: str
    credits: int
    professor: str
    capacity: int
    usage: int
    term: str
    year: int


class GetSectionsResponse(BaseModel):
    sections: list[Section]
