'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  NavDashboardIcon,
  NavStudioIcon,
  NavQueueIcon,
  NavSettingsIcon,
  NavUserIcon,
  NavLogoutIcon,
  NavMenuIcon,
  NavCloseIcon,
} from '@/components/NavIcons';
import WcLogo from '@/components/WcLogo';
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
    { name: 'Dashboard', href: '/dashboard', icon: NavDashboardIcon },
    { name: 'Studio', href: '/create', icon: NavStudioIcon },
    { name: 'Queue', href: '/wishes', icon: NavQueueIcon },
    { name: 'Settings', href: '/settings', icon: NavSettingsIcon },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-4 pt-2 sm:pt-3 pointer-events-none transition-all duration-500">
        <div className="mx-auto max-w-5xl pointer-events-auto">
          <div className="h-12 sm:h-14 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] flex items-center justify-between px-2 pr-4 transform -rotate-1 hover:rotate-0 transition-transform">
            
            {/* Brand Logo */}
            <Link
              href="/"
              onClick={() => soundFX.playPop()}
              className="flex items-center gap-2 group z-10 bg-yellow-400 border-[2px] border-black px-2 sm:px-3 py-1 shadow-[2px_2px_0_0_#000] hover:bg-rose-500 hover:text-white transition-colors"
            >
              <WcLogo size={24} color="#000" className="group-hover:invert transition-all shrink-0" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-black group-hover:text-white transition-colors hidden sm:inline">
                chitoria.dev
              </span>
            </Link>

            {/* Desktop Navigation Links - centered */}
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
                      <Icon size={15} className="w-3.5 h-3.5 shrink-0" />
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
                  <NavLogoutIcon size={14} className="w-3.5 h-3.5 shrink-0" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => soundFX.playPop()}
                  className="flex items-center gap-1.5 px-4 py-2 font-black uppercase tracking-widest text-xs text-white bg-black border-[2px] border-black hover:bg-cyan-400 hover:text-black shadow-[4px_4px_0_0_rgba(6,182,212,1)] transition-all transform rotate-2"
                >
                  <NavUserIcon size={14} className="w-3.5 h-3.5 shrink-0" />
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
              {mobileMenuOpen ? <NavCloseIcon size={20} className="w-5 h-5" /> : <NavMenuIcon size={20} className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-14 sm:pt-16 px-4 flex flex-col font-sans">
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.1] z-0" 
            style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
          />
          <nav className="flex flex-col gap-3 relative z-10">
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
                  className={`flex items-center gap-3 p-3 text-base sm:text-xl font-black uppercase tracking-widest border-[4px] border-black transition-all ${
                    isActive
                      ? 'bg-cyan-400 shadow-[6px_6px_0_0_#000] text-black transform rotate-1'
                      : 'bg-white text-black hover:bg-yellow-400 hover:shadow-[6px_6px_0_0_#000]'
                  }`}
                >
                  <Icon size={22} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
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
                className="flex items-center gap-3 p-3 text-base sm:text-xl font-black uppercase tracking-widest bg-rose-500 text-white border-[4px] border-black shadow-[6px_6px_0_0_#000] transform -rotate-1 active:translate-y-2 active:shadow-[0_0_0_0_#000] transition-all"
              >
                <NavLogoutIcon size={22} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => {
                  soundFX.playPop();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 text-base sm:text-xl font-black uppercase tracking-widest bg-black text-white border-[4px] border-black shadow-[6px_6px_0_0_rgba(6,182,212,1)] transform rotate-1 active:translate-y-2 active:shadow-[0_0_0_0_rgba(6,182,212,1)] transition-all"
              >
                <NavUserIcon size={22} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
