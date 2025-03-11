/**
 * Utility functions for making API calls to the backend
 */

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Get hello world message from the root endpoint
 */
export async function getHelloWorld() {
  return fetchFromAPI<{ message: string; status: string }>("/");
}

/**
 * Check the health of the API
 */
export async function checkHealth() {
  return fetchFromAPI<{ status: string; services: Record<string, string> }>(
    "/api/health"
  );
}

export default {
  getHelloWorld,
  checkHealth,
};
