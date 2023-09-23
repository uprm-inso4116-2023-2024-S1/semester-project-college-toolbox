from pydantic import BaseModel


class userDocsRequest(BaseModel):
    token: str
