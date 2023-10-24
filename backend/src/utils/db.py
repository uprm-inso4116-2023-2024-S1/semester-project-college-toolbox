# Dependency to get the database session
from src.database import SessionLocal, engine, Base
from sqlalchemy.orm import Session


def prepare_db(environment):
    # copy the prod db to the dev db if running locally
    if environment == "DEV":
        import os
        import shutil

        # Specify the paths to the source (dev) and destination (prod) databases
        dev_database_path = os.path.join("database", "dev", "ct-dev.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")

        # Copy the contents of the dev database to the prod database
        # Only copy if the developer doesn't already have a local dev db
        if not os.path.exists(dev_database_path) and os.path.exists(prod_database_path):
            os.makedirs(os.path.join("database", "dev"), exist_ok=True)
            shutil.copy2(prod_database_path, dev_database_path)
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
        with db.begin():
            yield db
    finally:
        db.close()
