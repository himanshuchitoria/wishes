'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Sparkles, Shield, Mail, ArrowRight, Code2 } from 'lucide-react';
import { soundFX } from '@/lib/audio';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/reveal')) return null;

  const isDashboard = pathname === '/dashboard';

  return (
    <footer className={`relative overflow-hidden border-t-[8px] border-black bg-cyan-400 pt-20 pb-10 mt-0`}>
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      {/* Massive Background Typography Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden h-full flex items-center justify-center z-[1] opacity-30 transform -rotate-2">
        <h2 className="text-[15vw] sm:text-[18vw] lg:text-[20vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '4px black' }}>
          CHITORIA
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Mission (Takes up 5 columns) */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <Link
              href="/"
              onClick={() => soundFX.playPop()}
              className="inline-flex items-center gap-2.5 group bg-white border-[4px] border-black px-4 py-2 shadow-[8px_8px_0_0_#000] transform -rotate-1 hover:rotate-0 hover:bg-yellow-400 transition-all"
            >
              <Code2 className="w-8 h-8 text-black" />
              <div className="flex flex-col">
                <span className="text-2xl font-black uppercase tracking-widest text-black">
                  chitoria.dev
                </span>
              </div>
            </Link>
            
            <p className="text-lg font-bold leading-relaxed text-black max-w-sm bg-white inline-block p-2 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform rotate-1">
              The AI-powered birthday delivery engine. Send brutal pop-art roasts or unforgettable classic tearjerkers at exact local midnight.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 border-[4px] border-black text-sm font-black uppercase text-black shadow-[4px_4px_0_0_#000] transform -rotate-2">
                <Sparkles className="w-4 h-4 fill-current" />
                100% Free Tier
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-400 border-[4px] border-black text-sm font-black uppercase text-black shadow-[4px_4px_0_0_#000] transform rotate-1">
                <Shield className="w-4 h-4 fill-current" />
                Privacy First
              </span>
            </div>
          </div>

          {/* Navigation Links (3 columns) */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-black text-black uppercase tracking-widest mb-6 text-xl bg-white inline-block px-2 border-[4px] border-black shadow-[4px_4px_0_0_#000]">
              Platform
            </h4>
            <ul className="space-y-4 text-base font-black uppercase tracking-widest">
              <li>
                <Link href="/create" onClick={() => soundFX.playPop()} className="text-black hover:text-white hover:bg-black inline-flex items-center gap-2 group px-2 py-1 border-[4px] border-transparent hover:border-black transition-all">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Immersive Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" onClick={() => soundFX.playPop()} className="text-black hover:text-white hover:bg-black inline-flex items-center gap-2 group px-2 py-1 border-[4px] border-transparent hover:border-black transition-all">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Calendar Hub
                </Link>
              </li>
              <li>
                <Link href="/wishes" onClick={() => soundFX.playPop()} className="text-black hover:text-white hover:bg-black inline-flex items-center gap-2 group px-2 py-1 border-[4px] border-transparent hover:border-black transition-all">
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Delivery Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Aliases (4 columns) */}
          <div className="md:col-span-8 lg:col-span-4">
            <h4 className="font-black text-black uppercase tracking-widest mb-6 text-xl bg-white inline-block px-2 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-1">
              <span className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-black fill-current" />
                Delivery Aliases
              </span>
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="group cursor-default flex items-center gap-2 px-3 py-2 bg-yellow-400 border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all transform rotate-1">
                <span className="w-3 h-3 rounded-full bg-black group-hover:animate-ping" />
                <code className="text-sm font-black tracking-widest text-black">roast@chitoria.dev</code>
              </div>
              <div className="group cursor-default flex items-center gap-2 px-3 py-2 bg-rose-500 border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all transform -rotate-2">
                <span className="w-3 h-3 rounded-full bg-black group-hover:animate-ping" />
                <code className="text-sm font-black tracking-widest text-white">forever@chitoria.dev</code>
              </div>
              <div className="group cursor-default flex items-center gap-2 px-3 py-2 bg-white border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all transform rotate-2">
                <span className="w-3 h-3 rounded-full bg-black group-hover:animate-ping" />
                <code className="text-sm font-black tracking-widest text-black">truth@chitoria.dev</code>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-[8px] border-black flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left bg-white p-6 shadow-[8px_8px_0_0_#000] transform rotate-1">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-black">
            © {new Date().getFullYear()} chitoria.dev. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-white bg-black px-4 py-2 border-[4px] border-black transform -rotate-2">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
            <span>for celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
