from fastapi import HTTPException
from sqlalchemy import Column, Integer, String, LargeBinary
from src.database import Base
from sqlalchemy.orm import sessionmaker


class PDFdocument(Base):
    __tablename__ = "pdfdocument"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    pdf_data = Column(LargeBinary)

    def __init__(self, filename, pdf_data):
        self.filename = filename
        self.pdf_data = pdf_data

    def upload_pdf(
        self,
        SessionLocal,
    ):
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
            with SessionLocal() as session:
                session.add(self)
                session.commit()

            return {"message": "PDF uploaded successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error uploading PDF: {str(e)}"
            )

    @staticmethod
    def get_pdf_by_id(pdf_id: int, SessionLocal):
        """

        gets PDFdocument from databse by id

        Args:
            pdf_id (int): pdf id of document to find

        Raises:
            HTTPException: if pdf not found
            HTTPException: if error retreiving from database

        Returns:
            dictionatry: dictionary with filename and pdf_document object
        """
        try:
            with SessionLocal() as session:
                pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()

                if pdf_document:
                    return {
                        "filename": pdf_document.filename,
                        "pdf_document": pdf_document,
                    }
                else:
                    raise HTTPException(
                        status_code=404, detail=f"No PDF found with id: {pdf_id}"
                    )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error retrieving PDF: {str(e)}"
            )

    @staticmethod
    def delete_pdf_by_id(pdf_id: int, SessionLocal):
        """
        deletes a pdf document from the database

        Args:
            pdf_id (int): id of pdf to be deleted

        Raises:
            HTTPException: if pdf not found
            HTTPException: if error deleting from database
        """
        try:
            with SessionLocal() as session:
                pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()

                if not pdf_document:
                    raise HTTPException(
                        status_code=404, detail=f"No PDF found with id: {pdf_id}"
                    )

                session.delete(pdf_document)
                session.commit()
                return {"message": f"PDF with ID={pdf_id} deleted successfully"}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting PDF: {str(e)}")

    @staticmethod
    def update_pdf_by_id(pdf_id: int, filename: str, file, SessionLocal):
        """

        updates PDFdocument from databse by id

        Args:
            pdf_id (int): pdf id of document to update
            filename (str): new filename
            file : file object contents
            SessionLocal: session

        Raises:
            HTTPException: if pdf not found
            HTTPException: if error updating pdf in database

        Returns:
            dictionatry: dictionary with filename and pdf_document object
        """
        try:
            with SessionLocal() as session:
                pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()

                if not pdf_document:
                    raise HTTPException(
                        status_code=404, detail=f"No PDF found with id: {pdf_id}"
                    )

                pdf_document.filename = filename
                pdf_document.pdf_data = file.read()

                session.add(pdf_document)
                session.commit()

                return {
                    "filename": pdf_document.file_name,
                    "pdf_document": pdf_document,
                }
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error retrieving PDF: {str(e)}"
            )
