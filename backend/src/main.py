# src/main.py
from uuid import uuid4
from sqlalchemy import Engine, asc, or_, desc
from sqlalchemy.orm import Session, joinedload
from typing import Annotated
from src.models.requests.schedule import (
    ExportCalendarRequest,
    GenerateSchedulesRequest,
    ValidateCourseIDRequest,
    SaveScheduleRequest,
    getSavedSchedulesRequest,
    CourseSearchRequest,
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
    filter_apps_by_prefix,
    filter_apps_by_criteria,
)
from fastapi import (
    FastAPI,
    Form,
    Request,
    HTTPException,
    Depends,
    Cookie,
    UploadFile,
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
    applyAllFilterRequest,
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
    TOKEN_EXPIRATION_SECONDS,
)

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

    permanent_token = generate_permanent_token(user.UserId)

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    response = JSONResponse(content=jsonable_encoder(RegisterResponse(profile=profile)))
    response.set_cookie(
        key="auth_token",
        value=permanent_token,
        max_age=TOKEN_EXPIRATION_SECONDS,
        samesite="None",  # Set SameSite attribute
        secure=True,
        path="/",
    )

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

    permanent_token = generate_permanent_token(user.UserId)

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    response = JSONResponse(content=jsonable_encoder(LoginResponse(profile=profile)))
    response.set_cookie(
        key="auth_token",
        value=permanent_token,
        max_age=TOKEN_EXPIRATION_SECONDS,
        samesite="None",  # Set SameSite attribute
        secure=True,
        path="/",
    )
    return response


# Fetch profile endpoint
@app.get("/profile", response_model=LoginResponse)
def fetch_user(
    db: Session = Depends(get_db), auth_token: Annotated[str | None, Cookie()] = None
) -> LoginResponse:
    """
    Returns the profile of a user given a valid auth token.

    - **db**: Database to be utilized (prod or test).
    - **auth_token**: The authentication token obtained during login.
    """
    if not auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")
    user_id = get_user_id_from_token(auth_token)
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
@app.get("/ExistingSolution/get/all")
async def get_all_existing_solutions(
    db: Session = Depends(get_db),
) -> list[ExistingSolutionResponse]:
    data: list[ExistingSolution] = db.query(ExistingSolution).all()

    responses = []
    for d in data:
        # The Pros, Cons, and types are stored as a string in the database, so we need to convert them to a list
        d.Pros = d.Pros.split(",") if d.Pros else []
        d.Cons = d.Cons.split(",") if d.Cons else []
        d.Type = d.Type.split(",") if d.Type else []

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

        
        d.BusinessModels = business_models

        # Create an ExistingSolutionResponse instance from the dictionary
        response = ExistingSolutionResponse(
            Name = d.Name if d.Name else "",
            Description = d.Description if d.Description else "",
            URL = d.URL if d.URL else "",
            Icon = d.Icon if d.Icon else "",
            Type = d.Type,
            Rating = d.Rating if d.Rating else 0,
            RatingCount = d.RatingCount if d.RatingCount else 0,
            Pros = d.Pros,
            Cons = d.Cons,
            LastUpdated = d.LastUpdated if d.LastUpdated else "",
            HasMobile = d.HasMobile if d.HasMobile else False,
            HasWeb = d.HasWeb if d.HasWeb else False,
        )
        responses.append(response)

    return responses


@app.post("/ExistingApplication/filter/prefix")
async def filter_existing_applications_by_prefix(
    request_data: PrefixFilterRequest, db: Session = Depends(get_db)
) -> list[ExistingSolutionResponse]:
    """Retrieve all applications that start with a specific prefix."""
    all_apps = await get_all_existing_solutions(db)
    filtered_apps = filter_apps_by_prefix(request_data.prefix, all_apps)
    return filtered_apps

