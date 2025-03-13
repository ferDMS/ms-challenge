import { useState, useCallback, useEffect } from "react";
import { getRandomPokemon } from "../utils/api";
import { Pokemon } from "../types/Pokemon";

interface UsePokemonReturn {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  fetchRandomPokemon: () => Promise<void>;
}

export const usePokemon = (): UsePokemonReturn => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRandomPokemon();
      setPokemon(data);
    } catch (err) {
      setError("Failed to fetch Pokemon. Please try again.");
      console.error("Error fetching Pokemon:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a random pokemon on initial mount
  useEffect(() => {
    fetchRandomPokemon();
  }, [fetchRandomPokemon]);

  return {
    pokemon,
    loading,
    error,
    fetchRandomPokemon,
  };
};
