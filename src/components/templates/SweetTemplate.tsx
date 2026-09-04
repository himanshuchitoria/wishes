'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wish } from '@/types';
import { Sparkle, DashedCorner } from './CelebrationAssets';
import { soundFX } from '@/lib/audio';

interface TemplateProps {
  wish: Wish;
  hasUnboxed: boolean;
  onUnbox: () => void;
}

export default function SweetTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'Wishing you a fantastic year ahead filled with success, joy, and good health!';
  const name = wish.recipient_name || 'Allen Dae';
  const imageUrl = wish.message_payload?.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'; // Fallback portrait

  // Pre-unbox state (The envelope/locked state)
  if (!hasUnboxed) {
    return (
      <div className="absolute inset-0 bg-violet-950 flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ scale: [1, 1.02, 1], y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="relative max-w-sm w-full aspect-[3/4] bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center justify-center"
        >
          <div className="absolute inset-2 border-2 border-dashed border-violet-200 rounded-lg" />
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-6">
            <span className="text-3xl">💌</span>
          </div>
          <h2 className="text-2xl font-black text-violet-900 mb-2 text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
            For {name}
          </h2>
          <p className="text-sm text-violet-500 font-medium tracking-widest uppercase">Tap to open</p>
        </motion.div>
      </div>
    );
  }

  // Revealed State (Exact Figma Match)
  return (
    <div className="absolute inset-0 bg-[#4c1d95] overflow-hidden flex flex-col items-center justify-center text-white font-[family-name:var(--font-inter)] selection:bg-yellow-400 selection:text-black">
      
      {/* Dashed Corners */}
      <DashedCorner className="bottom-0 left-0" position="bottom-left" />
      <DashedCorner className="bottom-0 right-0" position="bottom-right" />

      {/* Massive Background OUTLINE Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 overflow-hidden leading-[0.8] select-none">
        <span className="text-[25vw] font-black uppercase text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>BIR</span>
        <span className="text-[25vw] font-black uppercase text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>TH</span>
        <span className="text-[25vw] font-black uppercase text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>DAY</span>
      </div>

      {/* Sparkles */}
      <Sparkle className="top-[25%] left-[20%] w-8 h-8" />
      <Sparkle className="top-[30%] left-[22%] w-4 h-4" />
      <Sparkle className="top-[20%] right-[25%] w-10 h-10" />
      <Sparkle className="bottom-[35%] left-[25%] w-8 h-8" />
      <Sparkle className="bottom-[30%] left-[20%] w-6 h-6" />

      {/* Content Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 flex flex-col items-center w-full max-w-md px-6"
      >
        
        {/* Top Typography */}
        <div className="text-center relative -mb-10 z-20">
          <h3 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-[-10px]">Happy</h3>
          <h1 className="text-7xl md:text-8xl text-white transform -rotate-3 drop-shadow-md" style={{ fontFamily: 'var(--font-great-vibes)' }}>
            Birthday
          </h1>
        </div>

        {/* Polaroid Frame */}
        <motion.div 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white p-4 pb-16 md:p-5 md:pb-20 shadow-2xl relative w-full aspect-[4/5] transform -rotate-2"
        >
          {/* Inner Image */}
          <div className="w-full h-full bg-zinc-200 overflow-hidden relative">
            <img 
              src={imageUrl} 
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Polaroid Name Text */}
          <div className="absolute bottom-4 md:bottom-5 left-0 w-full text-center">
            <span className="text-3xl md:text-4xl font-bold text-zinc-700" style={{ fontFamily: 'var(--font-playfair)' }}>
              {name}
            </span>
          </div>
        </motion.div>

        {/* Bottom Message Text */}
        <div className="mt-12 text-center relative z-20">
          <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed max-w-[280px] md:max-w-[320px] mx-auto drop-shadow-md">
            {message}
          </p>
        </div>

      </motion.div>
    </div>
  );
}
