import logging
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS for specific origins in production for better security
# Example: CORS(app, resources={r"/*": {"origins": ["http://your-frontend-domain.com", "https://another-allowed-domain.net"]}}, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True) # Allow all origins for simplicity (adjust for production)


# Configure logging for production monitoring
logging.basicConfig(level=logging.INFO,  # Set logging level (e.g., INFO, DEBUG, ERROR)
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    logger.info("Handling GET request for / endpoint")
    return jsonify({
        'message': 'Hello World',
        'status': 'success'
    })

# Health check endpoint - important for monitoring in container environments
@app.route('/api/health', methods=['GET'])
def health_check():
    logger.info("Handling GET request for /api/health endpoint")
    return jsonify({
        'status': 'healthy',
        'services': {
            'api': 'available'
        }
    })

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
    # In production, run with Gunicorn (or uWSGI) instead of app.run()
    # Example Gunicorn command: gunicorn app:app -b 0.0.0.0:5001 -w 5
    # Remove app.run() for production deployments
    pass # No app.run() here, Gunicorn will start the app
    # app.run(debug=True, host='0.0.0.0', port=5001) # Development only