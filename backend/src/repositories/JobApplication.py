from fastapi import APIRouter, Depends, Cookie, HTTPException, Form
from typing import Annotated
from sqlalchemy.orm import Session
from src.security import get_user_id_from_token
from src.models.tables.JobApplication import JobApplication
from datetime import datetime
from src.utils.db import get_db


class JobRepository:
    def __init__(self, name: str):
        self.name = name
        self.db: Session = next(get_db())
        self.router = APIRouter()

        # add routes using router object here
        self.router.add_api_route(
            "/getAllJobApplications", self.getAllApplications, methods=["GET"]
        )
        self.router.add_api_route(
            "/updateJobApplication", self.updateApplicationById, methods=["PUT"]
        )
        self.router.add_api_route(
            "/deleteJobApplication", self.deleteApplication, methods=["DELETE"]
        )
        self.router.add_api_route(
            "/createJobApplication", self.createApplication, methods=["POST"]
        )

    def createApplication(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
        docId: int = Form(...),
        resumeId: int = Form(...),
        status: str = Form(...),
    ):
        userId = get_user_id_from_token(auth_token)
        try:
            application = JobApplication(userId, resumeId, docId, status)
        except Exception as e:
            raise HTTPException(
                status_code=405, detail="could not create application from paramteres"
            )

        try:
            self.db.add(application)
            self.db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail="database error" + str(e))

    def getById(self, jobId):
        """
        get job application by id

        Args:
            jobId (_type_): job id

        Raises:
            HTTPException: _description_

        Returns:
            _type_: job application object
        """

        try:
            job = (
                self.db.query(JobApplication)
                .filter(JobApplication.jobId == jobId)
                .first()
            )

        except HTTPException:
            raise HTTPException(status_code=404, detail="job not found")

        return job

    def getAllApplications(
        self,
        auth_token: Annotated[str | None, Cookie()] = None,
    ):
        """get all job applications for a given user

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
            apps = (
                self.db.query(JobApplication)
                .filter(JobApplication.userId == userId)
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

    def updateApplicationById(
        self,
        jobId: int,
        auth_token: Annotated[str | None, Cookie()] = None,
        status: int = Form(...),
        docId: int = Form(...),
        resumeId: int = Form(...),
    ):
        """
        Update a job application by id

        Args:
            jobId (int): job id
            auth_token (Annotated[str  |  None, Cookie, optional
            docId (int, optional): _description_. Defaults to Form(...). = doc id
            resumeId (int, optional): _description_. Defaults to Form(...). = resume id
            status (int, optional): _description_. Defaults to Form(...). = status

        Raises:
            HTTPException: _description_
            HTTPException: _description_

        Returns:
            _type_: _description_
        """
        userId = get_user_id_from_token(auth_token)
        try:
            oldJob = (
                self.db.query(JobApplication)
                .filter(JobApplication.jobId == jobId)
                .first()
            )
            print("old job: " + oldJob)
            oldJob.userId = userId
            oldJob.docId = docId
            oldJob.resumeId = resumeId
            oldJob.status = status
            oldJob.lastModified = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print("new job: " + oldJob)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="error updating job application from given params" + str(e),
            )

        try:
            self.db.add(oldJob)
            self.db.commit()
            return {"message": "success"}
        except HTTPException as e:
            raise HTTPException(
                status_code=500, detail="Error updating job application " + str(e)
            )

    def deleteApplication(self, applicationId: int = Form(...)):
        job = self.getById(applicationId)

        if job:
            self.db.delete(job)
            self.db.commit()
