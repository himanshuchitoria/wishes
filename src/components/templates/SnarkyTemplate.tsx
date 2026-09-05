'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wish } from '@/types';

interface TemplateProps {
  wish: Wish;
  hasUnboxed: boolean;
  onUnbox: () => void;
}

export default function SnarkyTemplate({ wish, hasUnboxed, onUnbox }: TemplateProps) {
  const message = wish.message_payload?.body || 'SYSTEM ERROR: Subject has survived another cycle.';
  const name = wish.recipient_name || 'USER_404';

  if (!hasUnboxed) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 cursor-pointer" onClick={onUnbox}>
        <motion.div 
          animate={{ opacity: [1, 0, 1, 1, 0.5, 1] }} 
          transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", repeatDelay: 2 }}
          className="text-center font-mono"
        >
          <p className="text-red-500 font-bold text-xl mb-2">{'>>'} ENCRYPTED PAYLOAD DETECTED</p>
          <p className="text-green-500 text-sm">Awaiting manual override...</p>
          <button className="mt-8 border border-green-500 text-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition-colors uppercase tracking-widest text-xs">
            Initialize Decryption
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-zinc-950 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 font-mono selection:bg-cyan-500 selection:text-black">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Neon Glows */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-2xl bg-black/80 border border-zinc-800 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]"
      >
        {/* Terminal Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-xs text-zinc-500">root@{name.toLowerCase().replace(/\s+/g, '_')} ~ /sys/birthday</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <motion.h1 
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-tight break-words"
            >
              SUBJECT: {name}
            </motion.h1>
            <p className="text-fuchsia-400 text-xs sm:text-sm mt-1">STATUS: SURVIVED ANOTHER SOLAR ORBIT.</p>
          </div>

          <div className="border-l-2 border-cyan-500 pl-4 py-2">
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>

          {wish.sender_alias && (
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-zinc-500 text-xs">
                <span className="text-cyan-500">{'>>'}</span> AUTHORIZED BY: <span className="text-zinc-300">{wish.sender_alias}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
