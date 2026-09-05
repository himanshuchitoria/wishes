'use client';

import React, { useState } from 'react';
import { WishVibe, VIBE_CONFIGS, Wish } from '@/types';
import { Sparkles, Wifi, Battery, Signal, Flame, Heart } from 'lucide-react';

import SweetTemplate from './templates/SweetTemplate';
import SentimentalTemplate from './templates/SentimentalTemplate';
import RoastTemplate from './templates/RoastTemplate';
import SnarkyTemplate from './templates/SnarkyTemplate';
import CustomTemplate from './templates/CustomTemplate';

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
  
  // Create a mock wish to pass to the templates
  const mockWish: Wish = {
    id: 'mock',
    user_id: 'mock',
    group_token: 'mock',
    reveal_token: 'mock',
    recipient_name: recipientName || 'Alex',
    recipient_email: 'test@example.com',
    sender_alias: senderAlias,
    birth_date: new Date().toISOString(),
    delivery_time: '00:00:00',
    delivery_timezone: 'UTC',
    vibe: vibe,
    is_anonymous: isAnonymous || false,
    sender_email_prefix: config.defaultPrefix,
    message_payload: { body: body },
    status: 'delivered',
    is_group_board: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const renderTemplate = () => {
    // We always show the unboxed state for the mockup to show off the design
    const props = { wish: mockWish, hasUnboxed: true, onUnbox: () => {} };
    switch (mockWish.vibe) {
      case 'sweet': return <SweetTemplate {...props} />;
      case 'sentimental': return <SentimentalTemplate {...props} />;
      case 'roast': return <RoastTemplate {...props} />;
      case 'snarky': return <SnarkyTemplate {...props} />;
      case 'custom': return <CustomTemplate {...props} />;
      default: return <SweetTemplate {...props} />;
    }
  };

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
        {/* Template renders here, absolutely positioned to fill the screen */}
        <div className="absolute inset-0 z-0">
          {renderTemplate()}
        </div>

        {/* Status Bar Overlay (z-20 so it sits on top of template) */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold px-5 pt-3 w-full">
          {/* We use a drop shadow or text shadow so time is visible on any background */}
          <span className="text-white drop-shadow-md">12:00 AM</span>
          <div className="flex items-center gap-1.5 text-white drop-shadow-md">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/60 rounded-full mx-auto mb-2 relative z-20" />
      </div>
    </div>
  );
}
