# Dependency to get the database session
from src.database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import os
import shutil


def prepare_db(environment: str):
    # copy the prod db to the dev db if running locally
    if environment == "DEV":
        # Specify the paths to the source (prod) and destination (dev) databases
        dev_database_path = os.path.join("database", "dev", "ct-dev.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")

        # Copy the contents of the prod database to the dev database
        # Only copy if the developer doesn't already have a local dev db
        if not os.path.exists(dev_database_path) and os.path.exists(prod_database_path):
            os.makedirs(os.path.join("database", "dev"), exist_ok=True)
            shutil.copy2(prod_database_path, dev_database_path)

    elif environment == "TEST":
        # Specify the paths to the source (prod) and destination (test) databases
        test_database_path = os.path.join("database", "test", "ct-test.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")

        # Copy the contents of the prod database to the test database
        # Only copy if the developer doesn't already have a local test db
        os.makedirs(os.path.join("database", "test"), exist_ok=True)
        shutil.copy2(prod_database_path, test_database_path)

    # Create database tables
    Base.metadata.create_all(bind=engine)

    return environment


def get_db():
    """
    Get database session instance

    Yields:
        db: generator object;
        To use in context of FASTAPI use Depends(get_db)
        If using it in other scopes use next(get_db)
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_engine():
    yield engine
