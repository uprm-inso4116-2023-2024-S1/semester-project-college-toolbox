import os
import shutil
import sys

# Define the source and destination paths
source_path = "hooks/pre-commit"
destination_path = ".git/hooks/pre-commit"

# Check if the source file exists
if not os.path.exists(source_path):
    print(f"Error: Source file '{source_path}' not found.")
    sys.exit(1)

# Ensure the destination directory exists
os.makedirs(os.path.dirname(destination_path), exist_ok=True)

# Copy the source file to the destination, overriding any existing file
try:
    shutil.copy(source_path, destination_path)
    print(f"'pre-commit' copied successfully.")
except Exception as e:
    print(f"Error: Failed to copy 'pre-commit' to '{destination_path}': {e}")
    sys.exit(1)

sys.exit(0)
