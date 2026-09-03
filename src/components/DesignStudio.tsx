'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Palette, Sparkles, MousePointer2, Trash2, RotateCcw, Plus } from 'lucide-react';
import {
  WishVibe, CardTheme, RevealType, ParticleEffect, CanvasElement,
  VIBE_CONFIGS, CARD_THEME_CONFIGS
} from '@/types';
import { soundFX } from '@/lib/audio';

// ─── Props ────────────────────────────────────────────────────────────────────
interface DesignStudioProps {
  vibe: WishVibe;
  theme: CardTheme;
  revealType: RevealType;
  effects: ParticleEffect;
  elements: CanvasElement[];
  onVibeChange: (v: WishVibe) => void;
  onThemeChange: (t: CardTheme) => void;
  onRevealChange: (r: RevealType) => void;
  onEffectsChange: (e: ParticleEffect) => void;
  onElementsChange: (els: CanvasElement[]) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VIBE_ORDER: WishVibe[] = ['roast', 'snarky', 'sweet', 'sentimental', 'custom'];

const REVEAL_OPTIONS: { id: RevealType; label: string; emoji: string; desc: string; preview: string }[] = [
  {
    id: 'scratch', label: 'Scratch-Off', emoji: '🪙', preview: '✨✨✨',
    desc: 'Recipient rubs their finger/mouse to expose the message — lotto-style suspense',
  },
  {
    id: 'envelope', label: 'Wax Envelope', emoji: '✉️', preview: '💌💌💌',
    desc: 'Break the wax seal — the letter slides out with a cinematic animation',
  },
  {
    id: 'glitch', label: 'Glitch Hack', emoji: '⚡', preview: '█▓▒░▒▓█',
    desc: 'A fake system error flickers and crashes to reveal the roast underneath',
  },
  {
    id: 'instant', label: 'Instant Reveal', emoji: '💥', preview: '🎉🎊🎉',
    desc: 'No wait — message explodes into view immediately with a burst of confetti',
  },
];

const EFFECT_OPTIONS: { id: ParticleEffect; label: string; emoji: string; color: string }[] = [
  { id: 'confetti', label: 'Confetti', emoji: '🎊', color: 'border-yellow-500/50 text-yellow-300' },
  { id: 'hearts', label: 'Floating Hearts', emoji: '💖', color: 'border-rose-500/50 text-rose-300' },
  { id: 'fireworks', label: 'Fireworks', emoji: '🎆', color: 'border-orange-500/50 text-orange-300' },
  { id: 'snow', label: 'Snow', emoji: '❄️', color: 'border-sky-500/50 text-sky-300' },
  { id: 'sparkles', label: 'Sparkles', emoji: '✨', color: 'border-amber-500/50 text-amber-300' },
  { id: 'none', label: 'Clean', emoji: '🖤', color: 'border-zinc-600/50 text-zinc-400' },
];

const EMOJI_PALETTE = [
  '🎂', '🎉', '🎊', '🎁', '🎈', '🥳', '🍰', '🎶',
  '💖', '❤️', '🔥', '⭐', '✨', '💫', '🌟', '💯',
  '😂', '😏', '🤣', '😈', '💀', '🫡', '🤌', '👑',
  '🌹', '🌺', '🦋', '🌊', '🌈', '☁️', '🌙', '⚡',
];

// ─── Tab enum ─────────────────────────────────────────────────────────────────
type Tab = 'vibe' | 'reveal' | 'stickers';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DesignStudio({
  vibe, theme, revealType, effects, elements,
  onVibeChange, onThemeChange, onRevealChange, onEffectsChange, onElementsChange,
}: DesignStudioProps) {
  const [activeTab, setActiveTab] = useState<Tab>('vibe');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // ── Sticker Canvas Logic ──────────────────────────────────────────────────
  const addEmoji = useCallback((emoji: string) => {
    soundFX.playPop();
    const newEl: CanvasElement = {
      id: Math.random().toString(36).slice(2),
      type: 'emoji',
      content: emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      rotation: (Math.random() - 0.5) * 30,
      scale: 1,
      fontSize: 28,
    };
    onElementsChange([...elements, newEl]);
    setSelectedElement(newEl.id);
  }, [elements, onElementsChange]);

  const removeElement = useCallback((id: string) => {
    soundFX.playPop();
    onElementsChange(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  }, [elements, onElementsChange]);

  const startDrag = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(id);
    const el = elements.find(el => el.id === id)!;
    dragStart.current = { x: e.clientX, y: e.clientY, elX: el.x, elY: el.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [elements]);

  const onDrag = useCallback((e: React.PointerEvent, id: string) => {
    if (!dragStart.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
    const newX = Math.max(5, Math.min(95, dragStart.current.elX + dx));
    const newY = Math.max(5, Math.min(95, dragStart.current.elY + dy));
    onElementsChange(elements.map(el => el.id === id ? { ...el, x: newX, y: newY } : el));
  }, [elements, onElementsChange]);

  const endDrag = useCallback(() => {
    dragStart.current = null;
  }, []);

  const rotateElement = useCallback((id: string, dir: number) => {
    soundFX.playPop();
    onElementsChange(elements.map(el => el.id === id ? { ...el, rotation: el.rotation + dir * 15 } : el));
  }, [elements, onElementsChange]);

  const scaleElement = useCallback((id: string, dir: number) => {
    soundFX.playPop();
    onElementsChange(elements.map(el => el.id === id ? { ...el, scale: Math.max(0.5, Math.min(3, el.scale + dir * 0.2)) } : el));
  }, [elements, onElementsChange]);

  const themeList = Object.values(CARD_THEME_CONFIGS);

  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl">
      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-zinc-800">
        {([
          { id: 'vibe' as Tab, label: 'Vibe & Theme', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'reveal' as Tab, label: 'The Reveal', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'stickers' as Tab, label: 'Stickers', icon: <MousePointer2 className="w-3.5 h-3.5" /> },
        ] as const).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { soundFX.playPop(); setActiveTab(tab.id); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-white border-b-2 border-rose-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab 1: Vibe & Theme ─────────────────────────────────────────────── */}
      {activeTab === 'vibe' && (
        <div className="p-4 space-y-5">
          {/* Vibe Picker */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Vibe</p>
            <div className="grid grid-cols-5 gap-1.5">
              {VIBE_ORDER.map(v => {
                const cfg = VIBE_CONFIGS[v];
                const selected = vibe === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { soundFX.playPop(); onVibeChange(v); }}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all duration-200 ${
                      selected
                        ? `${cfg.borderGlow} bg-zinc-800/90 scale-[1.04]`
                        : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-xl">{cfg.emoji}</span>
                    <span className={`text-[9px] font-bold mt-0.5 leading-tight ${selected ? 'text-white' : 'text-zinc-400'}`}>
                      {cfg.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Picker */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Card Theme</p>
            <div className="grid grid-cols-5 gap-1.5">
              {themeList.map(t => {
                const selected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    onClick={() => { soundFX.playPop(); onThemeChange(t.id); }}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all duration-200 ${
                      selected
                        ? `${t.borderClass} ${t.glowClass} bg-zinc-800/90 scale-[1.04]`
                        : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className={`text-[9px] font-bold mt-0.5 leading-tight ${selected ? t.textClass : 'text-zinc-400'}`}>
                      {t.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preview Banner */}
          {(() => {
            const themeConfig = CARD_THEME_CONFIGS[theme];
            return (
              <div className={`p-3 rounded-xl border bg-gradient-to-r ${themeConfig.bg} ${themeConfig.borderClass} ${themeConfig.glowClass}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{themeConfig.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold ${themeConfig.textClass}`}>{themeConfig.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono" style={{ color: themeConfig.accentFrom }}>
                      {themeConfig.accentFrom} → {themeConfig.accentTo}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Tab 2: The Reveal ───────────────────────────────────────────────── */}
      {activeTab === 'reveal' && (
        <div className="p-4 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">How They Open It</p>
          <div className="grid grid-cols-2 gap-2">
            {REVEAL_OPTIONS.map(opt => {
              const selected = revealType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { soundFX.playPop(); onRevealChange(opt.id); }}
                  className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    selected
                      ? 'bg-zinc-800 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.2)] scale-[1.02]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{opt.emoji}</span>
                    {selected && (
                      <span className="text-[9px] font-bold text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white mb-1">{opt.label}</p>
                  <p className="text-[10px] text-zinc-400 leading-snug">{opt.desc}</p>
                  <p className={`text-xs mt-2 font-mono tracking-widest ${selected ? 'text-rose-400' : 'text-zinc-600'}`}>
                    {opt.preview}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Effects Row */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Post-Reveal Effect</p>
            <div className="grid grid-cols-3 gap-1.5">
              {EFFECT_OPTIONS.map(eff => {
                const selected = effects === eff.id;
                return (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => { soundFX.playPop(); onEffectsChange(eff.id); }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                      selected
                        ? `${eff.color} bg-zinc-800 scale-[1.03]`
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <span>{eff.emoji}</span>
                    <span className="leading-none">{eff.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Stickers ─────────────────────────────────────────────────── */}
      {activeTab === 'stickers' && (
        <div className="p-4 space-y-4">
          {/* Mini Canvas */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Canvas Preview</p>
            <div
              ref={canvasRef}
              className="relative w-full h-44 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden select-none cursor-default"
              onClick={() => setSelectedElement(null)}
            >
              {/* Grid lines for alignment feel */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {elements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
                  <Plus className="w-5 h-5 text-zinc-600" />
                  <p className="text-[10px] text-zinc-600">Tap an emoji below to add it</p>
                </div>
              )}

              {elements.map(el => (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
                    fontSize: `${el.fontSize || 28}px`,
                    cursor: 'grab',
                    touchAction: 'none',
                    outline: selectedElement === el.id ? '2px dashed rgba(244,63,94,0.8)' : 'none',
                    outlineOffset: '4px',
                    borderRadius: '4px',
                    lineHeight: 1,
                  }}
                  onPointerDown={(e) => startDrag(e, el.id)}
                  onPointerMove={(e) => onDrag(e, el.id)}
                  onPointerUp={endDrag}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement(el.id); }}
                >
                  {el.content}
                </div>
              ))}
            </div>

            {/* Per-element controls */}
            {selectedElement && (
              <div className="mt-2 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                <span className="text-[10px] text-zinc-400 font-bold">Selected:</span>
                <span className="text-lg">{elements.find(el => el.id === selectedElement)?.content}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <button type="button" onClick={() => scaleElement(selectedElement, -1)} className="p-1 text-zinc-400 hover:text-white text-xs font-bold">－</button>
                  <button type="button" onClick={() => scaleElement(selectedElement, 1)} className="p-1 text-zinc-400 hover:text-white text-xs font-bold">＋</button>
                  <button type="button" onClick={() => rotateElement(selectedElement, -1)} className="p-1 text-zinc-400 hover:text-white"><RotateCcw className="w-3 h-3" /></button>
                  <button type="button" onClick={() => rotateElement(selectedElement, 1)} className="p-1 text-zinc-400 hover:text-white" style={{ transform: 'scaleX(-1)' }}><RotateCcw className="w-3 h-3" /></button>
                  <button type="button" onClick={() => removeElement(selectedElement)} className="p-1 text-rose-400 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Emoji Palette */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Emoji & Stickers</p>
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_PALETTE.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="p-1.5 text-xl rounded-lg hover:bg-zinc-800 transition-colors text-center leading-none hover:scale-110 transition-transform duration-100"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {elements.length > 0 && (
            <button
              type="button"
              onClick={() => { onElementsChange([]); setSelectedElement(null); }}
              className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear all stickers
            </button>
          )}
        </div>
      )}
    </div>
  );
}
