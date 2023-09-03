# PostgreSQL Docker Installation and Setup Guide

This guide will walk you through the process of installing and setting up PostgreSQL using Docker. Docker allows you to run PostgreSQL in a container, making it easy to manage and isolate your database environment.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed:

- Docker: [Docker Installation Guide](https://docs.docker.com/get-docker/)
- Docker Compose (usually comes with Docker): [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

## Installation

1. **Pull the PostgreSQL Docker Image**:

Open your terminal and run the following command to download the official PostgreSQL Docker image from Docker Hub:

```bash
docker pull postgres
```

This will fetch the latest PostgreSQL image.

2. **Create a Docker Network (optional)**:

You can create a custom Docker network to isolate your PostgreSQL container from other containers. This step is optional but can enhance security and organization.

```bash
docker network create ct-postgres-network
```

3. **Running PostgreSQL Container**

Now, you can run a PostgreSQL container using the image you pulled.

```bash
docker run --name ct-postgres-container -e POSTGRES_PASSWORD=password -d -p 5432:5432 --network ct-postgres-network postgres
```

4. **Accessing PostgreSQL**

Connecting with PostgreSQL Client:

Use your preferred PostgreSQL client (e.g., psql, pgAdmin, DBeaver) to connect to the database:

```bash
    Host: localhost (if running on the same machine) or the IP address of the machine running Docker.
    Port: 5432
    Username: postgres
    Password: password
```

5. Stopping and Removing the Container

To stop and remove the PostgreSQL container, use the following commands:

```bash

docker stop ct-postgres-container
docker rm ct-postgres-container
```