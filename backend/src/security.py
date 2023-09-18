# src/security.py
import hashlib
import jwt
import os
import secrets

from datetime import datetime, timedelta

SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
TOKEN_EXPIRATION_MINUTES = 60


# Generate salt to add to password for encryption
def generate_salt():
    return os.urandom(16).hex()


# Hash the encoded password and salt
def hash_password(password, salt):
    hash_obj = hashlib.sha256()
    hash_obj.update(password.encode() + salt.encode())
    return hash_obj.hexdigest()


# Generate permanent token for user session
def generate_permanent_token(user_id: int) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
    payload = {"sub": str(user_id), "exp": expiration}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token
