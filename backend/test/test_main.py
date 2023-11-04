# test/test_main.py
import os
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from src.models.tables.existing_app import ExistingApplication
from src.models.tables.user import User

from .test_utils import get_existing_application_insert_query
from src.main import app, get_db
from .test_config import test_db, engine
from src.models.responses.existing_app import ExistingApplicationResponse
from src.models.requests.schedule import SaveScheduleRequest, CreateCustomFilterRequest, GetCustomFiltersRequest

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


# Ensure the users table is empty before and after the test
@pytest.fixture()
def fresh_users_table():
    db = next(get_db())
    try:
        db.query(User).delete()
        db.commit()
    except Exception:
        db.rollback()
    db.close()


@pytest.fixture()
def fresh_solutions_table():
    db = next(get_db())
    try:
        db.query(ExistingApplication).delete()
        db.commit()
    except:
        db.rollback()
    db.close()


# Test the dummy endpoint
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}


# Test the register endpoint
def test_register_user(test_db, fresh_users_table):
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
def test_login_user(test_db, fresh_users_table):
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


def test_existing_application_get_all_endpoint(test_db, fresh_solutions_table):
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
    db = next(get_db())
    db.execute(get_existing_application_insert_query(expected_responses))
    db.commit()

    # Test the endpoint
    response = client.get("/ExistingApplication/get/all")

    assert response.status_code == 200
    assert len(response.json()) == len(expected_responses)
    for i in range(len(response.json())):
        assert response.json()[i] == expected_responses[i].model_dump()

    # Close the database connection
    db.close()


def test_save_schedule(test_db):
    # Register the user first (assuming registration works)
    response_register = client.post("/register", json=register_data)
    assert response_register.status_code == 200

    course_section_ids = [1, 2, 3, 4]
    name = "TestSchedule"
    term = "1erSem"
    year = 2023
    auth_token = response_register.cookies["auth_token"]
    request = SaveScheduleRequest(
        course_section_ids=course_section_ids,
        name=name,
        term=term,
        year=year,
        auth_token=auth_token,
    ).model_dump()

    # Test the endpoint
    response = client.post("/save_schedule", json=request)
    assert response.status_code == 200
    assert "schedule_id" in response.json()


def test_create_custom_filter(test_db):
    # Register the user first (assuming registration works)
    response_register = client.post("/register", json=register_data)
    assert response_register.status_code == 200

    name = "TestFilter"
    query = "QUERY"
    auth_token = response_register.cookies["auth_token"]
    request = CreateCustomFilterRequest(name=name, query=query, auth_token=auth_token).model_dump()

    # Test the endpoint
    response = client.post("/create_custom_filter", json=request)
    assert response.status_code == 200
    assert "custom_filter_id" in response.json()


def test_get_custom_filters(test_db):
    # Register the user first (assuming registration works)
    response_register = client.post("/register", json=register_data)
    assert response_register.status_code == 200

    auth_token = response_register.cookies["auth_token"]
    request = GetCustomFiltersRequest(auth_token=auth_token).model_dump()
    
    response = client.post("/get_custom_filters", json=request)
    assert response.status_code == 200
    assert "custom_filters" in response.json()
