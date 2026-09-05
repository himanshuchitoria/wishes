'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/settings`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.default_timezone === 'UTC' && typeof window !== 'undefined') {
            const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (userTz) data.default_timezone = userTz;
          }
          setProfile(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    soundFX.playPop();
    setIsSaving(true);
    
    try {
      if (!supabase) throw new Error('Supabase not loaded');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        await supabase.auth.refreshSession();
        soundFX.playCelebration();
        toast('Preferences updated successfully!', 'success');
      }
    } catch (e) {
      console.error(e);
      toast('Failed to update preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    soundFX.playPop();
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/wishes`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      
      const wishes = res.ok ? (await res.json()).wishes : [];
      const data = {
        profile,
        wishes,
        exported_at: new Date().toISOString(),
        platform: 'chitoria.dev',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chitoria-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Downloaded all your wishes & settings in JSON format.', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteEmail !== profile?.email) {
      toast('Email does not match. Account deletion cancelled.', 'error');
      return;
    }

    soundFX.playPop();
    setIsSaving(true);
    
    try {
      if (!supabase) throw new Error('Supabase not loaded');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/settings/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete account on the server');
      
      await supabase.auth.signOut();
      localStorage.clear();
      toast('Your account and all associated wishes have been permanently wiped (GDPR).', 'info');
      setShowDeleteModal(false);
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      toast('Failed to delete account.', 'error');
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-yellow-400 pt-24 pb-12">
        <div className="text-center space-y-4 border-[8px] border-black bg-white p-8 shadow-[16px_16px_0_0_#000] transform -rotate-2">
          <Settings className="w-16 h-16 animate-spin mx-auto text-black" />
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 text-black w-full relative overflow-hidden font-sans pb-24">
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      {/* Massive Background Typography */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-visible mt-20">
        <h1 className="text-[22vw] font-black leading-none tracking-tighter text-black uppercase whitespace-nowrap opacity-[0.05] scale-110 transform rotate-1">
          SETTINGS
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-12 pt-24 sm:pt-28">
        
        {/* Header */}
        <div className="border-b-[8px] border-black pb-8">
          <div className="inline-block bg-white border-[4px] border-black px-3 py-1 shadow-[4px_4px_0_0_#000] transform -rotate-2 mb-4">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
              <Shield className="w-4 h-4 fill-current" />
              Account Center
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tighter uppercase leading-none transform rotate-1">
            Preferences
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-12">
          {/* Section 1: Profile & Identity */}
          <div className="bg-white border-[6px] sm:border-[8px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000] sm:shadow-[16px_16px_0_0_#000] transform -rotate-1 relative">
            <div className="absolute -top-6 -left-6 bg-cyan-400 border-[4px] border-black p-3 shadow-[4px_4px_0_0_#000] transform -rotate-6">
              <User className="w-8 h-8 text-black" />
            </div>
            
            <div className="ml-8 sm:ml-12 mb-8 border-b-[4px] border-black pb-4">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Profile & Identity</h3>
              <p className="font-mono text-sm font-bold uppercase mt-1">Default configurations for your wishes</p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black uppercase tracking-widest text-black">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    className="w-full px-4 py-3 bg-yellow-100 border-[4px] border-black text-sm sm:text-base font-black text-black uppercase focus:outline-none focus:bg-white shadow-[4px_4px_0_0_#000] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black uppercase tracking-widest text-black">
                    Account Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-4 py-3 bg-zinc-200 border-[4px] border-black text-sm sm:text-base font-black text-zinc-500 cursor-not-allowed uppercase shadow-[4px_4px_0_0_#000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black uppercase tracking-widest text-black">
                    Default Sender Alias
                  </label>
                  <input
                    type="text"
                    value={profile.default_sender_alias || ''}
                    onChange={(e) => setProfile({ ...profile, default_sender_alias: e.target.value })}
                    placeholder="E.G. SECRET ADMIRER"
                    className="w-full px-4 py-3 bg-white border-[4px] border-black text-sm sm:text-base font-black text-black uppercase focus:outline-none focus:bg-cyan-100 shadow-[4px_4px_0_0_#000] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-black uppercase tracking-widest text-black">
                    Default Delivery Prefix
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={profile.default_email_prefix || 'roast'}
                      onChange={(e) => setProfile({ ...profile, default_email_prefix: e.target.value })}
                      className="w-full sm:w-auto px-4 py-3 bg-white border-[4px] border-black text-sm sm:text-base font-black text-black uppercase focus:outline-none focus:bg-rose-100 shadow-[4px_4px_0_0_#000] transition-colors cursor-pointer"
                    >
                      <option value="cheers">cheers</option>
                      <option value="roast">roast</option>
                      <option value="forever">forever</option>
                      <option value="truth">truth</option>
                      <option value="secret">secret</option>
                      <option value="anonymous">anonymous</option>
                    </select>
                    <span className="text-sm sm:text-base font-black uppercase hidden sm:inline-block">@chitoria.dev</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-black uppercase tracking-widest text-black">
                  Default Timezone
                </label>
                <select
                  value={profile.default_timezone}
                  onChange={(e) => setProfile({ ...profile, default_timezone: e.target.value })}
                  className="w-full sm:w-2/3 px-4 py-3 bg-white border-[4px] border-black text-sm sm:text-base font-black text-black uppercase focus:outline-none focus:bg-emerald-100 shadow-[4px_4px_0_0_#000] transition-colors cursor-pointer"
                >
                  {typeof Intl !== 'undefined' && Intl.supportedValuesOf ? (
                    Intl.supportedValuesOf('timeZone').map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))
                  ) : (
                    <option value={profile.default_timezone}>{profile.default_timezone}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="bg-white border-[6px] sm:border-[8px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000] sm:shadow-[16px_16px_0_0_#000] transform rotate-1 relative">
            <div className="absolute -top-6 -right-6 bg-rose-500 border-[4px] border-black p-3 shadow-[4px_4px_0_0_#000] transform rotate-6">
              <Bell className="w-8 h-8 text-white fill-white" />
            </div>
            
            <div className="mb-8 border-b-[4px] border-black pb-4 pr-12 sm:pr-0">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Comms & Alerts</h3>
              <p className="font-mono text-sm font-bold uppercase mt-1">Control automatic email dispatch</p>
            </div>

            <div className="space-y-6">
              <label className="flex items-center justify-between p-4 sm:p-6 bg-yellow-100 border-[4px] border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] transition-all cursor-pointer group">
                <div className="pr-4">
                  <h4 className="text-lg sm:text-xl font-black uppercase">Delivery Confirmations</h4>
                  <p className="font-mono text-xs sm:text-sm font-bold uppercase mt-1">Email me when a scheduled wish is dispatched</p>
                </div>
                <div className="relative flex items-center justify-center shrink-0">
                  <input
                    type="checkbox"
                    checked={profile.notify_on_delivery}
                    onChange={(e) => setProfile({ ...profile, notify_on_delivery: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-[4px] border-black bg-white peer-checked:bg-cyan-400 transition-colors flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 sm:p-6 bg-cyan-100 border-[4px] border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] transition-all cursor-pointer group">
                <div className="pr-4">
                  <h4 className="text-lg sm:text-xl font-black uppercase">Live Read Receipts</h4>
                  <p className="font-mono text-xs sm:text-sm font-bold uppercase mt-1">Email me the exact second the recipient opens it</p>
                </div>
                <div className="relative flex items-center justify-center shrink-0">
                  <input
                    type="checkbox"
                    checked={profile.notify_on_open}
                    onChange={(e) => setProfile({ ...profile, notify_on_open: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-[4px] border-black bg-white peer-checked:bg-rose-500 transition-colors flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-400 text-black px-6 py-4 md:px-8 md:py-5 text-lg font-black uppercase tracking-widest border-[4px] sm:border-[6px] border-black hover:bg-white shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all transform -rotate-1 active:translate-y-2 active:shadow-[0_0_0_0_#000]"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>{isSaving ? 'SAVING...' : 'SAVE PREFERENCES'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Section 3: Data Export & GDPR Danger Zone */}
        <div className="bg-rose-500 border-[6px] sm:border-[8px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000] sm:shadow-[16px_16px_0_0_#000] transform rotate-1 mt-12 relative overflow-hidden">
          {/* Warning stripes background */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
               style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 border-b-[4px] border-black pb-4 mb-8">
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-black fill-yellow-400" />
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white" style={{ WebkitTextStroke: '1px black' }}>Danger Zone</h3>
                <p className="font-mono text-sm font-bold uppercase mt-1 text-black bg-white inline-block px-2">Privacy & Data Control</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-6 bg-white border-[4px] border-black shadow-[6px_6px_0_0_#000]">
                <div>
                  <h4 className="text-lg sm:text-xl font-black uppercase">Export All Data</h4>
                  <p className="font-mono text-xs sm:text-sm font-bold uppercase mt-1">Download a JSON snapshot of all your wishes</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 border-[4px] border-black px-6 py-3 font-black uppercase hover:bg-black hover:text-yellow-400 transition-colors shrink-0"
                >
                  <Download className="w-5 h-5" />
                  <span>EXPORT JSON</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-6 bg-black border-[4px] border-black shadow-[6px_6px_0_0_rgba(255,255,255,1)]">
                <div>
                  <h4 className="text-lg sm:text-xl font-black uppercase text-rose-500">Nuclear Option</h4>
                  <p className="font-mono text-xs sm:text-sm font-bold uppercase mt-1 text-white">Permanently erase your account and scheduled wishes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 border-[4px] border-rose-500 text-white px-6 py-3 font-black uppercase hover:bg-rose-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>WIPE ACCOUNT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal - Comic Style */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-yellow-400 border-[8px] border-black p-8 sm:p-12 shadow-[20px_20px_0_0_#000] transform rotate-2 relative">
              <div className="absolute -top-8 -left-8 bg-rose-500 border-[6px] border-black p-4 shadow-[8px_8px_0_0_#000] transform -rotate-12">
                <AlertTriangle className="w-12 h-12 text-black fill-yellow-400" />
              </div>
              
              <div className="mt-6 mb-8 text-center space-y-4">
                <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">NO TURNING BACK!</h3>
                <p className="font-mono text-sm sm:text-base font-bold uppercase bg-white border-[4px] border-black p-3 inline-block transform -rotate-1">
                  Type your email (<span className="text-rose-600">{profile.email}</span>) to confirm total deletion:
                </p>
              </div>

              <input
                type="text"
                value={confirmDeleteEmail}
                onChange={(e) => setConfirmDeleteEmail(e.target.value)}
                placeholder="TYPE YOUR EMAIL HERE..."
                className="w-full px-6 py-4 bg-white border-[6px] border-black text-lg font-black uppercase text-black text-center focus:outline-none focus:bg-rose-100 shadow-[8px_8px_0_0_#000] mb-8"
              />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 bg-white border-[4px] border-black text-lg font-black uppercase hover:bg-black hover:text-white transition-colors"
                >
                  NEVERMIND
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 px-6 py-4 bg-rose-600 border-[4px] border-black text-lg font-black uppercase text-white hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  DO IT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
