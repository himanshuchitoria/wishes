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
  const [viewMode, setViewMode] = useState<'overview' | 'calendar'>('overview');

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

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Create a map of day -> wishes
  const wishesByDay: Record<number, Wish[]> = {};
  wishes.forEach(w => {
    const nextDate = getNextBirthdayDate(w.birth_date, w.delivery_time);
    if (nextDate.getFullYear() === currentYear && nextDate.getMonth() === currentMonth) {
      const day = nextDate.getDate();
      if (!wishesByDay[day]) wishesByDay[day] = [];
      wishesByDay[day].push(w);
    }
  });

  return (
    <div className="min-h-screen bg-[#FFeb3b] text-black w-full relative overflow-hidden font-sans pt-12 pb-24">
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />
      {/* MASSIVE BACKGROUND TYPOGRAPHY */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-visible mt-16">
        <h1 className="text-[25vw] md:text-[22vw] font-black leading-none tracking-tighter text-black uppercase whitespace-nowrap opacity-[0.05] scale-110">
          BIRTHDAYS
        </h1>
      </div>

      {/* FLOATING 3D / VECTOR CENTERPIECE */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-[10px_10px_0_rgba(0,0,0,1)] md:drop-shadow-[20px_20px_0_rgba(0,0,0,1)] animate-bounce scale-75 md:scale-100" style={{ animationDuration: '3s' }}>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase tracking-widest mb-16 md:mb-32">
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button 
            onClick={() => { soundFX.playPop(); setViewMode('overview'); }} 
            className={`px-2 py-1 transition-all flex items-center gap-1 ${viewMode === 'overview' ? 'text-black bg-white border-2 border-black shadow-[2px_2px_0_0_#000]' : 'hover:text-rose-600 opacity-60 hover:opacity-100'}`}
          >
            [ OVERVIEW ]
          </button>
          <button 
            onClick={() => { soundFX.playPop(); setViewMode('calendar'); }} 
            className={`px-2 py-1 transition-all flex items-center gap-1 ${viewMode === 'calendar' ? 'text-black bg-white border-2 border-black shadow-[2px_2px_0_0_#000]' : 'hover:text-rose-600 opacity-60 hover:opacity-100'}`}
          >
            <Calendar className="w-3 h-3 hidden sm:inline" /> [ CALENDAR ]
          </button>
          <Link href="/settings" className="hover:text-rose-600 transition-colors opacity-60 hover:opacity-100 flex items-center gap-1 px-2 py-1">
            <Settings className="w-3 h-3 hidden sm:inline" /> [ SETTINGS ]
          </Link>
        </div>
        <div className="flex gap-4">
          <span className="bg-black text-yellow-400 px-3 py-1 animate-pulse">[ SYSTEM ONLINE ]</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {viewMode === 'overview' ? (
          <>
            {/* HEADER & CALL TO ACTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16 border-b-8 border-black pb-8">
              <div>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2 md:mb-4">
                  The Command <br/> Center
                </h2>
                <p className="font-mono text-xs md:text-sm font-bold uppercase bg-white px-2 py-1 inline-block border-2 border-black shadow-[4px_4px_0_0_#000]">
                  [ MANAGE YOUR UPCOMING REVEALS ]
                </p>
              </div>
              <Link
                href="/create"
                onClick={() => soundFX.playPop()}
                className="group w-full md:w-auto flex items-center justify-between md:justify-center gap-3 bg-black text-white px-6 md:px-8 py-4 md:py-5 text-lg md:text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black hover:shadow-[8px_8px_0_0_#000] md:hover:shadow-[12px_12px_0_0_#000] transition-all md:-rotate-2 hover:rotate-0"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Launch New</span>
                </div>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 md:opacity-0 md:group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </Link>
            </div>

            {/* BRUTALIST METRIC PANELS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16">
              {/* Card 1 */}
              <div className="bg-[#facc15] border-[6px] md:border-8 border-black p-5 md:p-6 shadow-[8px_8px_0_0_#000] md:shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all">
                <div className="flex justify-between items-start mb-4 md:mb-8">
                  <span className="font-mono text-[10px] md:text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                    [ IMMINENT ]
                  </span>
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">{upcomingWishes.length}</div>
                <div className="text-sm md:text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Upcoming in 30 Days</div>
              </div>

              {/* Card 2 */}
              <div className="bg-emerald-400 border-[6px] md:border-8 border-black p-5 md:p-6 shadow-[8px_8px_0_0_#000] md:shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all">
                <div className="flex justify-between items-start mb-4 md:mb-8">
                  <span className="font-mono text-[10px] md:text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                    [ ACTIVE ]
                  </span>
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">{scheduledCount}</div>
                <div className="text-sm md:text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Scheduled Queues</div>
              </div>

              {/* Card 3 */}
              <div className="bg-rose-400 border-[6px] md:border-8 border-black p-5 md:p-6 shadow-[8px_8px_0_0_#000] md:shadow-[12px_12px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-y-2 hover:translate-x-2 transition-all sm:col-span-2 md:col-span-1">
                <div className="flex justify-between items-start mb-4 md:mb-8">
                  <span className="font-mono text-[10px] md:text-sm font-bold bg-white px-2 py-0.5 border-2 border-black">
                    [ ARCHIVE ]
                  </span>
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">{wishes.length - scheduledCount}</div>
                <div className="text-sm md:text-xl font-bold uppercase tracking-tight border-t-4 border-black pt-2">Total Delivered</div>
              </div>
            </div>

            {/* BRUTALIST LIST SECTION */}
            <div className="bg-white border-[6px] md:border-8 border-black shadow-[8px_8px_0_0_#000] md:shadow-[16px_16px_0_0_#000] p-4 sm:p-8 md:p-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-8 md:mb-12">
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                  [ TARGET LOG ]
                </h3>
                <div className="w-full sm:w-auto relative">
                  <input
                    type="text"
                    placeholder="SEARCH DATABASE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 bg-zinc-100 border-4 border-black px-4 py-3 font-mono font-bold uppercase placeholder-black/30 focus:outline-none focus:bg-yellow-100 transition-colors text-xs md:text-base"
                  />
                </div>
              </div>

              {filteredWishes.length === 0 ? (
                <div className="py-16 md:py-24 text-center border-4 border-dashed border-black bg-zinc-50">
                  <Flame className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-2">No Targets Found</h3>
                  <p className="font-mono text-xs md:text-sm font-bold opacity-60 uppercase">The database is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredWishes.map((wish) => {
                    const isScheduled = wish.status === 'scheduled';
                    const nextDate = getNextBirthdayDate(wish.birth_date, wish.delivery_time);
                    
                    return (
                      <div key={wish.id} className="group flex flex-col lg:flex-row justify-between gap-6 p-4 md:p-6 border-4 border-black bg-[#fafafa] hover:bg-yellow-50 transition-colors relative overflow-hidden">
                        
                        {/* Background Vibe Identifier */}
                        <div className="absolute -right-5 -bottom-5 md:-right-10 md:-bottom-10 text-[6rem] md:text-[10rem] opacity-5 pointer-events-none font-black uppercase">
                          {wish.vibe}
                        </div>

                        <div className="flex flex-col justify-center relative z-10">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            <span className={`px-2 py-0.5 text-[10px] md:text-xs font-black uppercase border-2 border-black ${isScheduled ? 'bg-cyan-400' : 'bg-zinc-300'}`}>
                              {isScheduled ? '[ PENDING ]' : '[ COMPLETED ]'}
                            </span>
                            <span className="font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 bg-black text-white">
                              VIBE: {wish.vibe.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1 break-words">
                            {wish.recipient_name}
                          </h4>
                          <p className="font-mono text-xs md:text-sm font-bold opacity-60 break-all">
                            TARGET: {wish.recipient_email}
                          </p>
                        </div>

                        <div className="flex flex-col lg:items-end justify-center gap-4 relative z-10 border-t-4 lg:border-t-0 lg:border-l-4 border-black pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-black tracking-tighter">
                              {formatDate(nextDate)}
                            </span>
                          </div>

                          <div className="flex flex-wrap lg:justify-end gap-2 w-full lg:w-auto">
                            <button
                              onClick={() => handleCopyLink(wish.reveal_token, 'reveal')}
                              className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 px-2 py-2 md:px-3 bg-white border-2 border-black font-mono text-[10px] md:text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]"
                            >
                              <Copy className="w-3.5 h-3.5" /> Reveal Link
                            </button>
                            {wish.is_group_board && (
                              <button
                                onClick={() => handleCopyLink(wish.group_token, 'group')}
                                className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 px-2 py-2 md:px-3 bg-white border-2 border-black font-mono text-[10px] md:text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]"
                              >
                                <Copy className="w-3.5 h-3.5" /> Group Link
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(wish.id, wish.recipient_name)}
                              className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 px-2 py-2 md:px-3 bg-rose-500 border-2 border-black font-mono text-[10px] md:text-xs font-bold uppercase text-white hover:bg-red-600 transition-colors shadow-[2px_2px_0_0_#000]"
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
          </>
        ) : (
          /* CALENDAR VIEW */
          <div className="bg-white border-[6px] md:border-8 border-black shadow-[8px_8px_0_0_#000] md:shadow-[16px_16px_0_0_#000] p-4 sm:p-8 md:p-12 mb-16">
            
            <div className="flex justify-between items-end mb-8 border-b-8 border-black pb-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <span className="font-mono text-xs md:text-sm font-bold bg-cyan-400 px-2 py-1 border-2 border-black shadow-[4px_4px_0_0_#000]">
                [ CALENDAR MODE ]
              </span>
            </div>

            <div className="grid grid-cols-7 border-t-4 border-l-4 border-black">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="border-b-4 border-r-4 border-black bg-zinc-100 p-2 text-center font-black uppercase text-xs md:text-sm">
                  {day}
                </div>
              ))}
              
              {/* Empty slots for days before the 1st */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-b-4 border-r-4 border-black bg-zinc-50 min-h-[80px] md:min-h-[120px]" />
              ))}
              
              {/* Actual days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayWishes = wishesByDay[day] || [];
                const hasWishes = dayWishes.length > 0;
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className={`border-b-4 border-r-4 border-black min-h-[80px] md:min-h-[120px] p-1 md:p-2 relative flex flex-col items-center justify-start ${hasWishes ? 'bg-[#FFeb3b] hover:bg-yellow-300' : 'bg-white'} transition-colors group cursor-default`}
                  >
                    <span className={`text-xl md:text-3xl font-black tracking-tighter ${hasWishes ? 'text-black' : 'text-zinc-300'}`}>
                      {day}
                    </span>
                    {hasWishes && (
                      <div className="absolute bottom-2 w-full flex justify-center gap-1 flex-wrap px-1">
                        {dayWishes.map((w, idx) => (
                          <div key={idx} className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black bg-rose-500" title={w.recipient_name} />
                        ))}
                      </div>
                    )}
                    
                    {/* Hover Info Tooltip */}
                    {hasWishes && (
                      <div className="absolute top-0 left-full ml-2 z-50 w-48 bg-black border-4 border-black text-white p-3 shadow-[8px_8px_0_0_#FFeb3b] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block">
                        <p className="font-mono text-xs font-bold mb-2 text-yellow-400">[ TARGETS ]</p>
                        {dayWishes.map(w => (
                          <div key={w.id} className="text-sm font-bold uppercase truncate">
                            - {w.recipient_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
