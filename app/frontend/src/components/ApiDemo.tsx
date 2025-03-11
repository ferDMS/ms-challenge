"use client";

import { useState, useEffect } from "react";
import { getHelloWorld, checkHealth } from "@/utils/api";

interface ApiResponse {
  message?: string;
  status: string;
  services?: Record<string, string>;
}

export default function ApiDemo() {
  const [helloData, setHelloData] = useState<ApiResponse | null>(null);
  const [healthData, setHealthData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from both endpoints
        const [helloResponse, healthResponse] = await Promise.all([
          getHelloWorld(),
          checkHealth(),
        ]);

        setHelloData(helloResponse);
        setHealthData(healthResponse);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch data from API"
        );
        console.error("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm text-center">
        <p className="text-gray-600 dark:text-gray-300">Loading API data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
        <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">
          Error connecting to API
        </h3>
        <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Make sure your Flask backend is running on port 5001
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hello World Response */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h3 className="font-medium mb-2 text-lg">Hello API Response</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-sm">
          <pre>{JSON.stringify(helloData, null, 2)}</pre>
        </div>
      </div>

      {/* Health Check Response */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h3 className="font-medium mb-2 text-lg">API Health Status</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-sm">
          <pre>{JSON.stringify(healthData, null, 2)}</pre>
        </div>
        {healthData?.status === "healthy" && (
          <p className="mt-2 text-green-600 dark:text-green-400 text-sm flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            All systems operational
          </p>
        )}
      </div>
    </div>
  );
}
