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
import CountdownTimer from '@/components/CountdownTimer';
import { soundFX } from '@/lib/audio';
import { useToast } from '@/components/Toast';

import SweetTemplate from '@/components/templates/SweetTemplate';
import SentimentalTemplate from '@/components/templates/SentimentalTemplate';
import RoastTemplate from '@/components/templates/RoastTemplate';
import SnarkyTemplate from '@/components/templates/SnarkyTemplate';
import CustomTemplate from '@/components/templates/CustomTemplate';

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

  const targetDate = wish ? getNextBirthdayDate(wish.birth_date, wish.delivery_time) : new Date();

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-rose-500/30 shadow-2xl text-center space-y-4 max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Poof! It's gone.</h2>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isEarly) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/40 border border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] text-center space-y-8 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-700">
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
      </div>
    );
  }

  if (!wish) return null;

  const renderTemplate = () => {
    const props = { wish, hasUnboxed, onUnbox: handleReveal };
    switch (wish.vibe) {
      case 'sweet': return <SweetTemplate {...props} />;
      case 'sentimental': return <SentimentalTemplate {...props} />;
      case 'roast': return <RoastTemplate {...props} />;
      case 'snarky': return <SnarkyTemplate {...props} />;
      case 'custom': return <CustomTemplate {...props} />;
      default: return <SweetTemplate {...props} />;
    }
  };

  return (
    <>
      {renderTemplate()}

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
