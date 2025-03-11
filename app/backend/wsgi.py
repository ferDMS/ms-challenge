import sys
import os

# Add the parent directory to the Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, parent_dir)

# Import the Flask app from your backend
from app import app

# This is what Gunicorn will look for
if __name__ == "__main__":
    app.run()
