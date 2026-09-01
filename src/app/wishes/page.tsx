'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  Filter,
  Eye,
  ExternalLink,
  Send,
  Trash2,
  Copy,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import { Wish, VIBE_CONFIGS } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatDate, getNextBirthdayDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';
import PhoneMockup from '@/components/PhoneMockup';

export default function WishQueuePage() {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewWish, setPreviewWish] = useState<Wish | null>(null);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch('https://wishesbackend.vercel.app/api/wishes', {
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
      
      const res = await fetch(`https://wishesbackend.vercel.app/api/wishes/${wish.id}/deliver_now`, {
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
      
      const res = await fetch(`https://wishesbackend.vercel.app/api/wishes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
        if (previewWish?.id === id) setPreviewWish(null);
        toast(`Wish for ${name} cancelled.`, 'info');
      }
    } catch (e) {
      console.error(e);
      toast('Failed to cancel wish.', 'error');
    }
  };

  const handleCopyLink = (token: string) => {
    soundFX.playPop();
    const url = `${window.location.origin}/reveal/${token}`;
    navigator.clipboard.writeText(url);
    toast('Reveal link copied to clipboard!', 'success');
  };

  const handleCopyGroupLink = (groupToken: string) => {
    soundFX.playPop();
    const url = `${window.location.origin}/collaborate/${groupToken}`;
    navigator.clipboard.writeText(url);
    toast('Group board link copied! Share with friends so they can add notes.', 'success');
  };

  const filtered = wishes.filter((w) => {
    const matchesTab = activeTab === 'all' || w.status === activeTab;
    const matchesSearch =
      w.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Audit & Queue
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">QStash Sync Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Scheduled Queue & History
          </h1>
        </div>

        <Link
          href="/create"
          onClick={() => soundFX.playPop()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Scheduled Wish</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-full sm:w-auto">
          {[
            { key: 'all', label: 'All Wishes' },
            { key: 'scheduled', label: 'Queued (Pending)' },
            { key: 'delivered', label: 'Delivered / Unlocked' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                soundFX.playPop();
                setActiveTab(tab.key as typeof activeTab);
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queue by name/email..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Data Grid */}
        <div className={`space-y-3 ${previewWish ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Scheduled For</th>
                    <th className="p-4">Vibe & Channel</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        No records match your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((wish) => {
                      const config = VIBE_CONFIGS[wish.vibe];
                      const nextBday = getNextBirthdayDate(wish.birth_date, wish.delivery_time);

                      return (
                        <tr
                          key={wish.id}
                          onClick={() => {
                            soundFX.playPop();
                            setPreviewWish(wish);
                          }}
                          className={`cursor-pointer hover:bg-zinc-800/40 transition-colors ${
                            previewWish?.id === wish.id ? 'bg-zinc-800/60' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">
                              {wish.recipient_name}
                            </div>
                            <div className="text-zinc-400 text-[11px]">
                              {wish.recipient_email}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-zinc-200 font-semibold">
                              {formatDate(nextBday.toISOString())}
                            </div>
                            <div className="text-zinc-500 text-[10px] font-mono">
                              00:00 ({wish.delivery_timezone})
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs">{config.emoji}</span>
                              <span className="font-semibold text-zinc-200">{config.name}</span>
                            </div>
                            <div className="text-zinc-500 font-mono text-[10px]">
                              @{wish.sender_email_prefix}.chitoria.dev
                            </div>
                          </td>

                          <td className="p-4">
                            {wish.status === 'scheduled' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                                <Clock className="w-3 h-3" /> Queued
                              </span>
                            ) : wish.opened_at ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Sent & Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Sent
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {wish.status === 'scheduled' && (
                                <button
                                  onClick={() => handleSendNow(wish)}
                                  title="Send Now (Override Schedule)"
                                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold"
                                >
                                  Send Now ⚡
                                </button>
                              )}

                              <button
                                onClick={() => handleCopyLink(wish.reveal_token)}
                                title="Copy Reveal Link"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              {wish.is_group_board && (
                                <button
                                  onClick={() => handleCopyGroupLink(wish.group_token)}
                                  title="Copy Group Board Link"
                                  className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/30"
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleCancel(wish.id, wish.recipient_name)}
                                title="Cancel Wish"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel Slideout Preview */}
        {previewWish && (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Inspect Wish Payload
                </h3>
                <p className="text-[11px] text-zinc-400">
                  ID: {previewWish.id}
                </p>
              </div>
              <button
                onClick={() => setPreviewWish(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <PhoneMockup
              recipientName={previewWish.recipient_name}
              vibe={previewWish.vibe}
              headline={previewWish.message_payload.headline}
              body={previewWish.message_payload.body}
              senderAlias={previewWish.sender_alias}
              isAnonymous={previewWish.is_anonymous}
              revealType={previewWish.message_payload.revealType}
            />

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link
                href={`/reveal/${previewWish.reveal_token}`}
                target="_blank"
                className="flex items-center gap-1.5 text-rose-400 hover:underline font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Reveal Window</span>
              </Link>
              {previewWish.is_group_board && (
                <button
                  onClick={() => handleCopyGroupLink(previewWish.group_token)}
                  className="flex items-center gap-1.5 text-purple-400 hover:underline font-bold"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Copy Group Link</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
