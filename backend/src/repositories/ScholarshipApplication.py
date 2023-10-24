from fastapi import APIRouter, Depends, Cookie, HTTPException, Form
from typing import Annotated
from sqlalchemy.orm import Session
from src.security import get_user_id_from_token
from src.models.tables.ScholarshipApplication import ScholarshipApplication
from datetime import datetime
from src.utils.db import get_db


class ScholarshipRepository:
    def __init__(self, name: str):
        self.name = name
        self.db: Session = next(get_db())
        self.router = APIRouter()

        # add routes using router object here
        self.router.add_api_route(
            "/getAllScholarshipApplications", self.getAllApplications, methods=["GET"]
        )
        self.router.add_api_route(
            "/updateScholarshipApplication", self.updateApplicationById, methods=["PUT"]
        )
        self.router.add_api_route(
            "/deleteScholarshipApplication",
            self.deleteApplication,
            methods=["DELETE"],
        )
        self.router.add_api_route(
            "/createScholarshipApplication", self.createApplication, methods=["POST"]
        )

    async def createApplication(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
        docId: int = Form(...),
        resumeId: int = Form(...),
        status: str = Form(...),
    ):
        try:
            userId = get_user_id_from_token(auth_token)
            application = ScholarshipApplication(userId, resumeId, docId, status)
        except Exception as e:
            raise HTTPException(
                status_code=405, detail="could not create application from paramteres"
            )

        try:
            self.db.add(application)
            self.db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail="database error" + str(e))

    async def getById(self, scholarshipId):
        """
        get scholarship application by id

        Args:
            ScholarshipId (_type_): Scholarship id

        Raises:
            HTTPException: _description_

        Returns:
            _type_: Scholarship application object
        """

        try:
            Scholarship = (
                self.db.query(ScholarshipApplication)
                .filter(ScholarshipApplication.ScholarshipId == scholarshipId)
                .first()
            )

        except HTTPException:
            raise HTTPException(status_code=404, detail="Scholarship not found")

        return Scholarship

    async def getAllApplications(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        """get all Scholarship applications for a given user

        Args:
            auth_token (Annotated[str  |  None, Cookie, optional): auth token for user session

        Raises:
            HTTPException: not found
            HTTPException: database error

        Returns:
            list: list of applications for user
        """
        try:
            userId = get_user_id_from_token(auth_token)
            # assume a max capacity of applications at a given time to be at most 25
            apps = (
                self.db.query(ScholarshipApplication)
                .filter(ScholarshipApplication.userId == userId)
                .limit(25)
            )

            if apps:
                return apps
            else:
                raise HTTPException(
                    status_code=404,
                    detail="Couldn't find the apps for given user id " + userId,
                )

        except HTTPException:
            raise HTTPException(status_code=500, detail="Error accessing database")

    async def updateApplicationById(
        self,
        ScholarshipId: int,
        auth_token: Annotated[str | None, Cookie()] = None,
        status: int = Form(...),
        docId: int = Form(...),
        resumeId: int = Form(...),
    ):
        """
        Update a Scholarship application by id

        Args:
            ScholarshipId (int): Scholarship id
            auth_token (Annotated[str  |  None, Cookie, optional
            docId (int, optional): .= doc id Defaults to Form(...).
            resumeId (int, optional): = resume id Defaults to Form(...).
            status (int, optional): = status Defaults to Form(...).

        Raises:
            HTTPException: not found
            HTTPException: db error

        Returns:
            _type_:
        """
        userId = get_user_id_from_token(auth_token)
        try:
            oldScholarship = (
                self.db.query(ScholarshipApplication)
                .filter(ScholarshipApplication.ScholarshipId == ScholarshipId)
                .first()
            )
            print("old Scholarship: " + oldScholarship)
            oldScholarship.userId = userId
            oldScholarship.docId = docId
            oldScholarship.resumeId = resumeId
            oldScholarship.status = status
            oldScholarship.lastModified = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print("new Scholarship: " + oldScholarship)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="error updating Scholarship application from given params"
                + str(e),
            )

        try:
            self.db.add(oldScholarship)
            self.db.commit()
            return {"message": "success"}
        except HTTPException as e:
            raise HTTPException(
                status_code=500,
                detail="Error updating Scholarship application " + str(e),
            )

    async def deleteApplication(self, applicationId: int = Form(...)):
        Scholarship = self.getById(applicationId)

        if Scholarship:
            self.db.delete(Scholarship)
            self.db.commit()
