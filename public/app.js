/**
 * @property {string} source (Required) 원본 텍스트(Source)의 언어 코드
 * @property {string} target (Required) 번역할 텍스트(Target)의 언어 코드
 * @property {string} text (Required) 번역할 텍스트
 * @property {string} glossaryKey (Optional) 용어집 아이디
 * @property {string} replaceInfo (Optional) 치환 번역 인덱스
 * @property {string} honorific (Optional) 높임말 적용 여부
 */
const TRANSLATE_REQ_KEY = {
  source: 'source',
  target: 'target',
  text: 'text',
  glossaryKey: 'glossaryKey',
  replaceInfo: 'replaceInfo',
  honorific: 'honorific',
}

getPokemonHandler();

function getPokemonHandler() {
  (async () => {
    try {
      // 포켓몬 데이터 가져오기
      const detectResData = await getPokemon(1);
      console.log(detectResData);

      // 포켓몬 초상화
      const pokemonPortrait = document.getElementById('pokemon-portrait-wrapper').getElementsByTagName('img')[0];
      const { sprites: { front_default } } = detectResData;
      pokemonPortrait.src = front_default;

      // 포켓몬 메인 정보
      const { name, types } = detectResData;
      const addMainInfo = (name, ...types) => {
        // 메인 정보 컨테이너
        const container = document.getElementById('pokemon-main-infos');
        container.className = 'flex gap-x-2 gap-y-1 flex-wrap';
        // 이름
        const pokemonName = document.createElement('p');
        pokemonName.className = 'text-gray-800 w-auto text-lg font-extrabold';
        pokemonName.textContent = name;
        container.appendChild(pokemonName);
        // 태그
        for (const type of types) {
          // 태그
          const pokemonInfo = document.createElement('div');
          pokemonInfo.className = 'text-white w-auto bg-gray-700 px-2 py-1 rounded-full text-xs font-bold';
          container.appendChild(pokemonInfo);
          const pokemonInfoValue = document.createElement('span');
          pokemonInfoValue.className = '';
          pokemonInfoValue.textContent = type.type.name;
          pokemonInfo.appendChild(pokemonInfoValue);
        }
      };
      // 이름
      addMainInfo(name, ...types);

      // 포켓몬 서브 정보
      const { height, weight, stats } = detectResData;
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
      addSubInfo('H', `${(height * 0.1).toFixed(2)}m`);
      addSubInfo('W', `${(weight * 0.1).toFixed(2)}kg`);
      addSubInfo('HP', stats[0].base_stat);
      addSubInfo('ATK', stats[1].base_stat);
      addSubInfo('DEF', stats[2].base_stat);
      addSubInfo('EXATK', stats[3].base_stat);
      addSubInfo('EXDEF', stats[4].base_stat);
      addSubInfo('SPD', stats[5].base_stat);
    }
    catch (err) {
      console.error('포켓몬 요청 처리 오류:', err);
    }
  })();
}

async function getPokemon(id) {
  const BASE_URL = '/pokemon';
  const URL = `${BASE_URL}/${id}`;
  const res = await fetch(URL);
  return await res.json();
}