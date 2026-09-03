'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Sparkles, Shield, Gift } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/reveal')) return null;

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/90 text-zinc-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <Gift className="w-4 h-4 text-rose-400" />
              </div>
              <span className="font-bold text-white text-base">chitoria.dev</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              The AI-powered birthday delivery engine. Send brutal roasts or unforgettable tearjerkers at exact local midnight.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Free tier forever</span>
              <span>•</span>
              <span>100% serverless</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/create" className="hover:text-rose-400 transition-colors">Wish Studio & AI Writer</Link></li>
              <li><Link href="/dashboard" className="hover:text-rose-400 transition-colors">Birthday Calendar Hub</Link></li>
              <li><Link href="/wishes" className="hover:text-rose-400 transition-colors">Scheduled Delivery Queue</Link></li>
              <li><Link href="/reveal/reveal-alex-roast-777" className="hover:text-rose-400 transition-colors">Live Demo: Scratch-off Reveal</Link></li>
              <li><Link href="/reveal/reveal-sarah-tearjerker-888" className="hover:text-rose-400 transition-colors">Live Demo: Envelope Reveal</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">Delivery Aliases</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><code className="text-amber-400 bg-zinc-900 px-1 py-0.5 rounded">roast@chitoria.dev</code></li>
              <li><code className="text-rose-400 bg-zinc-900 px-1 py-0.5 rounded">forever@chitoria.dev</code></li>
              <li><code className="text-sky-400 bg-zinc-900 px-1 py-0.5 rounded">cheers@chitoria.dev</code></li>
              <li><code className="text-purple-400 bg-zinc-900 px-1 py-0.5 rounded">truth@chitoria.dev</code></li>
              <li><code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">secret@chitoria.dev</code></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> AI Content Moderation</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Token-Gated Private Links</li>
              <li><Link href="/settings" className="hover:text-rose-400 transition-colors">GDPR Instant Data Wipe</Link></li>
              <li><Link href="/auth" className="hover:text-rose-400 transition-colors">Google OAuth Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} chitoria.dev — Crafted with precision & affection.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for unforgettable celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
