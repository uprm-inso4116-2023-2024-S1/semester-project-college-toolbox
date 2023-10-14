# test/test_main.py
import os
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .test_config import TEST_DATABASE_URL
from .test_utils import get_existing_application_insert_query
from src.main import app, get_db
from src.database import Base
from src.models.responses.existing_app import ExistingApplicationResponse

# Test database configuration
os.makedirs(os.path.join("database", "test"), exist_ok=True)
engine = create_engine(TEST_DATABASE_URL)
Base.metadata.create_all(bind=engine)


# Override database
def override_get_db():
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Allows tests to get a test database session
def get_test_db_session():
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    try:
        db = TestingSessionLocal()
        return db
    except:
        return None


# Override FastAPI app dependency
app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)

# Define test data
register_data = {
    "firstName": "Foo",
    "initial": "",
    "firstLastName": "Bar",
    "secondLastName": "",
    "email": "foobar@example.com",
    "password": "password123",
    "profileImageUrl": "https://example.com/foobar.jpg",
}

login_data = {
    "email": "foobar@example.com",
    "password": "password123",
}


# Set up test database tables and cleanup
@pytest.fixture()
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# Test the dummy endpoint
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}


# Test the register endpoint
def test_register_user(test_db):
    # Test successful registration
    response_register = client.post("/register", json=register_data)
    assert response_register.status_code == 200
    assert (
        "auth_token" in response_register.cookies
    )  # Make sure the cookie contains the auth token
    data = response_register.json()
    assert "profile" in data  # Make sure the response contains the user profile

    # Test duplicate registration (should fail)
    response_duplicate = client.post("/register", json=register_data)
    assert response_duplicate.status_code == 400  # Expect a 400 Bad Request status code
    assert response_duplicate.json() == {"detail": "Email already registered."}


# Test the login endpoint
def test_login_user(test_db):
    # Register the user first (assuming registration works)
    response_register = client.post("/register", json=register_data)
    assert response_register.status_code == 200

    # Test successful login
    response_login = client.post("/login", json=login_data)
    assert response_login.status_code == 200
    assert (
        "auth_token" in response_login.cookies
    )  # Make sure the cookie contains the auth token
    data = response_login.json()
    assert "profile" in data  # Make sure the response contains the user profile

    # Test user not found (should fail)
    user_not_found_data = {
        "email": "notfoobar@example.com",
        "password": "password123",
    }
    response_user_not_found = client.post("/login", json=user_not_found_data)
    assert (
        response_user_not_found.status_code == 404
    )  # Expect a 404 Not Found status code
    assert response_user_not_found.json() == {"detail": "User not found."}

    # Test incorrect password (should fail)
    incorrect_password_data = {
        "email": "foobar@example.com",
        "password": "notpassword123",
    }
    response_incorrect_password = client.post("/login", json=incorrect_password_data)
    assert (
        response_incorrect_password.status_code == 401
    )  # Expect a 401 Unauthorized status code
    assert response_incorrect_password.json() == {"detail": "Incorrect password."}


def test_existing_application_get_all_endpoint(test_db):
    expected_responses = [
        (
            ExistingApplicationResponse(
                Name="Test Application",
                Description="A test application",
                URL="https://example.com",
                Icon="https://example.com/image.jpg",
                Type="Test",
                Rating=500,
                RatingCount=100,
            )
        ),
        (
            ExistingApplicationResponse(
                Name="Test Application 2",
                Description="Another test application",
                URL="https://example2.com",
                Icon="https://example2.com/image.jpg",
                Type="Test",
                Rating=400,
                RatingCount=200,
            )
        ),
    ]
    # Write dummy data to the database
    db = get_test_db_session()
    db.execute(get_existing_application_insert_query(expected_responses))
    db.commit()

    # Test the endpoint
    response = client.get("/ExistingApplication/get/all")

    assert response.status_code == 200
    assert len(response.json()) == len(expected_responses)
    for i in range(len(response.json())):
        assert response.json()[i] == expected_responses[i].model_dump()
