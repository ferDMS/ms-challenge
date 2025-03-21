from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
from .ai_search_service import AISearchService

class JobMatchingService:
    """Service to handle job matching using AI capabilities"""
    
    def __init__(self):
        """Initialize the job matching service"""
        self.ai_search = AISearchService()
    
    def calculate_compatibility(self, participant_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate compatibility between a participant and a job
        
        Args:
            participant_data: Participant profile data
            job_data: Job data
            
        Returns:
            Dictionary with match score and compatibility elements
        """
        # This is a template implementation that will be enhanced with AI
        
        # Calculate skill match
        participant_skills = []
        if 'skills' in participant_data:
            if 'technical' in participant_data['skills']:
                participant_skills.extend(participant_data['skills']['technical'])
            if 'soft' in participant_data['skills']:
                participant_skills.extend(participant_data['skills']['soft'])
        
        job_skills = job_data.get('requiredSkills', [])
        
        # Count matching skills
        matching_skills = [skill for skill in participant_skills if skill in job_skills]
        skill_match_score = 0
        if job_skills:
            skill_match_score = min(100, int((len(matching_skills) / len(job_skills)) * 100))
        
        # Location match
        location_match_score = 0
        preferred_locations = participant_data.get('preferredLocations', [])
        job_location = job_data.get('location', '')
        
        for location in preferred_locations:
            if location.lower() in job_location.lower():
                location_match_score = 100
                break
        
        # Industry match
        industry_match_score = 0
        preferred_industries = participant_data.get('preferredIndustries', [])
        job_industry = job_data.get('industry', '')
        
        if job_industry in preferred_industries:
            industry_match_score = 100
        
        # Accommodations match
        accommodations_match_score = 0
        needed_accommodations = participant_data.get('accommodationsNeeded', [])
        available_accommodations = job_data.get('availableAccommodations', [])
        
        matching_accommodations = [acc for acc in needed_accommodations 
                                 if any(avail.lower() in acc.lower() for avail in available_accommodations)]
        if needed_accommodations:
            accommodations_match_score = min(100, int((len(matching_accommodations) / len(needed_accommodations)) * 100))
        
        # Template for compatibility elements that will be enhanced with AI
        compatibility_elements = [
            {
                "category": "skills",
                "factor": "Required skills match",
                "score": skill_match_score,
                "reasoning": f"Participant has {len(matching_skills)} of {len(job_skills)} required skills" 
                            if job_skills else "No skills required for this job"
            },
            {
                "category": "location",
                "factor": "Location preference",
                "score": location_match_score,
                "reasoning": "Job location matches participant's preferred areas" 
                            if location_match_score > 0 else "Job location is not in participant's preferred areas"
            },
            {
                "category": "industry",
                "factor": "Industry preference",
                "score": industry_match_score,
                "reasoning": "Job industry matches participant's preferred industries" 
                            if industry_match_score > 0 else "Job industry is not in participant's preferred industries"
            },
            {
                "category": "accommodations",
                "factor": "Available accommodations",
                "score": accommodations_match_score,
                "reasoning": f"Job provides {len(matching_accommodations)} of {len(needed_accommodations)} needed accommodations" 
                            if needed_accommodations else "No specific accommodations needed"
            }
        ]
        
        # Calculate weighted average - these weights could be adjusted by AI
        weights = {"skills": 0.4, "location": 0.2, "industry": 0.2, "accommodations": 0.2}
        total_score = sum(element["score"] * weights[element["category"]] for element in compatibility_elements)
        
        return {
            "matchScore": int(total_score),
            "compatibilityElements": compatibility_elements
        }
    
    def find_matches_for_participant(self, participant_id: str, participant_data: Dict[str, Any], 
                                    limit: int = 10) -> List[Dict[str, Any]]:
        """
        Find best job matches for a participant
        
        Args:
            participant_id: ID of the participant
            participant_data: Participant profile data
            limit: Maximum number of matches to return
            
        Returns:
            List of job matches with compatibility scores
        """
        print(f"Finding matches for participant {participant_id}")
        
        # Get sample job matches from the AI Search service
        job_matches = self.ai_search.find_job_matches(participant_data, limit)
        
        # Transform job data into JobMatch format
        results = []
        for job in job_matches:
            # Calculate detailed compatibility using our service
            compatibility = self.calculate_compatibility(participant_data, job)
            
            # Create a job match object
            match = {
                "id": str(uuid.uuid4()),
                "participantId": participant_id,
                "jobId": job["id"],
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
                "source": "system-generated",
                "matchScore": compatibility["matchScore"],
                "compatibilityElements": compatibility["compatibilityElements"],
                "status": "suggested",
                "statusHistory": [
                    {
                        "status": "suggested", 
                        "date": datetime.now().isoformat(),
                        "notes": "Automatically suggested by the system"
                    }
                ],
                "jobReference": {
                    "title": job["title"],
                    "employer": job["employer"],
                    "companyName": job["companyName"],
                    "location": job["location"],
                    "employmentType": job["employmentType"],
                    "shortDescription": job["shortDescription"],
                    "salary": job["salary"],
                    "postedDate": job["postedDate"]
                },
                "participantReference": {
                    "fullName": participant_data.get("fullName", ""),
                    "email": participant_data.get("email", ""),
                    "disabilityType": participant_data.get("disabilityType", ""),
                    "currentStatus": participant_data.get("currentStatus", "")
                },
                "recommendedActions": ["Review job details", "Discuss with coach"]
            }
            
            results.append(match)
        
        return results
    
    def find_matches_for_job(self, job_id: str, job_data: Dict[str, Any], 
                           limit: int = 10) -> List[Dict[str, Any]]:
        """
        Find participants that match a job
        
        Args:
            job_id: ID of the job
            job_data: Job data
            limit: Maximum number of matches to return
            
        Returns:
            List of participant matches with compatibility scores
        """
        print(f"Finding matches for job {job_id}")
        
        # This would normally search for matching participants
        # For now, return an empty list as this is for a future implementation
        return []
