# test/config.py
# Test database configuration

import os
import pytest
from sqlalchemy import create_engine, false
from sqlalchemy.orm import sessionmaker
from src.utils.db import prepare_db
from src.config import get_db_url

test_engine = None
TestSessionLocal = None


@pytest.fixture(scope="session")
def test_db():
    global test_engine, TestSessionLocal
    # If we are in GH actions, just use the prod db for tests
    if os.environ.get("CT_ENV") == "ACTIONS":
        test_engine = create_engine(get_db_url("ACTIONS"))
        yield test_engine
    else:
        os.environ["CT_ENV"], old_value = "TEST", os.environ.get("CT_ENV", "DEV")
        test_engine = create_engine(get_db_url("TEST"))
        prepare_db("TEST")
        from src.models.tables import Base

        Base.metadata.create_all(test_engine)
        yield test_engine
        os.environ["CT_ENV"] = old_value


def get_test_db():
    global test_engine, TestSessionLocal
    if test_engine is None:
        next(test_db())
    else:
        TestSessionLocal = sessionmaker(
            bind=test_engine, autoflush=False, autocommit=False
        )
        db = TestSessionLocal()
        yield db
        db.close()


def get_test_engine():
    if os.environ.get("CT_ENV") == "ACTIONS":
        return create_engine(get_db_url("ACTIONS"))
    else:
        return create_engine(get_db_url("TEST"))
