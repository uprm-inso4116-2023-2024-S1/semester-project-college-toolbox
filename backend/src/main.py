# main.py
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL
from src.models.PDFdocument import PDFdocument
from src.models.user import User
from src.models.base import Base

from http.client import HTTPException

app = FastAPI()

# Database configuration
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# API endpoints


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


# Additional API endpoints for interacting with models can be added here


@app.post("/JobApplication/upload/")
async def upload_pdf(filepath: str, filename: str):
    """
    Test for uploading pdffiles to database
    later on these pdfs will likely become different tables
    such as resume, application, and other documents

    Args:
        filepath (str): filepath from locall computer
        filename (str): name to label file in database

    Raises:
        HTTPException: general exception raised if error

    Returns:
        message to console stating success
    """
    try:
        with open(filepath, 'rb') as file:
            pdf_data = file.read()
            pdf_document = PDFdocument(file_name=filename, pdf_data=pdf_data)

        with SessionLocal() as session:
            session.add(pdf_document)
            session.commit()

        return {"message": "PDF uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading PDF: {str(e)}")


@app.get("/JobApplication/get/{pdf_id}")
async def get_pdf_by_id(pdf_id: int):
    """

    gets PDFdocument from databse by id

    Args:
        pdf_id (int): pdf id of document to find

    Raises:
        HTTPException: if not found
        HTTPException: if error retreiving from database

    Returns:
        dictionatry: dictionary with filename and pdf_document object
    """
    try:
        with SessionLocal() as session:
            pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()

            if pdf_document:
                return {"filename": pdf_document.file_name, "pdf_document": pdf_document}
            else:
                raise HTTPException(
                    status_code=404, detail=f"No PDF found with id: {pdf_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving PDF: {str(e)}")
