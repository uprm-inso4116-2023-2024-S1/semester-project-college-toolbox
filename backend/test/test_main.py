# test/test_main.py
import os
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from src.models.tables.ExistingSolution import ExistingSolution
from src.models.tables.user import User
from sqlalchemy.orm import Session
import test
from .test_utils import get_existing_solution_insert_query, get_business_model_insert_query
from .test_config import test_db, get_test_db
from src.main import app, get_db
from src.database import Base
from src.models.responses.existing_solution import ExistingSolutionResponse



# Override db
app.dependency_overrides[get_db] = get_test_db
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


# Test the dummy endpoint
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}


# Test the register endpoint
def test_register_user(test_db):
    # Ensure the users table is empty before and after the test
    with Session(test_db) as session:
        with session.begin():
            session.query(User).delete()
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
    # Ensure the users table is empty before and after the test
    with Session(test_db) as session:
        with session.begin():
            session.query(User).delete()
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

def test_existing_application_get_all_endpoint_no_business_models(test_db):
    expected_responses = [
        (
            ExistingSolutionResponse(
                Name="Test Application",
                Description="A test application",
                URL="https://example.com",
                Icon="https://example.com/image.jpg",
                Type="Test",
                Rating=500,
                RatingCount=100,
                Pros=["Pro 1", "Pro 2"],
                Cons=["Con 1", "Con 2"],
                LastUpdated="2021-01-01",
                HasMobile=True,
                HasWeb=True,
            )
        ),
        (
            ExistingSolutionResponse(
                Name="Test Application 2",
                Description="Another test application",
                URL="https://example2.com",
                Icon="https://example2.com/image.jpg",
                Type="Test",
                Rating=400,
                RatingCount=200,
                Pros=["Pro 3", "Pro 4"],
                Cons=["Con 3", "Con 4"],
                LastUpdated="2021-01-02",
                HasMobile=True,
                HasWeb=False,
            )
        ),
    ]
    # Write dummy data to the database
    with Session(test_db) as session:
        with session.begin():
            # Ensure that the database is empty before the test
            session.query(ExistingSolution).delete()
            session.execute(get_existing_solution_insert_query(expected_responses))
            session.commit()

    # Test the endpoint
    response = client.get("/ExistingSolution/get/all")

    assert response.status_code == 200
    assert len(response.json()) == len(expected_responses)
    for i in range(len(response.json())):
        assert response.json()[i] == expected_responses[i].model_dump()

def test_existing_application_get_all_endpoint_with_business_models(test_db):
    expected_responses = [
        (
            ExistingSolutionResponse(
                Name="Test Application",
                Description="A test application",
                URL="https://example.com",
                Icon="https://example.com/image.jpg",
                Type="Test",
                Rating=500,
                RatingCount=100,
                Pros=["Pro 1", "Pro 2"],
                Cons=["Con 1", "Con 2"],
                LastUpdated="2021-01-01",
                HasMobile=True,
                HasWeb=True,
                BusinessModels=[
                    {
                        "ExistingSolutionId": 1,
                        "BusinessModelType": "Free",
                        "Price": 0.0,
                        "Description": "A test business model",
                    },
                    {
                        "ExistingSolutionId": 1,
                        "BusinessModelType": "Paid (Monthly)",
                        "Price": 200.0,
                        "Description": "Another test business model",
                    },
                ],
            )
        ),
        (
            ExistingSolutionResponse(
                Name="Test Application 2",
                Description="Another test application",
                URL="https://example2.com",
                Icon="https://example2.com/image.jpg",
                Type="Test",
                Rating=400,
                RatingCount=200,
                Pros=["Pro 3", "Pro 4"],
                Cons=["Con 3", "Con 4"],
                LastUpdated="2021-01-02",
                HasMobile=True,
                HasWeb=False,
                BusinessModels=[
                    {
                        "ExistingSolutionId": 2,
                        "BusinessModelType": "Paid (One Time)",
                        "Price": 300.0,
                        "Description": "Yet another test business model",
                    },
                    {
                        "ExistingSolutionId": 2,
                        "BusinessModelType": "Paid (Yearly)",
                        "Price": 400.0,
                        "Description": "Yet another test business model",
                    },
                ],
            )
        ),
    ]
    # Write dummy data to the database
    with Session(test_db) as session:
        with session.begin():
            # Ensure that the database is empty before the test
            session.query(ExistingSolution).delete()
            session.execute(get_existing_solution_insert_query(expected_responses))
            for response in expected_responses:
                session.execute(get_business_model_insert_query(response.BusinessModels))
            session.commit()

    # Test the endpoint
    response = client.get("/ExistingSolution/get/all")

    assert response.status_code == 200
    assert len(response.json()) == len(expected_responses)
    for i in range(len(response.json())):
        assert response.json()[i] == expected_responses[i].model_dump()
