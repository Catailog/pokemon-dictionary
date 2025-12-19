export async function getPokemon(id) {
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
  const res = await fetch(`${BASE_URL}/${id}`);
  return await res.json();
}