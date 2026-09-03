'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Flame,
  Gift,
  Clock,
  Share2,
  Users,
  CheckCircle2,
  ArrowRight,
  Volume2,
  VolumeX,
  Lock,
} from 'lucide-react';
import { Wish, GroupContribution, VIBE_CONFIGS } from '@/types';
import { getCountdown, getNextBirthdayDate } from '@/lib/utils';
import ScratchCard from '@/components/ScratchCard';
import EnvelopeReveal from '@/components/EnvelopeReveal';
import GlitchReveal from '@/components/GlitchReveal';
import InstantReveal from '@/components/InstantReveal';
import VibeBackground from '@/components/VibeBackground';
import BackgroundEffects from '@/components/BackgroundEffects';
import MasonryGrid from '@/components/MasonryGrid';
import CountdownTimer from '@/components/CountdownTimer';
import { soundFX } from '@/lib/audio';
import { useToast } from '@/components/Toast';

export default function BirthdayRevealPage() {
  const params = useParams();
  const revealToken = params.reveal_token as string;
  const { toast } = useToast();

  const [wish, setWish] = useState<Wish | null>(null);
  const [contributions, setContributions] = useState<GroupContribution[]>([]);
  const [isEarly, setIsEarly] = useState<boolean>(false);
  const [hasUnboxed, setHasUnboxed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReveal = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/reveal/${revealToken}`);
        if (res.ok) {
          const data = await res.json();
          setWish(data.wish);
          setContributions(data.contributions || []);
          setIsEarly(data.is_early);
          
        } else if (res.status === 404) {
          setError('This wish has been deleted or no longer exists.');
        } else {
          setError('Failed to load the wish.');
        }
      } catch (e) {
        console.error('Failed to fetch reveal', e);
        setError('Failed to load the wish.');
      }
    };
    fetchReveal();
  }, [revealToken]);

  const handleReveal = () => {
    setHasUnboxed(true);
    // Unmute automatically on interaction to allow audio playback if desired
    setIsMuted(false);
    
    // Play aesthetic vibe-based sound
    if (wish?.vibe === 'roast' || wish?.vibe === 'snarky') {
      soundFX.playAirhorn();
    } else if (wish?.vibe === 'sweet' || wish?.vibe === 'sentimental') {
      soundFX.playChime();
    } else {
      soundFX.playCelebration();
    }
    
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
    
    // Background call to mark as read exactly upon unboxing
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/reveal/${revealToken}/read`, { method: 'POST' })
      .catch(err => console.error('Failed to mark as read', err));
  };

  const handleShare = () => {
    soundFX.playPop();
    if (navigator.share) {
      navigator.share({
        title: `Birthday reveal for ${wish?.recipient_name || 'you'}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('Reveal page URL copied to clipboard!', 'success');
    }
  };

  const config = wish ? VIBE_CONFIGS[wish.vibe] : VIBE_CONFIGS.roast;
  const targetDate = wish ? getNextBirthdayDate(wish.birth_date, wish.delivery_time) : new Date();

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Vibe Background */}
      <VibeBackground vibe={wish?.vibe || 'roast'} />
      
      {/* Post-reveal particles (confetti, fireworks) */}
      <BackgroundEffects
        effect={wish?.message_payload?.effects || 'none'}
        trigger={hasUnboxed}
      />

      {/* White Flash overlay triggered on unbox */}
      <AnimatePresence>
        {hasUnboxed && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-4xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2 pt-12">
          {/* Headline with aesthetic floating motion */}
          <motion.h1 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl"
            style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            {error ? 'Surprise Not Found' : `Happy Birthday, ${wish?.recipient_name || '...'}! ${config.emoji}`}
          </motion.h1>
        </div>

        {error ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-rose-500/30 backdrop-blur-xl shadow-2xl text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Flame className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Poof! It's gone.</h2>
            <p className="text-sm text-zinc-400">{error}</p>
          </div>
        ) : isEarly ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/40 border border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] text-center space-y-8 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            {/* Ambient Pulsing Lock */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center cursor-pointer" onClick={() => soundFX.playPop()}>
              <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 relative z-10 shadow-2xl">
                <Lock className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
                Hold on tight, <span className="font-bold text-white">{wish?.recipient_name || 'there'}</span>... Something special was crafted just for you.
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
                This vault unlocks automatically on your birthday.
              </p>
            </div>

            <div className="pt-4">
              <CountdownTimer targetDate={targetDate} onExpire={() => window.location.reload()} />
            </div>
          </div>
        ) : (
          /* State 2 & 3: Unboxing & Revealed Payload */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto w-full">
              {(() => {
                const revealType = wish?.message_payload?.revealType;
                const theme = wish?.message_payload?.theme;
                const elements = wish?.message_payload?.elements || [];
                const commonProps = {
                  headline: wish?.message_payload?.headline,
                  body: wish?.message_payload?.body || config.sampleMessage,
                  senderAlias: wish?.sender_alias,
                  isAnonymous: wish?.is_anonymous,
                  mediaUrl: wish?.message_payload?.mediaUrl,
                  elements,
                  onRevealed: handleReveal,
                };
                if (revealType === 'envelope' || wish?.vibe === 'sentimental') {
                  return <EnvelopeReveal {...commonProps} />;
                }
                if (revealType === 'glitch') {
                  return <GlitchReveal {...commonProps} />;
                }
                if (revealType === 'instant') {
                  return <InstantReveal {...commonProps} theme={theme} />;
                }
                // Default: scratch
                return <ScratchCard {...commonProps} accentColor={config.accentColor} />;
              })()}
            </div>

            {/* Share / Save Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Reveal Link</span>
              </button>
            </div>

            {/* Group Board Feed if enabled */}
            {wish?.is_group_board && (
              <div className="space-y-6 pt-8 border-t border-white/10">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Your Birthday Vault</span>
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Notes, memories, and photos collected from your friends
                  </p>
                </div>

                {contributions.length > 0 ? (
                  <MasonryGrid contributions={contributions} />
                ) : (
                  <div className="text-center py-8 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                    <p className="text-zinc-400 text-sm">No notes from friends yet — they might still be writing!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* State 4: Sleek Viral Footer */}
        {hasUnboxed && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
              <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                ✨ Made especially for {wish?.recipient_name} via <span className="text-zinc-200 font-semibold">chitoria.dev</span>
              </span>
              <div className="w-px h-3 bg-white/10" />
              <Link
                href="/create"
                target="_blank"
                onClick={() => soundFX.playPop()}
                className="text-[11px] font-bold text-white hover:text-rose-400 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Create a reveal <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating Audio Toggle */}
      {hasUnboxed && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all shadow-xl"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
      
      {/* Ambient Audio (Optional loops could go here. For now, it represents the aesthetic audio requirement) */}
      {!isMuted && hasUnboxed && (
         <audio src="/sounds/ambient-pad.mp3" autoPlay loop muted={isMuted} className="hidden" />
      )}
    </div>
  );
}
