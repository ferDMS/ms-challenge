import logging
from flask import jsonify
from .. import api_bp  # Import from parent package

logger = logging.getLogger(__name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    logger.info("Handling GET request for /api/health endpoint")
    return jsonify({
        'status': 'healthy',
        'services': {
            'api': 'available'
        }
    })