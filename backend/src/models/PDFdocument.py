from sqlalchemy import Column, Integer, String, LargeBinary
from src.models.base import Base
from sqlalchemy.orm import sessionmaker


class PDFdocument(Base):
    __tablename__ = 'pdf_file'

    # TODO: make file name and pdf_data required
    id = Column(Integer, primary_key=True)
    file_name = Column(String)
    pdf_data = Column(LargeBinary)

    def __init__(self, file_name, pdf_data):
        self.file_name = file_name
        self.pdf_data = pdf_data
