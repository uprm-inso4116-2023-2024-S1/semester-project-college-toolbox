# Dependency to get the database session
# CODE HAS been copied from main for testing; i will better organize the code later
from sqlalchemy.orm import Session
from src.database import SessionLocal


def get_db() -> Session:
    """
    get database session object

    Returns:
        Session: _description_

    Yields:
        Iterator[Session]: _description_
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
