"use client";

import { useState, useEffect } from "react";
import { getHelloWorld, checkHealth } from "@/utils/api";

interface ApiStatusProps {
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className = "" }) => {
  const [helloMessage, setHelloMessage] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    services: Record<string, string>;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApiStatus() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both API endpoints in parallel
        const [helloResponse, healthResponse] = await Promise.all([
          getHelloWorld(),
          checkHealth(),
        ]);

        setHelloMessage(helloResponse.message);
        setHealthStatus(healthResponse);
      } catch (err) {
        setError("Failed to check API status");
        console.error("API status check failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchApiStatus();
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-medium mb-4 text-gray-800">API Status</h2>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              Hello Endpoint
            </p>
            <p className="text-gray-800">
              {helloMessage || "No message available"}
            </p>
          </div>

          {healthStatus && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">
                Health Status
              </p>
              <div className="flex items-center mt-1">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    healthStatus.status === "ok" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p className="text-gray-800 capitalize">
                  {healthStatus.status}
                </p>
              </div>

              {Object.keys(healthStatus.services).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Services
                  </p>
                  <div className="mt-1 space-y-1">
                    {Object.entries(healthStatus.services).map(
                      ([service, status]) => (
                        <div
                          key={service}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">{service}</span>
                          <span
                            className={`${
                              status === "ok"
                                ? "text-green-600"
                                : "text-red-600"
                            } font-medium`}
                          >
                            {status}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiStatus;
