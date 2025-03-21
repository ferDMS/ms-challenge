from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import json
from . import job_matches_bp
from db.repositories.job_repository import JobRepository
from db.repositories.job_match_repository import JobMatchRepository
from db.models.job_match import JobMatchStatus, MatchSource
# Import the job matching service
from services.job_matches.main import run as run_job_matching_service

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
    
    # Get participant data
    participant = job_match_repository._get_participant(participant_id)
    if not participant:
        return jsonify({"error": "Participant not found"}), 404
    
    # Run job matching service using participant profile
    matching_results = run_job_matching_service(participant)
    
    # Transform results to expected format
    suggested_jobs = []
    
    # Extract participant attributes used in the analysis
    participant_attributes = extract_relevant_participant_attributes(participant)
    
    for match in matching_results.get('matches', []):
        job_details = match.get('job_details', {})
        job_id = job_details.get('id')
        match_score = int(match.get('match_score', 0) * 6.5)  # Scale match score to 0-100 range
        
        # Fetch complete job data from repository to access all fields
        complete_job = job_match_repository._get_job(job_id) or job_details
        
        # Create job object with required fields
        job = {
            "id": job_id,
            "title": job_details.get('title', ''),
            "employer": job_details.get('employer', ''),
            "location": job_details.get('location', ''),
            "employmentType": job_details.get('employmentType', ''),
            "shortDescription": job_details.get('description', '')[:200] + '...' if job_details.get('description') else '',
            "matchScore": match_score,
            "compatibilityElements": [],
            "participantAttributesUsed": participant_attributes
        }
        
        # Generate compatibility elements based on participant and job data
        compatibility_elements = generate_compatibility_elements(participant, complete_job, match_score)
        job["compatibilityElements"] = compatibility_elements[:5]  # Limit to 5 elements
        
        suggested_jobs.append(job)
    
    # Limit results as requested
    suggested_jobs = suggested_jobs[:limit]
    
    # Sort by match score (highest first)
    suggested_jobs.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
    
    return jsonify(suggested_jobs)

@job_matches_bp.route('/create-suggestion/<participant_id>/<job_id>', methods=['POST'])
def create_job_suggestion(participant_id, job_id):
    """Create a system-suggested job match"""
    # Get job and participant
    job = job_match_repository._get_job(job_id)
    participant = job_match_repository._get_participant(participant_id)
    
    if not job or not participant:
        return jsonify({"error": "Job or participant not found"}), 404
    
    # Run job matching to calculate compatibility
    matching_results = run_job_matching_service(participant)
    
    # Extract participant attributes used in the analysis
    participant_attributes = extract_relevant_participant_attributes(participant)
    
    # Find the specific job in results
    compatibility = None
    for match in matching_results.get('matches', []):
        if match.get('job_details', {}).get('id') == job_id:
            # Transform to expected format
            match_score = int(match.get('match_score', 0) * 6.5)  # Scale to 0-100
            
            # Generate compatibility elements
            compatibility_elements = generate_compatibility_elements(participant, job, match_score)
            
            compatibility = {
                "matchScore": match_score,
                "compatibilityElements": compatibility_elements[:5],  # Limit to 5 elements
                "participantAttributesUsed": participant_attributes
            }
            break
    
    if not compatibility:
        # If job not found in results, create a basic compatibility
        compatibility = {
            "matchScore": 50,  # Default score
            "compatibilityElements": [
                {
                    "category": "skills",
                    "factor": "Skills match",
                    "score": 50,
                    "reasoning": "Basic job match with limited information"
                },
                {
                    "category": "supportiveEnvironment",
                    "factor": "Workplace environment",
                    "score": 45,
                    "reasoning": "This job may offer a suitable working environment"
                }
            ],
            "participantAttributesUsed": participant_attributes
        }
    
    # Create match data
    match_data = {
        "participantId": participant_id,
        "jobId": job_id,
        "status": JobMatchStatus.SUGGESTED,
        "source": MatchSource.SYSTEM_GENERATED,
        "matchScore": compatibility["matchScore"],
        "compatibilityElements": compatibility["compatibilityElements"],
        "participantAttributesUsed": compatibility["participantAttributesUsed"]
    }
    
    # Create the match
    created_match = job_match_repository.create_job_match(match_data)
    return jsonify(created_match), 201

