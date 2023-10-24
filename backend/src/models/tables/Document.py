from fastapi import HTTPException
from sqlalchemy import (
    Column,
    Integer,
    String,
    LargeBinary,
    ForeignKey,
    DateTime,
)
from src.database import Base
from datetime import datetime


class Document(Base):
    __tablename__ = "Document"

    docId = Column(Integer, primary_key=True, nullable=False)
    filename = Column(String)
    data = Column(LargeBinary)
    filetype = Column(String, nullable=False)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    userId = Column(
        String,
        ForeignKey("User.UserId"),
        nullable=False,
    )

    def __init__(self, filename, data, filetype, userId):
        """constructor

        Args:
            filename (str): _description_
            data (binary data): _description_
            filetype (str): _description_
            userId (int, optional): user id . Defaults to 1.
        """
        self.filename = filename
        self.data = data
        self.filetype = filetype

        self.created = datetime.now()
        self.lastModified = self.created
        self.userId = userId

    def __repr__(self):
        return f"""
              Document object: docId: {self.docId}, 
                               filename: {self.filename}, 
                               filetype: {self.filetype}
                               created: {self.created}
                               last modified: {self.lastModified}
              """
