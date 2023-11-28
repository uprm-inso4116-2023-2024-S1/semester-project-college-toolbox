from src.models.tables import SessionLocal, engine
from sqlalchemy.orm import Session


# Dependency to get the database session
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
