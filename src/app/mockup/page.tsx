'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Wish, VIBE_CONFIGS, WishVibe } from '@/types';
import SweetTemplate from '@/components/templates/SweetTemplate';
import SentimentalTemplate from '@/components/templates/SentimentalTemplate';
import RoastTemplate from '@/components/templates/RoastTemplate';
import SnarkyTemplate from '@/components/templates/SnarkyTemplate';
import CustomTemplate from '@/components/templates/CustomTemplate';

function MockupContent() {
  const searchParams = useSearchParams();
  const vibe = (searchParams.get('vibe') as WishVibe) || 'roast';
  const config = VIBE_CONFIGS[vibe];
  
  const [hasUnboxed, setHasUnboxed] = useState(false);

  const mockWish: Wish = {
    id: 'mock',
    user_id: 'mock',
    group_token: 'mock',
    reveal_token: 'mock',
    recipient_name: 'Alex',
    recipient_email: 'test@example.com',
    sender_alias: 'The Roast Crew',
    birth_date: new Date().toISOString(),
    delivery_time: '00:00:00',
    delivery_timezone: 'UTC',
    vibe: vibe,
    is_anonymous: false,
    sender_email_prefix: config.defaultPrefix,
    message_payload: { body: config.sampleMessage },
    status: 'delivered',
    is_group_board: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const props = { wish: mockWish, hasUnboxed, onUnbox: () => setHasUnboxed(true) };

  return (
    <div className="w-full h-[100dvh] overflow-hidden relative">
      {vibe === 'sweet' && <SweetTemplate {...props} />}
      {vibe === 'sentimental' && <SentimentalTemplate {...props} />}
      {vibe === 'roast' && <RoastTemplate {...props} />}
      {vibe === 'snarky' && <SnarkyTemplate {...props} />}
      {vibe === 'custom' && <CustomTemplate {...props} />}
    </div>
  );
}

export default function MockupPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <MockupContent />
    </Suspense>
  );
}
