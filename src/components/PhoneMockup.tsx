'use client';

import React from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import ScratchCard from './ScratchCard';
import EnvelopeReveal from './EnvelopeReveal';
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
  recipientName = 'Alex',
  vibe = 'roast',
  headline,
  body,
  senderAlias = 'The Roast Crew',
  isAnonymous = true,
  revealType,
}: PhoneMockupProps) {
  const config = VIBE_CONFIGS[vibe];
  const activeReveal = revealType || config.defaultReveal;

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] h-[640px] bg-zinc-950 rounded-[48px] p-3.5 border-4 border-zinc-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 select-none">
      {/* Dynamic Island Notch */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>

      {/* Screen Container */}
      <div
        className={`relative w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-b ${config.bgGradient} flex flex-col justify-between p-4 pt-10 border border-white/5`}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 px-3 z-20">
          <span>12:00 AM</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Pill & Recipient Tag */}
        <div className="text-center space-y-1.5 my-2 z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-bold text-zinc-300">
            <span>chitoria.dev</span>
            <span>•</span>
            <span className="text-rose-400">Midnight Delivery</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight">
            Happy Birthday, {recipientName}! {config.emoji}
          </h2>
        </div>

        {/* Live Interactive Payload Screen */}
        <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto py-2 z-10">
          {activeReveal === 'scratch' ? (
            <ScratchCard
              headline={headline || `A special message from ${senderAlias}`}
              body={body || config.sampleMessage}
              senderAlias={senderAlias}
              isAnonymous={isAnonymous}
            />
          ) : (
            <EnvelopeReveal
              headline={headline || `A special note for you`}
              body={body || config.sampleMessage}
              senderAlias={senderAlias}
              isAnonymous={isAnonymous}
            />
          )}
        </div>

        {/* Bottom Viral CTA within mockup */}
        <div className="text-center pt-2 border-t border-white/10 z-10">
          <p className="text-[10px] text-zinc-400">
            ⚡ Want to surprise a friend? <span className="text-rose-400 font-bold">chitoria.dev</span>
          </p>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-1 z-20" />
      </div>
    </div>
  );
}
