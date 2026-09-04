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
  Mail,
  Calendar,
  Gift
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
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibeFilter, setSelectedVibeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/wishes`, {
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    soundFX.playPop();
    const confirmed = window.confirm(`Are you absolutely sure you want to cancel the wish for ${name}? This action cannot be undone.`);
    if (!confirmed) return;
    
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/wishes/${id}`, {
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
  }).sort((a, b) => {
     // Sort by closest birthday first
     const dateA = getNextBirthdayDate(a.birth_date, a.delivery_time).getTime();
     const dateB = getNextBirthdayDate(b.birth_date, b.delivery_time).getTime();
     return dateA - dateB;
  });

  // Vibe Map for Cards
  const getCardGlow = (vibe: WishVibe) => {
    switch(vibe) {
      case 'roast': return 'hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] border-orange-500/10 hover:border-orange-500/30';
      case 'snarky': return 'hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] border-cyan-500/10 hover:border-cyan-500/30';
      case 'sweet': return 'hover:shadow-[0_0_40px_rgba(244,114,182,0.15)] border-pink-500/10 hover:border-pink-500/30';
      case 'sentimental': return 'hover:shadow-[0_0_40px_rgba(139,125,107,0.15)] border-[#8b7d6b]/10 hover:border-[#8b7d6b]/30';
      case 'custom': return 'hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] border-[#d4af37]/10 hover:border-[#d4af37]/30';
      default: return 'hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] border-white/5 hover:border-white/20';
    }
  };

  const getVibeIconColor = (vibe: WishVibe) => {
    switch(vibe) {
      case 'roast': return 'text-orange-500 bg-orange-500/10';
      case 'snarky': return 'text-cyan-500 bg-cyan-500/10';
      case 'sweet': return 'text-pink-500 bg-pink-500/10';
      case 'sentimental': return 'text-[#8b7d6b] bg-[#8b7d6b]/10';
      case 'custom': return 'text-[#d4af37] bg-[#d4af37]/10';
      default: return 'text-zinc-400 bg-zinc-800';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950">
      
      {/* Animated Cosmic Background Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none mix-blend-screen opacity-50 animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none mix-blend-screen opacity-50" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-12">
        
        {/* Massive Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                Command Center
              </span>
              <span className="text-xs text-zinc-500 font-mono">UTC+5:30</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Birthday Hub
            </h1>
            <p className="text-zinc-400 mt-2 max-w-md text-sm">
              Manage your upcoming highly personalized, perfectly timed digital delivery payloads.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <PlusCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Schedule Wish</span>
            </Link>
          </div>
        </div>

        {/* Premium Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Upcoming (30d)', value: upcomingWishes.length, icon: Clock, color: 'from-amber-400 to-orange-500' },
            { label: 'Active Scheduled', value: scheduledCount, icon: Sparkles, color: 'from-rose-400 to-pink-500' },
            { label: 'Successfully Delivered', value: deliveredCount, icon: Mail, color: 'from-emerald-400 to-teal-500' },
            { label: 'Total Opened', value: openedCount, icon: Eye, color: 'from-cyan-400 to-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300 transition-colors">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className={`text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-br ${stat.color} bg-clip-text text-transparent drop-shadow-sm`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search wishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('timeline')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <select
              value={selectedVibeFilter}
              onChange={(e) => setSelectedVibeFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-zinc-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Vibes</option>
              <option value="roast">🔥 Roast</option>
              <option value="snarky">😏 Snarky</option>
              <option value="sweet">✨ Sweet</option>
              <option value="sentimental">💌 Sentimental</option>
              <option value="custom">👑 Custom</option>
            </select>
          </div>
        </div>

        {/* Wishes Grid */}
        {!isLoading && filteredWishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md border-dashed">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No wishes found</h3>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
              You haven't scheduled any wishes yet, or no wishes match your current filters.
            </p>
            <Link
              href="/create"
              className="px-6 py-2.5 rounded-full text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors"
            >
              Create your first wish
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filteredWishes.map((wish) => {
              const vibeConfig = VIBE_CONFIGS[wish.vibe as WishVibe];
              const nextDate = getNextBirthdayDate(wish.birth_date, wish.delivery_time);
              const isDelivered = wish.status === 'delivered';
              const glowClass = getCardGlow(wish.vibe as WishVibe);
              const iconColor = getVibeIconColor(wish.vibe as WishVibe);

              return (
                <div 
                  key={wish.id}
                  className={`group relative flex flex-col p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border transition-all duration-500 overflow-hidden ${glowClass} ${viewMode === 'timeline' ? 'sm:flex-row sm:items-center justify-between gap-6' : ''}`}
                >
                  {/* Subtle Background Vibe Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 bg-gradient-to-br ${vibeConfig.bgGradient} pointer-events-none rounded-full`} />

                  <div className={`flex flex-col gap-4 ${viewMode === 'timeline' ? 'flex-row items-center min-w-[300px]' : ''}`}>
                    
                    {/* Header: User & Vibe */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-white/5 ${iconColor}`}>
                          {vibeConfig.emoji}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight truncate max-w-[150px] sm:max-w-[200px]">
                            {wish.recipient_name}
                          </h3>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">
                            {wish.recipient_email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="ml-auto flex items-center gap-2">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/20">
                            <Clock className="w-3 h-3" /> Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body: Countdown & Meta */}
                  <div className={`flex-1 flex flex-col justify-end gap-5 ${viewMode === 'timeline' ? 'flex-row items-center justify-between border-l border-white/10 pl-6' : 'mt-6'}`}>
                    
                    {!isDelivered && (
                       <div>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Countdown to Delivery</p>
                         <CountdownTimer targetDate={nextDate} variant={viewMode === 'timeline' ? 'compact' : 'card'} />
                       </div>
                    )}

                    {isDelivered && wish.opened_at && (
                       <div>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Recipient Action</p>
                         <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 w-max">
                           <Eye className="w-4 h-4" />
                           Opened {formatDate(wish.opened_at)}
                         </div>
                       </div>
                    )}

                    <div className={`flex items-center gap-2 ${viewMode === 'timeline' ? 'flex-col sm:flex-row' : ''}`}>
                      <button
                        onClick={() => handleCopyLink(wish.reveal_token, 'reveal')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-colors"
                        title="Copy Reveal Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      
                      {wish.is_group_board && (
                        <button
                          onClick={() => handleCopyLink(wish.group_token!, 'group')}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 transition-colors"
                          title="Copy Group Board Link"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Invite</span>
                        </button>
                      )}

                      {!isDelivered && (
                        <button
                          onClick={() => handleDelete(wish.id, wish.recipient_name)}
                          className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 bg-zinc-900 hover:bg-red-500/20 border border-zinc-800 hover:border-red-500/30 rounded-xl text-zinc-500 hover:text-red-400 transition-colors"
                          title="Cancel Wish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-xs font-semibold">Cancel</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
