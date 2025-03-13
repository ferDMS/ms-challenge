import logging
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS for specific origins in production for better security
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure logging for production monitoring
logging.basicConfig(level=logging.INFO,  # Set logging level (e.g., INFO, DEBUG, ERROR)
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Register routes from the routes package
from routes import register_routes
register_routes(app)

# Error handlers for common HTTP errors - improve user experience and logging
@app.errorhandler(403)
def forbidden(e):
    logger.warning(f"Forbidden error (403): {e}")
    return jsonify(error="Forbidden: You don't have permission to access this resource"), 403

@app.errorhandler(404)
def not_found(e):
    logger.warning(f"Not Found error (404): {e}")
    return jsonify(error="Not found: The requested URL was not found on the server"), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Internal Server Error (500): {e}")
    return jsonify(error="Internal server error"), 500

if __name__ == '__main__':
    pass
    # app.run(debug=True, host='0.0.0.0', port=5001)
    