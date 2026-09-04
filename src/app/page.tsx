'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Globe2,
  Lock,
  MessageSquareQuote,
  Star,
  ChevronDown
} from 'lucide-react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import PhoneMockup from '@/components/PhoneMockup';
import VibeSlider from '@/components/VibeSlider';
import { soundFX } from '@/lib/audio';

export default function HomePage() {
  const [selectedVibe, setSelectedVibe] = useState<WishVibe>('roast');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const currentConfig = VIBE_CONFIGS[selectedVibe];

  const toggleFaq = (index: number) => {
    soundFX.playPop();
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { q: "Will the recipient know who sent it?", a: "By default, Roasts and Custom vibes are fully anonymous (sent from truth@chitoria.dev). Sweet and Sentimental vibes will display your configured sender alias." },
    { q: "How exact is the delivery time?", a: "Extremely exact. We use distributed serverless queues to ensure the wish lands in their inbox exactly at 00:00:00 in their local timezone." },
    { q: "Can I cancel a scheduled wish?", a: "Yes, you have full control in your Command Center. You can cancel or edit any wish right up until 1 minute before delivery." },
    { q: "Do group contributors need an account?", a: "No! Group boards are completely frictionless. Anyone with the secret link can add messages, photos, and voice notes without signing up." }
  ];

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-16 pb-24 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="absolute top-1/4 left-1/4 -z-10 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full lg:w-[55%] space-y-8 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-2xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
              Trusted by 10,000+ Senders
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.1]">
            The Birthday Wish Engine They’ll{' '}
            <span className="bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Never Forget.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Automate hyper-personalized, AI-crafted roasts or emotional digital time capsules. Delivered at <strong className="text-white">exact local midnight</strong> with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-md"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Launch Your First Reveal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Command Center
            </Link>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm font-semibold text-zinc-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required</span>
            <span className="hidden sm:flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free forever tier</span>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex justify-center relative">
          <div className="relative w-full max-w-sm transform perspective-1000 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
            <div className={`absolute inset-0 rounded-[50px] blur-3xl opacity-40 transition-colors duration-500 bg-gradient-to-tr ${currentConfig.bgGradient}`} />
            <PhoneMockup
              recipientName="Alex"
              vibe={selectedVibe}
              body={currentConfig.sampleMessage}
              senderAlias={currentConfig.sampleSender}
              isAnonymous={selectedVibe === 'roast' || selectedVibe === 'custom'}
            />
          </div>
        </div>
      </section>

      {/* 2. LOGOS / SOCIAL PROOF */}
      <section className="w-full border-y border-white/5 bg-zinc-950 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Powering celebrations at top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Mock SVGs for companies */}
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Zap className="w-6 h-6 fill-current" /> ACME CORP</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Globe2 className="w-6 h-6" /> GLOBAL TECH</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Users className="w-6 h-6 fill-current" /> STARTUP.IO</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter hidden md:flex"><Shield className="w-6 h-6" /> SECURE SYS</div>
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX FEATURES */}
      <section className="w-full py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Engineered for <span className="text-rose-400">Impact.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We combined serverless edge computing with advanced LLMs to deliver an unmatched unboxing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 p-8 sm:p-10 group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Clock className="w-48 h-48" /></div>
            <div className="relative z-10 max-w-md space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <Globe2 className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Precision Timezone Routing</h3>
              <p className="text-zinc-400 leading-relaxed">
                Whether they are in Tokyo or Toronto, our edge-network ensures the email lands in their inbox exactly at 00:00:00 local time. Not a minute late.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 p-8 sm:p-10 group">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Frictionless Groups</h3>
              <p className="text-zinc-400 leading-relaxed">
                Share a secure link. Anyone can add notes and photos without creating an account.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 p-8 sm:p-10 group">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Privacy First</h3>
              <p className="text-zinc-400 leading-relaxed">
                All memories are encrypted. Anonymous roasts stay fully anonymous via our proxy aliases.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 p-8 sm:p-10 group bg-gradient-to-br from-zinc-900 to-indigo-950/40">
            <div className="relative z-10 max-w-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Immersive Reveal Engine</h3>
              <p className="text-zinc-400 leading-relaxed">
                We don't just send plain text emails. We generate unique, bespoke web applications for every single recipient, featuring interactive scratch-offs, animations, and sound effects tailored to their specific vibe.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE PRODUCT TOUR (VIBE ENGINE) */}
      <section className="w-full py-32 border-y border-white/5 bg-zinc-950 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 uppercase tracking-widest">
              Live Interactive Demo
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              The Dual-Personality Engine
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Drag the slider below. Watch how the entire application architecture—styles, physics, copy, and sound—morphs instantly based on the chosen vibe.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-zinc-950 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="bg-zinc-900 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
              <VibeSlider value={selectedVibe} onChange={setSelectedVibe} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. WALL OF LOVE (TESTIMONIALS) */}
      <section className="w-full py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Loved by <span className="text-emerald-400">Thousands.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Don't just take our word for it. See what happens when you send a hyper-personalized reveal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "I sent a Brutal Roast to my co-founder at midnight. The Slack channel exploded the next morning. Absolutely hilarious.", author: "David K.", role: "Sent a Roast" },
            { quote: "My sister lives in Australia. Being able to set the exact timezone and have a group board ready when she woke up made her cry happy tears.", author: "Sarah M.", role: "Sent a Tearjerker" },
            { quote: "The scratch-off reveal is just genius. It feels like a premium app experience, not just another e-card. I use this for everyone now.", author: "Elena R.", role: "Sent a Snarky Card" }
          ].map((testimonial, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900 transition-colors">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed mb-8">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10" />
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-xs text-zinc-500 font-semibold">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING */}
      <section className="w-full py-32 border-t border-white/5 bg-zinc-950 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Simple, Transparent Pricing.
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              Start making memories instantly. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 flex flex-col">
              <h3 className="text-2xl font-black text-white mb-2">Hobby</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-zinc-500 font-semibold">/forever</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['3 Automated Wishes per month', 'Standard AI Engine', 'Group Boards (up to 10 ppl)', 'Standard Delivery Aliases'].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-300">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/create" className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-center font-bold text-white hover:bg-white/10 transition-colors">
                Start for Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-rose-500/20 to-orange-500/5 border border-rose-500/30 rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden shadow-[0_0_80px_rgba(244,63,94,0.15)]">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest py-1.5 px-6 rounded-bl-2xl">
                Most Popular
              </div>
              <h3 className="text-2xl font-black text-rose-400 mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white">$4.99</span>
                <span className="text-rose-400/60 font-semibold">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Unlimited Automated Wishes', 'GPT-4 Advanced AI Engine', 'Unlimited Group Contributors', 'Custom Domains (@roast.me)', 'Priority Sub-Minute Delivery'].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="text-zinc-100">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/create" className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-center font-bold text-white hover:opacity-90 shadow-lg shadow-rose-500/25 transition-all">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="w-full py-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 bg-zinc-900/50 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-lg text-zinc-100">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="w-full py-32 px-4 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-orange-500/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">
            Ready to become the <br className="hidden md:block"/> best gift-giver you know?
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Join thousands of users who have automated their friendships (in a good way). Takes 60 seconds.
          </p>
          <div className="pt-8">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-black text-black bg-white hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <Sparkles className="w-6 h-6" />
              <span>Get Started Now</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
