from sqlalchemy import Column, Integer, String, ForeignKey
from src.database import Base

from Document import Document


class Resume(Document, Base):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True)
    docid = Column(Integer, ForeignKey("document.docId"))
    notes = Column(String)