@job_matches_bp.route('/compatibility/<participant_id>/<job_id>', methods=['GET'])
def calculate_job_compatibility(participant_id, job_id):
    """Calculate compatibility between a participant and job"""
    # Get job and participant
    job = job_match_repository._get_job(job_id)
    participant = job_match_repository._get_participant(participant_id)
    
    if not job or not participant:
        return jsonify({"error": "Job or participant not found"}), 404
    
    # Run job matching to calculate compatibility
    matching_results = run_job_matching_service(participant)
    
    # Extract participant attributes used in the analysis
    participant_attributes = extract_relevant_participant_attributes(participant)
    
    # Find the specific job in results
    compatibility = None
    for match in matching_results.get('matches', []):
        if match.get('job_details', {}).get('id') == job_id:
            # Transform to expected format
            match_score = int(match.get('match_score', 0) * 6.5)  # Scale to 0-100
            
            # Generate compatibility elements
            compatibility_elements = generate_compatibility_elements(participant, job, match_score)
            
            compatibility = {
                "matchScore": match_score,
                "compatibilityElements": compatibility_elements[:5],  # Limit to 5 elements
                "participantAttributesUsed": participant_attributes
            }
            break
    
    if not compatibility:
        # If job not found in results, create a basic compatibility
        compatibility = {
            "matchScore": 50,  # Default score
            "compatibilityElements": [
                {
                    "category": "system",
                    "factor": "Basic match",
                    "score": 50,
                    "reasoning": "Basic job match with limited information"
                }
            ],
            "participantAttributesUsed": participant_attributes
        }
    
    return jsonify(compatibility)

def extract_relevant_participant_attributes(participant):
    """
    Extract the relevant participant attributes used in the matching analysis
    
    Args:
        participant: The participant data dictionary
        
    Returns:
        Dictionary containing only the attributes used in the matching algorithm
    """
    return {
        "primaryLanguage": participant.get("primaryLanguage", ""),
        "disabilityType": participant.get("disabilityType", ""),
        "accommodationsNeeded": participant.get("accommodationsNeeded", []),
        "transportationStatus": participant.get("transportationStatus", ""),
        "employmentGoal": participant.get("employmentGoal", ""),
        "desiredHours": participant.get("desiredHours", ""),
        "skills": {
            "technical": participant.get("skills", {}).get("technical", []),
            "soft": participant.get("skills", {}).get("soft", [])
        },
        "preferredLocations": participant.get("preferredLocations", []),
        "preferredIndustries": participant.get("preferredIndustries", []),
        "currentStatus": participant.get("currentStatus", "")
    }

