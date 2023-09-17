# config.py
from sqlalchemy import URL

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="2928",  # plain (unescaped) text
    host="localhost",
    port=5432,
)
