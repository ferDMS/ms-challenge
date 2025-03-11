from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename

# Import Azure services
from services.openai.client import OpenAIClient
from services.openai.models import ChatMessage
from services.document_intelligence.client import DocumentIntelligenceClient
from services.speech.client import SpeechClient

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# OpenAI API endpoint
@app.route('/api/openai/chat', methods=['POST'])
def openai_chat():
    try:
        data = request.json
        messages = [ChatMessage(role=msg['role'], content=msg['content']) for msg in data['messages']]
        
        client = OpenAIClient()
        completion = client.chat_completion(messages)
        
        return jsonify({
            'success': True,
            'content': completion.content
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Document Intelligence endpoint
@app.route('/api/document/analyze', methods=['POST'])
def analyze_document():
    if 'file' not in request.files:
        return jsonify({
            'success': False, 
            'error': 'No file part'
        }), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No selected file'
        }), 400
        
    try:
        # Save the file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process with Document Intelligence
        client = DocumentIntelligenceClient()
        with open(file_path, "rb") as document:
            result = client.analyze_document(document)
        
        # Clean up temporary file
        os.remove(file_path)
        
        # Extract and return relevant information
        pages_info = []
        for page in result.pages:
            page_info = {
                'page_number': page.page_number,
                'lines_count': len(page.lines),
                'lines': [line.content for line in page.lines]
            }
            pages_info.append(page_info)
        
        return jsonify({
            'success': True,
            'pages_count': len(result.pages),
            'pages': pages_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Text to speech endpoint
@app.route('/api/speech/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
            
        client = SpeechClient()
        output_file = os.path.join(app.config['UPLOAD_FOLDER'], 'output.wav')
        
        client.text_to_speech(text, output_file)
        
        # Return the audio file
        return send_file(output_file, mimetype='audio/wav', as_attachment=True, 
                         download_name='speech.wav')
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Speech to text endpoint
@app.route('/api/speech/speech-to-text', methods=['POST'])
def speech_to_text():
    if 'file' not in request.files:
        return jsonify({
            'success': False, 
            'error': 'No file part'
        }), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No selected file'
        }), 400
        
    try:
        # Save the file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process with Speech Service
        client = SpeechClient()
        transcription = client.speech_to_text(file_path)
        
        # Clean up temporary file
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'transcription': transcription
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'services': {
            'openai': 'available',
            'document_intelligence': 'available',
            'speech': 'available'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
