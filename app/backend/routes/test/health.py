import logging
from flask import jsonify
from .. import health_bp  # Import from parent package

logger = logging.getLogger(__name__)

@health_bp.route('', methods=['GET'])
def hello_world():
    logger.info("Handling GET request for / endpoint")
    return jsonify({
        'message': 'Hello World',
        'status': 'success'
    })