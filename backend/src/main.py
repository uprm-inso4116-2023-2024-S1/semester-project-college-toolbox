# src/main.py
import atexit
from uuid import uuid4
from src.models.requests.calendar import ExportCalendarRequest
from src.ssh_scraper.enums import Term
from src.ssh_scraper.utils import get_section_time_blocks_by_ids
from src.utils import (
    create_course_calendar,
    get_full_name,
    get_semester,
    try_delete_file,
)
from fastapi import (
    FastAPI,
    Form,
    Request,
    HTTPException,
    Depends,
    Cookie,
    UploadFile,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import Annotated

from src.config import environment
from src.database import Base, SessionLocal, engine
from src.models.requests.login import LoginRequest
from src.models.requests.register import RegisterRequest
from src.models.responses.login import LoginResponse, UserProfile
from src.models.responses.register import RegisterResponse
from src.models.tables.Document import Document
from src.models.tables.existing_app import ExistingApplication
from src.models.tables.user import User
from src.utils import get_full_name
from src.security import (
    hash_password,
    generate_permanent_token,
    get_user_id_from_token,
    TOKEN_EXPIRATION_SECONDS,
)

from src.repositories.JobApplication import JobRepository
from src.repositories.ScholarshipApplication import ScholarshipRepository
from src.repositories.Document import DocumentRepository


app = FastAPI(
    docs_url="/api/docs",
)

jobRepo = JobRepository("Job Repository")
scholarshipRepo = ScholarshipRepository("Scholarship Repository")

# handle related endpoints through dedicated repositrories
app.include_router(jobRepo)
app.include_router(scholarshipRepo)


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


def prepare_db():
    # copy the prod db to the dev db if running locally
    if environment == "DEV":
        import os
        import shutil

        # Specify the paths to the source (dev) and destination (prod) databases
        dev_database_path = os.path.join("database", "dev", "ct-dev.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")

        # Copy the contents of the dev database to the prod database
        # Only copy if the developer doesn't already have a local dev db
        if not os.path.exists(dev_database_path) and os.path.exists(prod_database_path):
            os.makedirs(os.path.join("database", "dev"), exist_ok=True)
            shutil.copy2(prod_database_path, dev_database_path)
    # Create database tables
    Base.metadata.create_all(bind=engine)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
        db.close()
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
    db.close()

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
        db.close()
        raise HTTPException(status_code=404, detail="User not found.")
    if user.EncryptedPassword != hash_password(user_request.password, user.Salt):
        db.close()
        raise HTTPException(status_code=401, detail="Incorrect password.")

    permanent_token = generate_permanent_token(user.UserId)
    db.close()

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
    db.close()

    profile = UserProfile(
        firstName=user.FirstName,
        initial=user.Initial,
        firstLastName=user.FirstLastName,
        secondLastName=user.SecondLastName,
        email=user.Email,
        profileImageUrl=user.ProfileImageUrl,
    )
    return LoginResponse(profile=profile)


# Create .ics calendar file
@app.post("/export_calendar")
def export_calendar(request: ExportCalendarRequest) -> FileResponse:
    time_blocks = get_section_time_blocks_by_ids(request.section_ids)
    # assume the time blocks are non conflicting
    file_name = f"{request.term}-calendar-{uuid4()}.ics"
    atexit.register(lambda: try_delete_file(file_name))
    semester = get_semester(Term(request.term), request.year)
    return create_course_calendar(time_blocks, file_name, semester)


if __name__ == "__main__":
    import uvicorn

    prepare_db()
    uvicorn.run(app, host="0.0.0.0", port=5670, reload=environment == "PROD")
