from typing import List, Dict, Any, Optional
import os
import random
import uuid
from datetime import datetime, timedelta

class AISearchService:
    """Service to provide sample job data (no Azure services used)"""
    
    def __init__(self):
        """Initialize the mock AI Search service"""
        # Sample data setup
        self.sample_jobs = self._generate_sample_jobs()
    
    def _generate_sample_jobs(self, count: int = 20) -> List[Dict[str, Any]]:
        """Generate a list of sample job data"""
        job_titles = [
            "Software Developer", "Project Manager", "Customer Service Representative",
            "Administrative Assistant", "Data Analyst", "Graphic Designer",
            "Marketing Specialist", "Sales Associate", "HR Coordinator", "Accountant"
        ]
        
        companies = [
            "Tech Innovations", "Global Solutions", "Creative Designs",
            "Financial Partners", "Healthcare Systems", "Retail Enterprises",
            "Educational Services", "Manufacturing Industries", "Consulting Group", "Media Productions"
        ]
        
        locations = [
            "Seattle, WA", "San Francisco, CA", "New York, NY", "Austin, TX",
            "Chicago, IL", "Denver, CO", "Boston, MA", "Atlanta, GA",
            "Portland, OR", "Miami, FL"
        ]
        
        industries = [
            "Technology", "Healthcare", "Finance", "Education", "Retail",
            "Manufacturing", "Media", "Consulting", "Hospitality", "Government"
        ]
        
        employment_types = ["Full-time", "Part-time", "Contract", "Temporary", "Remote"]
        
        skills_pool = [
            "Python", "JavaScript", "Communication", "Project Management", "Customer Service",
            "Microsoft Office", "Data Analysis", "Graphic Design", "Marketing", "Sales",
            "Problem Solving", "Teamwork", "Leadership", "Organization", "Writing",
            "Research", "Presentation", "Creativity", "Time Management", "Adaptability"
        ]
        
        accommodations = [
            "Flexible Schedule", "Remote Work", "Accessible Workplace", "Assistive Technology",
            "Modified Equipment", "Transportation Assistance", "Sign Language Interpreter",
            "Screen Reader Compatible", "Ergonomic Furniture", "Quiet Workspace"
        ]
        
        jobs = []
        now = datetime.now()
        
        for i in range(count):
            job_title = random.choice(job_titles)
            company = random.choice(companies)
            location = random.choice(locations)
            industry = random.choice(industries)
            
            # Generate a random set of required skills
            required_skills = random.sample(skills_pool, random.randint(3, 8))
            
            # Generate random accommodations
            available_accommodations = random.sample(accommodations, random.randint(1, 5))
            
            # Generate a random salary
            salary = random.randint(3, 15) * 10000
            
            # Generate a random posted date within the last 30 days
            posted_days_ago = random.randint(0, 30)
            posted_date = (now - timedelta(days=posted_days_ago)).isoformat()
            
            job = {
                "id": str(uuid.uuid4()),
                "title": job_title,
                "employer": company,
                "companyName": company,
                "location": location,
                "industry": industry,
                "employmentType": random.choice(employment_types),
                "salary": salary,
                "requiredSkills": required_skills,
                "availableAccommodations": available_accommodations,
                "shortDescription": f"We are seeking a {job_title} to join our team at {company}.",
                "postedDate": posted_date,
                "applicationDeadline": (now + timedelta(days=random.randint(7, 60))).isoformat()
            }
            
            jobs.append(job)
        
        return jobs
    
    def search_jobs(self, query: str, filters: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Return sample jobs matching the query
        
        Args:
            query: The search query text
            filters: OData filter expression (ignored in mock implementation)
            limit: Maximum number of results to return
        
        Returns:
            List of sample job documents
        """
        # Simple filtering based on query text
        results = []
        query_lower = query.lower()
        
        # If query is empty or *, return all jobs
        if not query or query == "*":
            results = self.sample_jobs.copy()
        else:
            # Basic filtering by title, company, or location
            for job in self.sample_jobs:
                if (query_lower in job["title"].lower() or
                    query_lower in job["companyName"].lower() or
                    query_lower in job["location"].lower() or
                    any(query_lower in skill.lower() for skill in job["requiredSkills"])):
                    results.append(job)
        
        # Randomize and limit results
        random.shuffle(results)
        return results[:limit]
    
    def find_job_matches(self, participant_data: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
        """
        Find sample jobs that match a participant's profile
        
        Args:
            participant_data: Participant profile data with skills, preferences, etc.
            limit: Maximum number of matches to return
            
        Returns:
            List of matching job documents with match scores
        """
        matches = []
        
        # Extract participant information for matching
        participant_skills = []
        if 'skills' in participant_data:
            if 'technical' in participant_data['skills']:
                participant_skills.extend(participant_data['skills']['technical'])
            if 'soft' in participant_data['skills']:
                participant_skills.extend(participant_data['skills']['soft'])
        
        preferred_locations = participant_data.get('preferredLocations', [])
        preferred_industries = participant_data.get('preferredIndustries', [])
        
        # Calculate simple match scores for each job
        for job in self.sample_jobs:
            match_score = 0
            
            # Skill match (weighted heavily)
            job_skills = job.get("requiredSkills", [])
            matching_skills = [skill for skill in participant_skills if skill in job_skills]
            skill_match = len(matching_skills) / max(len(job_skills), 1) if job_skills else 0
            match_score += skill_match * 50  # 50% weight to skills
            
            # Location match
            location_match = 0
            for location in preferred_locations:
                if location.lower() in job["location"].lower():
                    location_match = 1
                    break
            match_score += location_match * 25  # 25% weight to location
            
            # Industry match
            industry_match = 1 if job["industry"] in preferred_industries else 0
            match_score += industry_match * 25  # 25% weight to industry
            
            # Add job to matches with score
            job_copy = job.copy()
            job_copy["matchScore"] = int(match_score)
            matches.append(job_copy)
        
        # Sort by match score (descending) and limit results
        matches.sort(key=lambda x: x["matchScore"], reverse=True)
        return matches[:limit]
