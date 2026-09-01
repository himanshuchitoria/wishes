'use client';

import React, { useState } from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';
import { Sparkles, Wand2, X, Check, Loader2, RefreshCw } from 'lucide-react';
import { generateWishContent } from '@/lib/ai';
import { soundFX } from '@/lib/audio';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  vibe: WishVibe;
  recipientName: string;
  onApply: (headline: string, body: string, promptInputs: { fact1: string; fact2: string; fact3: string; insideJoke?: string }) => void;
}

export default function AIAssistantModal({
  isOpen,
  onClose,
  vibe,
  recipientName,
  onApply,
}: AIAssistantModalProps) {
  const [fact1, setFact1] = useState('');
  const [fact2, setFact2] = useState('');
  const [fact3, setFact3] = useState('');
  const [insideJoke, setInsideJoke] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ headline: string; body: string } | null>(null);

  if (!isOpen) return null;

  const currentVibeConfig = VIBE_CONFIGS[vibe];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    soundFX.playPop();

    try {
      const result = await generateWishContent({
        vibe,
        recipientName: recipientName || 'Friend',
        facts: {
          fact1: fact1 || 'obsessed with iced coffee',
          fact2: fact2 || 'always 10 minutes late',
          fact3: fact3 || 'has the most iconic laugh',
          insideJoke: insideJoke || 'that wild camping trip in 2023',
        },
      });

      setGeneratedResult(result);
      soundFX.playCelebration();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGenerated = () => {
    if (!generatedResult) return;
    soundFX.playPop();
    onApply(generatedResult.headline, generatedResult.body, {
      fact1,
      fact2,
      fact3,
      insideJoke,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                AI Birthday Writer
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {currentVibeConfig.emoji} {currentVibeConfig.name}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Drop 3 quick facts — AI crafts a custom roast or letter in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              1. Funny habit or obsession
            </label>
            <input
              type="text"
              value={fact1}
              onChange={(e) => setFact1(e.target.value)}
              placeholder="e.g. Eats cold pizza for breakfast, sleeps by 9:30 PM"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              2. Known quirk or embarrassing memory
            </label>
            <input
              type="text"
              value={fact2}
              onChange={(e) => setFact2(e.target.value)}
              placeholder="e.g. Tripped over their own dog, terrible driver"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              3. Best trait or superpower
            </label>
            <input
              type="text"
              value={fact3}
              onChange={(e) => setFact3(e.target.value)}
              placeholder="e.g. Always remembers birthdays, makes the best cocktails"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Inside Joke / Shared Lore (Optional)
            </label>
            <input
              type="text"
              value={insideJoke}
              onChange={(e) => setInsideJoke(e.target.value)}
              placeholder="e.g. The 2023 camping disaster, 'Lord of the Fries'"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Masterpiece...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI {currentVibeConfig.name} Draft</span>
              </>
            )}
          </button>
        </form>

        {/* Generated Output Preview Box */}
        {generatedResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-rose-500/30 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                ✨ Generated Draft
              </span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Re-generate
              </button>
            </div>

            <h4 className="text-sm font-bold text-white">
              {generatedResult.headline}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              &ldquo;{generatedResult.body}&rdquo;
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleUseGenerated}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Draft in Studio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
