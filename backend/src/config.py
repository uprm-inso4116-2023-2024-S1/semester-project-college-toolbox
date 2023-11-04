# src/config.py
import os

PROD_DB_URL = "sqlite:///database/prod/ct-prod.db"
TEST_DB_URL = "sqlite:///database/test/ct-test.db"
DEV_DB_URL = "sqlite:///database/dev/ct-dev.db"


def get_db_url(environment: str) -> str:
    match environment:
        case "PROD":
            return PROD_DB_URL
        case "DEV":
            return DEV_DB_URL
        case "TEST":
            return TEST_DB_URL
        case "ACTIONS":
            return PROD_DB_URL
    return DEV_DB_URL


environment = os.environ.get("CT_ENV", "DEV")

DATABASE_URL = get_db_url(environment)
