'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Calendar, PlusCircle, Volume2, VolumeX, Menu, X, Flame, ShieldAlert, LogOut, User } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { supabase } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    if (!supabase) return;
    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    soundFX.playPop();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push('/');
  };

  const toggleAudio = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playPop();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Calendar },
    { name: 'Wish Studio', href: '/create', icon: Sparkles },
    { name: 'Scheduled Queue', href: '/wishes', icon: Flame },
    { name: 'Settings', href: '/settings', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => soundFX.playPop()}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-[1px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <span className="text-lg font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                C
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                chitoria<span className="text-rose-500">.dev</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                AI Birthday
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => soundFX.playPop()}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800/80 text-rose-400 shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-zinc-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-zinc-800 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Create CTA */}
          <Link
            href="/create"
            onClick={() => soundFX.playPop()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule a Wish</span>
          </Link>

          {/* User Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                onClick={() => soundFX.playPop()}
                title={user.email}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:scale-105 transition-transform"
              >
                {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={() => soundFX.playPop()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  soundFX.playPop();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              href="/create"
              onClick={() => {
                soundFX.playPop();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule a Wish</span>
            </Link>
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-zinc-900 border border-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({(user.user_metadata?.full_name || user.email || '').split('@')[0]})
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => {
                  soundFX.playPop();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800"
              >
                <User className="w-4 h-4" />
                Sign In / Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
