'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Heart,
  Clock,
  Shield,
  Gift,
  ArrowRight,
  CheckCircle2,
  Users,
  Send,
  Zap,
  HelpCircle,
  Volume2,
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

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        {/* Background glow orbs */}
        <div className="absolute top-10 left-1/4 -z-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 -z-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Left Content */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-bold text-zinc-300 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              Never Send a Boring "HBD" Again
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400">100% Free Engine</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            The Birthday Wish They’ll{' '}
            <span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Never Forget
            </span>{' '}
            — Or Never Live Down.
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Schedule hyper-personalized, AI-crafted roasts, emotional digital time capsules, or collaborative group boards. Delivered at <strong className="text-zinc-200">exact local midnight</strong> with interactive scratch-offs and envelope reveals.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 shadow-xl shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create a Wish — It’s Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>View Dashboard Hub</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-left">
            <div>
              <div className="text-base sm:text-lg font-black text-white">00:00 AM</div>
              <div className="text-[11px] text-zinc-500">Exact Timezone Delivery</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-rose-400">100% Free</div>
              <div className="text-[11px] text-zinc-500">Email & Secret Links</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-amber-400">AI Powered</div>
              <div className="text-[11px] text-zinc-500">Roast or Tearjerker</div>
            </div>
          </div>
        </div>

        {/* Hero Right: Live Interactive Mockup Showcase */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            {/* Ambient Backlight Glow */}
            <div
              className={`absolute inset-0 rounded-[50px] blur-3xl opacity-30 transition-colors duration-500 bg-gradient-to-tr ${currentConfig.bgGradient}`}
            />
            {/* Interactive Phone Mockup */}
            <PhoneMockup
              recipientName="Alex"
              vibe={selectedVibe}
              body={currentConfig.sampleMessage}
              senderAlias={currentConfig.sampleSender}
              isAnonymous={selectedVibe === 'roast' || selectedVibe === 'custom'}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1.5">
            <span>✨ Try scratching or opening the card above!</span>
          </p>
        </div>
      </section>

      {/* Interactive Vibe Showcase Slider Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-800/80 bg-zinc-950/60">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              The Dual-Personality Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Pick Your Vibe: Sweet ↔ Savage
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Different friends deserve different energy. Drag the slider to experience how the entire reveal changes in real time.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <VibeSlider value={selectedVibe} onChange={setSelectedVibe} />
          </div>

          {/* Quick Demo Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs text-zinc-500">Live Demos:</span>
            <Link
              href="/reveal/reveal-alex-roast-777"
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-orange-500/30 text-orange-400 hover:bg-zinc-800 font-semibold transition-all"
            >
              🔥 Brutal Roast Scratch-Off Demo
            </Link>
            <Link
              href="/reveal/reveal-sarah-tearjerker-888"
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-rose-500/30 text-rose-400 hover:bg-zinc-800 font-semibold transition-all"
            >
              💌 Tearjerker Envelope Demo
            </Link>
            <Link
              href="/collaborate/group-alex-token-999"
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-purple-500/30 text-purple-400 hover:bg-zinc-800 font-semibold transition-all"
            >
              👥 Group Collaboration Board Demo
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Walkthrough */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Frictionless in 60 Seconds
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How chitoria.dev Works
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Set it once, forget it, and let our precision serverless queue deliver the magic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-4 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Choose Mood & Date</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Select anything from brutal roast to sincere tearjerker. Set the recipient’s birthdate and local timezone for exact midnight dispatch.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-4 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-white">AI Crafts The Lore</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Feed 3 funny quirks, inside jokes, or memories into our AI writer. Watch it generate hilarious rhyming insults or touching memoirs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-4 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Unboxing & Viral Loop</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Recipient gets a surprise email from <code className="text-amber-400">cheers@chitoria.dev</code> or an anonymous alias. They scratch or unseal to view, and pay it forward!
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered For Unforgettable Moments
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Everything you need to orchestrate the greatest birthday surprise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">AI Roast Generator</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pre-tuned sarcastic prompts that weaponize inside jokes and cold pizza habits without crossing into mean-spiritedness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Group Vaults</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate a zero-friction group link for friend circles to drop photos, GIFs, and notes into a collective board.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Midnight Delivery</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Serverless QStash engine guarantees timezone-accurate midnight triggers anywhere from Tokyo to New York.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Anonymity & Safety</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Send as 'Secret Admirer' with AI toxicity filters, token-gated links, and read-receipt notifications for the creator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about chitoria.dev.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is chitoria.dev really 100% free?',
              a: 'Yes! Scheduled email delivery, AI text generation, custom interactive reveal pages, scratch-off cards, and group boards are completely free forever.',
            },
            {
              q: 'How does midnight delivery work across different timezones?',
              a: 'When you create a wish, you pick the recipient’s city or timezone. Our Upstash QStash queue calculates the exact UTC moment of their 12:00 AM birthday and wakes up our serverless mailer to deliver it right on time.',
            },
            {
              q: 'Can the recipient see who sent an anonymous wish before midnight?',
              a: 'No. If opened early, the page only shows a pulsing countdown clock. The actual payload is never exposed over the network until midnight, and anonymous wishes hide your personal email address.',
            },
            {
              q: 'Do contributors need to create an account for group boards?',
              a: 'No! Friends can click your shared WhatsApp/iMessage link and submit notes and photos instantly without creating an account.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-rose-400 transition-colors"
              >
                <span>{item.q}</span>
                <span className="text-zinc-500 font-mono text-lg">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40 animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Big Bottom CTA */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-rose-950/20 to-zinc-950 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
            <Gift className="w-4 h-4" /> Ready to schedule your first wish?
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Give Them a Birthday Memory That Hits Different.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Takes less than 2 minutes to set up. Whether it’s an emotional masterpiece or a hilarious reality check.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              onClick={() => soundFX.playPop()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 shadow-xl shadow-rose-500/25 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Launch Wish Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
