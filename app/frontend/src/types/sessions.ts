// Type for tag input fields
export type TagInputType = "topics" | "goals";

// Type for session types
export type SessionType =
  | "initial"
  | "follow-up"
  | "assessment"
  | "training"
  | "job-matching";

export interface SessionAISuggestions {
  recommendedTopics: string[];
  sentimentAnalysis: {
    positive: string[];
    negative: string[];
  };
  jobRecommendations?: {
    id: string;
    title: string;
    match: number;
    reason: string;
  }[];
  summary: string;
}

export interface Session {
  id: string;
  title: string;
  coachId: string;
  coachName?: string;
  participantId: string;
  participantName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  type: SessionType;
  location: string;
  notes: string;
  topics: string[];
  goals: string[];
  progressNotes?: string;
  aiSuggestions: SessionAISuggestions;
}

// New SessionPreview type for table view
export interface SessionPreview {
  id: string;
  title: string;
  participantId?: string;
  participantName: string;
  participantAvatar?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  type: string;
  location: string;
}

export interface SessionFilters {
  coachId?: string;
  participantId?: string;
  status?: string;
  type?: string;
  date?: string;
}

export interface SessionAnalysis {
  recommendedTopics: string[];
  sentimentAnalysis: {
    positive: string[];
    negative: string[];
  };
  jobRecommendations: {
    id: string;
    title: string;
    match: number;
    reason: string;
  }[];
  summary: string;
}
