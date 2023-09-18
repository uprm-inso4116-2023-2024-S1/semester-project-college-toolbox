# Docker Database Setup

## Prod Database
1. cd into `database/prod`
2. Run `docker build -t ct-db-img .`
3. Run `docker run -d --name ct-db -p 5433:5432 ct-db-img`

## Test Database
1. cd into `database/test`
2. Run `docker build -t ct-test-db-img .`
3. Run `docker run -d --name ct-test-db -p 5434:5432 ct-test-db-img`
