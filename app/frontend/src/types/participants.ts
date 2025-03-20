// Employment cycle stage types
export type EmploymentCycleStage =
  | "seeking"
  | "employed"
  | "training"
  | "job-search"
  | "job-matching"
  | "interview-preparation"
  | "post-employment-support"
  | "inactive";

// Goal status type
export type GoalStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "abandoned";

// Job match status type
export type JobMatchStatus =
  | "considering"
  | "suggested"
  | "applied"
  | "interviewing"
  | "offered"
  | "accepted"
  | "rejected";

// Gender type
export type Gender =
  | "male"
  | "female"
  | "non-binary"
  | "prefer-not-to-say"
  | "other";

// Transportation status type
export type TransportationStatus =
  | "independent"
  | "public-transit"
  | "assistance-needed"
  | "no-transportation";

// Desired hours type
export type DesiredHours =
  | "full-time"
  | "part-time-30"
  | "part-time-20"
  | "part-time-10"
  | "flexible";

// Disability type
export type DisabilityType =
  | "physical"
  | "cognitive"
  | "sensory"
  | "developmental"
  | "mental-health"
  | "multiple";

// Participant display mappings interface
export interface ParticipantMappings {
  gender: {
    male: string;
    female: string;
    "non-binary": string;
    "prefer-not-to-say": string;
    other: string;
  };
  transportationStatus: {
    independent: string;
    "public-transit": string;
    "assistance-needed": string;
    "no-transportation": string;
  };
  desiredHours: {
    "full-time": string;
    "part-time-30": string;
    "part-time-20": string;
    "part-time-10": string;
    flexible: string;
  };
  disabilityType: {
    physical: string;
    cognitive: string;
    sensory: string;
    developmental: string;
    "mental-health": string;
    multiple: string;
  };
  employmentCycleStage: {
    initial: string;
    employed: string;
    training: string;
    "job-search": string;
    "interview-preparation": string;
    inactive: string;
  };
  jobMatchStatus: {
    considering: string;
    suggested: string;
    applied: string;
    interviewing: string;
    offered: string;
    accepted: string;
    rejected: string;
  };
  goalStatus: {
    "not-started": string;
    "in-progress": string;
    completed: string;
    abandoned: string;
  };
}

// Define display mappings for dropdown values
export const displayMappings: ParticipantMappings = {
  gender: {
    male: "Male",
    female: "Female",
    "non-binary": "Non-binary",
    "prefer-not-to-say": "Prefer not to say",
    other: "Other",
  },
  transportationStatus: {
    independent: "Independent transportation",
    "public-transit": "Uses public transit",
    "assistance-needed": "Needs transportation assistance",
    "no-transportation": "No transportation available",
  },
  desiredHours: {
    "full-time": "Full time (40h/week)",
    "part-time-30": "Part time (30h/week)",
    "part-time-20": "Part time (20h/week)",
    "part-time-10": "Part time (10h/week)",
    flexible: "Flexible hours",
  },
  disabilityType: {
    physical: "Physical",
    cognitive: "Cognitive",
    sensory: "Sensory",
    developmental: "Developmental",
    "mental-health": "Mental Health",
    multiple: "Multiple Disabilities",
  },
  employmentCycleStage: {
    initial: "Initial",
    employed: "Employed",
    training: "Training",
    "job-search": "Job Search",
    "interview-preparation": "Interview Prep",
    inactive: "Inactive",
  },
  jobMatchStatus: {
    considering: "Considering",
    suggested: "Suggested",
    applied: "Applied",
    interviewing: "Interviewing",
    offered: "Offered",
    accepted: "Accepted",
    rejected: "Rejected",
  },
  goalStatus: {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
    abandoned: "Abandoned",
  },
};

// Utility functions to get options from mappings
export function getOptionsForField<K extends keyof ParticipantMappings>(
  field: K
): Array<{ value: string; text: string }> {
  const mapping = displayMappings[field];
  return Object.entries(mapping).map(([value, text]) => ({
    value,
    text: text as string,
  }));
}

// Get key-value pairs for a specific field
export function getKeyValuePairsForField<K extends keyof ParticipantMappings>(
  field: K
): Record<string, string> {
  return { ...displayMappings[field] };
}

export const getDisplayValue = (
  field: keyof ParticipantMappings,
  value: string
) => {
  if (!value) return "";

  const mappings = displayMappings[field];

  if (mappings && Object.prototype.hasOwnProperty.call(mappings, value)) {
    return mappings[value as keyof typeof mappings];
  }

  return value;
};

// Job match type
export interface JobMatch {
  jobId: string;
  title: string;
  employer: string;
  description: string;
  matchScore: number;
  status: JobMatchStatus;
}

/**
 * Simplified participant data for preview in table listings
 */
export interface ParticipantPreview {
  id: string;
  fullName: string;
  email: string;
  disabilityType: DisabilityType;
  currentStatus: EmploymentCycleStage;
  employmentGoal: string;
  avatar?: string; // Optional avatar URL
  sessionCount?: number; // Number of sessions (for quick reference)
  jobMatchCount?: number; // Number of job matches (for quick reference)
}

// Main Participant interface
export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  primaryLanguage: string;

  // Core disability and support information
  disabilityType: DisabilityType;
  accommodationsNeeded: string[];
  transportationStatus: TransportationStatus;

  // Employment details
  currentStatus: EmploymentCycleStage;
  employmentGoal: string;
  desiredHours: DesiredHours;

  // Skills
  skills: {
    technical: string[];
    soft: string[];
  };

  // Work history
  workHistory: {
    employer: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }[];

  // Preferences
  preferredLocations: string[];
  preferredIndustries: string[];

  // Goals
  goals: {
    description: string;
    dateSet: string;
    targetDate: string;
    status: GoalStatus;
  }[];

  // Job matches
  jobMatches: JobMatch[];
}
