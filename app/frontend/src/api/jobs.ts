import { callAPI } from "@/utils/api";
import { Job } from "@/types/jobs";

/**
 * Get all jobs with optional filters
 */
export async function getJobs(filters?: {
  status?: string;
  employmentType?: string;
  industry?: string;
  location?: string;
}) {
  return callAPI<Job[]>("/api/jobs", {
    params: filters,
  });
}

/**
 * Get a specific job by ID
 */
export async function getJob(id: string) {
  return callAPI<Job>(`/api/jobs/${id}`);
}

/**
 * Create a new job
 */
export async function createJob(jobData: Omit<Job, "id">) {
  return callAPI<Job>("/api/jobs", {
    method: "POST",
    data: jobData as Record<string, unknown>,
  });
}

/**
 * Update an existing job
 */
export async function updateJob(id: string, jobData: Partial<Job>) {
  return callAPI<Job>(`/api/jobs/${id}`, {
    method: "PUT",
    data: jobData as Record<string, unknown>,
  });
}

/**
 * Delete a job
 */
export async function deleteJob(id: string) {
  return callAPI<{ message: string }>(`/api/jobs/${id}`, {
    method: "DELETE",
  });
}

/**
 * Search jobs by criteria
 */
export async function searchJobs(searchParams: {
  query?: string;
  skills?: string[];
  location?: string;
  employmentType?: string;
}) {
  const params = {
    ...searchParams,
    skills: searchParams.skills?.join(","),
  };

  return callAPI<Job[]>("/api/jobs/search", {
    params,
  });
}

/**
 * Get job match suggestions for a participant
 */
export async function getJobSuggestionsForParticipant(participantId: string) {
  return callAPI<Job[]>(`/api/job-matches/suggestions/${participantId}`);
}

/**
 * Create a job match between participant and job
 */
export async function createJobMatch(data: {
  participantId: string;
  jobId: string;
  status: string;
}) {
  return callAPI("/api/job-matches", {
    method: "POST",
    data,
  });
}

/**
 * Update job match status
 */
export async function updateJobMatchStatus(matchId: string, status: string) {
  return callAPI(`/api/job-matches/${matchId}/status`, {
    method: "PUT",
    data: { status },
  });
}
