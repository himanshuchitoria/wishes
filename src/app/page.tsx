'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  Globe2
} from 'lucide-react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import PhoneMockup from '@/components/PhoneMockup';
import VibeSlider from '@/components/VibeSlider';
import { soundFX } from '@/lib/audio';

// Custom Comic SVGs
const ComicBurst = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M100 0 L115 35 L155 15 L145 55 L190 55 L160 85 L195 120 L155 130 L165 170 L125 150 L100 195 L75 150 L35 170 L45 130 L5 120 L40 85 L10 55 L55 55 L45 15 L85 35 Z" 
      fill="#FFeb3b" 
      stroke="#000" 
      strokeWidth="6" 
      strokeLinejoin="round" 
    />
  </svg>
);

const SpeechBubble = ({ text, className, color = "bg-white" }: { text: string, className?: string, color?: string }) => (
  <div className={`relative ${className}`}>
    <div className={`${color} border-[6px] border-black p-6 rounded-3xl shadow-[8px_8px_0_0_#000] relative z-10 font-black uppercase text-xl leading-tight`}>
      {text}
    </div>
    <svg className="absolute -bottom-6 left-10 w-8 h-8 z-20" viewBox="0 0 50 50">
      <path d="M0,0 L0,50 L50,0 Z" fill={color.replace('bg-', '').replace('-400', '') === 'white' ? '#fff' : color.includes('cyan') ? '#06b6d4' : color.includes('rose') ? '#f43f5e' : '#fff'} stroke="#000" strokeWidth="6" />
    </svg>
  </div>
);

