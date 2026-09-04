'use client';

import React from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import { soundFX } from '@/lib/audio';

interface VibeSliderProps {
  value: WishVibe;
  onChange: (vibe: WishVibe) => void;
}

const VIBE_ORDER: WishVibe[] = ['roast', 'snarky', 'sweet', 'sentimental', 'custom'];

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
              <span className="text-2xl mb-1">{config.emoji}</span>
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
          <span>🔥 Roast</span>
          <span>😏 Snark</span>
          <span>✨ Sweet</span>
          <span>💌 Tearjerker</span>
          <span>🕶️ Secret</span>
        </div>
      </div>

      {/* Active Mood Preview Banner */}
      <div
        className={`p-3.5 rounded-xl border transition-all duration-300 bg-gradient-to-r ${currentConfig.bgGradient} ${currentConfig.borderGlow} shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentConfig.emoji}</span>
            <div>
              <h4 className="text-sm font-bold text-white">{currentConfig.name}</h4>
              <p className="text-xs text-white/70">{currentConfig.tagline}</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-white/80 border border-white/10 font-mono">
            @{currentConfig.defaultPrefix}.chitoria.dev
          </span>
        </div>
      </div>
    </div>
  );
}
