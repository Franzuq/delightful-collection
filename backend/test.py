import os
import sys

print("Python version:", sys.version)
print("Current directory:", os.getcwd())
print("Files in current directory:", os.listdir('.'))

try:
    from app import create_app
    print("Successfully imported create_app")
except Exception as e:
    print("Error importing create_app:", e) 