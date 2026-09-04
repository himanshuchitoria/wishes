'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Clock,
  Trash2,
  Copy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Calendar,
  Settings
} from 'lucide-react';
import { Wish } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatDate, getDaysUntil, getNextBirthdayDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

export default function DashboardPage() {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
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

  const handleDelete = async (id: string, name: string) => {
    soundFX.playPop();
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the wish for ${name}? This action cannot be undone.`);
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
        toast(`Wish for ${name} has been cancelled.`, 'info');
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
    toast(`Copied ${type === 'reveal' ? 'Reveal' : 'Group Board'} link!`, 'success');
  };

  // Metrics
  const upcomingWishes = wishes.filter((w) => {
    const nextDate = getNextBirthdayDate(w.birth_date, w.delivery_time);
    const days = getDaysUntil(nextDate);
    return days >= 0 && days <= 30 && w.status === 'scheduled';
  });
  const scheduledCount = wishes.filter((w) => w.status === 'scheduled').length;

  // Filtered List
  const filteredWishes = wishes.filter((w) => {
    return w.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           w.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#FFeb3b] text-black w-full relative overflow-hidden font-sans pt-32 pb-24 -mt-24">
      
      {/* MASSIVE BACKGROUND TYPOGRAPHY */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-visible mt-20">
        <h1 className="text-[22vw] font-black leading-none tracking-tighter text-black uppercase whitespace-nowrap opacity-[0.03] scale-110">
          BIRTHDAYS
        </h1>
      </div>

      {/* FLOATING 3D / VECTOR CENTERPIECE */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-[20px_20px_0_rgba(0,0,0,1)] animate-bounce" style={{ animationDuration: '3s' }}>
        <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bomb Body */}
          <circle cx="100" cy="110" r="70" fill="#111" stroke="#000" strokeWidth="8" />
          <path d="M100 40C80 40 40 70 30 110" stroke="#333" strokeWidth="6" strokeLinecap="round" />
          {/* Bomb Neck */}
          <rect x="85" y="25" width="30" height="20" fill="#333" stroke="#000" strokeWidth="8" rx="4" />
          {/* Fuse */}
          <path d="M100 25C100 10 130 10 140 20C150 30 140 50 150 50" stroke="#f97316" strokeWidth="6" fill="none" strokeDasharray="10 5" />
          {/* Spark */}
          <circle cx="150" cy="50" r="15" fill="#facc15" />
          <path d="M150 20L150 35M150 65L150 80M120 50L135 50M165 50L180 50M128 28L140 40M160 60L172 72M172 28L160 40M140 60L128 72" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          {/* Highlight */}
          <path d="M60 80A40 40 0 0 1 100 60" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      {/* TOP BRACKET NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase tracking-widest mb-32">
        <div className="flex gap-4">
          <span className="text-black bg-white px-2 border-2 border-black shadow-[2px_2px_0_0_#000] cursor-default">[ OVERVIEW ]</span>
          <button onClick={() => toast('Calendar view is coming soon!', 'info')} className="hover:text-rose-600 transition-colors opacity-60 hover:opacity-100 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> [ CALENDAR ]
          </button>
          <Link href="/settings" className="hover:text-rose-600 transition-colors opacity-60 hover:opacity-100 flex items-center gap-1">
            <Settings className="w-3 h-3" /> [ SETTINGS ]
          </Link>
        </div>
        <div className="flex gap-4">
          <span className="bg-black text-yellow-400 px-3 py-1 animate-pulse">[ SYSTEM ONLINE ]</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* HEADER & CALL TO ACTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b-8 border-black pb-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
              The Command <br/> Center
            </h2>
            <p className="font-mono text-sm font-bold uppercase bg-white px-2 py-1 inline-block border-2 border-black shadow-[4px_4px_0_0_#000]">
              [ MANAGE YOUR UPCOMING REVEALS ]
            </p>
          </div>
          <Link
            href="/create"
            onClick={() => soundFX.playPop()}
            className="group flex items-center gap-3 bg-black text-white px-8 py-5 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black hover:shadow-[12px_12px_0_0_#000] transition-all -rotate-2 hover:rotate-0"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Launch New</span>
            <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </Link>
        </div>

        {/* BRUTALIST METRIC PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-[#facc15] border-8 border-black p-6 shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all">
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                [ IMMINENT ]
              </span>
              <Clock className="w-8 h-8 text-black" />
            </div>
            <div className="text-8xl font-black tracking-tighter mb-2">{upcomingWishes.length}</div>
            <div className="text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Upcoming in 30 Days</div>
          </div>

          {/* Card 2 */}
          <div className="bg-emerald-400 border-8 border-black p-6 shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all">
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                [ ACTIVE ]
              </span>
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div className="text-8xl font-black tracking-tighter mb-2">{scheduledCount}</div>
            <div className="text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Scheduled Queues</div>
          </div>

          {/* Card 3 */}
          <div className="bg-rose-400 border-8 border-black p-6 shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all">
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                [ ARCHIVE ]
              </span>
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
            <div className="text-8xl font-black tracking-tighter mb-2">{wishes.length - scheduledCount}</div>
            <div className="text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Total Delivered</div>
          </div>
        </div>

        {/* BRUTALIST LIST SECTION */}
        <div className="bg-white border-8 border-black shadow-[16px_16px_0_0_#000] p-8 md:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
            <h3 className="text-4xl font-black uppercase tracking-tighter">
              [ TARGET LOG ]
            </h3>
            <div className="w-full sm:w-auto relative">
              <input
                type="text"
                placeholder="SEARCH DATABASE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 bg-zinc-100 border-4 border-black px-4 py-3 font-mono font-bold uppercase placeholder-black/30 focus:outline-none focus:bg-yellow-100 transition-colors"
              />
            </div>
          </div>

          {filteredWishes.length === 0 ? (
            <div className="py-24 text-center border-4 border-dashed border-black bg-zinc-50">
              <Flame className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-black uppercase mb-2">No Targets Found</h3>
              <p className="font-mono text-sm font-bold opacity-60 uppercase">The database is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredWishes.map((wish) => {
                const isScheduled = wish.status === 'scheduled';
                const nextDate = getNextBirthdayDate(wish.birth_date, wish.delivery_time);
                
                return (
                  <div key={wish.id} className="group flex flex-col lg:flex-row justify-between gap-6 p-6 border-4 border-black bg-[#fafafa] hover:bg-yellow-50 transition-colors relative overflow-hidden">
                    
                    {/* Background Vibe Identifier */}
                    <div className="absolute -right-10 -bottom-10 text-[10rem] opacity-5 pointer-events-none font-black uppercase">
                      {wish.vibe}
                    </div>

                    <div className="flex flex-col justify-center relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-black uppercase border-2 border-black ${isScheduled ? 'bg-cyan-400' : 'bg-zinc-300'}`}>
                          {isScheduled ? '[ PENDING ]' : '[ COMPLETED ]'}
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black text-white">
                          VIBE: {wish.vibe.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black uppercase tracking-tighter mb-1">
                        {wish.recipient_name}
                      </h4>
                      <p className="font-mono text-sm font-bold opacity-60">
                        TARGET: {wish.recipient_email}
                      </p>
                    </div>

                    <div className="flex flex-col lg:items-end justify-center gap-4 relative z-10 border-t-4 lg:border-t-0 lg:border-l-4 border-black pt-4 lg:pt-0 lg:pl-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">
                          {formatDate(nextDate)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCopyLink(wish.reveal_token, 'reveal')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]"
                        >
                          <Copy className="w-3.5 h-3.5" /> Reveal Link
                        </button>
                        {wish.is_group_board && (
                          <button
                            onClick={() => handleCopyLink(wish.group_token, 'group')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]"
                          >
                            <Copy className="w-3.5 h-3.5" /> Group Link
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(wish.id, wish.recipient_name)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 border-2 border-black font-mono text-xs font-bold uppercase text-white hover:bg-red-600 transition-colors shadow-[2px_2px_0_0_#000]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
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
    </div>
  );
}
