from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from src.database import Base
from datetime import datetime
from Document import Document


class Application(Base):
    __tablename__ = "Application"

    appId = Column(Integer, primary_key=True)
    deadline = Column(DateTime)
    status = Column(String, nullable=False)
    formId = Column(Integer, ForeignKey("Document.docId"), nullable=True)
    resumeId = Column(Integer, ForeignKey("Resume.resumeId"), nullable=True)
    userId = Column(String, ForeignKey("User.UserId"), nullable=False)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    def __init__(
        self, deadline: datetime, status: str, formId: int, resumeId: int, userId: int
    ):
        self.deadline = deadline
        self.status = status
        self.formId = formId
        self.resumeId = resumeId
        self.userId = userId
        self.created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = self.created

    def __repr__(self):
        return f"""Application ID: {self.appId} 
                    deadline: {self.deadline}
                    status: {self.status}
                    formId: {self.formId}
                    resumeId: {self.resumeId}
                    userId: {self.userId}
                    created: {self.created}
                    lastModified: {self.lastModified}"""
