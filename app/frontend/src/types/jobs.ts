// Job status types
export type JobStatus =
  | "active"
  | "filled"
  | "expired"
  | "draft"
  | "pending-approval";

// Employment type
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "temporary"
  | "seasonal"
  | "internship"
  | "contract";

// Main Job interface
export interface Job {
  id: string;
  title: string;
  employer: string;
  companyName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;

  // Job details
  description: string;
  shortDescription: string;
  location: string;
  address: string;
  remoteOption: boolean;
  postedDate: string;
  startDate?: string;
  salary: number;

  // Job classification
  employmentType: EmploymentType;
  industry: string;
  department?: string;
  hoursPerWeek?: {
    min: number;
    max: number;
  };
  schedule?: string[]; // e.g. ["weekdays", "mornings", "flexible"]

  // Requirements
  requiredSkills: string[];

  // Accessibility and accommodations
  availableAccommodations: string[];
  accessibilityFeatures: string[];
  supportiveEnvironment: string[];

  // Status information
  status: JobStatus;
  applicationUrl?: string;
}
