'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Sparkles, Shield, Mail, ArrowRight, Code2 } from 'lucide-react';
import { soundFX } from '@/lib/audio';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/reveal')) return null;

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/5 bg-zinc-950 pt-20 pb-10">
      
      {/* Massive Background Typography Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden h-full flex items-center justify-center">
        <h2 className="text-[15vw] font-black leading-none tracking-tighter bg-gradient-to-b from-white/[0.03] to-transparent bg-clip-text text-transparent transform -translate-y-1/4">
          CHITORIA
        </h2>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Mission (Takes up 5 columns) */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <Link
              href="/"
              onClick={() => soundFX.playPop()}
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-[1px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white group-hover:text-amber-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  chitoria<span className="text-rose-500">.dev</span>
                </span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              The AI-powered birthday delivery engine. Send brutal pop-art roasts or unforgettable classic tearjerkers at exact local midnight.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                100% Free Tier
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Privacy First
              </span>
            </div>
          </div>

          {/* Navigation Links (3 columns) */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-bold text-white mb-6 text-sm flex items-center gap-2">
              Platform
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/create" onClick={() => soundFX.playPop()} className="text-zinc-400 hover:text-rose-400 hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Immersive Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" onClick={() => soundFX.playPop()} className="text-zinc-400 hover:text-rose-400 hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Calendar Hub
                </Link>
              </li>
              <li>
                <Link href="/wishes" onClick={() => soundFX.playPop()} className="text-zinc-400 hover:text-rose-400 hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Delivery Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Aliases (4 columns) */}
          <div className="md:col-span-8 lg:col-span-4">
            <h4 className="font-bold text-white mb-6 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400" />
              Delivery Aliases
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="group cursor-default flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:shadow-[0_0_8px_#f59e0b]" />
                <code className="text-xs font-mono text-zinc-300 group-hover:text-amber-400">roast@chitoria.dev</code>
              </div>
              <div className="group cursor-default flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors">
                <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:shadow-[0_0_8px_#f43f5e]" />
                <code className="text-xs font-mono text-zinc-300 group-hover:text-rose-400">forever@chitoria.dev</code>
              </div>
              <div className="group cursor-default flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_#06b6d4]" />
                <code className="text-xs font-mono text-zinc-300 group-hover:text-cyan-400">truth@chitoria.dev</code>
              </div>
              <div className="group cursor-default flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:shadow-[0_0_8px_#10b981]" />
                <code className="text-xs font-mono text-zinc-300 group-hover:text-emerald-400">secret@chitoria.dev</code>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-zinc-500">
            © {new Date().getFullYear()} chitoria.dev. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for unforgettable celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
