import React, { useEffect, useRef, useState } from 'react';

import { fetchPokemonData } from '@/api';
import type { PokemonData } from '@/types/types';

const MAX_ID = 1025;

const App: React.FC = () => {
  const [curId, setCurId] = useState<number>(1);
  const [pokemon, setPokemon] = useState<PokemonData>();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadPokemon(curId);
  }, [curId]);

  const loadPokemon = async (id: number) => {
    try {
      const data = await fetchPokemonData(id);
      console.log(data);
      setPokemon(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    const input = prompt(`검색할 번호를 입력하세요. (1-${MAX_ID})`);
    const num = Number(input);
    if (num >= 1 && num <= MAX_ID) setCurId(num);
    else if (input !== null) alert('잘못된 번호입니다.');
  };

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.05;
      audioRef.current.play();
    }
  };

  if (!pokemon) return <div className="flex h-screen items-center justify-center">로딩 중...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center gap-4 bg-gray-50">
      {/* Prev Button */}
      <button
        onClick={() => curId > 1 && setCurId((prev) => prev - 1)}
        className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 font-bold text-white disabled:opacity-30"
        disabled={curId <= 1}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-6 rotate-180" stroke="currentColor">
          <path
            d="M6 12H18M18 12L13 7M18 12L13 17"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Card */}
      <div className="relative flex h-80 w-64 flex-col overflow-hidden rounded-2xl border-8 border-gray-600 bg-white shadow-xl">
        <div className="flex h-24 items-center justify-center bg-white p-2">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="h-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 bg-gray-200 p-4">
          {/* Main Info */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-lg font-extrabold text-gray-800">{toPascalCase(pokemon.name)}</p>
            {pokemon.types.map((t, i) => (
              <div
                key={i}
                className="rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                {toPascalCase(t.type.name)}
              </div>
            ))}
          </div>

          {/* Sub Info */}
          <div className="flex flex-wrap gap-x-1 gap-y-1 text-[10px]">
            <InfoTag label="H" value={`${(pokemon.height * 0.1).toFixed(1)}m`} />
            <InfoTag label="W" value={`${(pokemon.weight * 0.1).toFixed(1)}kg`} />
            <InfoTag label="HP" value={pokemon.stats[0].base_stat} />
            <InfoTag label="ATK" value={pokemon.stats[1].base_stat} />
            <InfoTag label="DEF" value={pokemon.stats[2].base_stat} />
            <InfoTag label="EXATK" value={pokemon.stats[3].base_stat} />
            <InfoTag label="EXDEF" value={pokemon.stats[4].base_stat} />
            <InfoTag label="SPD" value={pokemon.stats[5].base_stat} />
          </div>
        </div>

        {/* Floating UI */}
        <div
          onClick={handleSearch}
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white"
        >
          {String(pokemon.id).padStart(3, '0')}
        </div>

        <button
          onClick={playCry}
          className="absolute top-4 left-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <audio ref={audioRef} src={pokemon.cries.latest} />
        </button>
      </div>

      {/* Next Button */}
      <button
        onClick={() => curId < MAX_ID && setCurId((prev) => prev + 1)}
        className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 font-bold text-white disabled:opacity-30"
        disabled={curId >= MAX_ID}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-6" stroke="currentColor">
          <path
            d="M6 12H18M18 12L13 7M18 12L13 17"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

const InfoTag = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex gap-1 rounded-md border border-gray-300 bg-gray-100 p-1 text-gray-700">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export const toPascalCase = (str: string) =>
  str
    .replace(/[_\-\s]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

export default App;
