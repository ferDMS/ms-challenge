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
  type: "initial" | "follow-up" | "assessment" | "training" | "job-matching";
  location: string;
  notes: string;
  topics: string[];
  goals: string[];
  nextSteps: string[];
  completedSteps?: string[];
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

export interface SessionObservation {
  notes: string;
  progressNotes?: string;
  completedSteps?: string[];
  nextSteps?: string[];
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
}
