import { getPokemon } from './api.js';

const pokemonCache = [];

export const fetchPokemonData = async (id) => {
  try {
    const cachedData = pokemonCache.find(item => item.id === Number(id));
    if (cachedData) {
      console.log('캐시된 데이터 사용');
      return cachedData;
    }

    const resData = await getPokemon(id);

    pokemonCache.push(resData);
    return resData;

  } catch (err) {
    console.error('포켓몬 정보 얻기 오류:', err.message);
    throw err;
  }
};