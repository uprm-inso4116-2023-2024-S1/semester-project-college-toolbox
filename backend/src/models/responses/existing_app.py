#src/models/responses/existing_app.py
from pydantic import BaseModel

class ExistingApplicationResponse(BaseModel):
    Name: str | None = None
    Description: str
    URL: str
    Icon: str
    Type: str
    Rating: int
    RatingCount: int