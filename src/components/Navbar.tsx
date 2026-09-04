'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Calendar, Flame, ShieldAlert, User, Menu, X, LogOut, Code2 } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { supabase } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  if (pathname?.startsWith('/reveal')) return null;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Calendar },
    { name: 'Studio', href: '/create', icon: Sparkles },
    { name: 'Queue', href: '/wishes', icon: Flame },
    { name: 'Settings', href: '/settings', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6 pointer-events-none transition-all duration-500">
        <div className="mx-auto max-w-5xl pointer-events-auto">
          <div className="h-14 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-between px-2 pr-4 relative overflow-hidden">
            
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-orange-500/5 pointer-events-none" />

            {/* Brand Logo */}
            <Link
              href="/"
              onClick={() => soundFX.playPop()}
              className="flex items-center gap-2 group z-10 pl-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-[1px] shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white group-hover:text-amber-300 transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  chitoria<span className="text-rose-500">.dev</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 z-10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => soundFX.playPop()}
                    className="relative group px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300"
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                    )}
                    <span className={`relative flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`} />
                      {link.name}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Side Auth */}
            <div className="hidden md:flex items-center gap-3 z-10">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => soundFX.playPop()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-zinc-950 bg-white hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                soundFX.playPop();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 -mr-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-md md:hidden pt-24 px-4 flex flex-col">
          <nav className="flex flex-col gap-2">
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
                  className={`flex items-center gap-3 p-4 rounded-2xl text-lg font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500/20 to-transparent text-white border border-rose-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-rose-400' : 'text-zinc-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-lg font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => {
                  soundFX.playPop();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-lg font-bold text-zinc-950 bg-white"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
