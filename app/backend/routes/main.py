import logging
from flask import jsonify
from . import main_bp

logger = logging.getLogger(__name__)

@main_bp.route('', methods=['GET'])
def hello_world():
    logger.info("Handling GET request for / endpoint")
    return jsonify({
        'message': 'Hello World',
        'status': 'success'
    })
