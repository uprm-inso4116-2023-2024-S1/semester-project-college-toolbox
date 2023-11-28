# src/main.py
import os
from uuid import uuid4
from sqlalchemy import Engine, and_
from sqlalchemy.orm import Session
from typing import Annotated
from src.models.requests.schedule import (
    ExportCalendarRequest,
    GenerateSchedulesRequest,
    ValidateCourseIDRequest,
    SaveScheduleRequest,
    CourseSearchRequest,
    DeleteScheduleRequest,
)
from src.models.responses.schedule import (
    CourseSearchResponse,
    GenerateSchedulesResponse,
    ValidateCourseIDResponse,
    SaveScheduleResponse,
    getSavedScheduleResponse,
)
from src.ssh_scraper.enums import Term
from src.utils.schedule import ScheduleUtils
from src.utils.course import CourseQueryUtils
from src.utils.ExistingSolution import (
    filter_solutions_by_prefix,
    filter_solutions_by_criteria,
)
from fastapi import (
    FastAPI,
    Form,
    Request,
    HTTPException,
    Depends,
    Cookie,
    Header,
    BackgroundTasks,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from src.utils.calendar import (
    create_course_calendar,
    get_full_name,
    get_semester,
    try_delete_file,
)
from src.utils.db import get_db, get_engine

from src.config import environment
from src.models.requests.login import LoginRequest
from src.models.requests.register import RegisterRequest
from src.models.responses.business_model import BusinessModelResponse
from src.models.responses.existing_solution import ExistingSolutionResponse
from src.models.requests.resources import (
    PrefixFilterRequest,
    SchedulePrefixFilterRequest,
    ExistingSolutionsFilterAllRequest,
)
from src.models.responses.login import LoginResponse, UserProfile
from src.models.responses.register import RegisterResponse

from src.models.tables import (
    BusinessModel,
    Document,
    Resume,
    JobApplication,
    ScholarshipApplication,
    Schedule,
    RoomSchedule,
    CourseSection,
    ExistingSolution,
    User,
)
from src.security import (
    hash_password,
    generate_permanent_token,
    get_user_id_from_token,
    SecurityConfig,
)

from src.utils.validation import check_token_expiration

from src.repositories.JobApplication import JobRepository
from src.repositories.ScholarshipApplication import ScholarshipRepository
from src.repositories.Document import DocumentRepository
from src.repositories.Resume import ResumeRepository

app = FastAPI(
    docs_url="/api/docs",
)
jobRepo = JobRepository("Job Repository")
scholarshipRepo = ScholarshipRepository("Scholarship Repository")
docRepo = DocumentRepository("Document Repository")
resumeRepo = ResumeRepository("Resume Repository")
# handle related endpoints through dedicated repositrories
app.include_router(jobRepo.router)
app.include_router(scholarshipRepo.router)
app.include_router(docRepo.router)
app.include_router(resumeRepo.router)

# Configure CORS to allow requests from the React frontend
frontendPort = "2121"
origins = [
    f"http://localhost:{frontendPort}",
    "https://uprm-inso4116-2023-2024-s1.github.io",
]  # Add any other allowed origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict HTTP methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)


# API endpoints
# Dummy endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


# User registration endpoint
@app.post("/register", response_model=RegisterResponse)
async def register_user(
    user_request: RegisterRequest, db: Session = Depends(get_db)
) -> RegisterResponse:
    """
    Registers a new user account and logs the user in.

    - **user_request**: Request for registering a user.
    - **db**: Database to be utilized (prod or test).
    """
    existing_user = db.query(User).filter(User.Email == user_request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        FirstName=user_request.firstName,
        Initial=user_request.initial,
        FirstLastName=user_request.firstLastName,
        SecondLastName=user_request.secondLastName,
        Email=user_request.email,
        Password=user_request.password,
        ProfileImageUrl=user_request.profileImageUrl,
    )

    print(f" ID: {user.UserId}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate the JWT token
    jwt_token = generate_permanent_token(user.UserId)

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    
    # Create the response with the user's profile and JWT token
    response = RegisterResponse(profile=profile, token=jwt_token)

    return response



# Login endpoint
@app.post("/login", response_model=LoginResponse)
async def login_user(
    user_request: LoginRequest, db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Logs an existing user in.

    - **user_request**: Request for logging in a user.
    - **db**: Database to be utilized (prod or test).
    """
    user = db.query(User).filter(User.Email == user_request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.EncryptedPassword != hash_password(user_request.password, user.Salt):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    # Generate the JWT token
    jwt_token = generate_permanent_token(user.UserId)

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    return LoginResponse(profile=profile, token=jwt_token)


@app.get("/profile", response_model=LoginResponse)
def fetch_user(
    db: Session = Depends(get_db),
    auth_token: str = Header(None, alias="Authorization"),
) -> LoginResponse:
    """
    Returns the profile of a user given a valid auth token.

    - **db**: Database to be utilized (prod or test).
    - **auth_token**: The authentication token obtained during login.
    """
    if not auth_token or not auth_token.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid auth token, login first."
        )
    jwt_token = auth_token.split("Bearer ")[1]  # Extract the JWT from the header

    user_id = get_user_id_from_token(jwt_token)
    user = db.query(User).filter(User.UserId == user_id).first()
    if not user:
        raise HTTPException(
            status_code=400, detail="User corresponding to this token does not exist."
        )

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    return LoginResponse(profile=profile)


# Get all Existing Solutions endpoint
@app.get("/existing-solutions/get/all")
async def get_all_existing_solutions(
    db: Session = Depends(get_db),
) -> list[ExistingSolutionResponse]:
    data: list[ExistingSolution] = db.query(ExistingSolution).all()

    responses = []
    for d in data:
        # The Pros, Cons, and types are stored as a string in the database, so we need to convert them to a list
        d.Pros = d.Pros.split(",") if d.Pros else d.Pros
        d.Cons = d.Cons.split(",") if d.Cons else d.Cons
        d.Type = d.Type.split(",") if d.Type else d.Type

        # The datetime object is not JSON serializable, so we need to convert it to a string
        d.LastUpdated = d.LastUpdated.strftime("%Y-%m-%d") if d.LastUpdated else None

        business_models = [
            BusinessModelResponse(
                ExistingSolutionId=i.ExistingSolutionId,
                BusinessModelType=i.BusinessModelType,
                Price=i.Price,
                Description=i.Description,
            )
            for i in d.BusinessModels
        ]

        response_dict = {**d.__dict__}
        response_dict["BusinessModels"] = business_models

        # Create an ExistingSolutionResponse instance from the dictionary
        response = ExistingSolutionResponse(**response_dict)
        responses.append(response)

    return responses


@app.post("/existing-solutions/filter/prefix")
async def filter_existing_applications_by_prefix(
    request_data: PrefixFilterRequest, db: Session = Depends(get_db)
) -> list[ExistingSolutionResponse]:
    """Retrieve all applications that start with a specific prefix."""
    all_apps = await get_all_existing_solutions(db)
    filtered_apps = filter_solutions_by_prefix(request_data.prefix, all_apps)
    return filtered_apps


@app.post("/existing-solutions/filter/criteria")
async def get_filtered_existing_solutions(
    filter_request: ExistingSolutionsFilterAllRequest, db: Session = Depends(get_db)
) -> list[ExistingSolutionResponse]:
    """Retrieve existing solutions for students filtered by specified criteria."""
    all_solutions = await get_all_existing_solutions(db)
    filtered_solutions = filter_solutions_by_criteria(filter_request, all_solutions)
    return filtered_solutions


# Create .ics calendar file
@app.post("/export_calendar")
def export_calendar(
    request: ExportCalendarRequest, postWork: BackgroundTasks
) -> FileResponse:
    # assume the time blocks are non conflicting
    file_path = f"{request.term}-calendar-{uuid4()}.ics"
    postWork.add_task(try_delete_file, file_path)
    semester = get_semester(Term(request.term), request.year)
    return create_course_calendar(request.schedule.courses, file_path, semester)


# Generate Schedules
@app.post("/schedules")
def generate_schedules(
    request: GenerateSchedulesRequest, engine: Engine = Depends(get_engine)
) -> GenerateSchedulesResponse:
    su = ScheduleUtils(engine)
    schedules = su.generate_schedules_with_criteria(
        courses=request.courses,
        term=request.term,
        year=request.year,
        options=request.options,
    )

    return {"schedules": schedules}


# Validating courses for schedule generation
@app.post("/validate_course_id", response_model=ValidateCourseIDResponse)
def validate_course_id_endpoint(
    request: ValidateCourseIDRequest, engine: Engine = Depends(get_engine)
) -> ValidateCourseIDResponse:
    su = ScheduleUtils(engine)
    is_valid = su.validate_course_id(
        course_id=request.course_id,
        term=request.term,
        year=request.year,
        section=request.section,
    )
    return {"is_valid": is_valid}


@app.post("/save_schedule")
def save_schedule_endpoint(
    request: SaveScheduleRequest,
    engine: Engine = Depends(get_engine),
    auth_token: str = Header(None, alias="Authorization"),
) -> SaveScheduleResponse:
    if not auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")
    user_id = get_user_id_from_token(auth_token)
    su = ScheduleUtils(engine)
    schedule_id = su.save_schedule(
        course_section_ids=request.course_section_ids,
        name=request.name,
        term=request.term,
        year=request.year,
        user_id=user_id,
    )
    return {"schedule_id": schedule_id}


@app.delete("/save_schedule/delete")
def delete_saved_schedule(
    request: DeleteScheduleRequest, engine: Engine = Depends(get_engine)
):
    su = ScheduleUtils(engine)
    su.delete_schedule(request.schedule_id)

    return {"message": "Schedule deleted successfully."}


@app.post("/schedules/filter/prefix")
async def filter_saved_schedules_by_prefix(
    request_data: SchedulePrefixFilterRequest,
    db: Session = Depends(get_db),
    engine: Engine = Depends(get_engine),
    auth_token: str = Header(None, alias="Authorization"),
) -> list[getSavedScheduleResponse]:
    """Retrieve all schedules that start with a specific prefix."""
    if not auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")
    user_id = get_user_id_from_token(auth_token)
    all_schedules = (
        db.query(Schedule)
        .filter(
            and_(
                Schedule.user_id == user_id,
                and_(
                    Schedule.term == request_data.term,
                    Schedule.year == request_data.year,
                ),
            )
        )
        .all()
    )
    full_saved_schedules = []
    su = ScheduleUtils(engine)
    for schedule in all_schedules:
        course_sections_from_sections = su.get_sections_from_schedule(schedule.id)
        generated_schedule = su.make_generated_schedule(course_sections_from_sections)

        templated_schedule = getSavedScheduleResponse(
            user_id=schedule.user_id,
            id=schedule.id,
            name=schedule.name,
            term=schedule.term,
            year=schedule.year,
            schedule=generated_schedule,
        )

        full_saved_schedules.append(templated_schedule)

    filtered_schedules = su.filter_schedules_by_prefix(
        request_data.prefix, full_saved_schedules
    )
    if len(filtered_schedules) == 0:
        return su.filter_schedules_by_course_code(
            request_data.prefix, full_saved_schedules
        )
    return filtered_schedules


@app.get("/get_all_save_schedules")
def get_all_saved_schedules(
    db: Session = Depends(get_db),
    engine: Engine = Depends(get_engine),
    auth_token: str = Header(None, alias="Authorization"),
) -> list[getSavedScheduleResponse]:
    if not auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")

    user_id = get_user_id_from_token(auth_token)
    all_schedules = db.query(Schedule).filter(Schedule.user_id == user_id).all()

    full_saved_schedules = []
    su = ScheduleUtils(engine)
    for schedule in all_schedules:
        course_sections_from_sections = su.get_sections_from_schedule(schedule.id)
        generated_schedule = su.make_generated_schedule(course_sections_from_sections)

        templated_schedule = getSavedScheduleResponse(
            user_id=schedule.user_id,
            id=schedule.id,
            name=schedule.name,
            term=schedule.term,
            year=schedule.year,
            schedule=generated_schedule,
        )

        full_saved_schedules.append(templated_schedule)

    return full_saved_schedules


# Get section schedules from course query
@app.post("/course_search")
def course_search_endpoint(
    request: CourseSearchRequest, engine: Engine = Depends(get_engine)
) -> CourseSearchResponse:
    su = ScheduleUtils(engine)
    result = su.get_section_schedules(
        query=request.query, term=Term(request.term), year=request.year
    )
    course_section_schedules = [
        CourseQueryUtils.create_course_search_section(section, schedules)
        for section, schedules in result
    ]
    return {"course_section_schedules": course_section_schedules}


if __name__ == "__main__":
    print("Run the backend with the command: poetry run python src/run.py")
