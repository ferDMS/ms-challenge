import { callAPI } from "@/utils/api";
import { JobMatch } from "@/types/job-matches";
import { Job } from "@/types/jobs";

/**
 * Get all job matches with optional filters
 */
export async function getJobMatches(filters?: {
  participantId?: string;
  jobId?: string;
  status?: string;
}) {
  return callAPI<JobMatch[]>("/api/job-matches", {
    params: filters,
  });
}

/**
 * Get a specific job match by ID
 */
export async function getJobMatch(id: string) {
  return callAPI<JobMatch>(`/api/job-matches/${id}`);
}

/**
 * Create a new job match
 */
export async function createJobMatch(data: {
  participantId: string;
  jobId: string;
  status?: string;
  source?: string;
  coachNotes?: string;
}) {
  return callAPI<JobMatch>("/api/job-matches", {
    method: "POST",
    data,
  });
}

/**
 * Update a job match
 */
export async function updateJobMatch(id: string, data: Partial<JobMatch>) {
  return callAPI<JobMatch>(`/api/job-matches/${id}`, {
    method: "PUT",
    data,
  });
}

/**
 * Update job match status
 */
export async function updateJobMatchStatus(
  id: string,
  status: string,
  notes?: string
) {
  return callAPI<JobMatch>(`/api/job-matches/${id}/status`, {
    method: "PUT",
    data: { status, notes },
  });
}

/**
 * Get job suggestions for a participant
 */
export async function getJobSuggestionsForParticipant(
  participantId: string,
  limit?: number
) {
  return callAPI<Job[]>(`/api/job-matches/suggestions/${participantId}`, {
    params: { limit },
  });
}

/**
 * Create a suggested job match
 */
export async function createSuggestedJobMatch(
  participantId: string,
  jobId: string
) {
  return callAPI<JobMatch>(
    `/api/job-matches/create-suggestion/${participantId}/${jobId}`,
    {
      method: "POST",
    }
  );
}

/**
 * Calculate compatibility between a participant and job
 */
export async function calculateJobCompatibility(
  participantId: string,
  jobId: string
) {
  return callAPI<{
    matchScore: number;
    compatibilityElements: Array<{
      category: string;
      factor: string;
      score: number;
      reasoning: string;
    }>;
  }>(`/api/job-matches/compatibility/${participantId}/${jobId}`);
}
