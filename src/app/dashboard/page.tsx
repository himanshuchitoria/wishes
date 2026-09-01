'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  MoreVertical,
  Flame,
  Heart,
  Share2,
  ExternalLink,
  Trash2,
  Copy,
  Users,
  Grid,
  List,
} from 'lucide-react';
import { Wish, WishVibe, VIBE_CONFIGS } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatDate, getDaysUntil, getNextBirthdayDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';
import CountdownTimer from '@/components/CountdownTimer';

export default function DashboardPage() {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibeFilter, setSelectedVibeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch('http://localhost:8000/api/wishes', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setWishes(data.wishes || []);
        }
      } catch (e) {
        console.error('Failed to fetch wishes:', e);
      }
    };
    fetchWishes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    soundFX.playPop();
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the wish for ${name}? This action cannot be undone and will delete all associated media and group contributions.`);
    if (!confirmed) return;
    
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch(`http://localhost:8000/api/wishes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
        toast(`Wish for ${name} has been cancelled & removed.`, 'info');
      } else {
        toast('Failed to cancel wish.', 'error');
      }
    } catch (e) {
      console.error(e);
      toast('Error deleting wish.', 'error');
    }
  };

  const handleCopyLink = (token: string, type: 'reveal' | 'group') => {
    soundFX.playPop();
    const url = `${window.location.origin}/${type === 'reveal' ? 'reveal' : 'collaborate'}/${token}`;
    navigator.clipboard.writeText(url);
    toast(`Copied ${type === 'reveal' ? 'Reveal' : 'Group Board'} link to clipboard!`, 'success');
  };

  // Metrics
  const upcomingWishes = wishes.filter((w) => {
    const nextDate = getNextBirthdayDate(w.birth_date, w.delivery_time);
    const days = getDaysUntil(nextDate);
    return days >= 0 && days <= 30 && w.status === 'scheduled';
  });

  const scheduledCount = wishes.filter((w) => w.status === 'scheduled').length;
  const deliveredCount = wishes.filter((w) => w.status === 'delivered').length;
  const openedCount = wishes.filter((w) => w.opened_at).length;

  // Filtered List
  const filteredWishes = wishes.filter((w) => {
    const matchesSearch =
      w.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVibe = selectedVibeFilter === 'all' || w.vibe === selectedVibeFilter;
    const matchesStatus = selectedStatusFilter === 'all' || w.status === selectedStatusFilter;
    return matchesSearch && matchesVibe && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              Birthday Hub
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Timezone: Asia/Kolkata (UTC+5:30)</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Dashboard & Calendar
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => {
                soundFX.playPop();
                setViewMode('timeline');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => {
                soundFX.playPop();
                setViewMode('calendar');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Link
            href="/create"
            onClick={() => soundFX.playPop()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule Wish</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming (30d)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{upcomingWishes.length}</div>
          <p className="text-[11px] text-zinc-500">Birthdays on deck</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled</span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{scheduledCount}</div>
          <p className="text-[11px] text-zinc-500">Active serverless queues</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{deliveredCount}</div>
          <p className="text-[11px] text-zinc-500">Midnight dispatches</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Unlocked / Read</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{openedCount}</div>
          <p className="text-[11px] text-zinc-500">100% Read Receipt Rate</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedVibeFilter}
            onChange={(e) => setSelectedVibeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Vibes</option>
            <option value="roast">🔥 Brutal Roast</option>
            <option value="sentimental">💌 Tearjerker</option>
            <option value="sweet">✨ Sweet</option>
            <option value="snarky">😏 Snarky</option>
            <option value="custom">🕶️ Secret Admirer</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="delivered">Delivered</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main Content: Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-4">
          {filteredWishes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-800 space-y-4">
              <Sparkles className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No scheduled wishes found</h3>
                <p className="text-xs text-zinc-400">
                  Add your best friend's birthday and set up a roast or tearjerker in 60 seconds.
                </p>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create a Wish Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWishes.map((wish) => {
                const nextBday = getNextBirthdayDate(wish.birth_date, wish.delivery_time);
                const daysUntil = getDaysUntil(nextBday);
                const vibeConfig = VIBE_CONFIGS[wish.vibe];

                return (
                  <div
                    key={wish.id}
                    className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 shadow-xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-black text-white">
                            {wish.recipient_name}
                          </h3>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${vibeConfig.borderGlow} bg-black/40 text-white flex items-center gap-1`}
                          >
                            <span>{vibeConfig.emoji}</span>
                            <span>{vibeConfig.name}</span>
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {wish.recipient_email} • Born {formatDate(wish.birth_date)}
                        </p>
                      </div>

                      {/* Countdown badge */}
                      <div className="text-right">
                        {wish.status === 'scheduled' ? (
                          <div className="inline-flex flex-col items-end">
                            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                              {daysUntil === 0
                                ? '🎉 Today!'
                                : daysUntil === 1
                                ? '⚡ Tomorrow'
                                : `In ${daysUntil} days`}
                            </span>
                            <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                              00:00 local
                            </span>
                          </div>
                        ) : wish.opened_at ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
                            ✓ Delivered & Opened
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
                            ✓ Delivered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message Preview Snippet */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed font-sans italic">
                      &ldquo;{wish.message_payload.body.substring(0, 130)}...&rdquo;
                    </div>

                    {/* Footer Row & Actions */}
                    <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                        <span>From: <strong>{wish.sender_alias || 'Anonymous'}</strong></span>
                        <span>•</span>
                        <code className="text-zinc-400">@{wish.sender_email_prefix}.chitoria.dev</code>
                      </div>

                      <div className="flex items-center gap-2">
                        {wish.is_group_board && (
                          <button
                            onClick={() => handleCopyLink(wish.group_token, 'group')}
                            title="Copy Group Invite Link"
                            className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 border border-purple-500/30 transition-all flex items-center gap-1 text-[11px] font-semibold"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Group Link</span>
                          </button>
                        )}

                        <Link
                          href={`/reveal/${wish.reveal_token}`}
                          className="p-1.5 px-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-all flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview Reveal</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(wish.id, wish.recipient_name)}
                          title="Cancel / Delete Wish"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Calendar Month Grid View */
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-rose-400" />
              <span>September 2026 Calendar</span>
            </h3>
            <span className="text-xs text-zinc-400">Showing all upcoming dates</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider py-2 border-b border-zinc-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 30 }).map((_, dayIdx) => {
              const day = dayIdx + 1;
              const matches = wishes.filter((w) => {
                const bday = new Date(w.birth_date);
                return bday.getMonth() === 8 && bday.getDate() === day;
              });

              return (
                <div
                  key={day}
                  className={`min-h-[75px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    matches.length > 0
                      ? 'bg-zinc-800/80 border-rose-500/40 shadow-md'
                      : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500'
                  }`}
                >
                  <span className="font-bold text-zinc-300 text-left">{day}</span>
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="p-1 rounded bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-300 truncate text-left"
                    >
                      {VIBE_CONFIGS[m.vibe].emoji} {m.recipient_name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
