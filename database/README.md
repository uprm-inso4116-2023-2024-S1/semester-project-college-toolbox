# Docker Database Setup

1. cd into `database/`
2. Run `docker build -t ct-db-img .`
3. Run `docker run -d --name ct-db -p 5432:5432 ct-db-img`
