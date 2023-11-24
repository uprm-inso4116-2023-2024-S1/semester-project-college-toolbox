# College Toolbox Database

College Toolbox uses a SQLite database for all its data. Data that should be available to all developers like RUMAD data, existing solutions, etc. should live in the production database (/prod/ct-prod.db). When developing locally, a dev database will automatically be created based on the prod db.

## Rebuilding Dev Database

Deleting the dev database (/dev/ct-test.db) and rerunning the backend (from backend/ run `poetry run python src/run.py`) will recreate it.

## Keeping the database updated

Running the backend will create any newly added tables, but existing tables that are changed will need to be migrated. Be sure to apply the alembic migrations (see alembic/ directory) when changing the data models to ensure both prod and dev have the latest models.