export default function HomePage() {
  const [selectedVibe, setSelectedVibe] = useState<WishVibe>('roast');
  const currentConfig = VIBE_CONFIGS[selectedVibe];

  return (
    <div className="flex flex-col items-center w-full overflow-hidden bg-white text-black font-sans relative selection:bg-rose-500 selection:text-white">
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      {/* 1. HERO SECTION (COMIC COVER) */}
      <section className="relative w-full pt-24 pb-16 sm:pt-28 lg:pt-36 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 z-10 border-b-[8px] border-black">
        
        {/* Massive Background Text behind everything */}
        <div className="absolute top-10 left-0 w-full overflow-hidden z-[-1] flex flex-col pointer-events-none select-none opacity-20 transform -rotate-3">
          <h1 className="text-[20vw] font-black uppercase leading-[0.8] text-transparent" style={{ WebkitTextStroke: '4px black' }}>BAM!</h1>
          <h1 className="text-[20vw] font-black uppercase leading-[0.8] text-transparent" style={{ WebkitTextStroke: '4px black', marginLeft: '10vw' }}>POW!</h1>
        </div>

        {/* Left Panel */}
        <div className="w-full lg:w-[50%] space-y-8 relative z-20">
          <div className="inline-block bg-rose-500 text-white border-[4px] border-black px-4 py-1 transform -rotate-2 shadow-[4px_4px_0_0_#000]">
            <span className="text-sm font-black tracking-widest uppercase">Issue #1: The Ultimate Gift</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-black drop-shadow-[4px_4px_0_rgba(255,235,59,1)]">
            NEVER SEND A BORING HBD AGAIN.
          </h1>

          <div className="relative">
            <SpeechBubble 
              text="Automate hyper-personalized, AI-crafted roasts or emotional digital time capsules. Delivered at exact local midnight!" 
              className="max-w-md transform rotate-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-6 pt-8">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 sm:px-8 sm:py-5 text-lg sm:text-xl font-black text-black bg-cyan-400 border-[6px] border-black hover:bg-yellow-400 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0_0_0_#000] transition-all transform -rotate-2"
            >
              <Zap className="w-6 h-6 fill-current" />
              <span>LAUNCH REVEAL</span>
            </Link>
          </div>
        </div>

        {/* Right Panel: The Centerpiece */}
        <div className="w-full lg:w-[50%] flex justify-center relative z-20 mt-16 lg:mt-0">
          {/* Jagged Starburst Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 animate-[spin_30s_linear_infinite]">
            <ComicBurst className="w-full h-full drop-shadow-[16px_16px_0_rgba(0,0,0,1)]" />
          </div>
          
          <div className="relative w-full max-w-sm transform rotate-6 hover:rotate-0 transition-transform duration-500 shadow-[20px_20px_0_0_#000] rounded-[50px] bg-white border-[8px] border-black p-2">
            <PhoneMockup
              recipientName="Alex"
              vibe={selectedVibe}
              body={currentConfig.sampleMessage}
              senderAlias={currentConfig.sampleSender}
              isAnonymous={selectedVibe === 'roast' || selectedVibe === 'custom'}
            />
          </div>

          {/* Floating Action Text */}
          <div className="absolute -bottom-10 -right-10 bg-rose-500 text-white border-[4px] border-black px-6 py-4 transform -rotate-12 shadow-[8px_8px_0_0_#000] z-30">
            <span className="font-black text-3xl uppercase tracking-tighter">*SCRATCH ME!*</span>
          </div>
        </div>
      </section>

      {/* 2. THE DUAL-PERSONALITY ENGINE (VIBE SLIDER) */}
      <section className="w-full py-24 bg-cyan-400 border-b-[8px] border-black relative z-10 overflow-hidden">
        {/* Background Comic Text */}
        <div className="absolute top-0 right-0 overflow-hidden z-0 pointer-events-none opacity-30 transform rotate-12 translate-x-1/4 -translate-y-1/4">
           <h1 className="text-[30vw] font-black uppercase text-black leading-none">VIBES</h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block bg-black text-yellow-400 px-6 py-2 border-[4px] border-black shadow-[8px_8px_0_0_#fff] transform rotate-2">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                THE DUAL-PERSONALITY ENGINE
              </h2>
            </div>
            <p className="text-xl font-bold uppercase tracking-widest bg-white inline-block px-4 py-1 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-1">
              Drag to switch from SWEET to SAVAGE
            </p>
          </div>

          {/* Comic Panel Container for Slider */}
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-12 border-[6px] sm:border-[8px] border-black shadow-[12px_12px_0_0_#000] sm:shadow-[16px_16px_0_0_#000] relative transform -rotate-1">
            {/* Cartoon Ornaments */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose-500 rounded-full border-[6px] border-black flex items-center justify-center shadow-[8px_8px_0_0_#000] z-30 transform -rotate-12">
               <Flame className="w-12 h-12 text-white fill-white" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-yellow-400 border-[6px] border-black flex items-center justify-center shadow-[8px_8px_0_0_#000] z-30 transform rotate-12">
               <Sparkles className="w-10 h-10 text-black fill-black" />
            </div>

            <VibeSlider value={selectedVibe} onChange={setSelectedVibe} />
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX COMIC PANELS (FEATURES) */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-b-[8px] border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[minmax(300px,auto)]">
          
          {/* Panel 1 */}
          <div className="lg:col-span-2 bg-yellow-400 border-[8px] border-black p-8 sm:p-10 shadow-[16px_16px_0_0_#000] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[24px_24px_0_0_#000] transition-all flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
              <Clock className="w-64 h-64 text-black" />
            </div>
            <div className="bg-black text-white self-start px-4 py-2 border-[4px] border-black mb-6 transform -rotate-2">
              <span className="font-black text-xl uppercase tracking-widest">01. TIMING</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black uppercase mb-4 leading-none text-black">Precision Timezone Routing</h3>
              <p className="text-xl font-bold bg-white p-4 border-[4px] border-black inline-block shadow-[4px_4px_0_0_#000] transform rotate-1">
                Lands exactly at 00:00:00 local time. Not a minute late.
              </p>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="bg-rose-500 border-[8px] border-black p-8 sm:p-10 shadow-[16px_16px_0_0_#000] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[24px_24px_0_0_#000] transition-all flex flex-col justify-between">
             <div className="bg-white text-black self-start px-4 py-2 border-[4px] border-black mb-6 transform rotate-3 shadow-[4px_4px_0_0_#000]">
              <span className="font-black text-xl uppercase tracking-widest">02. GROUPS</span>
            </div>
            <div className="relative z-10 space-y-4">
              <Users className="w-16 h-16 text-black fill-black" />
              <h3 className="text-3xl font-black uppercase leading-none text-black">Frictionless Boards</h3>
              <p className="font-bold text-white uppercase bg-black p-2 inline-block">No signup required.</p>
            </div>
          </div>

          {/* Panel 3 */}
          <div className="bg-white border-[8px] border-black p-8 sm:p-10 shadow-[16px_16px_0_0_#000] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[24px_24px_0_0_#000] transition-all flex flex-col justify-between">
            <div className="bg-cyan-400 text-black self-start px-4 py-2 border-[4px] border-black mb-6 transform -rotate-3 shadow-[4px_4px_0_0_#000]">
              <span className="font-black text-xl uppercase tracking-widest">03. PRIVACY</span>
            </div>
            <div className="relative z-10 space-y-4">
              <Lock className="w-16 h-16 text-black fill-cyan-400" />
              <h3 className="text-3xl font-black uppercase leading-none text-black">Secure & Anonymous</h3>
              <p className="font-bold text-black uppercase">Roasts stay fully anonymous.</p>
            </div>
          </div>

          {/* Panel 4 */}
          <div className="lg:col-span-2 bg-[#d8b4e2] border-[8px] border-black p-8 sm:p-10 shadow-[16px_16px_0_0_#000] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[24px_24px_0_0_#000] transition-all flex flex-col justify-between bg-[radial-gradient(circle,_#000_2px,_transparent_2.5px)]" style={{ backgroundSize: '12px 12px' }}>
            <div className="absolute inset-0 bg-[#d8b4e2] opacity-80" />
            <div className="bg-black text-yellow-400 self-start px-4 py-2 border-[4px] border-black mb-6 transform rotate-2 shadow-[4px_4px_0_0_#fff] relative z-10">
              <span className="font-black text-xl uppercase tracking-widest">04. EXPERIENCE</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-5xl font-black uppercase mb-4 leading-none text-black bg-white inline-block px-2 border-[4px] border-black">Bespoke Web Apps</h3>
              <p className="text-xl font-bold bg-yellow-400 p-4 border-[4px] border-black shadow-[6px_6px_0_0_#000] mt-4 max-w-md transform -rotate-1">
                We generate unique, immersive reveal experiences featuring scratch-offs and sound effects.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WALL OF LOVE (SPEECH BUBBLES) */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-b-[8px] border-black">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black drop-shadow-[4px_4px_0_rgba(244,67,54,1)] transform -rotate-2">
            WHAT THEY SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mt-12">
          
          <div className="flex flex-col items-center group">
            <SpeechBubble color="bg-cyan-400" text="The Slack channel exploded the next morning. Absolutely hilarious roast!" className="w-full transform -rotate-3 group-hover:-translate-y-2 transition-transform" />
            <div className="mt-8 font-black uppercase text-xl text-black bg-white px-4 py-1 border-[4px] border-black transform rotate-2 shadow-[4px_4px_0_0_#000]">DAVID K.</div>
          </div>

          <div className="flex flex-col items-center group">
            <SpeechBubble color="bg-yellow-400" text="Being able to set the exact timezone made her cry happy tears when she woke up." className="w-full transform rotate-2 group-hover:-translate-y-2 transition-transform" />
            <div className="mt-8 font-black uppercase text-xl text-black bg-white px-4 py-1 border-[4px] border-black transform -rotate-2 shadow-[4px_4px_0_0_#000]">SARAH M.</div>
          </div>

          <div className="flex flex-col items-center group">
            <SpeechBubble color="bg-rose-500" text="The scratch-off reveal is genius. It feels like a premium app experience." className="w-full transform -rotate-1 group-hover:-translate-y-2 transition-transform text-white" />
            <div className="mt-8 font-black uppercase text-xl text-black bg-white px-4 py-1 border-[4px] border-black transform rotate-3 shadow-[4px_4px_0_0_#000]">ELENA R.</div>
          </div>

        </div>
      </section>

      {/* 5. FINAL BIG BANG CTA */}
      <section className="w-full py-32 px-4 relative overflow-hidden bg-yellow-400 z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] -z-10 animate-[spin_60s_linear_infinite]">
            <ComicBurst className="w-full h-full opacity-30 drop-shadow-[0_0_0_rgba(0,0,0,0)]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-12 bg-white border-[12px] border-black p-12 sm:p-20 shadow-[24px_24px_0_0_#000] transform -rotate-2">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-black leading-[0.9]">
            READY TO DROP <br/> THE BOMB?
          </h2>
          <p className="text-2xl font-bold uppercase tracking-widest text-black/60 bg-yellow-400 inline-block px-4 py-2 border-[4px] border-black transform rotate-2">
            Automate your friendships today.
          </p>
          <div className="pt-8 flex justify-center">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="group inline-flex items-center justify-center gap-4 px-12 py-6 text-3xl font-black uppercase text-white bg-rose-500 border-[8px] border-black hover:bg-black hover:text-rose-500 shadow-[16px_16px_0_0_#000] hover:shadow-[24px_24px_0_0_#000] hover:-translate-y-2 active:translate-y-4 active:shadow-[0_0_0_0_#000] transition-all transform rotate-2"
            >
              <Sparkles className="w-8 h-8 group-hover:animate-ping" />
              <span>START FOR FREE</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
