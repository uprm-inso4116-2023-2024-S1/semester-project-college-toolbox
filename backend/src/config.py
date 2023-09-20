# src/config.py
from sqlalchemy import URL

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="ct",
    password="password",  # plain (unescaped) text
    host="localhost",
    port=5433,
    database="ct",
)

TOKEN_EXPIRATION_TIME = 5 * 24 * 60 * 60  # 5 days
