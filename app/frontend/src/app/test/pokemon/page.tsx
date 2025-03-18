"use client";

import PokemonCard from "@/components/pokemon/PokemonCard";
import ApiStatus from "@/components/demo/ApiStatus";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pokémon Explorer
          </h1>
          <p className="text-gray-600">
            A minimalist demo showing API and Pokémon integration
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <PokemonCard className="max-w-md mx-auto" />
          </div>

          <div className="md:order-1 flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4 text-gray-800">
                About This App
              </h2>
              <p className="text-gray-700">
                This application demonstrates how to integrate with external
                APIs in a Next.js frontend. The Pokémon data is fetched from a
                mock Pokemon API, while the API status section shows health
                checks and basic API responses.
              </p>
            </div>

            <ApiStatus />

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4 text-gray-800">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "Axios",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-medium rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
