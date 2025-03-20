from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Define models for participant data
class WorkHistory(BaseModel):
    employer: str
    position: str
    startDate: str
    endDate: str
    responsibilities: List[str]

class Goal(BaseModel):
    description: str
    dateSet: str
    targetDate: str
    status: str

class JobMatch(BaseModel):
    jobId: str
    title: str
    employer: str
    description: str
    matchScore: float
    status: str

class Skills(BaseModel):
    technical: List[str]
    soft: List[str]

class ParticipantBase(BaseModel):
    firstName: str
    lastName: str
    fullName: str
    email: str
    phone: str
    dateOfBirth: str
    gender: str
    primaryLanguage: str
    disabilityType: str
    accommodationsNeeded: List[str]
    transportationStatus: str
    currentStatus: str
    employmentGoal: str
    desiredHours: str
    skills: Skills
    workHistory: List[WorkHistory] = []
    preferredLocations: List[str] = []
    preferredIndustries: List[str] = []
    goals: List[Goal] = []
    jobMatches: List[JobMatch] = []

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class ParticipantPreview(BaseModel):
    id: str
    fullName: str
    email: str
    disabilityType: str
    currentStatus: str
    employmentGoal: str
    avatar: Optional[str] = None
    sessionCount: Optional[int] = 0
    jobMatchCount: Optional[int] = 0

class ParticipantUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    primaryLanguage: Optional[str] = None
    disabilityType: Optional[str] = None
    accommodationsNeeded: Optional[List[str]] = None
    transportationStatus: Optional[str] = None
    currentStatus: Optional[str] = None
    employmentGoal: Optional[str] = None
    desiredHours: Optional[str] = None
    skills: Optional[Skills] = None
    workHistory: Optional[List[WorkHistory]] = None
    preferredLocations: Optional[List[str]] = None
    preferredIndustries: Optional[List[str]] = None
    goals: Optional[List[Goal]] = None
    jobMatches: Optional[List[JobMatch]] = None
