// Type for tag input fields
export type TagInputType = "topics" | "goals";

// Type for session types
export type SessionType =
  | "initial"
  | "follow-up"
  | "assessment"
  | "training"
  | "job-matching";

export type SessionStatus = "scheduled" | "completed" | "cancelled";

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
  status: SessionStatus;
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
  status: SessionStatus;
  type: SessionType;
  location: string;
  coachId: string;
  coachName: string;
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

// Define display mappings for session fields
export const SessionMappings = {
  sessionType: {
    initial: "Initial Session",
    "follow-up": "Follow-up",
    assessment: "Assessment",
    training: "Training",
    "job-matching": "Job Matching",
  },
  sessionStatus: {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
  },
};

// Get display value for a field based on its key
export function getDisplayValue(
  field: keyof typeof SessionMappings,
  value: string
): string {
  if (!value) return "";

  const mapping = SessionMappings[field];
  return mapping && mapping[value as keyof typeof mapping]
    ? mapping[value as keyof typeof mapping]
    : value;
}

// Get options for dropdown/combobox fields
export function getOptionsForField(
  field: keyof typeof SessionMappings
): { text: string; value: string }[] {
  const mapping = SessionMappings[field];
  return Object.entries(mapping).map(([value, text]) => ({
    text: text as string,
    value,
  }));
}

// Get key-value pairs for a field
export function getKeyValuePairsForField(
  field: keyof typeof SessionMappings
): [string, string][] {
  const mapping = SessionMappings[field];
  return Object.entries(mapping);
}
