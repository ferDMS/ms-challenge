from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import jobs_bp
from db.repositories.job_repository import JobRepository

# Initialize the job repository
job_repository = JobRepository()

# Routes
@jobs_bp.route('', methods=['GET'])
def get_jobs():
    """Get all jobs with optional filtering"""
    # Get query parameters for filtering
    status = request.args.get('status')
    employment_type = request.args.get('employmentType')
    industry = request.args.get('industry')
    location = request.args.get('location')
    
    # Use repository to get filtered jobs
    jobs = job_repository.get_all_jobs(
        status=status,
        employment_type=employment_type,
        industry=industry,
        location=location
    )
    
    return jsonify(jobs)

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    """Get a specific job by ID"""
    job = job_repository.get_job(job_id)
    
    if not job:
        return jsonify({"error": "Job not found"}), 404
    
    return jsonify(job)

@jobs_bp.route('', methods=['POST'])
def create_job():
    """Create a new job listing"""
    data = request.json
    
    # Validate required fields (minimal validation)
    required_fields = ["title", "companyName", "description", "shortDescription", 
                      "location", "salary", "employmentType", "status"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Set default values for optional fields
    if "postedDate" not in data:
        data["postedDate"] = datetime.utcnow().isoformat()
    
    if "requiredSkills" not in data:
        data["requiredSkills"] = []
    
    if "remoteOption" not in data:
        data["remoteOption"] = False
    
    # Use repository to create the job
    created_job = job_repository.create_job(data)
    return jsonify(created_job), 201

@jobs_bp.route('/<job_id>', methods=['PUT'])
def update_job(job_id):
    """Update an existing job"""
    # Check if job exists
    existing_job = job_repository.get_job(job_id)
    
    if not existing_job:
        return jsonify({"error": "Job not found"}), 404
    
    data = request.json
    
    # Update job using repository
    updated_job = job_repository.update_job(job_id, data)
    
    if not updated_job:
        return jsonify({"error": "Failed to update job"}), 500
    
    return jsonify(updated_job)

@jobs_bp.route('/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job"""
    # Check if job exists
    existing_job = job_repository.get_job(job_id)
    
    if not existing_job:
        return jsonify({"error": "Job not found"}), 404
    
    # Delete job using repository
    success = job_repository.delete_job(job_id)
    
    if not success:
        return jsonify({"error": "Failed to delete job"}), 500
    
    return jsonify({"message": "Job deleted successfully"}), 200

@jobs_bp.route('/search', methods=['GET'])
def search_jobs():
    """Search jobs by criteria"""
    # Get search parameters
    query = request.args.get('query')
    skills_str = request.args.get('skills')
    location = request.args.get('location')
    employment_type = request.args.get('employmentType')
    
    # Parse skills if provided
    skills = skills_str.split(',') if skills_str else None
    
    # Search jobs using repository
    jobs = job_repository.search_jobs(
        query=query,
        skills=skills,
        location=location,
        employment_type=employment_type
    )
    
    return jsonify(jobs)
