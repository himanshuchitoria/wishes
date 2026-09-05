'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show the splash screen once per session
    const hasSeenSplash = sessionStorage.getItem('chitoria_splash_seen');
    if (!hasSeenSplash) {
      setIsVisible(true);
      sessionStorage.setItem('chitoria_splash_seen', 'true');
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* Halftone background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.1] z-0" 
            style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4">
            
            {/* "For" - Modern, Minimalist */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-transparent"
              style={{ WebkitTextStroke: '3px black' }}
            >
              For
            </motion.span>

            {/* "your" - Elegant, Cursive */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-rose-500 transform -rotate-6"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              your
            </motion.span>

            {/* "loved" - Comic, Pop-Art, Brutalist */}
            <motion.span
              initial={{ opacity: 0, x: -30, rotate: -15 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.4, delay: 0.9, type: 'spring', bounce: 0.5 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-black bg-yellow-400 px-4 py-2 border-[6px] border-black shadow-[8px_8px_0_0_#000] ml-2"
            >
              loved
            </motion.span>

            {/* "ones" - Glossy, Gold, Serif */}
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#d4af37] bg-gradient-to-b from-[#f9f295] via-[#e0aa3e] to-[#b8860b] bg-clip-text text-transparent transform rotate-1 drop-shadow-lg ml-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              ones
            </motion.span>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
