'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Sparkles } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { CanvasElement, CARD_THEME_CONFIGS, CardTheme } from '@/types';
import StickerOverlay from './StickerOverlay';

interface InstantRevealProps {
  headline?: string;
  body: string;
  senderAlias?: string;
  isAnonymous?: boolean;
  mediaUrl?: string;
  theme?: CardTheme;
  elements?: CanvasElement[];
  onRevealed?: () => void;
}

export default function InstantReveal({
  headline, body, senderAlias, isAnonymous, mediaUrl,
  theme = 'midnight-gold', elements = [], onRevealed,
}: InstantRevealProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    soundFX.playCelebration();
    // Burst from both sides
    confetti({ particleCount: 80, spread: 70, origin: { x: 0.1, y: 0.6 }, angle: 60 });
    confetti({ particleCount: 80, spread: 70, origin: { x: 0.9, y: 0.6 }, angle: 120 });
    if (onRevealed) setTimeout(onRevealed, 500);
  }, [onRevealed]);

  const themeConfig = CARD_THEME_CONFIGS[theme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
      className="w-full max-w-lg mx-auto relative"
    >
      <div className={`rounded-2xl border ${themeConfig.borderClass} ${themeConfig.glowClass} bg-gradient-to-br ${themeConfig.bg} p-8 shadow-2xl space-y-5`}>
        {/* Top gradient bar */}
        <div className="h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${themeConfig.accentFrom}, ${themeConfig.accentTo})` }} />

        {/* Badge */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Gift className="w-5 h-5" style={{ color: themeConfig.accentFrom }} />
          </motion.div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${themeConfig.textClass}`}>
            Happy Birthday! {themeConfig.emoji}
          </span>
        </div>

        {headline && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-white leading-tight"
          >
            {headline}
          </motion.h2>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line"
        >
          {body}
        </motion.p>

        {mediaUrl && (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            src={mediaUrl}
            alt="Birthday media"
            className="w-full rounded-xl object-cover max-h-64"
          />
        )}

        {/* Bottom gradient bar */}
        <div className="h-0.5 rounded-full opacity-40" style={{ background: `linear-gradient(90deg, ${themeConfig.accentTo}, ${themeConfig.accentFrom})` }} />

        <p className={`text-[11px] text-right font-mono ${themeConfig.textClass} opacity-70`}>
          {isAnonymous ? '— A Secret Admirer ✨' : `— ${senderAlias || 'Someone Special'}`}
        </p>
      </div>

      {/* Sticker overlay */}
      {elements.length > 0 && <StickerOverlay elements={elements} />}
    </motion.div>
  );
}
