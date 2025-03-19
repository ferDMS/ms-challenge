from ..cosmos_client import get_cosmos_client, get_database, get_container
from ..config import CONTAINERS, DB_NAME
import uuid

class SessionRepository:
    def __init__(self):
        client = get_cosmos_client()
        database = get_database(client, DB_NAME)
        container_config = CONTAINERS['sessions']
        self.container = get_container(
            database, 
            container_config['name'], 
            container_config['partition_key']
        )

    def get_all_sessions(self, coach_id=None, participant_id=None, status=None, session_type=None):
        """Get all sessions with optional filtering"""
        query = "SELECT * FROM c"
        parameters = []
        where_clauses = []
        
        if coach_id:
            where_clauses.append("c.coachId = @coachId")
            parameters.append({"name": "@coachId", "value": coach_id})
        
        if participant_id:
            where_clauses.append("c.participantId = @participantId")
            parameters.append({"name": "@participantId", "value": participant_id})
        
        if status:
            where_clauses.append("c.status = @status")
            parameters.append({"name": "@status", "value": status})
        
        if session_type:
            where_clauses.append("c.type = @type")
            parameters.append({"name": "@type", "value": session_type})
        
        if where_clauses:
            query += " WHERE " + " AND ".join(where_clauses)
        
        results = list(self.container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        
        return results
        
    def get_session(self, session_id):
        """Get a specific session by ID"""
        try:
            return self.container.read_item(
                item=session_id,
                partition_key=session_id
            )
        except Exception as e:
            print(f"Error retrieving session: {e}")
            return None

    def create_session(self, session_data):
        """Create a new session"""
        if 'id' not in session_data:
            session_data['id'] = f"session-{uuid.uuid4().hex[:8]}"
        
        return self.container.create_item(body=session_data)

    def update_session(self, session_id, session_data):
        """Update an existing session"""
        try:
            session_data['id'] = session_id
            return self.container.replace_item(
                item=session_id,
                body=session_data
            )
        except Exception as e:
            print(f"Error updating session: {e}")
            return None

    def delete_session(self, session_id):
        """Delete a session"""
        try:
            return self.container.delete_item(
                item=session_id, 
                partition_key=session_id
            )
        except Exception as e:
            print(f"Error deleting session: {e}")
            return None
    
    def add_observations(self, session_id, observations_data):
        """Add observations to a session"""
        try:
            # First, get the session
            session = self.get_session(session_id)
            if not session:
                return None
                
            # Update the notes field only
            if "notes" in observations_data:
                if session["notes"]:
                    session["notes"] += f"\n\n{observations_data['notes']}"
                else:
                    session["notes"] = observations_data["notes"]
            
            # Update the session
            return self.update_session(session_id, session)
            
        except Exception as e:
            print(f"Error adding observations: {e}")
            return None
    
    def generate_analysis(self, session_id, ai_service=None):
        """Generate AI analysis for a session"""
        try:
            # Get the session
            session = self.get_session(session_id)
            if not session:
                return None
                
            # Check if notes are provided to analyze
            if not session.get("notes"):
                return {"error": "Session has no notes to analyze"}
                
            # In a real implementation, this would call an AI service
            # Here we'll use either the provided AI service or return mock data
            if ai_service:
                ai_analysis = ai_service.analyze_session_notes(session["notes"])
            else:
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
            self.update_session(session_id, session)
            
            return ai_analysis
            
        except Exception as e:
            print(f"Error generating analysis: {e}")
            return None
