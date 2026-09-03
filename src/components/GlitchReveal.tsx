'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Skull, AlertTriangle } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { CanvasElement } from '@/types';
import StickerOverlay from './StickerOverlay';

interface GlitchRevealProps {
  headline?: string;
  body: string;
  senderAlias?: string;
  isAnonymous?: boolean;
  mediaUrl?: string;
  elements?: CanvasElement[];
  onRevealed?: () => void;
  accentColor?: string;
}

// Random hex garbage generator
const hexGarbage = () =>
  Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ');

const ERROR_CODES = [
  '0x0000007E', '0xDEADBEEF', '0xC000021A', '0x0000001E', '0xCAFEBABE', '0xFEEDFACE',
];

export default function GlitchReveal({
  headline, body, senderAlias, isAnonymous, mediaUrl, elements = [], onRevealed,
}: GlitchRevealProps) {
  const [phase, setPhase] = useState<'bsod' | 'glitching' | 'revealed'>('bsod');
  const [hexLines, setHexLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate hex dump
  useEffect(() => {
    if (phase !== 'bsod') return;
    setHexLines(Array.from({ length: 6 }, () => hexGarbage()));
    intervalRef.current = setInterval(() => {
      setHexLines(prev => prev.map(() => hexGarbage()));
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const handleReveal = () => {
    if (phase !== 'bsod') return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('glitching');
    soundFX.playPop();

    // Progress bar
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 8 + 2;
      setProgress(Math.min(prog, 100));
      if (prog >= 100) {
        clearInterval(progInterval);
        setTimeout(() => {
          setPhase('revealed');
          soundFX.playCelebration();
          if (onRevealed) onRevealed();
        }, 600);
      }
    }, 80);
  };

  const errorCode = ERROR_CODES[Math.floor(Math.random() * ERROR_CODES.length)];

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {/* ── Phase 1: BSOD Screen ───────────────────────────────────────── */}
        {phase === 'bsod' && (
          <motion.div
            key="bsod"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: [1, 1.02, 0.98, 1.03, 0.97, 0],
              filter: ['none', 'hue-rotate(90deg)', 'hue-rotate(180deg)', 'hue-rotate(270deg)', 'none'],
              x: [0, -8, 6, -4, 8, 0],
            }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-2xl border border-violet-500/40 bg-[#0a0014] shadow-2xl shadow-violet-500/20 overflow-hidden cursor-pointer select-none"
            onClick={handleReveal}
          >
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            }} />

            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-900/40 border-b border-violet-500/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-violet-300 ml-2">SYSTEM_CRITICAL.exe — TERMINAL</span>
            </div>

            <div className="p-6 font-mono space-y-4">
              {/* Skull icon */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <Skull className="w-6 h-6 text-violet-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-violet-300 text-xs font-bold uppercase tracking-widest">System Fault</p>
                  <p className="text-white text-sm font-black">UNEXPECTED_BIRTHDAY_EXCEPTION</p>
                </div>
              </div>

              {/* Error code */}
              <div className="border border-violet-500/20 rounded-lg p-3 bg-violet-950/30 space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-400 text-[10px] font-bold">STOP CODE:</span>
                  <span className="text-white text-[10px] font-mono">{errorCode}</span>
                </div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  A critical process has detected a surprise that could not be safely contained.
                  If this is the first time you&apos;ve seen this stop error, restart your expectations.
                </p>
              </div>

              {/* Hex dump */}
              <div className="space-y-0.5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Memory Dump:</p>
                {hexLines.map((line, i) => (
                  <p key={i} className="text-[10px] text-zinc-400 font-mono leading-tight">
                    <span className="text-violet-400">{(i * 16).toString(16).padStart(4, '0').toUpperCase()}:</span> {line}
                  </p>
                ))}
              </div>

              {/* CTA */}
              <div className="border border-violet-500/30 rounded-lg p-3 bg-violet-900/20 text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
                  <span className="text-violet-300 text-xs font-bold">Click anywhere to force-terminate...</span>
                </div>
                <p className="text-[9px] text-zinc-500">qr://chitoria.dev/birthday.sys — v1.0.0</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Phase 2: Glitching / Loading ──────────────────────────────── */}
        {phase === 'glitching' && (
          <motion.div
            key="glitching"
            initial={{ opacity: 1 }}
            animate={{
              opacity: [1, 0.3, 1, 0.5, 1],
              x: [0, -5, 4, -3, 0],
              filter: ['hue-rotate(0deg)', 'hue-rotate(120deg)', 'hue-rotate(240deg)', 'hue-rotate(0deg)'],
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] }}
            className="w-full rounded-2xl border border-violet-500/40 bg-[#0a0014] p-8 space-y-6 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5 text-violet-400 animate-spin" />
              <span className="text-violet-300 font-mono text-sm font-bold">DECRYPTING SURPRISE...</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 rounded-full"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">{Math.round(progress)}% — decompressing love.tar.gz</p>
          </motion.div>
        )}

        {/* ── Phase 3: Revealed Message ──────────────────────────────────── */}
        {phase === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full relative"
          >
            <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/80 via-zinc-900 to-cyan-950/60 shadow-2xl shadow-violet-500/20 p-8 space-y-4">
              {/* Glitchy top accent */}
              <div className="h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6)' }} />

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 text-[10px] font-mono uppercase tracking-widest">Surprise decrypted</span>
              </div>

              {headline && (
                <h2 className="text-xl font-black text-white leading-tight">{headline}</h2>
              )}

              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">{body}</p>

              {mediaUrl && (
                <img src={mediaUrl} alt="Birthday media" className="w-full rounded-xl object-cover max-h-64" />
              )}

              <p className="text-[11px] text-zinc-500 text-right font-mono">
                {isAnonymous ? '— [SENDER REDACTED]' : `— ${senderAlias || 'Someone'}`}
              </p>
            </div>

            {/* Sticker overlay */}
            {elements.length > 0 && <StickerOverlay elements={elements} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
