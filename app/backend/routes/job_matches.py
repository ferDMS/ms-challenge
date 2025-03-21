from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import job_matches_bp
from db.repositories.job_repository import JobRepository
from db.repositories.job_match_repository import JobMatchRepository
from db.models.job_match import JobMatchStatus, MatchSource

# Initialize the repositories
job_repository = JobRepository()
job_match_repository = JobMatchRepository()

# Routes
@job_matches_bp.route('', methods=['GET'])
def get_job_matches():
    """Get all job matches with optional filtering"""
    # Get query parameters for filtering
    participant_id = request.args.get('participantId')
    job_id = request.args.get('jobId')
    status = request.args.get('status')
    
    # Determine which repository method to use based on filters
    if participant_id:
        matches = job_match_repository.get_job_matches_for_participant(participant_id)
    elif job_id:
        matches = job_match_repository.get_job_matches_for_job(job_id)
    elif status:
        matches = job_match_repository.get_job_matches_by_status(status)
    else:
        matches = job_match_repository.get_all_job_matches()
        
    return jsonify(matches)

@job_matches_bp.route('/<match_id>', methods=['GET'])
def get_job_match(match_id):
    """Get a specific job match by ID"""
    match = job_match_repository.get_job_match(match_id)
    
    if not match:
        return jsonify({"error": "Job match not found"}), 404
    
    return jsonify(match)

@job_matches_bp.route('', methods=['POST'])
def create_job_match():
    """Create job match between participant and job"""
    data = request.json
    
    # Validate required fields
    required_fields = ["participantId", "jobId"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Set default status if not provided
    if "status" not in data:
        data["status"] = JobMatchStatus.CONSIDERING
        
    # Set source if not provided
    if "source" not in data:
        data["source"] = MatchSource.COACH_ASSIGNED
    
    # Calculate compatibility if not provided
    if "matchScore" not in data or "compatibilityElements" not in data:
        compatibility = job_match_repository.calculate_compatibility(
            data["participantId"], 
            data["jobId"]
        )
        
        if compatibility:
            data["matchScore"] = compatibility["matchScore"]
            data["compatibilityElements"] = compatibility["compatibilityElements"]
    
    # Use repository to create the job match
    created_match = job_match_repository.create_job_match(data)
    return jsonify(created_match), 201

@job_matches_bp.route('/<match_id>', methods=['PUT'])
def update_job_match(match_id):
    """Update job match data"""
    data = request.json
    
    # Check if match exists
    existing_match = job_match_repository.get_job_match(match_id)
    if not existing_match:
        return jsonify({"error": "Job match not found"}), 404
    
    # Update match using repository
    updated_match = job_match_repository.update_job_match(match_id, data)
    
    if not updated_match:
        return jsonify({"error": "Failed to update job match"}), 500
    
    return jsonify(updated_match)

@job_matches_bp.route('/<match_id>/status', methods=['PUT'])
def update_job_match_status(match_id):
    """Update job match status"""
    data = request.json
    
    # Validate required field
    if "status" not in data:
        return jsonify({"error": "Missing required field: status"}), 400
    
    # Get optional notes
    notes = data.get("notes")
    
    # Update status using repository
    updated_match = job_match_repository.update_job_match_status(
        match_id,
        data["status"],
        notes
    )
    
    if not updated_match:
        return jsonify({"error": "Failed to update job match status"}), 500
    
    return jsonify(updated_match)

@job_matches_bp.route('/suggestions/<participant_id>', methods=['GET'])
def get_job_suggestions(participant_id):
    """Get job suggestions for a participant"""
    # Get limit parameter (default to 10)
    try:
        limit = int(request.args.get('limit', 10))
    except ValueError:
        limit = 10
    
    # Get suggestions using repository
    suggested_jobs = job_repository.get_job_suggestions_for_participant(participant_id, limit)
    
    # For each suggested job, calculate compatibility
    for job in suggested_jobs:
        compatibility = job_match_repository.calculate_compatibility(
            participant_id,
            job["id"]
        )
        
        if compatibility:
            job["matchScore"] = compatibility["matchScore"]
            job["compatibilityElements"] = compatibility["compatibilityElements"]
        else:
            job["matchScore"] = 0
            job["compatibilityElements"] = []
    
    # Sort by match score (highest first)
    suggested_jobs.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
    
    return jsonify(suggested_jobs)

@job_matches_bp.route('/create-suggestion/<participant_id>/<job_id>', methods=['POST'])
def create_job_suggestion(participant_id, job_id):
    """Create a system-suggested job match"""
    # Calculate compatibility
    compatibility = job_match_repository.calculate_compatibility(
        participant_id,
        job_id
    )
    
    if not compatibility:
        return jsonify({"error": "Could not calculate compatibility"}), 400
    
    # Create match data
    match_data = {
        "participantId": participant_id,
        "jobId": job_id,
        "status": JobMatchStatus.SUGGESTED,
        "source": MatchSource.SYSTEM_GENERATED,
        "matchScore": compatibility["matchScore"],
        "compatibilityElements": compatibility["compatibilityElements"]
    }
    
    # Create the match
    created_match = job_match_repository.create_job_match(match_data)
    return jsonify(created_match), 201
