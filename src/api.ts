import type { PokemonData } from '@/types/types';

const pokemonCache: Record<number, PokemonData> = {};

export async function fetchPokemonData(id: number): Promise<PokemonData> {
  if (pokemonCache[id]) return pokemonCache[id];

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`에러 발생: ${res.status}`);

  const data = await res.json();
  pokemonCache[id] = data;
  return data;
}
