import os
import subprocess
import sys

# Function to check if a command exists
def command_exists(command):
    try:
        subprocess.check_call([command], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return False
    return True

# Paths to the backend folder
backend_folder = "backend"

# Check if poetry is available
if not command_exists("poetry"):
    print("Error: poetry must be installed for this hook. Follow the readme in backend.")
    sys.exit(1)

# Check for uncommitted changes in the backend folder
try:
    git_diff = subprocess.check_output(["git", "diff", "--name-only", "--cached"], universal_newlines=True)
    if any(line.startswith(f"{backend_folder}/") for line in git_diff.split("\n")):
        # Run black on Python files in the backend folder
        print(f"Running black on Python files in {backend_folder}...")
        os.chdir(backend_folder)
        subprocess.check_call(["poetry", "run", "black", "."])
        print("Formatting completed successfully.")
except subprocess.CalledProcessError:
    sys.exit(1)

sys.exit(0)
