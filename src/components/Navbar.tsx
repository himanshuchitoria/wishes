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
      <header className="sticky top-6 z-50 w-full px-4 sm:px-6 pointer-events-none transition-all duration-500">
        <div className="mx-auto max-w-5xl pointer-events-auto">
          <div className="h-16 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] flex items-center justify-between px-2 pr-4 transform -rotate-1 hover:rotate-0 transition-transform">
            
            {/* Brand Logo */}
            <Link
              href="/"
              onClick={() => soundFX.playPop()}
              className="flex items-center gap-2 group z-10 pl-2 bg-yellow-400 border-[2px] border-black px-2 py-1 shadow-[2px_2px_0_0_#000] hover:bg-rose-500 hover:text-white transition-colors"
            >
              <Code2 className="w-5 h-5 text-black group-hover:text-white transition-colors" />
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="text-sm font-black uppercase tracking-widest text-black group-hover:text-white transition-colors">
                  chitoria.dev
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 z-10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => soundFX.playPop()}
                    className={`relative group px-3 py-1 border-[2px] border-transparent hover:border-black text-[13px] font-black uppercase tracking-widest transition-all ${
                      isActive ? 'bg-cyan-400 border-black shadow-[4px_4px_0_0_#000] text-black transform rotate-2' : 'text-black hover:bg-yellow-400 hover:shadow-[4px_4px_0_0_#000] hover:-rotate-2'
                    }`}
                  >
                    <span className="relative flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Side Auth */}
            <div className="hidden md:flex items-center gap-3 z-10">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-black uppercase text-xs tracking-widest text-black border-[2px] border-transparent hover:border-black hover:bg-rose-500 hover:text-white hover:shadow-[4px_4px_0_0_#000] transition-all transform rotate-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => soundFX.playPop()}
                  className="flex items-center gap-1.5 px-4 py-2 font-black uppercase tracking-widest text-xs text-white bg-black border-[2px] border-black hover:bg-cyan-400 hover:text-black shadow-[4px_4px_0_0_rgba(6,182,212,1)] transition-all transform rotate-2"
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
              className="md:hidden p-2 rounded-none bg-yellow-400 border-[2px] border-black text-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-[0_0_0_0_#000] transition-all z-10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 font-bold" /> : <Menu className="w-5 h-5 font-bold" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-32 px-6 flex flex-col font-sans">
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.1] z-0" 
            style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
          />
          <nav className="flex flex-col gap-4 relative z-10">
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
                  className={`flex items-center gap-4 p-4 text-xl font-black uppercase tracking-widest border-[4px] border-black transition-all ${
                    isActive
                      ? 'bg-cyan-400 shadow-[8px_8px_0_0_#000] text-black transform rotate-1'
                      : 'bg-white text-black hover:bg-yellow-400 hover:shadow-[8px_8px_0_0_#000]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-2 bg-black w-full my-4" />

            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 p-4 text-xl font-black uppercase tracking-widest bg-rose-500 text-white border-[4px] border-black shadow-[8px_8px_0_0_#000] transform -rotate-1 active:translate-y-2 active:shadow-[0_0_0_0_#000] transition-all"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => {
                  soundFX.playPop();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 p-4 text-xl font-black uppercase tracking-widest bg-black text-white border-[4px] border-black shadow-[8px_8px_0_0_rgba(6,182,212,1)] transform rotate-1 active:translate-y-2 active:shadow-[0_0_0_0_rgba(6,182,212,1)] transition-all"
              >
                <User className="w-6 h-6" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
