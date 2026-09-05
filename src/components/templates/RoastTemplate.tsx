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

export default function RoastTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'You are officially too old. Enjoy the back pain.';
  const name = wish.recipient_name || 'Old Timer';

  if (!hasUnboxed) {
    return (
      <div className="absolute inset-0 bg-[#FFeb3b] flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ rotate: [-2, 2, -2], scale: [1, 1.1, 1] }} 
          transition={{ duration: 0.5, repeat: Infinity }}
          className="bg-black text-white px-4 sm:px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(244,67,54,1)] transform -rotate-3 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">WARNING!</h2>
          <p className="text-xs sm:text-sm font-bold text-[#FFeb3b] uppercase mt-1">Hazardous aging detected</p>
        </motion.div>
        <p className="mt-8 font-black uppercase text-black text-xl tracking-wider hover:underline">Tap to detonate</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#FFeb3b] overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
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
        <div className="bg-white border-4 sm:border-8 border-black p-4 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative transform rotate-1 w-full">
          
          <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-[#f44336] text-white border-2 sm:border-4 border-black px-3 py-1 sm:px-4 sm:py-2 transform -rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
            <span className="font-black text-lg sm:text-xl uppercase tracking-tighter">ROASTED</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mt-6 sm:mt-4 mb-1 sm:mb-2 leading-none break-words">
            {name}
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-black/50 uppercase tracking-widest mb-6 sm:mb-8 break-words">is leveled up (sadly)</p>

          <div className="bg-[#2196F3] text-white p-4 sm:p-6 border-2 sm:border-4 border-black transform rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-base sm:text-xl font-bold leading-tight uppercase">
              "{message}"
            </p>
          </div>
          
          {wish.sender_alias && (
            <p className="text-right mt-4 sm:mt-6 font-black uppercase text-black text-sm sm:text-lg break-words">
              — {wish.sender_alias}
            </p>
          )}

          {/* Sticker Overlay */}
          <StickerOverlay elements={wish.message_payload?.elements || []} />
        </div>
      </motion.div>
    </div>
  );
}
