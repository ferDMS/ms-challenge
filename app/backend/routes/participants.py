from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import participants_bp
from db.repositories.participant_repository import ParticipantRepository

# Initialize the participant repository
participant_repository = ParticipantRepository()

# Routes
@participants_bp.route('', methods=['GET'])
def get_participants():
    """Get all participants with optional filtering"""
    # Get query parameters for filtering
    coach_id = request.args.get('coachId')
    status = request.args.get('status')
    disability_type = request.args.get('disabilityType')
    skill_type = request.args.get('skillType')
    
    # Use repository to get filtered participants
    participants = participant_repository.get_all_participants(
        status=status,
        disability_type=disability_type,
        skill_type=skill_type,
        coach_id=coach_id
    )
    
    return jsonify(participants)

@participants_bp.route('/<participant_id>', methods=['GET'])
def get_participant(participant_id):
    """Get a specific participant by ID"""
    participant = participant_repository.get_participant(participant_id)
    
    if not participant:
        return jsonify({"error": "Participant not found"}), 404
    
    return jsonify(participant)

@participants_bp.route('', methods=['POST'])
def create_participant():
    """Create a new participant"""
    data = request.json
    
    # Validate required fields (minimal validation)
    required_fields = ["firstName", "lastName", "email", "disabilityType", "currentStatus"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Ensure fullName is created if not provided
    if "fullName" not in data:
        data["fullName"] = f"{data['firstName']} {data['lastName']}"
    
    # Use repository to create the participant
    created_participant = participant_repository.create_participant(data)
    return jsonify(created_participant), 201

@participants_bp.route('/<participant_id>', methods=['PUT'])
def update_participant(participant_id):
    """Update an existing participant"""
    # Check if participant exists
    existing_participant = participant_repository.get_participant(participant_id)
    
    if not existing_participant:
        return jsonify({"error": "Participant not found"}), 404
    
    data = request.json
    
    # Update participant using repository
    updated_participant = participant_repository.update_participant(participant_id, data)
    
    if not updated_participant:
        return jsonify({"error": "Failed to update participant"}), 500
    
    return jsonify(updated_participant)

@participants_bp.route('/<participant_id>', methods=['DELETE'])
def delete_participant(participant_id):
    """Delete a participant"""
    # Check if participant exists
    existing_participant = participant_repository.get_participant(participant_id)
    
    if not existing_participant:
        return jsonify({"error": "Participant not found"}), 404
    
    # Delete participant using repository
    success = participant_repository.delete_participant(participant_id)
    
    if not success:
        return jsonify({"error": "Failed to delete participant"}), 500
    
    return jsonify({"message": "Participant deleted successfully"}), 200

@participants_bp.route('/<participant_id>/sessions', methods=['GET'])
def get_participant_sessions(participant_id):
    """Get all sessions for a specific participant"""
    # Check if participant exists
    existing_participant = participant_repository.get_participant(participant_id)
    
    if not existing_participant:
        return jsonify({"error": "Participant not found"}), 404
    
    # Get sessions using repository
    sessions = participant_repository.get_participant_sessions(participant_id)
    return jsonify(sessions)

@participants_bp.route('/<participant_id>/job-matches', methods=['GET'])
def get_participant_job_matches(participant_id):
    """Get job matches for a specific participant"""
    # Check if participant exists
    existing_participant = participant_repository.get_participant(participant_id)
    
    if not existing_participant:
        return jsonify({"error": "Participant not found"}), 404
    
    # Get job matches using repository
    job_matches = participant_repository.get_participant_job_matches(participant_id)
    return jsonify(job_matches)
