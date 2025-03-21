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

export interface JobPreview {
  id: string;
  title: string;
  employer: string;
  companyName: string;
  location: string;
  remoteOption: boolean;
  employmentType: EmploymentType;
  industry: string;
  postedDate: string;
  salary: number;
  status: JobStatus;
}

// Job display mappings interface
export interface JobMappings {
  status: {
    active: string;
    filled: string;
    expired: string;
    draft: string;
    "pending-approval": string;
  };
  employmentType: {
    "full-time": string;
    "part-time": string;
    temporary: string;
    seasonal: string;
    internship: string;
    contract: string;
  };
}

// Job display mappings
export const jobDisplayMappings: JobMappings = {
  status: {
    active: "Active",
    filled: "Filled",
    expired: "Expired",
    draft: "Draft",
    "pending-approval": "Pending Approval",
  },
  employmentType: {
    "full-time": "Full Time",
    "part-time": "Part Time",
    temporary: "Temporary",
    seasonal: "Seasonal",
    internship: "Internship",
    contract: "Contract",
  },
};

// Utility function to get display value
export function getJobDisplayValue(
  field: keyof JobMappings,
  value: string
): string {
  if (!value) return "";

  const mappings = jobDisplayMappings[field];

  if (mappings && Object.prototype.hasOwnProperty.call(mappings, value)) {
    return mappings[value as keyof typeof mappings];
  }

  return value;
}

// Utility function to get options for dropdown
export function getJobOptionsForField(
  field: keyof JobMappings
): Array<{ value: string; text: string }> {
  const mapping = jobDisplayMappings[field];
  return Object.entries(mapping).map(([value, text]) => ({
    value,
    text,
  }));
}
