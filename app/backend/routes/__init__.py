# Initialize the routes package
from flask import Blueprint

# Create blueprints for different route categories
health_bp = Blueprint('health', __name__)
api_bp = Blueprint('api', __name__)
pokemon_bp = Blueprint('pokemon', __name__)
call_center_bp = Blueprint('call_center', __name__)

participants_bp = Blueprint('participants', __name__)
coaches_bp = Blueprint('coaches', __name__)
sessions_bp = Blueprint('sessions', __name__)
jobs_bp = Blueprint('jobs', __name__)
job_matches_bp = Blueprint('job_matches', __name__)
documents_bp = Blueprint('documents', __name__)
suggestions_bp = Blueprint('suggestions', __name__)

# Import route definitions to register them with the blueprints
# Make sure test package has an __init__.py file to make it a proper package
from .test import health, api, pokemon, call_center

from . import participants
from . import coaches
from . import sessions
from . import jobs
from . import job_matches
from . import documents
from . import suggestions

# Function to register all blueprints with the Flask app
def register_routes(app):
    # Test routes
    app.register_blueprint(health_bp, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(pokemon_bp, url_prefix='/api/pokemon')
    app.register_blueprint(call_center_bp, url_prefix='/api/call-center')

    # Main application routes 
    app.register_blueprint(participants_bp, url_prefix='/api/participants')
    app.register_blueprint(coaches_bp, url_prefix='/api/coaches')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(job_matches_bp, url_prefix='/api/job-matches')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(suggestions_bp, url_prefix='/api/suggestions')