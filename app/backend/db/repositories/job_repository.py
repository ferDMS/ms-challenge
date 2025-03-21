from ..cosmos_client import get_cosmos_client, get_database, get_container
from ..config import CONTAINERS, DB_NAME
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

class JobRepository:
    def __init__(self):
        client = get_cosmos_client()
        database = get_database(client, DB_NAME)
        container_config = CONTAINERS['jobs']
        self.container = get_container(
            database, 
            container_config['name'], 
            container_config['partition_key']
        )
        self.job_matches_container = get_container(
            database,
            CONTAINERS['job_matches']['name'],
            CONTAINERS['job_matches']['partition_key']
        )
        self.participants_container = get_container(
            database,
            CONTAINERS['participants']['name'],
            CONTAINERS['participants']['partition_key']
        )

    def get_all_jobs(self, 
                    status: Optional[str] = None, 
                    employment_type: Optional[str] = None,
                    industry: Optional[str] = None,
                    location: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all jobs with optional filtering"""
        query_parts = ["SELECT * FROM c"]
        params = []
        
        # Build WHERE clause dynamically based on provided filters
        where_clauses = []
        param_index = 0
        
        if status and status != "all":
            param_index += 1
            where_clauses.append(f"c.status = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": status})
            
        if employment_type and employment_type != "all":
            param_index += 1
            where_clauses.append(f"c.employmentType = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": employment_type})
            
        if industry and industry != "all":
            param_index += 1
            where_clauses.append(f"c.industry = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": industry})
        
        if location and location != "all":
            param_index += 1
            # Use CONTAINS for more flexible location matching
            where_clauses.append(f"CONTAINS(LOWER(c.location), LOWER(@p{param_index}))")
            params.append({"name": f"@p{param_index}", "value": location})
        
        # Combine all where clauses
        if where_clauses:
            query_parts.append("WHERE " + " AND ".join(where_clauses))
        
        query = " ".join(query_parts)
        
        items = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
            
        return items

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific job by ID"""
        try:
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": job_id}]
            items = list(self.container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving job: {e}")
            return None

    def create_job(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new job"""
        if 'id' not in job_data:
            job_data['id'] = str(uuid.uuid4())
        
        if 'postedDate' not in job_data:
            job_data['postedDate'] = datetime.utcnow().isoformat()
            
        job_data['createdAt'] = datetime.utcnow().isoformat()
        job_data['updatedAt'] = job_data['createdAt']
        
        return self.container.create_item(body=job_data)

    def update_job(self, job_id: str, job_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing job"""
        try:
            # First get existing job
            existing = self.get_job(job_id)
            if not existing:
                return None
                
            # Update fields
            for key, value in job_data.items():
                if value is not None:  # Only update non-None values
                    existing[key] = value
            
            # Update timestamp
            existing['updatedAt'] = datetime.utcnow().isoformat()
            
            # Save back to database
            return self.container.replace_item(
                item=job_id,
                body=existing
            )
        except Exception as e:
            print(f"Error updating job: {e}")
            return None

    def delete_job(self, job_id: str) -> bool:
        """Delete a job"""
        try:
            self.container.delete_item(
                item=job_id, 
                partition_key=job_id
            )
            return True
        except Exception as e:
            print(f"Error deleting job: {e}")
            return False
            
    def search_jobs(self, 
                  query: Optional[str] = None,
                  skills: Optional[List[str]] = None,
                  location: Optional[str] = None,
                  employment_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search jobs by various criteria"""
        # In the future, this will use AI Search for more intelligent results
        # For now, we'll keep the existing implementation
        
        query_parts = ["SELECT * FROM c"]
        params = []
        
        # Build WHERE clause dynamically based on provided search criteria
        where_clauses = []
        param_index = 0
        
        # Search by text query (title, description, company)
        if query:
            param_index += 1
            where_clauses.append(f"""(
                CONTAINS(LOWER(c.title), LOWER(@p{param_index})) OR 
                CONTAINS(LOWER(c.description), LOWER(@p{param_index})) OR 
                CONTAINS(LOWER(c.shortDescription), LOWER(@p{param_index})) OR
                CONTAINS(LOWER(c.companyName), LOWER(@p{param_index}))
            )""")
            params.append({"name": f"@p{param_index}", "value": query})
        
        # Filter by location
        if location:
            param_index += 1
            where_clauses.append(f"CONTAINS(LOWER(c.location), LOWER(@p{param_index}))")
            params.append({"name": f"@p{param_index}", "value": location})
        
        # Filter by employment type
        if employment_type:
            param_index += 1
            where_clauses.append(f"c.employmentType = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": employment_type})
        
        # Filter by required skills
        if skills and len(skills) > 0:
            skill_conditions = []
            for skill in skills:
                param_index += 1
                # Check if skill is in the requiredSkills array
                skill_conditions.append(f"ARRAY_CONTAINS(c.requiredSkills, @p{param_index})")
                params.append({"name": f"@p{param_index}", "value": skill})
            
            # If we have multiple skills, match any of them
            where_clauses.append("(" + " OR ".join(skill_conditions) + ")")
        
        # Combine all where clauses
        if where_clauses:
            query_parts.append("WHERE " + " AND ".join(where_clauses))
        
        # Only return active jobs by default
        if not where_clauses:
            query_parts.append("WHERE c.status = 'active'")
        elif all("c.status" not in clause for clause in where_clauses):
            query_parts[-1] += " AND c.status = 'active'"
        
        query = " ".join(query_parts)
        
        items = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
            
        return items
    
    def get_job_suggestions_for_participant(self, participant_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get job suggestions for a specific participant based on skills and preferences"""
        # This will eventually use the AI Search service
        # For now, we'll use a basic implementation
        
        try:
            # Get the participant data
            participant = self._get_participant(participant_id)
            if not participant:
                return []
                
            # Get active jobs
            query = "SELECT TOP @limit * FROM c WHERE c.status = 'active' ORDER BY c.postedDate DESC"
            params = [{"name": "@limit", "value": limit}]
            
            jobs = list(self.container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            # Calculate compatibility for each job
            for job in jobs:
                compatibility = self.job_matching.calculate_compatibility(participant, job)
                job["matchScore"] = compatibility["matchScore"]
                job["compatibilityElements"] = compatibility["compatibilityElements"]
            
            # Sort by match score
            jobs.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
            
            return jobs
            
        except Exception as e:
            print(f"Error getting job suggestions: {e}")
            return []
    
    def _get_participant(self, participant_id: str) -> Optional[Dict[str, Any]]:
        """Get a participant by ID"""
        try:
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": participant_id}]
            items = list(self.participants_container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving participant: {e}")
            return None
