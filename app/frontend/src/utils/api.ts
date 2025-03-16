/**
 * Utility functions for making API calls to the backend
 */
import axios from "axios";
import { Pokemon } from "@/types/Pokemon";

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic API request wrapper with error handling
 */
async function callAPI<T>(
  endpoint: string,
  options?: {
    method?: string;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
  }
): Promise<T> {
  try {
    const response = await api({
      url: endpoint,
      method: options?.method || "GET",
      data: options?.data,
      headers: options?.headers,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Get hello world message from the root endpoint
 */
export async function getHelloWorld() {
  return callAPI<{ message: string; status: string }>("/");
}

/**
 * Check the health of the API
 */
export async function checkHealth() {
  return callAPI<{ status: string; services: Record<string, string> }>(
    "/api/health"
  );
}

/**
 * Get a random Pokemon
 */
export async function getRandomPokemon() {
  return callAPI<Pokemon>("/api/pokemon/random");
}

// Create named export object
const apiService = {
  getHelloWorld,
  checkHealth,
  getRandomPokemon,
};

export default apiService;