@app.post("/ExistingApplication/filter/applyAll")
async def filter_existing_applications_by_criteria(request_data: applyAllFilterRequest, db: Session = Depends(get_db)) -> list[ExistingSolutionResponse]:
    data : list[ExistingSolution] = []
    conditions_list = []
    if request_data.type:
        for filter in request_data.type:
            # Specific scenario since for some reason "note-taking" does not yeild results
            if filter.startswith("Note"):
                conditions_list.append(
                    or_(ExistingSolution.Type.like("%note%"))
                )
                continue
            
            conditions_list.append(
                ExistingSolution.Type == filter
            ) 
    # query for when business model gets populated
    # if request_data.cost: # Will only have one option
    #     # Specific scenario for One-time Buy
    #     if request_data.cost[0].startswith("One"):
    #         conditions_list.append(
    #             or_(BusinessModel.BusinessModelType.like("%One%"))
    #         )
    #     else:
    #         conditions_list.append(
    #             BusinessModel.BusinessModelType == request_data.cost[0]
    #         )
    # default sorting
    if not request_data.sort or request_data.sort.__contains__("A-Z"):
        data : list[ExistingSolution] = (
            db.query(ExistingSolution)
            .filter(or_(*conditions_list))
            .order_by(asc(ExistingSolution.Name))
            .all()
        )
    if request_data.sort.__contains__("High to low"):
        if request_data.sort.__contains__("A-Z"):
            data : list[ExistingSolution] = (
                db.query(ExistingSolution)
                .filter(or_(*conditions_list))
                .order_by(desc(ExistingSolution.Name))
                .all()
            ) # query for when business model gets populated
            # data: list[tuple] = (
            #     db.query(ExistingSolution, BusinessModel.BusinessModelType)
            #     .join(BusinessModel, ExistingSolution.ExistingSolutionId == BusinessModel.ExistingSolutionId)
            #     .filter(or_(*conditions_list))
            #     .group_by(BusinessModel.BusinessModelType)
            #     .order_by(desc(ExistingSolution.Name))
            #     .options(joinedload(ExistingSolution.BusinessModels))  # This is optional for eager loading related BusinessModels
            #     .all()
            # )
        # elif request_data.sort.__contains__("Price"):
        #     data: list[tuple] = (
        #         db.query(ExistingSolution, BusinessModel.BusinessModelType)
        #         .join(BusinessModel, ExistingSolution.ExistingSolutionId == BusinessModel.ExistingSolutionId)
        #         .filter(or_(*conditions_list))
        #         .group_by(BusinessModel.BusinessModelType)
        #         .order_by(desc(BusinessModel.Price))
        #         .options(joinedload(ExistingSolution.BusinessModels))  # This is optional for eager loading related BusinessModels
        #         .all()
        #     )
    else:
        if request_data.sort.__contains__("A-Z"):
            data : list[ExistingSolution] = (
                db.query(ExistingSolution)
                .filter(or_(*conditions_list))
                .order_by(asc(ExistingSolution.Name))
                .all()
            ) # query for when business model gets populated
            # data: list[tuple] = (
            #     db.query(ExistingSolution, BusinessModel.BusinessModelType)
            #     .join(BusinessModel, ExistingSolution.ExistingSolutionId == BusinessModel.ExistingSolutionId)
            #     .filter(or_(*conditions_list))
            #     .group_by(BusinessModel.BusinessModelType)
            #     .order_by(asc(ExistingSolution.Name))
            #     .options(joinedload(ExistingSolution.BusinessModels))  # This is optional for eager loading related BusinessModels
            #     .all()
            # ) 
        # elif request_data.sort.__contains__("Price"):
        #     data: list[tuple] = (
        #         db.query(ExistingSolution, BusinessModel.BusinessModelType)
        #         .join(BusinessModel, ExistingSolution.ExistingSolutionId == BusinessModel.ExistingSolutionId)
        #         .filter(or_(*conditions_list))
        #         .group_by(BusinessModel.BusinessModelType)
        #         .order_by(asc(BusinessModel.Price))
        #         .options(joinedload(ExistingSolution.BusinessModels))  # This is optional for eager loading related BusinessModels
        #         .all()
        #     )      
        
    responses = []
    # mapping for when the Business Model table gets populated
    # for existing_solution, business_model_type in data:
    #     # The Pros, Cons, and types are stored as a string in the database, so we need to convert them to a list
    #     existing_solution.Pros = existing_solution.Pros.split(",") if existing_solution.Pros else existing_solution.Pros
    #     existing_solution.Cons = existing_solution.Cons.split(",") if existing_solution.Cons else existing_solution.Cons
    #     existing_solution.Type = existing_solution.Type.split(",") if existing_solution.Type else existing_solution.Type
    #     # The datetime object is not JSON serializable, so we need to convert it to a string
    #     existing_solution.LastUpdated = existing_solution.LastUpdated.strftime("%Y-%m-%d") if existing_solution.LastUpdated else None

    #     business_models = [
    #         BusinessModelResponse(
    #             ExistingSolutionId=i.ExistingSolutionId,
    #             BusinessModelType=business_model_type,
    #             Price=i.Price,
    #             Description=i.Description,
    #         )
    #         for i in existing_solution.BusinessModels
    #     ]
    # response_dict = {**existing_solution.__dict__}
    
    for d in data:
        # The Pros, Cons, and types are stored as a string in the database, so we need to convert them to a list
        d.Pros = d.Pros.split(",") if d.Pros else []
        d.Cons = d.Cons.split(",") if d.Cons else []
        d.Type = d.Type.split(",") if d.Type else []

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

        
        d.BusinessModels = business_models

        # Create an ExistingSolutionResponse instance from the dictionary
        response = ExistingSolutionResponse(
            Name = d.Name if d.Name else "",
            Description = d.Description if d.Description else "",
            URL = d.URL if d.URL else "",
            Icon = d.Icon if d.Icon else "",
            Type = d.Type,
            Rating = d.Rating if d.Rating else 0,
            RatingCount = d.RatingCount if d.RatingCount else 0,
            Pros = d.Pros,
            Cons = d.Cons,
            LastUpdated = d.LastUpdated if d.LastUpdated else "",
            HasMobile = d.HasMobile if d.HasMobile else False,
            HasWeb = d.HasWeb if d.HasWeb else False,
        )
        responses.append(response)

    return responses

            



