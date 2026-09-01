'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Users,
  Image as ImageIcon,
  Send,
  Clock,
  Flame,
  CheckCircle2,
  Lock,
  ImagePlus,
  X,
  Loader2,
} from 'lucide-react';
import { Wish, GroupContribution, VIBE_CONFIGS } from '@/types';
import { getNextBirthdayDate } from '@/lib/utils';
import MasonryGrid from '@/components/MasonryGrid';
import CountdownTimer from '@/components/CountdownTimer';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

export default function GroupContributionPage() {
  const params = useParams();
  const groupToken = params.group_token as string;
  const { toast } = useToast();

  const [wish, setWish] = useState<Wish | null>(null);
  const [contributions, setContributions] = useState<GroupContribution[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`https://wishesbackend.vercel.app/api/collaborate/${groupToken}`);
        if (res.ok) {
          const data = await res.json();
          setWish(data.wish);
          setContributions(data.contributions || []);
        } else if (res.status === 404) {
          setError('This group board has been deleted or no longer exists.');
        } else {
          setError('Failed to load the group board.');
        }
      } catch (e) {
        console.error('Failed to fetch board', e);
        setError('Failed to load the group board.');
      }
    };
    fetchBoard();
  }, [groupToken]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast('File too large (max 5MB)', 'error');
        return;
      }
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    soundFX.playPop();
    setSubmitting(true);

    try {
      let finalImageUrl = undefined;
      
      if (mediaFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', mediaFile);
        
        const uploadRes = await fetch('https://wishesbackend.vercel.app/api/storage/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            finalImageUrl = uploadData.url;
          }
        }
        setIsUploading(false);
      }

      const payload = {
        contributor_name: name,
        message,
        image_url: finalImageUrl,
        avatar_seed: name.toLowerCase().replace(/\s+/g, ''),
      };
      const res = await fetch(`https://wishesbackend.vercel.app/api/collaborate/${groupToken}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setContributions((prev) => [data.contribution, ...prev]);
        soundFX.playCelebration();
        toast('Your note has been added to the board!', 'success');
        setMessage('');
        setMediaFile(null);
        setMediaPreview(null);
      } else {
        toast('Failed to post note. Please try again.', 'error');
      }
    } catch (e) {
      console.error(e);
      toast('Error submitting note.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentVibeConfig = wish ? VIBE_CONFIGS[wish.vibe] : VIBE_CONFIGS.roast;
  const targetDate = wish ? getNextBirthdayDate(wish.birth_date, wish.delivery_time) : new Date();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {error ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-rose-500/30 backdrop-blur-xl shadow-2xl text-center space-y-4 max-w-md mx-auto mt-20">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Board Unavailable</h2>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      ) : (
        <>
          {/* Sticky Countdown Urgency Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-zinc-950 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Collaborative Birthday Board</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                TOKEN-GATED
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Board seals and delivers to {wish?.recipient_name || 'Alex'} on midnight!
            </p>
          </div>
        </div>

        <CountdownTimer targetDate={targetDate} variant="compact" />
      </div>

      {/* Hero Header for this board */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
          <span>{currentVibeConfig.emoji}</span>
          <span>{currentVibeConfig.name} Board for {wish?.recipient_name || 'Alex'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Drop a Note or Roast for {wish?.recipient_name || 'Alex'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          No sign-up required. Your note will be compiled into a digital time capsule delivered on their birthday.
        </p>
      </div>

      {/* Contribution Form (Above the fold) */}
      {!isLocked ? (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Add Your Message to the Vault</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Your Name / Alias
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya & Sam, The College Crew, Mystery Friend"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Your Message / Memory / Roast
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  wish?.vibe === 'roast'
                    ? 'Remember that time you tripped over your own luggage? Never forget. Happy Birthday!'
                    : 'Sarah, thank you for being the most supportive friend anyone could ask for! 💖'
                }
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Attach a Photo (Optional)
              </label>
              {!mediaPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <ImagePlus className="w-5 h-5 text-zinc-500 mb-1" />
                    <p className="text-xs text-zinc-400 font-medium">Add an image</p>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={mediaPreview} alt="Preview" className="h-24 rounded-xl object-cover border border-zinc-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreview(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-zinc-800 text-zinc-300 hover:text-white rounded-full shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-lg shadow-purple-500/20 transition-all"
            >
              {submitting ? (isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post to Group Board</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-3 max-w-md mx-auto">
          <Lock className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">This board is sealed!</h3>
          <p className="text-xs text-zinc-400">
            Delivery is in progress and new notes can no longer be accepted.
          </p>
        </div>
      )}

      {/* The Live Board Feed (Masonry Layout) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Friend Messages ({contributions.length})</span>
          </h3>
          <span className="text-xs text-zinc-400">Live Real-Time Feed</span>
        </div>

        <MasonryGrid contributions={contributions} />
      </div>

      {/* Viral Upsell Loop */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-purple-950/40 border border-rose-500/30 text-center space-y-4">
        <h4 className="text-lg sm:text-xl font-black text-white">
          Want to create a free automated board for your best friend?
        </h4>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Schedule midnight delivery, AI generated roasts, and invite your group chats for free on chitoria.dev.
        </p>
        <Link
          href="/create"
          onClick={() => soundFX.playPop()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Free Board for a Friend</span>
        </Link>
      </div>
    </div>
  );
}
