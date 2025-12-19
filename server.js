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
app.get('/pokemon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resData = await getPokemon(id);
    res.json(resData);
  } catch (err) {
    console.log('translation 오류', err.message);
  }
});

// 요청 대기
app.listen(port, () => {
  console.log(`express 서버가 해당 포트에서 대기 중: ${port}`);
});