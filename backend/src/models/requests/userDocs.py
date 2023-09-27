from pydantic import BaseModel
from typing import TextIO, Type


class TextIOWrapperField(TextIO):
    pass


class userDocsRequest(BaseModel):
    # commented for test
    # token: str

    filename: str
    file: Type[TextIOWrapperField]
    userid: int
