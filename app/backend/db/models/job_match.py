from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

# Job match status types
class JobMatchStatus:
    CONSIDERING = "considering"
    SUGGESTED = "suggested"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    NOT_SUITABLE = "not-suitable"

# Match source types
class MatchSource:
    SYSTEM_GENERATED = "system-generated"
    COACH_ASSIGNED = "coach-assigned"
    PARTICIPANT_FOUND = "participant-found"

# Compatibility element model
class CompatibilityElement(BaseModel):
    category: str  # e.g., "skills", "location", "accommodations"
    factor: str  # e.g., "Basic gardening", "Accessible location"
    score: int  # 0-100 indicating strength of match
    reasoning: str  # Explanation of why this is a match

# Status history entry
class StatusHistoryEntry(BaseModel):
    status: str
    date: str
    notes: Optional[str] = None

# Job reference model for quick access without joins
class JobReference(BaseModel):
    title: str
    employer: str
    companyName: str
    location: str
    employmentType: str
    shortDescription: str
    salary: float
    postedDate: str

# Participant reference model for quick access without joins
class ParticipantReference(BaseModel):
    fullName: str
    email: str
    disabilityType: str
    currentStatus: str

# Complete job match model
class JobMatch(BaseModel):
    id: str
    participantId: str
    jobId: str
    
    # Match metadata
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    source: str
    
    # Match analysis
    matchScore: int  # 0-100 overall score
    compatibilityElements: List[CompatibilityElement] = []
    
    # Status tracking
    status: str
    statusHistory: List[StatusHistoryEntry] = []
    
    # Coach input
    coachNotes: Optional[str] = None
    
    # Reference information
    jobReference: JobReference
    participantReference: ParticipantReference
    
    # Next steps
    recommendedActions: Optional[List[str]] = None
    nextAppointment: Optional[str] = None
    applicationDeadline: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id": "match-123",
                "participantId": "participant-458",
                "jobId": "job-393",
                "createdAt": "2024-05-20T14:30:00.000Z",
                "updatedAt": "2024-05-20T14:30:00.000Z",
                "source": "system-generated",
                "matchScore": 85,
                "compatibilityElements": [
                    {
                        "category": "skills",
                        "factor": "Basic gardening",
                        "score": 90,
                        "reasoning": "Participant has gardening experience which aligns with job requirements"
                    },
                    {
                        "category": "location",
                        "factor": "Accessible location",
                        "score": 80,
                        "reasoning": "Job location is within participant's preferred areas"
                    }
                ],
                "status": "suggested",
                "statusHistory": [
                    {
                        "status": "suggested",
                        "date": "2024-05-20T14:30:00.000Z",
                        "notes": "Initial match by system"
                    }
                ],
                "jobReference": {
                    "title": "Garden Center Helper",
                    "employer": "VerdeVida Plants",
                    "companyName": "VerdeVida Green Spaces SA",
                    "location": "Tlalpan, Mexico City",
                    "employmentType": "part-time",
                    "shortDescription": "Hands-on outdoor role with plants and customers in a garden setting.",
                    "salary": 155,
                    "postedDate": "2024-03-15"
                },
                "participantReference": {
                    "fullName": "Luis Vargas",
                    "email": "luis.vargas@example.com",
                    "disabilityType": "Mild autism spectrum disorder",
                    "currentStatus": "job-search"
                }
            }
        }
