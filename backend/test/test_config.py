# test/config.py
from sqlalchemy import URL


TEST_DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="ct_test",
    password="password",  # plain (unescaped) text
    host="localhost",
    port=5434,
    database="ct_test",
)
