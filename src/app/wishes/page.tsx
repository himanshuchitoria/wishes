'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Sparkles,
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';
import { Wish, VIBE_CONFIGS } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatDate, getNextBirthdayDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

export default function WishQueuePage() {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      }
    };
    fetchWishes();
  }, []);

  const handleSendNow = async (wish: Wish) => {
    soundFX.playCelebration();
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/wishes/${wish.id}/deliver_now`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWishes((prev) => prev.map((w) => (w.id === wish.id ? data.wish : w)));
        toast(`Override sent! Wish for ${wish.recipient_name} dispatched immediately.`, 'success');
      } else {
        const errText = await res.text();
        throw new Error(`Backend delivery failed: ${errText}`);
      }
    } catch (e) {
      console.error(e);
      toast('Failed to deliver wish immediately. Please check logs.', 'error');
    }
  };

  const handleCancel = async (id: string, name: string) => {
    soundFX.playPop();
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the wish for ${name}? This action cannot be undone and will delete all associated media and group contributions.`);
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
        toast(`Wish for ${name} cancelled.`, 'info');
      }
    } catch (e) {
      console.error(e);
      toast('Failed to cancel wish.', 'error');
    }
  };

  const handleCopyLink = (token: string, type: 'reveal' | 'group') => {
    soundFX.playPop();
    const url = `${window.location.origin}/${type === 'reveal' ? 'reveal' : 'collaborate'}/${token}`;
    navigator.clipboard.writeText(url);
    toast(`Copied ${type === 'reveal' ? 'Reveal' : 'Group Board'} link!`, 'success');
  };

  const filtered = wishes.filter((w) => {
    const matchesTab = activeTab === 'all' || w.status === activeTab;
    const matchesSearch =
      w.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-rose-500 text-black w-full relative overflow-hidden font-sans pt-8 sm:pt-12 pb-24">
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      {/* Massive Background Typography */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-visible mt-20">
        <h1 className="text-[25vw] font-black leading-none tracking-tighter text-black uppercase whitespace-nowrap opacity-[0.05] scale-110 transform -rotate-2">
          QUEUE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-[8px] border-black pb-8">
          <div>
            <div className="inline-block bg-white border-[4px] border-black px-3 py-1 shadow-[4px_4px_0_0_#000] transform -rotate-2 mb-4">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Flame className="w-4 h-4 fill-current" />
                Delivery Queue
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              The Arsenal
            </h1>
          </div>
          
          <Link
            href="/create"
            onClick={() => soundFX.playPop()}
            className="group w-full md:w-auto flex items-center justify-center gap-3 bg-yellow-400 text-black px-6 py-4 md:px-8 md:py-5 text-lg font-black uppercase tracking-widest border-[4px] sm:border-[6px] border-black hover:bg-white shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all transform rotate-1 hover:rotate-0"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>Load New Wish</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Filters and Search - Brutalist Style */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-12">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full lg:w-auto">
            {[
              { key: 'all', label: 'All Targets' },
              { key: 'scheduled', label: 'Pending' },
              { key: 'delivered', label: 'Delivered' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  soundFX.playPop();
                  setActiveTab(tab.key as typeof activeTab);
                }}
                className={`flex-1 sm:flex-initial px-4 py-3 border-[4px] border-black text-sm sm:text-base font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? 'bg-cyan-400 shadow-[6px_6px_0_0_#000] translate-y-0 transform -rotate-1'
                    : 'bg-white hover:bg-yellow-200 hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH TARGETS..."
              className="w-full bg-white border-[4px] sm:border-[6px] border-black px-4 py-3 sm:py-4 pl-12 font-black uppercase tracking-wider text-black placeholder-black/30 focus:outline-none focus:bg-yellow-100 shadow-[8px_8px_0_0_#000] transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
          </div>
        </div>

        {/* Comic Card Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border-[8px] border-black border-dashed p-12 sm:p-24 text-center shadow-[16px_16px_0_0_#000] transform rotate-1">
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-4">No Targets Found</h3>
            <p className="font-mono text-sm sm:text-base font-bold uppercase">The queue is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((wish) => {
              const config = VIBE_CONFIGS[wish.vibe];
              const nextBday = getNextBirthdayDate(wish.birth_date, wish.delivery_time);
              const isScheduled = wish.status === 'scheduled';

              return (
                <div 
                  key={wish.id}
                  className="bg-white border-[6px] sm:border-[8px] border-black p-5 sm:p-6 shadow-[12px_12px_0_0_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#000] transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Absolute Background Vibe Watermark */}
                  <div className="absolute -bottom-8 -right-8 text-8xl font-black uppercase text-black opacity-[0.03] pointer-events-none transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500">
                    {wish.vibe}
                  </div>

                  <div className="relative z-10">
                    {/* Status & Vibe Tags */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
                      <span className={`px-2 py-1 border-[4px] border-black text-xs font-black uppercase shadow-[4px_4px_0_0_#000] transform -rotate-2 ${isScheduled ? 'bg-cyan-400' : 'bg-emerald-400'}`}>
                        {isScheduled ? (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Queued</span>
                        ) : (
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sent</span>
                        )}
                      </span>
                      <span className="px-2 py-1 bg-yellow-400 border-[4px] border-black text-xs font-black uppercase shadow-[4px_4px_0_0_#000] transform rotate-2">
                        {config.emoji} {config.name}
                      </span>
                    </div>

                    {/* Recipient Details */}
                    <div className="mb-6">
                      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none mb-2 break-words">
                        {wish.recipient_name}
                      </h3>
                      <p className="font-mono text-xs sm:text-sm font-bold opacity-60 break-all">
                        {wish.recipient_email}
                      </p>
                    </div>

                    {/* Delivery Date Info */}
                    <div className="mb-8 border-l-[4px] border-black pl-4 py-1">
                      <div className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                        {formatDate(nextBday.toISOString())}
                      </div>
                      <div className="font-mono text-[10px] sm:text-xs font-bold uppercase mt-1">
                        Time: 00:00 ({wish.delivery_timezone})
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap gap-3 mt-auto relative z-10 pt-4 border-t-[4px] border-black border-dashed">
                    {isScheduled && (
                      <button
                        onClick={() => handleSendNow(wish)}
                        title="Send Now (Override Schedule)"
                        className="flex-1 min-w-full sm:min-w-0 bg-yellow-400 border-[4px] border-black p-2 flex items-center justify-center gap-2 hover:bg-black hover:text-yellow-400 transition-colors font-black uppercase text-xs"
                      >
                        <Zap className="w-4 h-4 fill-current" /> OVERRIDE
                      </button>
                    )}
                    
                    <div className="flex flex-1 w-full sm:w-auto gap-3">
                      <button
                        onClick={() => handleCopyLink(wish.reveal_token, 'reveal')}
                        title="Copy Reveal Link"
                        className="flex-1 bg-white border-[4px] border-black p-2 flex items-center justify-center hover:bg-cyan-400 transition-colors font-black uppercase"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      {wish.is_group_board && (
                        <button
                          onClick={() => handleCopyLink(wish.group_token, 'group')}
                          title="Copy Group Link"
                          className="flex-1 bg-white border-[4px] border-black p-2 flex items-center justify-center hover:bg-cyan-400 transition-colors font-black uppercase"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleCancel(wish.id, wish.recipient_name)}
                        title="Delete Wish"
                        className="flex-1 bg-rose-500 border-[4px] border-black p-2 flex items-center justify-center text-white hover:bg-red-600 transition-colors font-black uppercase"
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
    </div>
  );
}
