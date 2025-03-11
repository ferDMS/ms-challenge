import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app from your backend
from app import app

# This is what Gunicorn will look for
if __name__ == "__main__":
    app.run()
