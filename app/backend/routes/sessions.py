from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import sessions_bp
from db.repositories.session_repository import SessionRepository

# Initialize the session repository
session_repository = SessionRepository()

# Routes

@sessions_bp.route('', methods=['GET'])
def get_sessions():
    """Get all sessions with optional filtering"""
    # Get query parameters for filtering
    coach_id = request.args.get('coachId')
    participant_id = request.args.get('participantId')
    status = request.args.get('status')
    session_type = request.args.get('type')
    
    # Use repository to get filtered sessions
    sessions = session_repository.get_all_sessions(
        coach_id=coach_id,
        participant_id=participant_id,
        status=status,
        session_type=session_type
    )
    
    return jsonify(sessions)

@sessions_bp.route('/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get a specific session by ID"""
    session = session_repository.get_session(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    return jsonify(session)

@sessions_bp.route('', methods=['POST'])
def create_session():
    """Create a new session"""
    data = request.json
    
    # Validate required fields
    required_fields = ["title", "coachId", "participantId", "date", "startTime", "endTime", "type", "location"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Create a new session with default values for optional fields
    new_session = {
        "title": data["title"],
        "coachId": data["coachId"],
        "coachName": data.get("coachName", ""),
        "participantId": data["participantId"],
        "participantName": data.get("participantName", ""),
        "date": data["date"],
        "startTime": data["startTime"],
        "endTime": data["endTime"],
        "status": data.get("status", "scheduled"),
        "type": data["type"],
        "location": data["location"],
        "notes": data.get("notes", ""),
        "topics": data.get("topics", []),
        "goals": data.get("goals", []),
        "nextSteps": data.get("nextSteps", []),
        "completedSteps": data.get("completedSteps", []),
        "progressNotes": data.get("progressNotes", ""),
        "aiSuggestions": data.get("aiSuggestions", {
            "recommendedTopics": [],
            "sentimentAnalysis": {
                "positive": [],
                "negative": []
            },
            "jobRecommendations": []
        })
    }
    
    # Use repository to create the session
    created_session = session_repository.create_session(new_session)
    return jsonify(created_session), 201

@sessions_bp.route('/<session_id>', methods=['PUT'])
def update_session(session_id):
    """Update an existing session"""
    # Check if session exists
    existing_session = session_repository.get_session(session_id)
    
    if not existing_session:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.json
    
    # Ensure ID is not changed
    data['id'] = session_id
    
    # Update session using repository
    updated_session = session_repository.update_session(session_id, data)
    
    if not updated_session:
        return jsonify({"error": "Failed to update session"}), 500
    
    return jsonify(updated_session)

@sessions_bp.route('/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a session"""
    # Check if session exists
    existing_session = session_repository.get_session(session_id)
    
    if not existing_session:
        return jsonify({"error": "Session not found"}), 404
    
    # Delete session using repository
    result = session_repository.delete_session(session_id)
    
    if not result:
        return jsonify({"error": "Failed to delete session"}), 500
    
    return jsonify({"message": "Session deleted successfully"}), 200

@sessions_bp.route('/<session_id>/observations', methods=['POST'])
def add_observations(session_id):
    """Add observations to a session"""
    # Check if session exists
    existing_session = session_repository.get_session(session_id)
    
    if not existing_session:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.json
    
    # Check if required fields are in the request
    if "notes" not in data:
        return jsonify({"error": "Missing required field: notes"}), 400
    
    # Use repository to add observations
    updated_session = session_repository.add_observations(session_id, data)
    
    if not updated_session:
        return jsonify({"error": "Failed to add observations"}), 500
    
    return jsonify(updated_session)

@sessions_bp.route('/<session_id>/analysis', methods=['POST'])
def generate_analysis(session_id):
    """Generate AI analysis for a session"""
    # Check if session exists
    existing_session = session_repository.get_session(session_id)
    
    if not existing_session:
        return jsonify({"error": "Session not found"}), 404
    
    # Use repository to generate analysis
    analysis_result = session_repository.generate_analysis(session_id)
    
    if isinstance(analysis_result, dict) and "error" in analysis_result:
        return jsonify(analysis_result), 400
    
    if not analysis_result:
        return jsonify({"error": "Failed to generate analysis"}), 500
    
    return jsonify(analysis_result)
