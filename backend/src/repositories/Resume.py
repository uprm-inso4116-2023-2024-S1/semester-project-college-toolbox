from fastapi import APIRouter, Depends, Cookie, HTTPException, Form, Request
from typing import Annotated
from sqlalchemy.orm import Session
from src.security import get_user_id_from_token
from src.models.tables.Resume import Resume
from datetime import datetime
from src.utils.db import get_db


class ResumeRepository:
    def __init__(self, name: str):
        self.name = name
        self.router = APIRouter()
        self.db = next(get_db())
        # add routes using router object here
        self.router.add_api_route("/getAllResumes", self.getAllResumes, methods=["GET"])
        self.router.add_api_route(
            "/updateResume", self.updateResumeById, methods=["PUT"]
        )
        self.router.add_api_route(
            "/deleteResume", self.deleteResume, methods=["DELETE"]
        )
        self.router.add_api_route("/createResume", self.createResume, methods=["POST"])

    async def createResume(
        self,
        filename: str = Form(...),
        data=Form(...),
        filetype: str = Form(...),
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        userId = get_user_id_from_token(auth_token)
        try:
            data = await data.read()
            resume = Resume(filename, data, filetype, userId)
            print(resume)
        except Exception as e:
            raise HTTPException(
                status_code=405, detail="could not create Resume from paramteres"
            )

        try:
            self.db.add(resume)
            self.db.commit()
        except Exception as e:
            raise HTTPException(status_code=500)

    def getById(self, resumeId: int):
        """
        get Resume by id

        Args:
            resumeId (_type_): resume id

        Raises:
            HTTPException: _description_

        Returns:
            _type_:  Resume object
        """

        try:
            resume = self.db.query(Resume).filter(Resume.resumeId == resumeId).first()

        except HTTPException:
            raise HTTPException(status_code=404, detail="resume not found")

        return resume

    def getAllResumes(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        """get all resumes for a given user

        Args:
            auth_token (Annotated[str  |  None, Cookie, optional): auth token for user session

        Raises:
            HTTPException: not found
            HTTPException: database error

        Returns:
            list: list of Resumes for user
        """
        try:
            userId = get_user_id_from_token(auth_token)
            resumes = self.db.query(Resume).filter(Resume.userId == userId).limit(25)

            if resumes:
                return resumes
            else:
                raise HTTPException(
                    status_code=404,
                    detail="Couldn't find the apps for given user id " + userId,
                )

        except HTTPException:
            raise HTTPException(status_code=500, detail="Error accessing database")

    def updateResumeById(
        self,
        resumeId: int,
        filename: str = Form(...),
        data=Form(...),
        filetype=Form(...),
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        userId = get_user_id_from_token(auth_token)
        try:
            oldresume = (
                self.db.query(Resume).filter(Resume.resumeId == resumeId).first()
            )
            print("old resume: " + oldresume)
            oldresume.userId = userId
            oldresume.filename = filename
            oldresume.data = data
            oldresume.filetype = filetype
            oldresume.lastModified = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print("new resume: " + oldresume)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="error updating resume  from given params" + str(e),
            )

        try:
            with self.db.begin():
                self.db.add(oldresume)
                self.db.commit()
            return {"message": "success"}
        except HTTPException as e:
            raise HTTPException(
                status_code=500, detail="Error updating resume  " + str(e)
            )

    def deleteResume(self, resumeId: int = Form(...)):
        resume = self.getById(resumeId)

        if resume:
            self.db.delete(resume)
            self.db.commit()
