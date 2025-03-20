from ..cosmos_client import get_cosmos_client, get_database, get_container
from ..config import CONTAINERS, DB_NAME
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

class ParticipantRepository:
    def __init__(self):
        client = get_cosmos_client()
        database = get_database(client, DB_NAME)
        container_config = CONTAINERS['participants']
        self.container = get_container(
            database, 
            container_config['name'], 
            container_config['partition_key']
        )
        self.sessions_container = get_container(
            database,
            CONTAINERS['sessions']['name'],
            CONTAINERS['sessions']['partition_key']
        )

    def map_to_preview(self, participant: Dict[str, Any]) -> Dict[str, Any]:
        """Convert a full participant record to preview format"""
        preview = {
            "id": participant["id"],
            "fullName": participant["fullName"],
            "email": participant["email"],
            "disabilityType": participant["disabilityType"],
            "currentStatus": participant["currentStatus"],
            "employmentGoal": participant["employmentGoal"],
        }
        
        # Add optional fields if present
        if "avatar" in participant:
            preview["avatar"] = participant["avatar"]
        
        # Calculate job match count
        preview["jobMatchCount"] = len(participant.get("jobMatches", []))
        
        # Session count will be filled in separately when needed
        preview["sessionCount"] = 0
        
        return preview

    def get_all_participants(self, 
                           status: Optional[str] = None, 
                           disability_type: Optional[str] = None,
                           skill_type: Optional[str] = None,
                           coach_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all participants with optional filtering"""
        query_parts = ["SELECT * FROM c"]
        params = []
        
        # Build WHERE clause dynamically based on provided filters
        where_clauses = []
        param_index = 0
        
        if status and status != "all":
            param_index += 1
            where_clauses.append(f"c.currentStatus = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": status})
            
        if disability_type and disability_type != "all":
            param_index += 1
            where_clauses.append(f"c.disabilityType = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": disability_type})
            
        if coach_id:
            param_index += 1
            where_clauses.append(f"c.coachId = @p{param_index}")
            params.append({"name": f"@p{param_index}", "value": coach_id})
        
        # Add skill filter (more complex since skills is an array property)
        if skill_type and skill_type != "all":
            param_index += 1
            where_clauses.append(f"ARRAY_LENGTH(c.skills.{skill_type}) > 0")
        
        # Combine all where clauses
        if where_clauses:
            query_parts.append("WHERE " + " AND ".join(where_clauses))
        
        query = " ".join(query_parts)
        
        items = list(self.container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
        
        # Convert to preview format
        previews = [self.map_to_preview(item) for item in items]
        
        # Get session counts for each participant
        for preview in previews:
            preview["sessionCount"] = self.get_session_count(preview["id"])
            
        return previews

    def get_session_count(self, participant_id: str) -> int:
        """Get the count of sessions for a participant"""
        query = "SELECT VALUE COUNT(1) FROM c WHERE c.participantId = @participantId"
        params = [{"name": "@participantId", "value": participant_id}]
        
        try:
            results = list(self.sessions_container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            return results[0] if results else 0
        except Exception:
            # If there's an error, just return 0
            return 0

    def get_participant(self, participant_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific participant by ID"""
        try:
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": participant_id}]
            items = list(self.container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True
            ))
            
            return items[0] if items else None
        except Exception as e:
            print(f"Error retrieving participant: {e}")
            return None

    def create_participant(self, participant_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new participant"""
        if 'id' not in participant_data:
            participant_data['id'] = str(uuid.uuid4())
        
        participant_data['createdAt'] = datetime.utcnow().isoformat()
        participant_data['updatedAt'] = participant_data['createdAt']
        
        return self.container.create_item(body=participant_data)

    def update_participant(self, participant_id: str, participant_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing participant"""
        try:
            # First get existing participant
            existing = self.get_participant(participant_id)
            if not existing:
                return None
                
            # Update fields
            for key, value in participant_data.items():
                if value is not None:  # Only update non-None values
                    existing[key] = value
            
            # Update timestamp
            existing['updatedAt'] = datetime.utcnow().isoformat()
            
            # Save back to database
            return self.container.replace_item(
                item=participant_id,
                body=existing
            )
        except Exception as e:
            print(f"Error updating participant: {e}")
            return None

    def delete_participant(self, participant_id: str) -> bool:
        """Delete a participant"""
        try:
            self.container.delete_item(
                item=participant_id, 
                partition_key=participant_id
            )
            return True
        except Exception as e:
            print(f"Error deleting participant: {e}")
            return False

    def get_participant_sessions(self, participant_id: str) -> List[Dict[str, Any]]:
        """Get all sessions for a specific participant"""
        query = "SELECT * FROM c WHERE c.participantId = @participantId"
        params = [{"name": "@participantId", "value": participant_id}]
        
        sessions = list(self.sessions_container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))
        
        return sessions

    def get_participant_job_matches(self, participant_id: str) -> List[Dict[str, Any]]:
        """Get job matches for a specific participant"""
        participant = self.get_participant(participant_id)
        if not participant:
            return []
        
        return participant.get("jobMatches", [])
