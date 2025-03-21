// Job match status type
export type JobMatchStatus =
  | "considering"
  | "suggested" // System-suggested match
  | "applied"
  | "interviewing"
  | "offered"
  | "accepted"
  | "rejected"
  | "not-suitable"; // Coach determined not suitable

// Match source
export type MatchSource =
  | "system-generated" // Created by the AI matching system
  | "coach-assigned" // Manually assigned by coach
  | "participant-found"; // Found by the participant

// Compatibility element - explains why a job matches a participant
export interface CompatibilityElement {
  category: string; // e.g., "skills", "location", "accommodations"
  factor: string; // e.g., "Basic gardening", "Accessible location"
  score: number; // 0-100 indicating strength of match
  reasoning: string; // Explanation of why this is a match
}

// JobMatch interface
export interface JobMatch {
  id: string;
  participantId: string;
  jobId: string;

  // Match metadata
  createdAt: string;
  updatedAt: string;
  source: MatchSource;

  // Match analysis
  matchScore: number; // 0-100 overall score
  compatibilityElements: CompatibilityElement[];

  // Status tracking
  status: JobMatchStatus;
  statusHistory: {
    status: JobMatchStatus;
    date: string;
    notes?: string;
  }[];

  // Coach input
  coachNotes?: string;

  // Reference information (for quicker access without joins)
  jobReference: {
    title: string;
    employer: string;
    companyName: string;
    location: string;
    employmentType: string;
    shortDescription: string;
    salary: number;
    postedDate: string;
  };

  participantReference: {
    fullName: string;
    email: string;
    disabilityType: string;
    currentStatus: string;
  };

  // Next steps
  recommendedActions?: string[];
  nextAppointment?: string;
  applicationDeadline?: string;
}

// New type for creating job matches
export interface CreateJobMatchData {
  participantId: string;
  jobId: string;
  status?: JobMatchStatus;
  source?: MatchSource;
  coachNotes?: string;
  matchScore?: number;
  compatibilityElements?: CompatibilityElement[];
}

// Define a type for job suggestions based on the API response
export interface JobSuggestion {
  id: string;
  title: string;
  employer: string;
  employmentType: string;
  location: string;
  shortDescription: string;
  matchScore: number;
  compatibilityElements: {
    category: string;
    factor: string;
    reasoning: string;
    score: number;
  }[];
  participantAttributesUsed: {
    accommodationsNeeded: string[];
    currentStatus: string;
    desiredHours: string;
    disabilityType: string;
    employmentGoal: string;
    preferredIndustries: string[];
    preferredLocations: string[];
    primaryLanguage: string;
    skills: {
      soft: string[];
      technical: string[];
    };
    transportationStatus: string;
  };
}

// Job match display mappings interface
export interface JobMatchMappings {
  status: {
    considering: string;
    suggested: string;
    applied: string;
    interviewing: string;
    offered: string;
    accepted: string;
    rejected: string;
    "not-suitable": string;
  };
  source: {
    "system-generated": string;
    "coach-assigned": string;
    "participant-found": string;
  };
}

// Job match display mappings
export const jobMatchDisplayMappings: JobMatchMappings = {
  status: {
    considering: "Considering",
    suggested: "Suggested",
    applied: "Applied",
    interviewing: "Interviewing",
    offered: "Offered",
    accepted: "Accepted",
    rejected: "Rejected",
    "not-suitable": "Not Suitable",
  },
  source: {
    "system-generated": "AI Suggested",
    "coach-assigned": "Coach Assigned",
    "participant-found": "Participant Found",
  },
};

// Utility function to get display value
export function getJobMatchDisplayValue(
  field: keyof JobMatchMappings,
  value: string
): string {
  if (!value) return "";

  const mappings = jobMatchDisplayMappings[field];

  if (mappings && Object.prototype.hasOwnProperty.call(mappings, value)) {
    return mappings[value as keyof typeof mappings];
  }

  return value;
}

// Utility function to get options for dropdown
export function getJobMatchOptionsForField(
  field: keyof JobMatchMappings
): Array<{ value: string; text: string }> {
  const mapping = jobMatchDisplayMappings[field];
  return Object.entries(mapping).map(([value, text]) => ({
    value,
    text,
  }));
}
