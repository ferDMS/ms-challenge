import { callAPI } from "@/utils/api";
import { Participant, ParticipantPreview } from "@/types/participants";

/**
 * Get all participants with optional filters
 */
export async function getParticipants(filters?: {
  coachId?: string;
  status?: string;
  disabilityType?: string;
  skillType?: string;
}) {
  return callAPI<ParticipantPreview[]>("/api/participants", {
    params: filters,
  });
}

/**
 * Get a specific participant by ID
 */
export async function getParticipant(id: string) {
  return callAPI<Participant>(`/api/participants/${id}`);
}

/**
 * Create a new participant
 */
export async function createParticipant(
  participantData: Omit<Participant, "id">
) {
  return callAPI<Participant>("/api/participants", {
    method: "POST",
    data: participantData as Record<string, unknown>,
  });
}

/**
 * Update an existing participant
 */
export async function updateParticipant(
  id: string,
  participantData: Partial<Participant>
) {
  return callAPI<Participant>(`/api/participants/${id}`, {
    method: "PUT",
    data: participantData as Record<string, unknown>,
  });
}

/**
 * Delete a participant
 */
export async function deleteParticipant(id: string) {
  return callAPI<{ message: string }>(`/api/participants/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get a participant's sessions
 */
export async function getParticipantSessions(id: string) {
  return callAPI(`/api/participants/${id}/sessions`);
}

/**
 * Get job matches for a participant
 */
export async function getParticipantJobMatches(id: string) {
  return callAPI(`/api/participants/${id}/job-matches`);
}
