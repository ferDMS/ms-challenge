# Initialize the routes package
from flask import Blueprint

# Create blueprints for different route categories
main_bp = Blueprint('main', __name__)
api_bp = Blueprint('api', __name__)
pokemon_bp = Blueprint('pokemon', __name__)
call_center_bp = Blueprint('call_center', __name__)

# Import route definitions to register them with the blueprints
from . import main
from . import api
from . import pokemon
from . import call_center

# Function to register all blueprints with the Flask app
def register_routes(app):
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(pokemon_bp, url_prefix='/api/pokemon')
    app.register_blueprint(call_center_bp, url_prefix='/api/call-center')
