# src/utils/security.py
import jwt

from src.security import ALGORITHM, SECRET_KEY, oauth2_scheme

from datetime import datetime
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session

from src.models.tables import User
from src.utils.db import get_db


def check_token_expiration(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials."
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.UserId == user_id).first()
    if not user:
        raise HTTPException(
            status_code=400, detail="User corresponding to this token does not exist."
        )

    # Check token expiration
    token_exp = payload.get("exp")
    current_time = datetime.utcnow().timestamp()
    if token_exp < current_time:
        raise HTTPException(
            status_code=401, detail="Token expired, please log in again."
        )

    return user
