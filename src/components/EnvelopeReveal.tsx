'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '@/lib/audio';
import { Heart, Sparkles } from 'lucide-react';
import ImageModal from './ImageModal';

interface EnvelopeRevealProps {
  headline?: string;
  body: string;
  senderAlias?: string;
  isAnonymous?: boolean;
  mediaUrl?: string;
  onRevealed?: () => void;
  accentColor?: string;
}

export default function EnvelopeReveal({
  headline,
  body,
  senderAlias,
  isAnonymous,
  mediaUrl,
  onRevealed,
}: EnvelopeRevealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundFX.playSwoosh();
    setTimeout(() => {
      soundFX.playCelebration();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24'],
      });
      if (onRevealed) onRevealed();
    }, 400);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      {!isOpen ? (
        /* Sealed Envelope Card */
        <div
          onClick={handleOpen}
          className="cursor-pointer group relative w-full max-w-md bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-950 border border-rose-500/30 rounded-3xl p-8 shadow-2xl shadow-rose-500/10 hover:shadow-rose-500/25 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center space-y-6"
        >
          <div className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            ✉️ Special Delivery
          </div>

          {/* Wax Seal Button */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 p-1 shadow-lg shadow-rose-600/40 group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-rose-300/40 flex items-center justify-center bg-gradient-to-br from-rose-700 to-rose-900">
              <Heart className="w-8 h-8 text-rose-100 fill-rose-100 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              You Have a Birthday Letter
            </h3>
            <p className="text-xs text-zinc-400">
              Tap the wax seal to break open your surprise
            </p>
          </div>

          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 tracking-wide uppercase transition-all"
          >
            Break Seal & Open ✨
          </button>
        </div>
      ) : (
        /* Unfolded Letter */
        <div className="w-full max-w-lg bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Birthday Capsule
              </span>
            </div>
            <span className="text-xs text-zinc-500">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {headline && (
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {headline}
            </h3>
          )}
          
          {mediaUrl && (
            <div 
              className="w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-xl my-4 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <img src={mediaUrl} alt="Surprise" className="w-full h-auto object-cover max-h-72" />
            </div>
          )}

          <p className="text-base sm:text-lg leading-relaxed text-zinc-200 font-serif italic whitespace-pre-line">
            &ldquo;{body}&rdquo;
          </p>

          <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500">
                {isAnonymous ? 'From your anonymous friend' : 'With all our love,'}
              </span>
              <span className="font-bold text-rose-300">
                {senderAlias || 'Himanshu'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
          </div>
        </div>
      )}
      
      <ImageModal 
        isOpen={isModalOpen}
        imageUrl={mediaUrl || null}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
