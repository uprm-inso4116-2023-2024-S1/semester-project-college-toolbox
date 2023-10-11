# Dependency to get the database session
# CODE HAS been copied from main for testing; i will better organize the code later
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
