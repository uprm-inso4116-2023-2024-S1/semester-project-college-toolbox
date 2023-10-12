from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from src.database import Base
from datetime import datetime


class JobApplication(Base):
    __tablename__ = "JobApplication"

    jobId = Column(Integer, primary_key=True, nullable=False)
    status = Column(String, nullable=False)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    docId = Column(
        Integer,
        ForeignKey("Document.docId"),
        nullable=False,
    )

    resumeId = Column(
        Integer,
        ForeignKey("Resume.resumeId"),
        nullable=False,
    )

    userId = Column(
        String,
        ForeignKey("User.UserId"),
        nullable=False,
    )

    def __init__(self, userId: str, resumeId: int, docId: int, status: str):
        """constructor

        Args:
            filename (str): _description_
            data (binary data): _description_
            filetype (str): _description_
            userId (int, optional): user id . Defaults to 1.
        """
        self.created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = self.created
        self.userId = userId
        self.resumeId = resumeId
        self.status = status
        self.docId = docId

    def __repr__(self):
        return f"""
              JobApplication object:    jobId: {self.jobId}
                                        resumeId: {self.resumeId}
                                        userId: {self.userId}
                                        created: {self.created}
                                        last modified: {self.lastModified}
                                        
              """
