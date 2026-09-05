'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wish } from '@/types';
import StickerOverlay from '../StickerOverlay';

interface TemplateProps {
  wish: Wish;
  hasUnboxed: boolean;
  onUnbox: () => void;
}

export default function SentimentalTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'Thank you for showing up on my hardest days and celebrating my smallest wins.';
  const name = wish.recipient_name || 'My Dearest';

  if (!hasUnboxed) {
    return (
      <div className="absolute inset-0 bg-[#f8f5f2] flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7] }} 
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto border-t-2 border-l-2 border-[#8b7d6b] rotate-45 mb-4" />
          <p className="text-[#8b7d6b] tracking-[0.3em] text-sm font-light uppercase" style={{ fontFamily: 'var(--font-playfair)' }}>
            To {name}
          </p>
          <p className="text-[#a89f91] text-xs mt-4 uppercase tracking-widest">Gently open</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#fdfbf7] overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 text-[#4a4036] selection:bg-[#e6dfd3] selection:text-[#4a4036]">
      {/* Soft gradient blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f1ebe1] via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#d3cabc] pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[#d3cabc] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-8 sm:space-y-12"
      >
        <div className="space-y-4">
          <p className="text-[#a89f91] tracking-[0.2em] text-xs sm:text-sm uppercase">Happy Birthday</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#2d261e] break-words px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {name}
          </h1>
        </div>

        <div className="w-px h-16 bg-[#e6dfd3]" />

        <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-[#5c5346] max-w-lg px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          "{message}"
        </p>
        
        {wish.sender_alias && (
          <p className="text-sm tracking-wider text-[#8b7d6b] pt-8" style={{ fontFamily: 'var(--font-great-vibes)', fontSize: '1.5rem' }}>
            — {wish.sender_alias}
          </p>
        )}

        {/* Sticker Overlay */}
        <StickerOverlay elements={wish.message_payload?.elements || []} />
      </motion.div>
    </div>
  );
}
