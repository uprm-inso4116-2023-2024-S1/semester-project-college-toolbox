# main.py
from typing import Annotated

from fastapi import FastAPI, UploadFile, File, Request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URL
from src.models.PDFdocument import PDFdocument
from src.models.user import User
from src.models.base import Base
from fastapi.middleware.cors import CORSMiddleware


# Configure CORS to allow requests from the React frontend

app = FastAPI()

frontendPort = "2121"
origins = [
    f"http://localhost:{frontendPort}"
]  # Add any other allowed origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict HTTP methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)


# Database configuration
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# API endpoints


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


# Additional API endpoints for interacting with models can be added here


@app.post("/ScholarshipApplication/upload")
async def upload_pdf(request: Request):
    # new_pdf = PDFdocument(filename, file)
    # new_pdf.upload_pdf(SessionLocal)
    # return {"message": "uploaded successfully"}

    # print(await request.form())
    async with request.form() as form:
        filename = form["test"].filename
        print(filename)
        pdf_data = await form["test"].read()

        doc = PDFdocument(filename, pdf_data)
        doc.upload_pdf(SessionLocal)


@app.get("/ScholarshipApplication/get/pdf_id/{pdf_id}")
def get_pdf_by_id(pdf_id: int):
    return PDFdocument.get_pdf_by_id(pdf_id=pdf_id, SessionLocal=SessionLocal)


@app.delete("/ScholarshipApplication/delete/pdf_id/{pdf_id}")
def delete_pdf_by_id(pdf_id: int):
    # """
    # deletes a pdf document from the database

    # Args:
    #     pdf_id (int): id of pdf to be deleted

    # Raises:
    #     HTTPException: if pdf not found
    #     HTTPException: if error deleting from database
    # """
    # try:
    #     with SessionLocal() as session:
    #         pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()
    #         if not pdf_document:
    #             raise HTTPException(
    #                 status_code=404, detail=f"No PDF found with id: {pdf_id}"
    #             )
    #         else:
    #             session.delete(pdf_document)
    #             session.commit()

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error deleting PDF: {str(e)}")

    return PDFdocument.delete_pdf_by_id(pdf_id=pdf_id, SessionLocal=SessionLocal)


@app.put(
    "/ScholarshipApplication/update/pdf_id/{pdf_id}/filepath/{filepath: str}/filename/{filename: str}"
)
def update_pdf_by_id(pdf_id: int, filepath: str, filename: str):
    PDFdocument.update_pdf_by_id(pdf_id, filepath, filename, SessionLocal)
