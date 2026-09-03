'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WishVibe } from '@/types';

interface VibeBackgroundProps {
  vibe: WishVibe;
}

export default function VibeBackground({ vibe }: VibeBackgroundProps) {
  // 1. ROAST / SNARKY: Dark vignette, intense spotlights, floating red/purple orbs
  if (vibe === 'roast' || vibe === 'snarky') {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-black" />
        
        {/* Spotlights */}
        <motion.div
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '20%', '-20%'],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 left-0 w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-screen pointer-events-none ${vibe === 'roast' ? 'bg-orange-600/20' : 'bg-purple-600/20'}`}
        />
        <motion.div
          animate={{
            x: ['20%', '-20%', '20%'],
            y: ['20%', '-20%', '20%'],
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-0 right-0 w-[60vw] h-[60vw] rounded-full blur-[100px] mix-blend-screen pointer-events-none ${vibe === 'roast' ? 'bg-red-600/20' : 'bg-indigo-600/20'}`}
        />
      </div>
    );
  }

  // 2. SWEET / SENTIMENTAL: Soft bokeh, warm animated pastel gradients
  if (vibe === 'sweet' || vibe === 'sentimental') {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden bg-rose-950">
        <motion.div
          animate={{
            background: [
              'linear-gradient(to bottom right, #4c0519, #2e1065)',
              'linear-gradient(to bottom right, #4c1d95, #701a75)',
              'linear-gradient(to bottom right, #4c0519, #2e1065)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-80"
        />
        
        {/* Floating Bokeh Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: '120vh', 
              x: `${Math.random() * 100}vw`,
              scale: Math.random() * 1.5 + 0.5 
            }}
            animate={{ 
              y: '-20vh',
              x: `${Math.random() * 100}vw`,
              rotate: 360 
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * -20,
            }}
            className="absolute w-64 h-64 rounded-full bg-white/5 blur-[40px] mix-blend-overlay pointer-events-none"
          />
        ))}
      </div>
    );
  }

  // 3. CUSTOM: Matrix / Deep sea grid
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-teal-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#115e59_1px,transparent_1px),linear-gradient(to_bottom,#115e59_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"
      />
    </div>
  );
}
