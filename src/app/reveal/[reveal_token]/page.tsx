'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import { Wish, GroupContribution, VIBE_CONFIGS } from '@/types';
import { getCountdown, getNextBirthdayDate } from '@/lib/utils';
import ScratchCard from '@/components/ScratchCard';
import EnvelopeReveal from '@/components/EnvelopeReveal';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReveal = async () => {
      try {
        const res = await fetch(`https://wishesbackend.vercel.app/api/reveal/${revealToken}`);
        if (res.ok) {
          const data = await res.json();
          setWish(data.wish);
          setContributions(data.contributions || []);
          
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('early') === 'true') {
            setIsEarly(true);
          }
          
          if (urlParams.get('source') === 'email') {
            // Background call to mark as read
            fetch(`https://wishesbackend.vercel.app/api/reveal/${revealToken}/read`, { method: 'POST' })
              .catch(err => console.error('Failed to mark as read', err));
          }
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
    soundFX.playCelebration();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
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
    <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8`}>
      {/* Background ambient particles */}
      <div className="max-w-4xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs font-bold text-zinc-300 shadow-xl backdrop-blur-md">
            <span>chitoria.dev</span>
            <span>•</span>
            <span className="text-rose-400">Special Birthday Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {error ? 'Surprise Not Found' : `Happy Birthday, ${wish?.recipient_name || '...'}! ${config.emoji}`}
          </h1>
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
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl shadow-2xl text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                Someone Has Secured a Surprise For You!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                This message is locked until exact midnight on your birthday. Check back when the countdown hits zero!
              </p>
            </div>

            <CountdownTimer targetDate={targetDate} onExpire={() => setIsEarly(false)} />

            <button
              onClick={() => setIsEarly(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              (Demo: Click to bypass early lock)
            </button>
          </div>
        ) : (
          /* State 2 & 3: Unboxing & Revealed Payload */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto w-full">
              {wish?.message_payload.revealType === 'envelope' || wish?.vibe === 'sentimental' ? (
                <EnvelopeReveal
                  headline={wish?.message_payload.headline}
                  body={wish?.message_payload.body || config.sampleMessage}
                  senderAlias={wish?.sender_alias}
                  isAnonymous={wish?.is_anonymous}
                  mediaUrl={wish?.message_payload.mediaUrl}
                  onRevealed={handleReveal}
                />
              ) : (
                <ScratchCard
                  headline={wish?.message_payload.headline}
                  body={wish?.message_payload.body || config.sampleMessage}
                  senderAlias={wish?.sender_alias}
                  isAnonymous={wish?.is_anonymous}
                  mediaUrl={wish?.message_payload.mediaUrl}
                  onRevealed={handleReveal}
                />
              )}
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

        {/* State 4: Viral Growth Engine Footer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
            <Gift className="w-3.5 h-3.5" /> Pay It Forward
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Want to roast or surprise someone on their next birthday?
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Schedule hyper-personalized AI roasts or tearjerkers for your friends in under 2 minutes. 100% free serverless delivery.
          </p>

          <div className="pt-2">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 shadow-xl shadow-rose-500/25 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Schedule a Wish for a Friend</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
