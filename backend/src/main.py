# src/main.py
from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Request, HTTPException, Depends
from sqlalchemy.orm import Session

from src.models.PDFdocument import PDFdocument
from src.models.user import User
from src.database import Base, SessionLocal, engine
from src.models.requests.login import LoginRequest
from src.models.requests.register import RegisterRequest
from src.models.responses.login import LoginResponse
from src.models.responses.register import RegisterResponse
from src.security import hash_password, generate_permanent_token
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow requests from the React frontend
frontendPort = "2121"
origins = [
    f"http://localhost:{frontendPort}"
]  # Add any other allowed origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict HTTP methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)

# Database configuration
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
@app.post("/register/", response_model=RegisterResponse)
def register_user(
    user_request: RegisterRequest, db: Session = Depends(get_db)
) -> RegisterResponse:
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

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return {"token": generate_permanent_token(user.UserId)}


# Login endpoint
@app.post("/login/", response_model=LoginResponse)
def login_user(user_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.Email == user_request.email).first()
    if not user:
        db.close()
        raise HTTPException(status_code=401, detail="User not found.")
    if user.EncryptedPassword != hash_password(user_request.password, user.Salt):
        db.close()
        raise HTTPException(status_code=401, detail="Incorrect password.")

    permanent_token = generate_permanent_token(user.UserId)
    db.close()
    return {"token": permanent_token}


# PDF document upload endpoint
@app.post("/ScholarshipApplication/upload")
async def upload_pdf(request: Request):
    # new_pdf = PDFdocument(filename, file)
    # new_pdf.upload_pdf(SessionLocal)
    # return {"message": "uploaded successfully"}

    # print(await request.form())
    async with request.form() as form:
        filename = form["test"].filename
        print(filename)
        pdf_data = await form["test"].read()

        doc = PDFdocument(filename, pdf_data)
        doc.upload_pdf(SessionLocal)


# Get PDF by ID endpoint
@app.get("/ScholarshipApplication/get/pdf_id/{pdf_id}")
def get_pdf_by_id(pdf_id: int):
    return PDFdocument.get_pdf_by_id(pdf_id=pdf_id, SessionLocal=SessionLocal)


# Delete PDF by ID endpoint
@app.delete("/ScholarshipApplication/delete/pdf_id/{pdf_id}")
def delete_pdf_by_id(pdf_id: int):
    # """
    # deletes a pdf document from the database

    # Args:
    #     pdf_id (int): id of pdf to be deleted

    # Raises:
    #     HTTPException: if pdf not found
    #     HTTPException: if error deleting from database
    # """
    # try:
    #     with SessionLocal() as session:
    #         pdf_document = session.query(PDFdocument).filter_by(id=pdf_id).first()
    #         if not pdf_document:
    #             raise HTTPException(
    #                 status_code=404, detail=f"No PDF found with id: {pdf_id}"
    #             )
    #         else:
    #             session.delete(pdf_document)
    #             session.commit()

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error deleting PDF: {str(e)}")

    return PDFdocument.delete_pdf_by_id(pdf_id=pdf_id, SessionLocal=SessionLocal)


# Update PDF by ID endpoint
@app.put(
    "/ScholarshipApplication/update/pdf_id/{pdf_id}/filepath/{filepath: str}/filename/{filename: str}"
)
def update_pdf_by_id(pdf_id: int, filepath: str, filename: str):
    PDFdocument.update_pdf_by_id(pdf_id, filepath, filename, SessionLocal)
