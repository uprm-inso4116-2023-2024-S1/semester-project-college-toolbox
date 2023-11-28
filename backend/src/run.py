import argparse
import os
import shutil
import uvicorn
from src.config import environment


def prepare_db(environment: str, refresh: bool = False):
    # copy the prod db to the dev db if running locally

    if environment == "DEV":
        # Specify the paths to the source (prod) and destination (dev) databases
        dev_database_path = os.path.join("database", "dev", "ct-dev.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")
        os.makedirs(os.path.join("database", "test"), exist_ok=True)
        # Refresh dev environment if flag is set
        if refresh:
            # Check if the destination file exists and delete it if it does
            if os.path.exists(dev_database_path):
                os.remove(dev_database_path)
        # Copy the contents of the prod database to the dev database
        # Only copy if the developer doesn't already have a local dev db
        shutil.copy2(prod_database_path, dev_database_path)

    elif environment == "TEST":
        # Specify the paths to the source (prod) and destination (test) databases
        test_database_path = os.path.join("database", "test", "ct-test.db")
        prod_database_path = os.path.join("database", "prod", "ct-prod.db")

        # Copy the contents of the prod database to the test database
        os.makedirs(os.path.join("database", "test"), exist_ok=True)
        shutil.copy2(prod_database_path, test_database_path)
    return environment


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the Fast API application.")
    parser.add_argument(
        "-r",
        "--refresh",
        dest="refresh",
        action="store_true",
        help="Toggle dev database refresh.",
    )
    args = parser.parse_args()
    env = prepare_db(environment, args.refresh)
    host = "localhost"
    port = 5670
    uvicorn.run("src.main:app", host=host, port=port)