def generate_compatibility_elements(participant, job, match_score):
    """
    Generate detailed compatibility elements based on participant and job data
    
    Args:
        participant: The participant data dictionary
        job: The job data dictionary
        match_score: The overall match score (0-100)
        
    Returns:
        List of compatibility elements
    """
    compatibility_elements = []
    base_score = max(15, min(95, int(match_score * 0.9)))
    job_description = job.get('description', '').lower()
    
    # 1. Location Compatibility
    participant_locations = participant.get('preferredLocations', [])
    job_location = job.get('location', '')
    if job_location and participant_locations:
        location_match = any(location.lower() in job_location.lower() or job_location.lower() in location.lower() 
                             for location in participant_locations)
        if location_match:
            compatibility_elements.append({
                "category": "location",
                "factor": "Location preference",
                "score": base_score,
                "reasoning": "Job location matches one of participant's preferred areas"
            })
        else:
            # Check if location is accessible by mentioned transportation
            transport = participant.get('transportationStatus', '').lower()
            if transport and any(transport_keyword in transport for transport_keyword in 
                               ['bus', 'metro', 'subway', 'train', 'bicycle', 'car', 'walk']):
                compatibility_elements.append({
                    "category": "transportationAccess",
                    "factor": "Transportation accessibility",
                    "score": max(15, base_score - 15),
                    "reasoning": f"Participant has transportation options that may work for this location"
                })
    
    # 2. Industry Match
    participant_industries = participant.get('preferredIndustries', [])
    job_industry = job.get('industry', '')
    if job_industry and participant_industries:
        industry_match = any(industry.lower() in job_industry.lower() or job_industry.lower() in industry.lower() 
                             for industry in participant_industries)
        if industry_match:
            compatibility_elements.append({
                "category": "industry",
                "factor": "Industry alignment",
                "score": base_score + 5,
                "reasoning": "Job industry matches participant's preferred industries"
            })
    
    # 3. Employment Type Match
    desired_hours = participant.get('desiredHours', '').lower()
    job_type = job.get('employmentType', '').lower()
    hours_per_week = job.get('hoursPerWeek', {})
    
    if job_type and desired_hours:
        employment_match = False
        if 'part' in job_type and any(keyword in desired_hours for keyword in ['part', '10-', '15-', '20-', 'flexible']):
            employment_match = True
        elif 'full' in job_type and any(keyword in desired_hours for keyword in ['30-', '35-', '40-', 'full']):
            employment_match = True
            
        if employment_match:
            compatibility_elements.append({
                "category": "employmentType",
                "factor": "Work schedule",
                "score": base_score,
                "reasoning": f"Job's {job_type} schedule aligns with participant's desired hours"
            })
        elif hours_per_week:
            min_hours = hours_per_week.get('min', 0)
            max_hours = hours_per_week.get('max', 40)
            hours_match = False
            
            # Extract numeric ranges from desired_hours
            import re
            hours_numbers = re.findall(r'(\d+)', desired_hours)
            if len(hours_numbers) >= 2:
                desired_min = int(hours_numbers[0])
                desired_max = int(hours_numbers[1])
                
                # Check for overlap in ranges
                if (min_hours <= desired_max and max_hours >= desired_min):
                    compatibility_elements.append({
                        "category": "hoursPerWeek",
                        "factor": "Working hours match",
                        "score": base_score - 5,
                        "reasoning": f"Job's {min_hours}-{max_hours} hours/week has some overlap with participant's desired {desired_min}-{desired_max} hours"
                    })
    
    # 4. Skills Match
    participant_skills = []
    if participant.get('skills', {}).get('technical'):
        participant_skills.extend(participant.get('skills', {}).get('technical', []))
    if participant.get('skills', {}).get('soft'):
        participant_skills.extend(participant.get('skills', {}).get('soft', []))
    
    job_skills = job.get('requiredSkills', [])
    
    if participant_skills and job_skills:
        matching_skills = [skill for skill in participant_skills 
                          if any(job_skill.lower() in skill.lower() or skill.lower() in job_skill.lower() 
                                for job_skill in job_skills)]
        
        if matching_skills:
            compatibility_elements.append({
                "category": "skills",
                "factor": "Skills match",
                "score": min(base_score + 10, 95),
                "reasoning": f"Participant has {len(matching_skills)} relevant skills: {', '.join(matching_skills[:3])}"
            })
    
    # 5. Accommodations Match
    participant_accommodations = participant.get('accommodationsNeeded', [])
    job_accommodations = job.get('availableAccommodations', [])
    
    if participant_accommodations and job_accommodations:
        matching_accommodations = [acc for acc in participant_accommodations 
                                  if any(job_acc.lower() in acc.lower() or acc.lower() in job_acc.lower() 
                                        for job_acc in job_accommodations)]
        
        if matching_accommodations:
            compatibility_elements.append({
                "category": "availableAccommodations",
                "factor": "Accommodation support",
                "score": min(base_score + 15, 95),  # Higher score for accommodation matches
                "reasoning": f"Job offers accommodations that match participant's needs: {', '.join(matching_accommodations[:2])}"
            })
    
    # 6. Supportive Environment
    disability_type = participant.get('disabilityType', '').lower()
    supportive_env = job.get('supportiveEnvironment', [])
    
    if disability_type and supportive_env:
        relevant_support = []
        
        # Map disability types to relevant support features
        if 'autism' in disability_type or 'asd' in disability_type:
            keywords = ['clear instructions', 'routine', 'predictable', 'sensory', 'structure']
        elif 'intellectual' in disability_type:
            keywords = ['simple instructions', 'training', 'step-by-step', 'mentor', 'patient']
        elif 'learning' in disability_type:
            keywords = ['written instructions', 'additional time', 'alternative formats', 'training']
        elif 'physical' in disability_type:
            keywords = ['accessible', 'ergonomic', 'assistance', 'adaptive equipment']
        else:
            keywords = ['training', 'inclusive', 'supportive', 'mentoring']
            
        for support in supportive_env:
            if any(keyword in support.lower() for keyword in keywords):
                relevant_support.append(support)
                
        if relevant_support:
            compatibility_elements.append({
                "category": "supportiveEnvironment",
                "factor": "Supportive workplace",
                "score": min(base_score + 5, 95),
                "reasoning": f"Job offers support features relevant to participant's needs: {', '.join(relevant_support[:2])}"
            })
    
    # 7. Employment Goal Match
    employment_goal = participant.get('employmentGoal', '').lower()
    if employment_goal:
        job_title = job.get('title', '').lower()
        job_industry = job.get('industry', '').lower()
        job_department = job.get('department', '').lower()
        
        goal_keywords = employment_goal.split()
        goal_match = any(keyword in job_title or keyword in job_industry or keyword in job_department 
                         for keyword in goal_keywords if len(keyword) > 3)
        
        if goal_match:
            compatibility_elements.append({
                "category": "employmentGoal",
                "factor": "Career goal alignment",
                "score": min(base_score + 8, 95),
                "reasoning": f"Job aligns with participant's stated employment goal: '{employment_goal}'"
            })
    
    # 8. Accessibility Features
    participant_disability = participant.get('disabilityType', '').lower()
    job_accessibility = job.get('accessibilityFeatures', [])
    
    if participant_disability and job_accessibility:
        relevant_features = []
        
        # Map disability types to relevant accessibility features
        if 'physical' in participant_disability or 'mobility' in participant_disability:
            keywords = ['ramp', 'elevator', 'parking', 'wheelchair', 'ground floor', 'accessible']
        elif 'visual' in participant_disability or 'blind' in participant_disability:
            keywords = ['screen reader', 'braille', 'audio', 'guidance']
        elif 'hearing' in participant_disability or 'deaf' in participant_disability:
            keywords = ['visual alerts', 'sign language', 'written', 'captioning']
        else:
            keywords = ['accessible', 'rest areas', 'quiet space', 'accommodations']
            
        for feature in job_accessibility:
            if any(keyword in feature.lower() for keyword in keywords):
                relevant_features.append(feature)
                
        if relevant_features:
            compatibility_elements.append({
                "category": "accessibilityFeatures",
                "factor": "Accessibility match",
                "score": min(base_score + 10, 95),
                "reasoning": f"Job has accessibility features for participant's needs: {', '.join(relevant_features)}"
            })
    
    # 9. Schedule Flexibility
    participant_accommodations = [acc.lower() for acc in participant.get('accommodationsNeeded', [])]
    job_schedule = job.get('schedule', [])
    
    schedule_needs = any('schedule' in acc or 'routine' in acc or 'break' in acc 
                          or 'hour' in acc or 'time' in acc for acc in participant_accommodations)
    
    if schedule_needs and job_schedule:
        schedule_matches = []
        for schedule_item in job_schedule:
            if 'flexible' in schedule_item.lower():
                schedule_matches.append('flexible scheduling')
            if 'break' in schedule_item.lower():
                schedule_matches.append('regular breaks')
            if any(time_period in schedule_item.lower() for time_period in ['morning', 'afternoon', 'evening']):
                schedule_matches.append(f"{schedule_item} available")
                
        if schedule_matches:
            compatibility_elements.append({
                "category": "schedule",
                "factor": "Schedule compatibility",
                "score": base_score,
                "reasoning": f"Job offers scheduling options that may work for participant: {', '.join(schedule_matches)}"
            })
    
    # 10. Employment History Relevance
    work_history = participant.get('workHistory', [])
    
    if work_history:
        job_title = job.get('title', '').lower()
        job_industry = job.get('industry', '').lower()
        job_department = job.get('department', '').lower()
        relevant_experience = []
        
        for work in work_history:
            position = work.get('position', '').lower()
            employer = work.get('employer', '').lower()
            resp = ' '.join(work.get('responsibilities', [])).lower()
            
            if any(keyword in job_title or keyword in job_industry or keyword in job_department 
                  for keyword in position.split() if len(keyword) > 3):
                relevant_experience.append(f"similar role at {work.get('employer')}")
            elif any(resp_keyword in job_description for resp_keyword in resp.split() if len(resp_keyword) > 3):
                relevant_experience.append(f"relevant responsibilities at {work.get('employer')}")
                
        if relevant_experience:
            compatibility_elements.append({
                "category": "workHistory",
                "factor": "Relevant experience",
                "score": min(base_score + 5, 95),
                "reasoning": f"Participant has relevant past work experience: {', '.join(relevant_experience)}"
            })
    
    # Add a general language match if relevant
    participant_language = participant.get('primaryLanguage', '').lower()
    if participant_language and ('spanish' in participant_language or 'español' in participant_language):
        # Check if job description has Spanish indicators
        if 'español' in job_description or 'spanish speaking' in job_description or 'bilingüe' in job_description:
            compatibility_elements.append({
                "category": "language",
                "factor": "Language compatibility",
                "score": base_score + 5,
                "reasoning": "Job appears to match participant's primary language (Spanish)"
            })
    
    # If no compatibility elements were generated, add a basic one
    if not compatibility_elements:
        compatibility_elements.append({
            "category": "overallMatch",
            "factor": "Overall job match",
            "score": max(15, match_score - 15),
            "reasoning": "Based on general compatibility between job requirements and participant profile"
        })
    
    # Sort by score (highest first) and return
    compatibility_elements.sort(key=lambda x: x["score"], reverse=True)
    return compatibility_elements
