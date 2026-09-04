'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wish } from '@/types';

interface TemplateProps {
  wish: Wish;
  hasUnboxed: boolean;
  onUnbox: () => void;
}

export default function CustomTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'A top secret file has been declassified...';
  const name = wish.recipient_name || 'Agent';

  if (!hasUnboxed) {
    return (
      <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-32 border border-[#d4af37]/30 flex items-center justify-center relative"
        >
          <div className="absolute w-8 h-8 rounded-full bg-[#d4af37]/10" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
        </motion.div>
        <p className="mt-8 text-[#d4af37] text-xs uppercase tracking-[0.4em] font-light">Break Seal</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-[#d4af37] selection:text-black">
      {/* Golden Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Gold Dust */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, Math.random() * 0.5 + 0.2, 0] }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * -10,
          }}
          className="absolute w-1 h-1 rounded-full bg-[#d4af37] blur-[1px] pointer-events-none"
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-10"
      >
        <div className="space-y-4">
          <p className="text-[#8b7322] tracking-[0.3em] text-xs uppercase">Celebrating</p>
          <h1 className="text-4xl sm:text-6xl font-light tracking-widest text-[#d4af37]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {name}
          </h1>
        </div>

        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />

        <div className="px-4 py-8 border-y border-[#d4af37]/10">
          <p className="text-lg sm:text-xl font-light leading-relaxed text-zinc-300 max-w-xl mx-auto">
            {message}
          </p>
        </div>
        
        {wish.sender_alias && (
          <p className="text-sm tracking-[0.2em] text-[#d4af37]/70 uppercase">
            From {wish.sender_alias}
          </p>
        )}
      </motion.div>
    </div>
  );
}
