from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import sessions_bp

# Mock database - in production, would use a real database
sessions_db = [
    {
        "id": "1",
        "title": "Initial Assessment Meeting",
        "coachId": "coach-123",
        "coachName": "Maria González",
        "participantId": "participant-456",
        "participantName": "Juan Pérez",
        "date": "2023-11-15T14:00:00Z",
        "startTime": "14:00",
        "endTime": "15:30",
        "status": "completed",
        "type": "assessment",
        "location": "Office 302",
        "notes": "Juan showed interest in retail positions. He has previous experience at a local store. He mentioned he'd like to work in an environment where he can interact with customers. His family is willing to support him with transportation during the first few months.",
        "topics": ["Skills assessment", "Employment history", "Job preferences"],
        "goals": ["Identify 3 potential job matches", "Complete skills assessment"],
        "nextSteps": ["Schedule skills training", "Research retail openings"],
        "completedSteps": ["Initial evaluation", "Document registration"],
        "progressNotes": "Juan demonstrates good progress in communication skills",
        "aiSuggestions": {
            "recommendedTopics": ["Communication skills", "Interview preparation"],
            "sentimentAnalysis": {
                "positive": [
                    "Excited about new opportunities",
                    "Confident in technical abilities"
                ],
                "negative": [
                    "Concerned about transportation",
                    "Anxious about interviews"
                ]
            },
            "jobRecommendations": [
                {
                    "id": "job-789",
                    "title": "Sales Assistant - Department Store",
                    "match": 92,
                    "reason": "Compatible with previous experience and communication skills"
                },
                {
                    "id": "job-456",
                    "title": "Customer Service Assistant",
                    "match": 85,
                    "reason": "Interactive environment that matches preferences"
                }
            ]
        }
    },
    {
        "id": "2",
        "title": "Skills Training Session",
        "coachId": "coach-123",
        "coachName": "Maria González",
        "participantId": "participant-789",
        "participantName": "Ana Martínez",
        "date": "2023-11-18T10:00:00Z",
        "startTime": "10:00",
        "endTime": "11:30",
        "status": "scheduled",
        "type": "training",
        "location": "Training Room A",
        "notes": "Focus on customer service skills",
        "topics": ["Communication", "Problem solving", "Customer interaction"],
        "goals": ["Improve phone skills", "Practice greeting customers"],
        "nextSteps": ["Mock interviews", "Review progress"],
        "completedSteps": [],
        "progressNotes": "",
        "aiSuggestions": {
            "recommendedTopics": [],
            "sentimentAnalysis": {
                "positive": [],
                "negative": []
            },
            "jobRecommendations": []
        }
    }
]

# Helper functions
def find_session_by_id(session_id):
    for session in sessions_db:
        if session["id"] == session_id:
            return session
    return None

# Routes

@sessions_bp.route('', methods=['GET'])
def get_sessions():
    """Get all sessions with optional filtering"""
    # Get query parameters for filtering
    coach_id = request.args.get('coachId')
    participant_id = request.args.get('participantId')
    status = request.args.get('status')
    session_type = request.args.get('type')
    
    # Apply filters if they exist
    filtered_sessions = sessions_db
    
    if coach_id:
        filtered_sessions = [s for s in filtered_sessions if s["coachId"] == coach_id]
    
    if participant_id:
        filtered_sessions = [s for s in filtered_sessions if s["participantId"] == participant_id]
    
    if status:
        filtered_sessions = [s for s in filtered_sessions if s["status"] == status]
    
    if session_type:
        filtered_sessions = [s for s in filtered_sessions if s["type"] == session_type]
    
    return jsonify(filtered_sessions)

@sessions_bp.route('/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get a specific session by ID"""
    session = find_session_by_id(session_id)
    
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
        "id": f"session-{uuid.uuid4().hex[:8]}",  # Generate a unique ID
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
    
    sessions_db.append(new_session)
    return jsonify(new_session), 201

@sessions_bp.route('/<session_id>', methods=['PUT'])
def update_session(session_id):
    """Update an existing session"""
    session = find_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.json
    
    # Update fields that are present in the request
    for key, value in data.items():
        if key in session and key != "id":  # Don't allow ID to be changed
            session[key] = value
    
    return jsonify(session)

@sessions_bp.route('/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a session"""
    session = find_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    sessions_db.remove(session)
    return jsonify({"message": "Session deleted successfully"}), 200

@sessions_bp.route('/<session_id>/observations', methods=['POST'])
def add_observations(session_id):
    """Add observations to a session"""
    session = find_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.json
    
    # Check if required fields are in the request
    if "notes" not in data:
        return jsonify({"error": "Missing required field: notes"}), 400
    
    # Append to existing notes or create new ones
    if session["notes"]:
        session["notes"] += f"\n\n{data['notes']}"
    else:
        session["notes"] = data["notes"]
    
    # Add any additional observations
    if "progressNotes" in data:
        session["progressNotes"] = data["progressNotes"]
    
    if "completedSteps" in data:
        session["completedSteps"].extend(data["completedSteps"])
    
    if "nextSteps" in data:
        session["nextSteps"].extend(data["nextSteps"])
    
    return jsonify(session)

@sessions_bp.route('/<session_id>/analysis', methods=['POST'])
def generate_analysis(session_id):
    """Generate AI analysis for a session"""
    session = find_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    # In a real implementation, this would call an AI service
    # Here we'll just return mock data
    
    # Check if notes are provided to analyze
    if not session["notes"]:
        return jsonify({"error": "Session has no notes to analyze"}), 400
    
    # Mock AI analysis
    ai_analysis = {
        "recommendedTopics": [
            "Communication skills",
            "Interview preparation",
            "Job search strategies"
        ],
        "sentimentAnalysis": {
            "positive": [
                "Excited about new opportunities",
                "Confident in technical abilities",
                "Eager to learn new skills"
            ],
            "negative": [
                "Concerned about transportation",
                "Anxious about interviews",
                "Worried about schedule flexibility"
            ]
        },
        "jobRecommendations": [
            {
                "id": "job-789",
                "title": "Sales Assistant - Department Store",
                "match": 92,
                "reason": "Compatible with previous experience and communication skills"
            },
            {
                "id": "job-456",
                "title": "Customer Service Assistant",
                "match": 85,
                "reason": "Interactive environment that matches preferences"
            },
            {
                "id": "job-234",
                "title": "Retail Associate",
                "match": 78,
                "reason": "Good fit for skill level and interests"
            }
        ]
    }
    
    # Update session with AI analysis
    session["aiSuggestions"] = ai_analysis
    
    return jsonify(ai_analysis)
