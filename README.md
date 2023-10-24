# 🧰College Toolbox🧰

Welcome to College Toolbox, your all-in-one web application for managing your college life more efficiently. This web app is built using Astro and is designed to help students streamline various aspects of their college experience, from tracking job and scholarship applications to generating tuition schedules and discovering useful college websites.

### 🛠Installation

#### Pre-requisites

1. Docker [Docker Installation Guide](https://docs.docker.com/get-docker/)
Installing Docker is a decently involved process. Be sure to follow every step carefully.
The two commonly hardest steps are:

- Installing WSL: if you're running Windows, you will need to install WSL. Pick Ubuntu as the Linux distro to install.
- Enabling Virtualization: To do this you will need to enter your BIOS and find the virtualization settings. You can enter the BIOS by restarting your computer and mashing the F2, F8, F12, or Del key (it depends LOL). Once in the BIOS, you can lookup a tutorial for enabling it for your particular BIOS (mine was the [MSI Click 5](https://liquidsky.com/how-to-enable-virtualization-msi-click-bios-5/))

2. Git Bash or another flavor of Bash
3. Python
4. Poetry: `curl -sSL https://install.python-poetry.org | python3 -`
5. Add the following line to your [PATH](https://gist.github.com/nex3/c395b2f8fd4b02068be37c961301caa7):
 `%APPDATA%\Python\Scripts`
6. Node [Download](https://nodejs.org/en/download)

#### 🏠Local Development

##### API Documentation

1. Run `cd backend`
2. Run `poetry install`
3. Run `poetry run python src/main.py`
4. Access http://localhost:5670/api/docs on your browser

##### 📜Scripts

##### Frontend

1. Run `cd frontend/college-toolbox`
2. Run `npm install`
3. Run `npm run dev`

##### Backend

1. Run `cd backend`
2. Run `poetry install`
3. Run `poetry run python src/main.py`

##### Testing
1. Run `cd backend`
2. Run `poetry run pytest`

### Deployment

#### Frontend

The frontend is automatically deployed to Github Pages on every push to the main branch

#### Self-hosted

TBA

#### Remote

TBA

## Features

College Toolbox offers a range of features to make your college journey smoother:

### Job Application Tracker

Keep tabs on your job applications with ease. Track the companies you've applied to, application deadlines, and the current status of your applications. Never miss an opportunity again!

### Scholarship Application Tracker

Managing scholarship applications can be daunting. College Toolbox simplifies it by allowing you to monitor your scholarship applications, deadlines, and award statuses all in one place.

### Tuition Schedule Generator

Planning your course schedule and tuition expenses can be complicated. This feature helps you generate possible tuition schedules based on the courses you select. Get a clearer picture of your academic journey.

### College Resources

Discover a curated list of helpful college websites and resources that cover a wide range of topics, from academic support to financial aid. Explore valuable tools that can enhance your college experience.

## Architecture

Diagram TBA

- Frontend: Astro
- Backend: FastAPI
- ORM: SQLalchemy
- Database: SQLite
