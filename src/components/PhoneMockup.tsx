'use client';

import React from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import { Sparkles, Wifi, Battery, Signal, Flame, Heart } from 'lucide-react';

interface PhoneMockupProps {
  recipientName?: string;
  vibe: WishVibe;
  headline?: string;
  body: string;
  senderAlias?: string;
  isAnonymous?: boolean;
  revealType?: 'scratch' | 'envelope' | 'glitch' | 'instant';
}

export default function PhoneMockup({
  vibe = 'roast',
}: PhoneMockupProps) {
  const config = VIBE_CONFIGS[vibe];

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] h-[640px] bg-zinc-950 rounded-[48px] p-3.5 border-4 border-zinc-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none">
      {/* Dynamic Island Notch */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>

      {/* Screen Container */}
      <div
        className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between"
      >
        {/* Template renders here in an iframe to enforce mobile viewport for Tailwind */}
        <div className="absolute inset-0 z-0 bg-black">
          <iframe 
            src={`/mockup?vibe=${vibe}`} 
            className="w-full h-full border-none outline-none pointer-events-auto"
            title="Reveal Preview"
          />
        </div>

        {/* Status Bar Overlay (z-20 so it sits on top of template) */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold px-5 pt-3 w-full pointer-events-none">
          {/* We use a drop shadow or text shadow so time is visible on any background */}
          <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">12:00 AM</span>
          <div className="flex items-center gap-1.5 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/60 rounded-full mx-auto mb-2 relative z-20 pointer-events-none" />
      </div>
    </div>
  );
}
