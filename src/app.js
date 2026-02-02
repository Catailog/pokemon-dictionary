let curId = 1;
getPokemonHandler(curId);

const dictNum = document.getElementById('dict-num');
const MAX_ID = 1025;
dictNum.addEventListener('click', () => {
  const inputStr = prompt(`검색할 번호를 입력하세요. (1-${MAX_ID})`);
  if (inputStr === null || inputStr === '') return;

  const num = Number(inputStr);
  if (1 <= num && num <= MAX_ID) {
    curId = num;
    getPokemonHandler(curId);
  }
  else {
    alert('잘못된 번호입니다.');
  }
});

const prevPokemonBtn = document.getElementById('prev-pokemon-btn');
const nextPokemonBtn = document.getElementById('next-pokemon-btn');
prevPokemonBtn.addEventListener('click', () => {
  if (curId > 1) {
    getPokemonHandler(--curId);
  }
});
nextPokemonBtn.addEventListener('click', () => {
  if (curId < MAX_ID) {
    getPokemonHandler(++curId);
  }
});

const criesBtn = document.getElementById('cries-btn');
const criesAudio = document.getElementById('cries-audio');
criesAudio.volume = 0.05;
criesBtn.addEventListener('click', () => {
  criesAudio.play();
});

function getPokemonHandler(identifier) {
  (async () => {
    try {
      // 포켓몬 데이터 가져오기
      const resData = await getPokemon(identifier);
      console.log(resData);

      // 포켓몬 초상화
      const pokemonPortrait = document.getElementById('pokemon-portrait-wrapper').getElementsByTagName('img')[0];
      const { sprites: { front_default } } = resData;
      pokemonPortrait.src = front_default;

      // 포켓몬 메인 정보
      const { name, types } = resData;
      const addMainInfo = (name, ...types) => {
        // 메인 정보 컨테이너
        const container = document.getElementById('pokemon-main-infos');
        container.className = 'flex gap-x-2 gap-y-1 flex-wrap';
        // 이름
        const pokemonName = document.createElement('p');
        pokemonName.className = 'text-gray-800 w-auto text-lg font-extrabold';
        pokemonName.textContent = toPascalCase(name);
        container.appendChild(pokemonName);
        // 태그
        for (const type of types) {
          const pokemonInfo = document.createElement('div');
          pokemonInfo.className = 'text-white w-auto bg-gray-700 px-2 py-1 rounded-full text-xs font-bold';
          container.appendChild(pokemonInfo);
          const pokemonInfoValue = document.createElement('span');
          pokemonInfoValue.textContent = toPascalCase(type.type.name);
          pokemonInfo.appendChild(pokemonInfoValue);
        }
      };
      const pokemonMainInfos = document.getElementById('pokemon-main-infos');
      pokemonMainInfos.replaceChildren();
      addMainInfo(name, ...types);

      // 포켓몬 서브 정보
      const { height, weight, stats } = resData;
      const addSubInfo = (key, value) => {
        // 서브 정보 컨테이너
        const container = document.getElementById('pokemon-sub-infos');
        container.className = 'flex gap-x-2 gap-y-1 flex-wrap text-xs';
        // 태그
        const pokemonInfo = document.createElement('div');
        pokemonInfo.className = 'flex gap-1 text-gray-700 w-auto bg-gray-100 p-1 rounded-lg';
        container.appendChild(pokemonInfo);
        // 태그 키
        const pokemonInfoKey = document.createElement('span');
        pokemonInfoKey.textContent = key;
        pokemonInfo.appendChild(pokemonInfoKey);
        // 태그 값
        const pokemonInfoValue = document.createElement('span');
        pokemonInfoValue.className = 'font-bold';
        pokemonInfoValue.textContent = value;
        pokemonInfo.appendChild(pokemonInfoValue);
      };
      const pokemonSubInfos = document.getElementById('pokemon-sub-infos');
      pokemonSubInfos.replaceChildren();
      addSubInfo('H', `${Number((height * 0.1).toFixed(2)).toString()}m`);
      addSubInfo('W', `${Number((weight * 0.1).toFixed(2)).toString()}kg`);
      addSubInfo('HP', stats[0].base_stat);
      addSubInfo('ATK', stats[1].base_stat);
      addSubInfo('DEF', stats[2].base_stat);
      addSubInfo('EXATK', stats[3].base_stat);
      addSubInfo('EXDEF', stats[4].base_stat);
      addSubInfo('SPD', stats[5].base_stat);

      // 포켓몬 번호
      const { id } = resData;
      const dictNum = document.getElementById('dict-num');
      dictNum.textContent = id.toString().padStart(3, '0');

      // 포켓몬 울음소리
      const { cries: { latest } } = resData;
      const criesAudio = document.getElementById('cries-audio');
      criesAudio.src = latest;
    }
    catch (err) {
      console.error('포켓몬 요청 처리 오류:', err);
    }
  })();
}

async function getPokemon(id) {
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
  const URL = `${BASE_URL}/${id}`;

  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error(`네트워크 응답 에러: ${res.status}`);
  }

  return await res.json();
}

function toPascalCase(str) {
  return str
    .replace(/[_\-\s]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}