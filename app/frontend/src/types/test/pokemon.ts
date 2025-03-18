/**
 * Pokemon data interface matching the API response
 */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprite: string;
  generation: string;
}
