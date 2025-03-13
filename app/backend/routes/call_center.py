import logging
import json
from flask import jsonify, request
from . import call_center_bp
from services.call_center.main import run

logger = logging.getLogger(__name__)

@call_center_bp.route('', methods=['POST'])
def analyze_call():
    """
    Analyze call audio using Azure Speech Services and Language Services
    
    Expects JSON payload with the following parameters:
    - input_audio_url: URL to the audio file
    - language: Language code for analysis (default: 'en')
    - locale: Locale for transcription (default: 'en-US')
    - use_stereo: Boolean to indicate if audio is stereo (default: False)
    """
    logger.info("Handling POST request for /api/call-center endpoint")
    
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        if 'input_audio_url' not in data:
            return jsonify({"error": "input_audio_url is required"}), 400
            
        # Call the run function with parameters from request
        result = run()
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error analyzing call: {e}")
        return jsonify({"error": str(e)}), 500
