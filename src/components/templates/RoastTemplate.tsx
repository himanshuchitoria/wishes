'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wish } from '@/types';

interface TemplateProps {
  wish: Wish;
  hasUnboxed: boolean;
  onUnbox: () => void;
}

export default function RoastTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'You are officially too old. Enjoy the back pain.';
  const name = wish.recipient_name || 'Old Timer';

  if (!hasUnboxed) {
    return (
      <div className="fixed inset-0 bg-[#FFeb3b] flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ rotate: [-2, 2, -2], scale: [1, 1.1, 1] }} 
          transition={{ duration: 0.5, repeat: Infinity }}
          className="bg-black text-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(244,67,54,1)] transform -rotate-3"
        >
          <h2 className="text-4xl font-black uppercase tracking-tighter">WARNING!</h2>
          <p className="text-sm font-bold text-[#FFeb3b] uppercase mt-1">Hazardous aging detected</p>
        </motion.div>
        <p className="mt-8 font-black uppercase text-black text-xl tracking-wider hover:underline">Tap to detonate</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#FFeb3b] overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
      {/* Halftone / Polka dot background effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '15px 15px' }}
      />

      <motion.div 
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Main Card */}
        <div className="bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative transform rotate-1">
          
          <div className="absolute -top-6 -left-6 bg-[#f44336] text-white border-4 border-black px-4 py-2 transform -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-xl uppercase tracking-tighter">ROASTED</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-black mt-4 mb-2 leading-none">
            {name}
          </h1>
          <p className="text-2xl font-bold text-black/50 uppercase tracking-widest mb-8">is leveled up (sadly)</p>

          <div className="bg-[#2196F3] text-white p-6 border-4 border-black transform rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold leading-tight uppercase">
              "{message}"
            </p>
          </div>
          
          {wish.sender_alias && (
            <p className="text-right mt-6 font-black uppercase text-black text-lg">
              — {wish.sender_alias}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
