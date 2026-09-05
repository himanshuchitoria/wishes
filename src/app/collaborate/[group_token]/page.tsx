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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/collaborate/${groupToken}`);
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
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/storage/upload`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/collaborate/${groupToken}/contribute`, {
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16 space-y-8">
      {error ? (
        <div className="p-8 sm:p-12 bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-4 max-w-md mx-auto mt-20">
          <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center text-black mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-black uppercase">Board Unavailable</h2>
          <p className="text-sm text-black font-bold">{error}</p>
        </div>
      ) : (
        <>
          {/* Sticky Countdown Urgency Header */}
          <div className="p-4 bg-cyan-300 border-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black uppercase flex items-center gap-2">
              <span>Collaborative Birthday Board</span>
              <span className="text-[10px] px-2 py-0.5 bg-yellow-300 border border-black text-black font-black">
                TOKEN-GATED
              </span>
            </h3>
            <p className="text-xs text-black font-bold">
              Board seals and delivers to {wish?.recipient_name || 'Alex'} on midnight!
            </p>
          </div>
        </div>

        <CountdownTimer targetDate={targetDate} variant="compact" />
      </div>

      {/* Hero Header for this board */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-black uppercase">
          <span className="text-base">{currentVibeConfig.emoji}</span>
          <span>{currentVibeConfig.name} Board for {wish?.recipient_name || 'Alex'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-yellow-300 tracking-tight uppercase" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #000' }}>
          Drop a Note for {wish?.recipient_name || 'Alex'}
        </h1>
        <p className="text-sm sm:text-base text-white font-bold max-w-xl mx-auto bg-black/50 p-2 rounded-lg">
          No sign-up required. Your note will be compiled into a digital time capsule delivered on their birthday.
        </p>
      </div>

      {/* Contribution Form (Above the fold) */}
      {!isLocked ? (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h3 className="text-lg font-black text-black uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-black fill-yellow-400" />
            <span>Add Your Message</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Your Name / Alias
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya & Sam, The College Crew, Mystery Friend"
                className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder-zinc-400 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
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
                className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder-zinc-400 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Attach a Photo (Optional)
              </label>
              {!mediaPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-black border-dashed bg-yellow-100 hover:bg-yellow-200 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <ImagePlus className="w-6 h-6 text-black mb-1" />
                    <p className="text-xs text-black font-bold uppercase">Add an image</p>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={mediaPreview} alt="Preview" className="h-24 object-cover border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreview(null);
                    }}
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-400 border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-black text-black uppercase bg-magenta-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</>) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Post to Group Board</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-8 bg-zinc-200 border-4 border-black text-center space-y-3 max-w-md mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Lock className="w-12 h-12 text-black mx-auto" />
          <h3 className="text-xl font-black text-black uppercase">This board is sealed!</h3>
          <p className="text-sm text-black font-bold">
            Delivery is in progress and new notes can no longer be accepted.
          </p>
        </div>
      )}

      {/* The Live Board Feed (Masonry Layout) */}
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0px #000' }}>
            <Users className="w-6 h-6 text-cyan-300" />
            <span>Friend Messages ({contributions.length})</span>
          </h3>
          <span className="text-xs text-white font-bold px-3 py-1 bg-black rounded-full">Live Real-Time Feed</span>
        </div>

        <MasonryGrid contributions={contributions} />
      </div>

      {/* Viral Upsell Loop */}
      <div className="p-8 bg-yellow-400 border-4 border-black text-center space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h4 className="text-2xl sm:text-3xl font-black text-black uppercase">
          Want to create a free automated board for your best friend?
        </h4>
        <p className="text-sm sm:text-base text-black font-bold max-w-xl mx-auto">
          Schedule midnight delivery, AI generated roasts, and invite your group chats for free on chitoria.dev.
        </p>
        <Link
          href="/create"
          onClick={() => soundFX.playPop()}
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black text-black uppercase bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <Sparkles className="w-5 h-5 text-black fill-yellow-400" />
          <span>Create Free Board for a Friend</span>
        </Link>
      </div>
      </>
      )}
    </div>
  );
}
