# Installation

## Option A: Local

1. Ensure you have `poetry` installed: `curl -sSL https://install.python-poetry.org | python -`
2. Add the following lines to your [PATH](https://gist.github.com/nex3/c395b2f8fd4b02068be37c961301caa7):
 `%APPDATA%\Python\Scripts` (if you have Python installed through the MS store)
 `%APPDATA%\pypoetry\venv\Scripts`
3. cd into `backend/`
4. Run `poetry install`
5. Run `poetry run python src/main.py`
6. Make desired changes and visit `localhost:5670`

## Option B: Docker

*Note that changes will not be visible until the image is rebuilt

1. cd into `backend/`
2. Run `docker build -t backend-dev-image --target development .`
3. Run `docker run -it -p 5670:5670 --name backend-dev-container backend-dev-image`
4. visit `localhost:5670`


# Database Migrations

## Local Development 
### To create a new revision locally:
1. cd into the `backend/` directory
2. Run `poetry run alembic -c src/alembic.ini -n dev revision --autogenerate -m "<insert description>"` 
3. Revise and edit the newly created revision script if necessary
4. Run `poetry run alembic -c src/alembic.ini -n dev upgrade head`

### After pulling from the GitHub repository:
1. cd into the `backend/` directory
2. Run `poetry run alembic -c src/alembic.ini -n dev upgrade head`

## Production Deployments
When changing a SQLAlchemy model for a table, you should generate migrations on the production database for it.

### To create a new migration:
1. cd into the `backend/` directory
2. Run `poetry run alembic -c src/alembic.ini -n prod revision --autogenerate -m "<insert description>"` 
3. Revise and edit the newly created revision script if necessary
4. Run `poetry run alembic -c src/alembic.ini -n prod upgrade head`

### After pulling from the GitHub repository:
1. cd into the `backend/` directory
2. Run `poetry run alembic -c src/alembic.ini -n prod upgrade head`