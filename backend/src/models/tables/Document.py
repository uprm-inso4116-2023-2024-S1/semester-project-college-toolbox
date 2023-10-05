from fastapi import HTTPException
from sqlalchemy import (
    Column,
    Integer,
    String,
    LargeBinary,
    ForeignKey,
    DateTime,
)
from src.database import Base
from datetime import datetime


class Document(Base):
    __tablename__ = "Document"

    docId = Column(Integer, primary_key=True, nullable=False)
    filename = Column(String)
    data = Column(LargeBinary)
    filetype = Column(String, nullable=False)
    created = Column(DateTime, nullable=False)
    lastModified = Column(DateTime, nullable=False)

    userId = Column(
        String,
        ForeignKey("User.UserId"),
        nullable=False,
    )

    def __init__(self, filename, data, filetype, userId):
        """constructor

        Args:
            filename (str): _description_
            data (binary data): _description_
            filetype (str): _description_
            userId (int, optional): user id . Defaults to 1.
        """
        self.filename = filename
        self.data = data
        self.filetype = filetype

        self.created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = self.created
        self.userId = userId

    def __repr__(self):
        return f"""
              Document object: docId: {self.docId}, 
                               filename: {self.filename}, 
                               filetype: {self.filetype}
                               created: {self.created}
                               last modified: {self.lastModified}
              """

    def upload(self, session):
        """
        uploading files to database
        such as resume, application form, and other documents

        Args:
            session : session object to access database

        Raises:
            HTTPException: general exception raised if error

        Returns:
            message to console stating success
        """
        try:
            session.add(self)

            session.commit()
            session.close()
            return {"message": "Document uploaded successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error uploading doc: {str(e)}"
            )

    @staticmethod
    def get_doc_by_id(doc_id: int, session):
        """

        gets document from databse by id

        Args:
            doc_id (int): doc id of document to find
            session (Session): session object

        Raises:
            HTTPException: if doc not found
            HTTPException: if error retreiving from database

        Returns:
            document object
        """
        try:
            document = session.query(document).filter_by(id=doc_id).first()

            if document:
                return document
            else:
                raise HTTPException(
                    status_code=404, detail=f"No Doc found with id: {doc_id}"
                )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error retrieving doc: {str(e)}"
            )

    @staticmethod
    def delete_doc_by_id(doc_id: int, session):
        """
        deletes a document from the database

        Args:
            doc_id (int): id of doc to be deleted

        Raises:
            HTTPException: if doc not found
            HTTPException: if error deleting from database
        """
        try:
            with session() as session:
                document = session.query(Document).filter_by(id=doc_id).first()

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
    def update_doc_by_id(doc_id: int, filename: str, file, session):
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
            with session() as session:
                document = session.query(Document).filter_by(id=doc_id).first()

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

    @staticmethod
    def getAllUserDocs(userId: String, session):
        try:
            documents = session.query(Document).filter(Document.userId == userId)

            if documents:
                print(documents)
                return documents
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error getting all documents : {str(e)}"
            )