# @app.post("/ExistingApplication/filter/applyAll")
# async def filter_existing_applications_by_criteria(request_data: applyAllFilterRequest, db: Session = Depends(get_db)) -> list[ExistingSolutionResponse]:
#     """Retrieve all applications that fit the given filters."""
#     all_apps = await get_all_existing_solutions(db)
#     filtered_apps = filter_apps_by_criteria(request_data, all_apps)
#     return filtered_apps


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
    request: SaveScheduleRequest, engine: Engine = Depends(get_engine)
) -> SaveScheduleResponse:
    if not request.auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")
    user_id = get_user_id_from_token(request.auth_token)
    su = ScheduleUtils(engine)
    schedule_id = su.save_schedule(
        course_section_ids=request.course_section_ids,
        name=request.name,
        term=request.term,
        year=request.year,
        user_id=user_id,
    )
    return {"schedule_id": schedule_id}


@app.post("/schedules/filter/prefix")
async def filter_existing_applications_by_prefix(
    request_data: SchedulePrefixFilterRequest,
    db: Session = Depends(get_db),
    engine: Engine = Depends(get_engine),
) -> list[getSavedScheduleResponse]:
    """Retrieve all schedules that start with a specific prefix."""
    if not request_data.auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")
    user_id = get_user_id_from_token(request_data.auth_token)
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

    filtered_schedules = su.filter_schedules_by_prefix(
        request_data.prefix, full_saved_schedules
    )
    return filtered_schedules


@app.post("/get_all_save_schedules")
def get_all_saved_schedules(
    request: getSavedSchedulesRequest,
    db: Session = Depends(get_db),
    engine: Engine = Depends(get_engine),
) -> list[getSavedScheduleResponse]:
    if not request.auth_token:
        raise HTTPException(status_code=401, detail="Missing auth token, login first.")

    user_id = get_user_id_from_token(request.auth_token)
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
