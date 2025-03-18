import logging
import json
from flask import jsonify, request
from .. import call_center_bp
from services.call_center.main import run

logger = logging.getLogger(__name__)

def validate_call_center_data(data):
    """
    Validates the call center request data.
    Returns (is_valid, error_message, status_code) tuple.
    """
    if not data:
        return False, "No data provided", 400
        
    # Check for required field
    if not data.get('input_audio_url'):
        return False, "input_audio_url is required and cannot be empty", 400
        
    # Validate optional parameters if provided
    if 'language' in data and not data['language']:
        return False, "language cannot be empty", 400
        
    if 'locale' in data and not data['locale']:
        return False, "locale cannot be empty", 400
        
    if 'use_stereo' in data and not isinstance(data['use_stereo'], bool):
        return False, "use_stereo must be a boolean", 400
    
    return True, None, None

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
        
        # Validate data
        is_valid, error_message, status_code = validate_call_center_data(data)
        if not is_valid:
            return jsonify({"error": error_message}), status_code
        
        # Extract input_audio_url which is required
        input_audio_url = data['input_audio_url']  # Already validated above
        
        # Set defaults for optional parameters if not provided
        defaults = {
            "language": "en",
            "locale": "en-US",
            "use_stereo_audio": False
        }
        
        # Create a new dict with defaults and update with provided data
        params = {**defaults, **data}
        
        # Call the run function with the parameters
        result = run(params)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error analyzing call: {e}")
        return jsonify({"error": str(e)}), 500
