import { callAPI } from "@/utils/api";
import { Session, SessionAnalysis, SessionPreview } from "@/types/sessions";

/**
 * Get all sessions with optional filters
 */
export async function getSessions(filters?: {
  coachId?: string;
  participantId?: string;
  status?: string;
  type?: string;
  date?: string;
}) {
  return callAPI<SessionPreview[]>("/api/sessions", { params: filters });
}

/**
 * Get a specific session by ID
 */
export async function getSession(id: string) {
  return callAPI<Session>(`/api/sessions/${id}`);
}

/**
 * Create a new session
 */
export async function createSession(sessionData: Omit<Session, "id">) {
  return callAPI<Session>("/api/sessions", {
    method: "POST",
    data: sessionData as Record<string, unknown>,
  });
}

/**
 * Update an existing session
 */
export async function updateSession(id: string, sessionData: Partial<Session>) {
  return callAPI<Session>(`/api/sessions/${id}`, {
    method: "PUT",
    data: sessionData as Record<string, unknown>,
  });
}

/**
 * Delete a session
 */
export async function deleteSession(id: string) {
  return callAPI<{ message: string }>(`/api/sessions/${id}`, {
    method: "DELETE",
  });
}

/**
 * Add observations to a session
 */
export async function addSessionObservations(
  id: string,
  observations: { notes: string }
) {
  return callAPI<Session>(`/api/sessions/${id}/observations`, {
    method: "POST",
    data: observations,
  });
}

/**
 * Generate AI analysis for a session
 */
export async function generateSessionAnalysis(id: string) {
  return callAPI<SessionAnalysis>(`/api/sessions/${id}/analysis`, {
    method: "POST",
  });
}
