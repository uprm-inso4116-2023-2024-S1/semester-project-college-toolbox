# Installation

## Option A: Local

1. Ensure you have `poetry` installed: `curl -sSL https://install.python-poetry.org | python3 -`
2. Add the following line to your [PATH](https://gist.github.com/nex3/c395b2f8fd4b02068be37c961301caa7):
 `%APPDATA%\Python\Scripts`
3. cd into `backend/`
4. Run `poetry install`
5. Run `poetry run uvicorn src.main:app --host 0.0.0.0 --port 5670 --reload`
6. Make desired changes and visit `localhost:5670`

## Option B: Docker

*Note that changes will not be visible until the image is rebuilt

1. cd into `backend/`
2. Run `docker build -t backend-dev-image --target development .`
3. Run `docker run -it -p 8081:8080 --name backend-dev-container backend-dev-image`
4. visit `localhost:8081`
