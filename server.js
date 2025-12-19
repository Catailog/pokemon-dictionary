import express from 'express';

// init
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.json());

// 웹 렌더링
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// 요청 대기
app.listen(port, () => {
  console.log(`express 서버가 해당 포트에서 대기 중: ${port}`);
});