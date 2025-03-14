"use client";

import { usePokemon } from "../hooks/usePokemon";
import Image from "next/image";

interface PokemonCardProps {
  className?: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ className = "" }) => {
  const { pokemon, loading, error, fetchRandomPokemon } = usePokemon();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow-sm min-h-[320px] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm min-h-[320px] w-full flex flex-col justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={fetchRandomPokemon}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  // Format the Pokemon name to capitalize first letter
  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Generate a subtle background color based on the first pokemon type
  const typeColor =
    pokemon.types.length > 0 ? pokemon.types[0].toLowerCase() : "normal";
  const typeColorMap: Record<string, string> = {
    normal: "bg-gray-50",
    fire: "bg-red-50",
    water: "bg-blue-50",
    grass: "bg-green-50",
    electric: "bg-yellow-50",
    ice: "bg-cyan-50",
    fighting: "bg-orange-50",
    poison: "bg-purple-50",
    ground: "bg-amber-50",
    flying: "bg-indigo-50",
    psychic: "bg-pink-50",
    bug: "bg-lime-50",
    rock: "bg-stone-50",
    ghost: "bg-violet-50",
    dragon: "bg-sky-50",
    dark: "bg-slate-50",
    steel: "bg-zinc-50",
    fairy: "bg-rose-50",
  };

  const bgColor = typeColorMap[typeColor] || "bg-gray-50";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <div className={`${bgColor} p-6 flex flex-col items-center`}>
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={`${formattedName} sprite`}
            width={144} // 36 * 4 = 144px (w-36 is roughly 144px)
            height={144} // 36 * 4 = 144px (h-36 is roughly 144px)
            className="w-36 h-36 object-contain"
          />
        ) : (
          <div className="w-36 h-36 flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <h2 className="text-2xl font-medium mt-4 text-gray-800">
          {formattedName}
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          #{pokemon.id.toString().padStart(3, "0")}
        </p>

        <div className="flex space-x-2 mt-1">
          {pokemon.types.map((type, index) => {
            const typeClasses: Record<string, string> = {
              normal: "bg-gray-200 text-gray-800",
              fire: "bg-red-200 text-red-800",
              water: "bg-blue-200 text-blue-800",
              grass: "bg-green-200 text-green-800",
              electric: "bg-yellow-200 text-yellow-800",
              ice: "bg-cyan-200 text-cyan-800",
              fighting: "bg-orange-200 text-orange-800",
              poison: "bg-purple-200 text-purple-800",
              ground: "bg-amber-200 text-amber-800",
              flying: "bg-indigo-200 text-indigo-800",
              psychic: "bg-pink-200 text-pink-800",
              bug: "bg-lime-200 text-lime-800",
              rock: "bg-stone-200 text-stone-800",
              ghost: "bg-violet-200 text-violet-800",
              dragon: "bg-sky-200 text-sky-800",
              dark: "bg-slate-200 text-slate-800",
              steel: "bg-zinc-200 text-zinc-800",
              fairy: "bg-rose-200 text-rose-800",
            };
            const classes =
              typeClasses[type.toLowerCase()] || "bg-gray-200 text-gray-800";

            return (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-medium rounded-full ${classes}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              Height
            </p>
            <p className="text-gray-800">{pokemon.height / 10} m</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              Weight
            </p>
            <p className="text-gray-800">{pokemon.weight / 10} kg</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Generation
            </p>
            <p className="text-gray-800">{pokemon.generation}</p>
          </div>
        </div>

        <button
          onClick={fetchRandomPokemon}
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Get Another Pokémon
        </button>
      </div>
    </div>
  );
};

export default PokemonCard;
