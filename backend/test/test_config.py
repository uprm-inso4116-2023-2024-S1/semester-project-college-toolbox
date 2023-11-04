# test/config.py
# Test database configuration

import os
import pytest
from sqlalchemy import create_engine
from src.utils.db import prepare_db
from src.config import get_db_url

engine = None


@pytest.fixture(scope="session")
def test_db():
    global engine
    if os.environ.get("CT_ENV") != "ACTIONS":
        os.environ["CT_ENV"], old_value = "TEST", os.environ.get("CT_ENV", "DEV")
        engine = create_engine(get_db_url(os.environ["CT_ENV"]))
        prepare_db("TEST")
        yield
        os.environ["CT_ENV"] = old_value
    else:  # If we are in GH actions, just use the prod db for tests
        engine = create_engine(get_db_url("ACTIONS"))
        yield
