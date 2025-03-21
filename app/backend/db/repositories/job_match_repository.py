from ..cosmos_client import get_cosmos_client, get_database, get_container
from ..config import CONTAINERS, DB_NAME
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from db.models.job_match import JobMatchStatus, MatchSource
from services.job_matcher_.job_matching_service import JobMatchingService

class JobMatchRepository:
    def __init__(self):
        client = get_cosmos_client()
        database = get_database(client, DB_NAME)
        container_config = CONTAINERS['job_matches']
        self.container = get_container(
            database, 
            container_config['name'], 
            container_config['partition_key']
        )
        self.jobs_container = get_container(
            database,
            CONTAINERS['jobs']['name'],
            CONTAINERS['jobs']['partition_key']
        )
        self.participants_container = get_container(
            database,
            CONTAINERS['participants']['name'],
            CONTAINERS['participants']['partition_key']
        )
        
        # Initialize the job matching service
        self.job_matching = JobMatchingService()

    def get_all_job_matches(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all job matches with pagination"""
        query = f"SELECT TOP {limit} * FROM c ORDER BY c.updatedAt DESC"
        matches = list(self.container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))
        return matches

    def get_job_match(self, match_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific job match by ID"""
        try:
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": match_id}]
            items = list(self.container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving job match: {e}")
            return None

    def create_job_match(self, match_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new job match"""
        # Generate ID if not provided
        if 'id' not in match_data:
            match_data['id'] = str(uuid.uuid4())
        
        # Set timestamps
        now = datetime.utcnow().isoformat()
        match_data['createdAt'] = now
        match_data['updatedAt'] = now
        
        # Set default source if not specified
        if 'source' not in match_data:
            match_data['source'] = MatchSource.COACH_ASSIGNED
            
        # Initialize status history if needed
        if 'statusHistory' not in match_data:
            match_data['statusHistory'] = [{
                'status': match_data.get('status', JobMatchStatus.CONSIDERING),
                'date': now,
                'notes': 'Initial match created'
            }]
            
        # Get job and participant reference data
        if 'jobReference' not in match_data and 'jobId' in match_data:
            job = self._get_job_reference(match_data['jobId'])
            if job:
                match_data['jobReference'] = job
                
        if 'participantReference' not in match_data and 'participantId' in match_data:
            participant = self._get_participant_reference(match_data['participantId'])
            if participant:
                match_data['participantReference'] = participant
                
        # Initialize empty compatibility elements array if not provided
        if 'compatibilityElements' not in match_data:
            match_data['compatibilityElements'] = []
        
        return self.container.create_item(body=match_data)

    def update_job_match(self, match_id: str, match_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update job match data"""
        try:
            # First get existing job match
            existing = self.get_job_match(match_id)
            if not existing:
                return None
                
            # Update fields
            for key, value in match_data.items():
                if value is not None and key != 'id' and key != 'participantId' and key != 'jobId':
                    existing[key] = value
            
            # Update timestamp
            existing['updatedAt'] = datetime.utcnow().isoformat()
            
            # Save back to database
            return self.container.replace_item(
                item=match_id,
                body=existing
            )
        except Exception as e:
            print(f"Error updating job match: {e}")
            return None

    def update_job_match_status(self, match_id: str, status: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Update job match status and add to status history"""
        try:
            # First get existing job match
            existing = self.get_job_match(match_id)
            if not existing:
                return None
                
            # Update status
            now = datetime.utcnow().isoformat()
            existing['status'] = status
            existing['updatedAt'] = now
            
            # Add to status history
            status_entry = {
                'status': status,
                'date': now
            }
            
            if notes:
                status_entry['notes'] = notes
                
            if 'statusHistory' not in existing:
                existing['statusHistory'] = []
                
            existing['statusHistory'].append(status_entry)
            
            # Save back to database
            return self.container.replace_item(
                item=match_id,
                body=existing
            )
        except Exception as e:
            print(f"Error updating job match status: {e}")
            return None

    def get_job_matches_for_participant(self, participant_id: str) -> List[Dict[str, Any]]:
        """Get all job matches for a specific participant"""
        query = "SELECT * FROM c WHERE c.participantId = @participantId ORDER BY c.updatedAt DESC"
        params = [{"name": "@participantId", "value": participant_id}]
        
        matches = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
        
        return matches

    def get_job_matches_for_job(self, job_id: str) -> List[Dict[str, Any]]:
        """Get all job matches for a specific job"""
        query = "SELECT * FROM c WHERE c.jobId = @jobId"
        params = [{"name": "@jobId", "value": job_id}]
        
        matches = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
        
        return matches
        
    def get_job_matches_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get all job matches with a specific status"""
        query = "SELECT * FROM c WHERE c.status = @status"
        params = [{"name": "@status", "value": status}]
        
        matches = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
        
        return matches
        
    def _get_job_reference(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get simplified reference data for a job"""
        try:
            query = """
            SELECT 
                c.title, 
                c.employer, 
                c.companyName, 
                c.location, 
                c.employmentType, 
                c.shortDescription, 
                c.salary, 
                c.postedDate 
            FROM c 
            WHERE c.id = @id
            """
            params = [{"name": "@id", "value": job_id}]
            items = list(self.jobs_container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving job reference: {e}")
            return None
            
    def _get_participant_reference(self, participant_id: str) -> Optional[Dict[str, Any]]:
        """Get simplified reference data for a participant"""
        try:
            query = """
            SELECT 
                c.fullName, 
                c.email, 
                c.disabilityType, 
                c.currentStatus 
            FROM c 
            WHERE c.id = @id
            """
            params = [{"name": "@id", "value": participant_id}]
            items = list(self.participants_container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving participant reference: {e}")
            return None
            
    def calculate_compatibility(self, participant_id: str, job_id: str) -> Optional[Dict[str, Any]]:
        """Calculate compatibility between a participant and job"""
        try:
            # Get participant and job
            participant = self._get_participant(participant_id)
            job = self._get_job(job_id)
            
            if not participant or not job:
                return None
            
            # Use the job matching service
            return self.job_matching.calculate_compatibility(participant, job)
            
        except Exception as e:
            print(f"Error calculating compatibility: {e}")
            return None
            
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
            
    def _get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a job by ID"""
        try:
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": job_id}]
            items = list(self.jobs_container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving job: {e}")
            return None
