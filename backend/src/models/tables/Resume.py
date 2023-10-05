from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from src.database import Base
from datetime import datetime


class Resume(Base):
    __tablename__ = "Resume"

    resumeId = Column(Integer, primary_key=True)
    docId = Column(Integer, ForeignKey("Document.docId"), nullable=False)
    notes = Column(String, nullable=True)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    def __init__(self, docId: int, notes: str = None):
        self.docId = docId
        self.notes = notes
        self.created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = self.created
