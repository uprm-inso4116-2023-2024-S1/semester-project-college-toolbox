from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from src.database import Base
from datetime import datetime


class ScholarshipApplication(Base):
    __tablename__ = "ScholarshipApplication"

    ScholarshipId = Column(Integer, primary_key=True, nullable=False)
    status = Column(String, nullable=False)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    docId = Column(
        String,
        ForeignKey("Document.docId"),
        nullable=False,
    )

    resumeId = Column(
        String,
        ForeignKey("Resume.resumeId"),
        nullable=False,
    )

    userId = Column(
        String,
        ForeignKey("User.UserId"),
        nullable=False,
    )

    def __init__(self, userId: int, docId: int, resumeId: int, status: str):
        """constructor

        Args:
            filename (str): _description_
            data (binary data): _description_
            filetype (str): _description_
            userId (int, optional): user id . Defaults to 1.
        """
        self.created = datetime.now()
        self.lastModified = self.created
        self.userId = userId
        self.docId = docId
        self.resumeId = resumeId
        self.status = status

    def __repr__(self):
        return f"""
              ScholarshipApplication object:    ScholarshipId: {self.ScholarshipId}
                                        resumeId: {self.resumeId}
                                        userId: {self.userId}
                                        created: {self.created}
                                        last modified: {self.lastModified}
                                        
              """
