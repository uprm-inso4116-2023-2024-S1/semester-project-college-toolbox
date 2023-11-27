# src/security.py
import hashlib
import jwt
import os
import secrets

from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional

from src.models.tables import User
from src.utils.db import get_db

SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
TOKEN_EXPIRATION_SECONDS = 60 * 60 * 3  # Three hours

# OAuth2 password bearer instance
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Generate salt to add to password for encryption
def generate_salt():
    return os.urandom(16).hex()


# Hash the encoded password and salt
def hash_password(password, salt):
    hash_obj = hashlib.sha256()
    hash_obj.update(password.encode() + salt.encode())
    return hash_obj.hexdigest()


# Generate permanent token for user session
def generate_permanent_token(user_id: str) -> str:
    expiration = datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION_SECONDS)
    payload = {"sub": user_id, "exp": expiration}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


# Token validation and user_id extraction
def get_user_id_from_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token.")


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
