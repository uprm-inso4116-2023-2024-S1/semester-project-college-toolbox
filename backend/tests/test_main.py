# tests/test_main.py
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app, get_db
from src.database import Base
from tests.test_config import TEST_DATABASE_URL

engine = create_engine(
TEST_DATABASE_URL
)
Base.metadata.create_all(bind=engine)
def override_get_db():
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

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
    response_register = client.post("/register/", json=register_data)

    # Print the response content for debugging (temporary)
    print(response_register.content.decode("utf-8"))

    assert response_register.status_code == 200
    data = response_register.json()
    assert "token" in data  # Make sure the response contains the auth token

    # Test duplicate registration (should fail)
    response_duplicate = client.post("/register/", json=register_data)
    assert response_duplicate.status_code == 400  # Expect a 400 Bad Request status code

# Test the login endpoint
def test_login_user(test_db):
    # Register the user first (assuming registration works)
    response_register = client.post("/register/", json=register_data)
    assert response_register.status_code == 200

    # Test successful login
    response_login = client.post("/login/", json=login_data)
    assert response_login.status_code == 200
    data = response_login.json()
    assert "token" in data  # Make sure the response contains the auth token

    # Test user not found (should fail)
    user_not_found_data = {
        "email": "notfoobar@example.com",
        "password": "password123",
    }
    response_user_not_found = client.post("/login/", json=user_not_found_data)
    assert response_user_not_found.status_code == 401  # Expect a 401 Unauthorized status code

    # Test incorrect password (should fail)
    incorrect_password_data = {
        "email": "foobar@example.com",
        "password": "notpassword123",
    }
    response_incorrect_password = client.post("/login/", json=incorrect_password_data)
    assert response_incorrect_password.status_code == 401  # Expect a 401 Unauthorized status code
