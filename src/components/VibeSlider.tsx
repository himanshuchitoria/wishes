'use client';

import React from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import { soundFX } from '@/lib/audio';

interface VibeSliderProps {
  value: WishVibe;
  onChange: (vibe: WishVibe) => void;
}

const VIBE_ORDER: WishVibe[] = ['roast', 'snarky', 'sweet', 'sentimental', 'custom'];

const VIBE_ICONS: Record<WishVibe, React.ReactNode> = {
  roast: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black drop-shadow-[2px_2px_0px_#000]">
      <circle cx="12" cy="12" r="8" fill="#FFeb3b" stroke="black" strokeWidth="2"/>
      <path d="M12 4V2M16 5l1.5-1.5M19 9h2" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9.5 10.5L10 11M14.5 10.5L14 11M10 15c1 1 3 1 4 0" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  snarky: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 drop-shadow-[0_0_5px_#06b6d4]">
      <path d="M4 17L10 11L4 5" stroke="#06b6d4" strokeWidth="2" strokeLinecap="square"/>
      <path d="M12 19H20" stroke="#d946ef" strokeWidth="2" strokeLinecap="square"/>
      <path d="M5 17L11 11L5 5" stroke="#d946ef" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="square" transform="translate(-2, 0)"/>
    </svg>
  ),
  sweet: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 drop-shadow-md">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#fbbf24" />
      <path d="M5 4L6 7L9 8L6 9L5 12L4 9L1 8L4 7L5 4Z" fill="#fb7185" />
      <path d="M19 18L19.5 20.5L22 21L19.5 21.5L19 24L18.5 21.5L16 21L18.5 20.5L19 18Z" fill="#a78bfa" />
    </svg>
  ),
  sentimental: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="#4a4036" strokeWidth="1"/>
      <path d="M7 12H17M12 7V17" stroke="#4a4036" strokeWidth="1"/>
      <path d="M9 9L15 15M15 9L9 15" stroke="#4a4036" strokeWidth="1" strokeOpacity="0.5"/>
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 drop-shadow-[0_0_5px_#d4af37]">
      <path d="M12 2L20 8L12 22L4 8L12 2Z" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 2V22" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5"/>
      <path d="M4 8H20" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5"/>
    </svg>
  )
};

export default function VibeSlider({ value, onChange }: VibeSliderProps) {
  const currentIndex = VIBE_ORDER.indexOf(value);
  const currentConfig = VIBE_CONFIGS[value];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    const newVibe = VIBE_ORDER[idx];
    if (newVibe !== value) {
      soundFX.playPop();
      onChange(newVibe);
    }
  };

  const handleSelectVibe = (vibe: WishVibe) => {
    soundFX.playPop();
    onChange(vibe);
  };

  return (
    <div className="space-y-4">
      {/* Vibe Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {VIBE_ORDER.map((vibeKey) => {
          const config = VIBE_CONFIGS[vibeKey];
          const isSelected = value === vibeKey;
          return (
            <button
              key={vibeKey}
              type="button"
              onClick={() => handleSelectVibe(vibeKey)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? `bg-black/20 ${config.borderGlow} border-opacity-100 scale-[1.03] backdrop-blur-md shadow-lg shadow-black/20`
                  : 'bg-black/5 border-transparent hover:bg-black/10 hover:border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="mb-2 scale-[0.85] origin-bottom">{VIBE_ICONS[vibeKey]}</div>
              <span className={`text-xs font-bold ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
                {config.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Range Slider */}
      <div className="relative pt-2 pb-1 px-1">
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={currentIndex >= 0 ? currentIndex : 0}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-black/20 rounded-lg appearance-none cursor-pointer accent-current transition-all focus:outline-none"
        />
        <div className="flex justify-between text-[11px] font-semibold opacity-70 mt-1.5 px-0.5">
          <span>Roast</span>
          <span>Snark</span>
          <span>Sweet</span>
          <span>Tearjerker</span>
          <span>Secret</span>
        </div>
      </div>

      {/* Active Mood Preview Banner */}
      <div
        className={`p-3.5 rounded-xl border transition-all duration-300 bg-gradient-to-r ${currentConfig.bgGradient} ${currentConfig.borderGlow} shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="scale-75 origin-left">{VIBE_ICONS[value]}</div>
            <div>
              <h4 className="text-sm font-bold text-white">{currentConfig.name}</h4>
              <p className="text-xs text-white/70">{currentConfig.tagline}</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-white/80 border border-white/10 font-mono">
            {currentConfig.defaultPrefix}@chitoria.dev
          </span>
        </div>
      </div>
    </div>
  );
}
