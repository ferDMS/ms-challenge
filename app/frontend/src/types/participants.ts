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

/**
 * Simplified participant data for preview in table listings
 */
export interface ParticipantPreview {
  id: string;
  fullName: string;
  email: string;
  disabilityType: string;
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
  gender: string;
  primaryLanguage: string;

  // Core disability and support information
  disabilityType: string;
  accommodationsNeeded: string[];
  transportationStatus: string;

  // Employment details
  currentStatus: EmploymentCycleStage;
  employmentGoal: string;
  desiredHours: string;

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
  jobMatches: {
    jobId: string;
    title: string;
    employer: string;
    description: string;
    matchScore: number;
    status: JobMatchStatus;
  }[];
}
