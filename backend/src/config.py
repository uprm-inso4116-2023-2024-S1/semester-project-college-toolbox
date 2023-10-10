# src/config.py
import os
environment = os.environ.get('CT_ENV', "DEV")

if environment == "PROD":
    DATABASE_URL = "sqlite:///database/prod/ct-prod.db"
else:
    DATABASE_URL = "sqlite:///database/dev/ct-dev.db"
