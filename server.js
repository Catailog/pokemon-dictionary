import express from 'express';
import { getPokemon } from './api.js';

// init
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.json());

// 웹 렌더링
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// 포켓몬 정보 얻기
const pokemonCache = [];
app.get('/pokemon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // 캐싱
    const cachedData = pokemonCache.find(item => item.id === Number(id));
    // 캐시에 있으면 곧바로 응답
    if (cachedData) {
      return res.json(cachedData);
    }

    // 캐시에 없으면 API로 요청 후 응답
    const resData = await getPokemon(id);
    pokemonCache.push(resData);
    res.json(resData);
  } catch (err) {
    console.log('포켓몬 정보 얻기 오류', err.message);
  }
});

// 요청 대기
app.listen(port, () => {
  console.log(`express 서버가 해당 포트에서 대기 중: ${port}`);
});