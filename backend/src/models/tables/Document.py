from fastapi import HTTPException
from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey
from src.database import Base
from datetime import datetime


class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    data = Column(LargeBinary)
    filetype = Column(String, nullable=False)
    created = Column(Integer, nullable=False)
    lastModified = Column(Integer, nullable=False)

    userId = Column(
        Integer,
        ForeignKey("user.userId"),
        nullable=False,
    )

    def __init__(self, filename, data, filetype):
        self.filename = filename
        self.data = data
        self.filetype = filetype

        self.created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = self.created

    def upload(
        self,
        SessionLocal,
    ):
        """
        Test for uploading files to database
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

            return {"message": "Document uploaded successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error uploading PDF: {str(e)}"
            )

    @staticmethod
    def get_doc_by_id(doc_id: int, SessionLocal):
        """

        gets document from databse by id

        Args:
            doc_id (int): pdf id of document to find

        Raises:
            HTTPException: if pdf not found
            HTTPException: if error retreiving from database

        Returns:
            dictionatry: dictionary with filename and pdf_document object
        """
        try:
            with SessionLocal() as session:
                document = session.query(document).filter_by(id=doc_id).first()

                if document:
                    return {
                        "filename": document.filename,
                        "document": document,
                    }
                else:
                    raise HTTPException(
                        status_code=404, detail=f"No Doc found with id: {doc_id}"
                    )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error retrieving doc: {str(e)}"
            )

    @staticmethod
    def delete_pdf_by_id(doc_id: int, SessionLocal):
        """
        deletes a document from the database

        Args:
            doc_id (int): id of doc to be deleted

        Raises:
            HTTPException: if doc not found
            HTTPException: if error deleting from database
        """
        try:
            with SessionLocal() as session:
                document = session.query(document).filter_by(id=doc_id).first()

                if not document:
                    raise HTTPException(
                        status_code=404, detail=f"No document found with id: {doc_id}"
                    )

                session.delete(document)
                session.commit()
                return {"message": f"document with ID={doc_id} deleted successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error deleting document: {str(e)}"
            )

    @staticmethod
    def update_doc_by_id(doc_id: int, filename: str, file, SessionLocal):
        """

        updates document from databse by id

        Args:
            doc_id (int): pdf id of document to update
            filename (str): new filename
            file : file object contents
            SessionLocal: session

        Raises:
            HTTPException: if pdf not found
            HTTPException: if error updating pdf in database

        Returns:
            dictionatry: dictionary with filename and document object
        """
        try:
            with SessionLocal() as session:
                document = session.query(document).filter_by(id=doc_id).first()

                if not document:
                    raise HTTPException(
                        status_code=404, detail=f"No documenr found with id: {doc_id}"
                    )

                document.filename = filename
                document.pdf_data = file.read()

                session.add(document)
                session.commit()

                return {
                    "filename": document.filename,
                    "document": document,
                }
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error retrieving document: {str(e)}"
            )
