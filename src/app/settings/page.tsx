'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  Globe,
  Clock,
  Mail,
  Lock,
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
        
        const res = await fetch('http://localhost:8000/api/settings', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Auto-detect timezone if default is UTC
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
      
      const res = await fetch('http://localhost:8000/api/settings', {
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
      
      const res = await fetch('http://localhost:8000/api/wishes', {
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

  const handleDeleteAccount = () => {
    if (confirmDeleteEmail !== profile?.email) {
      toast('Email does not match. Account deletion cancelled.', 'error');
      return;
    }

    soundFX.playPop();
    localStorage.clear();
    toast('Your account and all associated wishes have been permanently wiped (GDPR).', 'info');
    setShowDeleteModal(false);
    window.location.href = '/';
  };

  if (!profile) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Account Center
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-400">Privacy & Settings</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Preferences & Identity
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Profile & Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Profile & Identity</h3>
              <p className="text-xs text-zinc-400">Default settings for scheduled wishes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile!, display_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800/60 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Default Sender Alias
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={profile.default_sender_alias}
                   onChange={(e) => setProfile({ ...profile!, default_sender_alias: e.target.value })}
                  className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-amber-400 font-mono focus:outline-none focus:border-rose-500"
                >
                  <option value="cheers">cheers</option>
                  <option value="roast">roast</option>
                  <option value="forever">forever</option>
                  <option value="truth">truth</option>
                  <option value="secret">secret</option>
                </select>
                <span className="text-sm text-zinc-400 font-mono">@chitoria.dev</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                Default Timezone
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={profile.default_timezone}
                  onChange={(e) => setProfile({ ...profile!, default_timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notifications & Read Receipts</h3>
              <p className="text-xs text-zinc-400">Control automatic email alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h4 className="text-sm font-bold text-white">Delivery Confirmations</h4>
                <p className="text-xs text-zinc-400">Email me when my scheduled wish is successfully dispatched at midnight</p>
              </div>
              <input
                type="checkbox"
                checked={profile.notify_on_delivery}
                onChange={(e) => setProfile({ ...profile!, notify_on_delivery: e.target.checked })}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h4 className="text-sm font-bold text-white">Live Read Receipts</h4>
                <p className="text-xs text-zinc-400">Email me the exact second the recipient scratches or opens their reveal</p>
              </div>
              <input
                type="checkbox"
                checked={profile.notify_on_open}
                onChange={(e) => setProfile({ ...profile!, notify_on_open: e.target.checked })}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Section 3: Data Export & GDPR Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-rose-500/20 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Privacy & Data Control</h3>
            <p className="text-xs text-zinc-400">Export or permanently erase all your data</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div>
            <h4 className="text-sm font-bold text-white">Export All Account Data</h4>
            <p className="text-xs text-zinc-400">Download a complete JSON snapshot of all your scheduled and delivered wishes</p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
          <div>
            <h4 className="text-sm font-bold text-rose-300">Delete Account & Wipe Wishes</h4>
            <p className="text-xs text-zinc-400">Permanently erase your account, contacts, and scheduled messages (irreversible)</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Are you absolutely sure?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This action cannot be undone. To confirm deletion, please type your email address (<strong>{profile.email}</strong>) below:
              </p>
            </div>

            <input
              type="text"
              value={confirmDeleteEmail}
              onChange={(e) => setConfirmDeleteEmail(e.target.value)}
              placeholder={profile.email}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30"
              >
                Permanently Wipe Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
