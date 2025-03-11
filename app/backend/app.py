from flask import Flask, jsonify, make_response
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
# Configure CORS more explicitly
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({
        'message': 'Hello World',
        'status': 'success'
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'services': {
            'api': 'available'
        }
    })

# Add error handlers for common HTTP errors
@app.errorhandler(403)
def forbidden(e):
    return jsonify(error="Forbidden: You don't have permission to access this resource"), 403

@app.errorhandler(404)
def not_found(e):
    return jsonify(error="Not found: The requested URL was not found on the server"), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify(error="Internal server error"), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
