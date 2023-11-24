from fastapi import APIRouter, Depends, Cookie, HTTPException, Form
from typing import Annotated
from sqlalchemy.orm import Session
from src.security import get_user_id_from_token
from src.models.tables import Document
from datetime import datetime
from src.utils.db import get_db
from src.repositories.Repository import Repository


class DocumentRepository(Repository):
    def __init__(self, name: str):
        super().__init__(name)

    def addRoutes(self) -> None:
        # add routes using router object here
        self.router.add_api_route("/getAllDocuments", self.getAll, methods=["GET"])
        self.router.add_api_route("/updateDocument", self.update, methods=["PUT"])
        self.router.add_api_route("/deleteDocument", self.delete, methods=["DELETE"])
        self.router.add_api_route("/createDocument", self.create, methods=["POST"])

    async def create(
        self,
        filename: str,
        data=Form(...),
        filetype: int = Form(...),
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        try:
            userId = get_user_id_from_token(auth_token)
            document = Document(filename, data, filetype, userId)
        except Exception as e:
            raise HTTPException(
                status_code=405, detail="could not create Document from paramteres"
            )

        try:
            self.db.add(document)
            self.db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail="database error" + str(e))

    async def getOne(self, docId: int):
        """
        get Document by id

        Args:
            docId (_type_): doc id

        Raises:
            HTTPException: _description_

        Returns:
            _type_: doc Document object
        """

        try:
            doc = self.db.query(Document).filter(Document.docId == docId).first()

        except HTTPException:
            raise HTTPException(status_code=404, detail="doc not found")

        return doc

    async def getAll(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        """get all docs for a given user

        Args:
            auth_token (Annotated[str  |  None, Cookie, optional): auth token for user session

        Raises:
            HTTPException: not found
            HTTPException: database error

        Returns:
            list: list of documents for user
        """
        try:
            userId = get_user_id_from_token(auth_token)
            docs = self.db.query(Document).filter(Document.userId == userId).limit(25)

            if docs:
                return docs
            else:
                raise HTTPException(
                    status_code=404,
                    detail="Couldn't find the apps for given user id " + userId,
                )

        except HTTPException:
            raise HTTPException(status_code=500, detail="Error accessing database")

    async def update(
        self,
        docId: int,
        filename: str = Form(...),
        data=Form(...),
        filetype=Form(...),
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        userId = get_user_id_from_token(auth_token)
        try:
            oldDoc = self.db.query(Document).filter(Document.docId == docId).first()
            print("old Doc: " + oldDoc)
            oldDoc.userId = userId
            oldDoc.filename = filename
            oldDoc.data = data
            oldDoc.filetype = filetype
            oldDoc.lastModified = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print("new Doc: " + oldDoc)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="error updating Doc application from given params" + str(e),
            )

        try:
            self.db.add(oldDoc)
            self.db.commit()
            return {"message": "success"}
        except HTTPException as e:
            raise HTTPException(
                status_code=500, detail="Error updating Doc application " + str(e)
            )

    async def delete(self, docId: int = Form(...)):
        Doc = self.getOne(docId)

        if Doc:
            self.db.delete(Doc)
            self.db.commit()
