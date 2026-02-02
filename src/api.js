export async function getPokemon(id) {
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
  const URL = `${BASE_URL}/${id}`;

  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error(`네트워크 응답 에러: ${res.status}`);
  }

  return await res.json();
}