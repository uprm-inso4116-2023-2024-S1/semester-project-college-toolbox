from sqlalchemy import Column, Integer, String, ForeignKey
from src.database import Base

from Document import Document


class Resume(Document, Base):
    __tablename__ = "Resume"

    id = Column(Integer, primary_key=True)
    notes = Column(String)
    docid = Column(Integer, ForeignKey("Document.docId"))
