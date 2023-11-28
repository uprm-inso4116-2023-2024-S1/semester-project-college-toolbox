# src/security.py
from base64 import b64decode, b64encode
import hashlib
import jwt
import os
import secrets

from datetime import datetime, timedelta
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import Optional


class SecurityConfig:
    _instance = None

    # Private constructor
    def __init__(self):
        self._SECRET_KEY = secrets.token_hex(32)
        self._ALGORITHM = "HS256"
        self._TOKEN_EXPIRATION_SECONDS = 60 * 60 * 3  # Three hours

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def get_secret_key(cls):
        return cls.get_instance()._SECRET_KEY

    @classmethod
    def get_algorithm(cls):
        return cls.get_instance()._ALGORITHM

    @classmethod
    def get_token_expiration_seconds(cls):
        return cls.get_instance()._TOKEN_EXPIRATION_SECONDS


# Generate permanent token for user session
def generate_permanent_token(user_id: str) -> str:
    expiration = datetime.utcnow() + timedelta(hours=3)
    payload = {"sub": user_id, "exp": expiration}
    token = jwt.encode(
        payload=payload,
        key=SecurityConfig.get_secret_key(),
        algorithm=SecurityConfig.get_algorithm(),
    )
    return token


# Generate salt to add to password for encryption
def generate_salt():
    return os.urandom(16).hex()


# Hash the encoded password and salt
def hash_password(password, salt):
    hash_obj = hashlib.sha256()
    hash_obj.update(password.encode() + salt.encode())
    return hash_obj.hexdigest()


# Token validation and user_id extraction
def get_user_id_from_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            jwt=token,
            key=SecurityConfig.get_secret_key(),
            algorithms=[SecurityConfig.get_algorithm()],
        )
        user_id = payload.get("sub")
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token. {e}")
