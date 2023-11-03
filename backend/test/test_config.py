# test/config.py
# Test database configuration

import os
import pytest
from sqlalchemy import create_engine
from src.utils.db import prepare_db

TEST_DATABASE_URL = "sqlite:///database/test/ct-test.db"
engine = create_engine(TEST_DATABASE_URL)


@pytest.fixture(scope="session")
def test_db():
    os.environ["CT_ENV"], old_value = "TEST", os.environ.get("CT_ENV", "DEV")
    prepare_db("TEST")
    yield
    os.environ["CT_ENV"] = old_value
