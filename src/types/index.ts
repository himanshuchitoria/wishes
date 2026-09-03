export type WishVibe = 'roast' | 'sentimental' | 'sweet' | 'snarky' | 'custom';

export type WishStatus = 'draft' | 'scheduled' | 'delivered' | 'failed' | 'cancelled';

export type DeliveryMethod = 'email' | 'sms' | 'link';

// ─── Phase 1: Wish Engine Rich Schema ────────────────────────────────────────

export type RevealType = 'scratch' | 'envelope' | 'glitch' | 'instant';

export type ParticleEffect = 'confetti' | 'hearts' | 'fireworks' | 'snow' | 'sparkles' | 'none';

export type CardTheme =
  | 'dark-ember'
  | 'rose-gold'
  | 'neon-glitch'
  | 'pastel-joy'
  | 'midnight-gold'
  | 'ocean-breeze'
  | 'velvet-noir'
  | 'aurora-borealis'
  | 'cherry-blossom'
  | 'cyber-punk';

export interface CanvasElement {
  id: string;
  type: 'emoji' | 'text' | 'sticker';
  content: string;      // emoji char, text string, or sticker key
  x: number;            // 0–100 (% of canvas width)
  y: number;            // 0–100 (% of canvas height)
  rotation: number;     // degrees
  scale: number;        // 1.0 = default
  fontSize?: number;
  color?: string;
}

export interface WishPayload {
  headline?: string;
  body: string;
  theme?: CardTheme;
  revealType?: RevealType;
  effects?: ParticleEffect;
  elements?: CanvasElement[];   // sticker / emoji overlay layer
  aiPromptInputs?: {
    fact1: string;
    fact2: string;
    fact3: string;
    insideJoke?: string;
  };
  mediaUrl?: string;
  musicTrack?: string;
}

// ─── Theme Configuration Map ─────────────────────────────────────────────────
export interface CardThemeConfig {
  id: CardTheme;
  name: string;
  emoji: string;
  bg: string;           // Tailwind gradient classes
  accentFrom: string;   // hex
  accentTo: string;     // hex
  textClass: string;
  borderClass: string;
  glowClass: string;
  fontClass: string;
}

export const CARD_THEME_CONFIGS: Record<CardTheme, CardThemeConfig> = {
  'dark-ember': {
    id: 'dark-ember', name: 'Dark Ember', emoji: '🔥',
    bg: 'from-orange-950 via-zinc-950 to-red-950',
    accentFrom: '#f97316', accentTo: '#ef4444',
    textClass: 'text-orange-400', borderClass: 'border-orange-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', fontClass: 'font-sans',
  },
  'rose-gold': {
    id: 'rose-gold', name: 'Rose Gold', emoji: '🌹',
    bg: 'from-rose-950 via-zinc-900 to-pink-950',
    accentFrom: '#f43f5e', accentTo: '#ec4899',
    textClass: 'text-rose-300', borderClass: 'border-rose-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]', fontClass: 'font-serif',
  },
  'neon-glitch': {
    id: 'neon-glitch', name: 'Neon Glitch', emoji: '⚡',
    bg: 'from-violet-950 via-zinc-950 to-cyan-950',
    accentFrom: '#8b5cf6', accentTo: '#06b6d4',
    textClass: 'text-violet-300', borderClass: 'border-violet-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(139,92,246,0.35)]', fontClass: 'font-mono',
  },
  'pastel-joy': {
    id: 'pastel-joy', name: 'Pastel Joy', emoji: '🌸',
    bg: 'from-pink-950/80 via-purple-950/60 to-sky-950/80',
    accentFrom: '#e879f9', accentTo: '#7dd3fc',
    textClass: 'text-pink-300', borderClass: 'border-pink-500/30',
    glowClass: 'shadow-[0_0_25px_rgba(232,121,249,0.25)]', fontClass: 'font-sans',
  },
  'midnight-gold': {
    id: 'midnight-gold', name: 'Midnight Gold', emoji: '✨',
    bg: 'from-zinc-950 via-amber-950/40 to-zinc-950',
    accentFrom: '#f59e0b', accentTo: '#d97706',
    textClass: 'text-amber-300', borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]', fontClass: 'font-serif',
  },
  'ocean-breeze': {
    id: 'ocean-breeze', name: 'Ocean Breeze', emoji: '🌊',
    bg: 'from-sky-950 via-teal-950 to-emerald-950',
    accentFrom: '#0ea5e9', accentTo: '#10b981',
    textClass: 'text-sky-300', borderClass: 'border-sky-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]', fontClass: 'font-sans',
  },
  'velvet-noir': {
    id: 'velvet-noir', name: 'Velvet Noir', emoji: '🖤',
    bg: 'from-zinc-950 via-purple-950/30 to-zinc-950',
    accentFrom: '#a855f7', accentTo: '#7c3aed',
    textClass: 'text-purple-300', borderClass: 'border-purple-500/30',
    glowClass: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]', fontClass: 'font-mono',
  },
  'aurora-borealis': {
    id: 'aurora-borealis', name: 'Aurora', emoji: '🌌',
    bg: 'from-emerald-950 via-teal-950 to-violet-950',
    accentFrom: '#34d399', accentTo: '#a78bfa',
    textClass: 'text-emerald-300', borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_35px_rgba(52,211,153,0.3)]', fontClass: 'font-sans',
  },
  'cherry-blossom': {
    id: 'cherry-blossom', name: 'Cherry Blossom', emoji: '🌺',
    bg: 'from-pink-950 via-rose-900/40 to-red-950',
    accentFrom: '#fb7185', accentTo: '#fda4af',
    textClass: 'text-pink-200', borderClass: 'border-pink-400/40',
    glowClass: 'shadow-[0_0_25px_rgba(251,113,133,0.3)]', fontClass: 'font-serif',
  },
  'cyber-punk': {
    id: 'cyber-punk', name: 'Cyber Punk', emoji: '🤖',
    bg: 'from-yellow-950 via-zinc-950 to-cyan-950',
    accentFrom: '#facc15', accentTo: '#22d3ee',
    textClass: 'text-yellow-300', borderClass: 'border-yellow-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]', fontClass: 'font-mono',
  },
};

export interface Wish {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone?: string;
  birth_date: string; // YYYY-MM-DD
  delivery_time: string; // HH:mm:ss
  delivery_timezone: string;
  vibe: WishVibe;
  is_anonymous: boolean;
  sender_alias?: string;
  sender_email_prefix: string; // e.g. 'cheers', 'secret', 'roast', 'anonymous'
  message_payload: WishPayload;
  status: WishStatus;
  qstash_message_id?: string;
  group_token: string;
  is_group_board: boolean;
  reveal_token: string;
  opened_at?: string;
  created_at: string;
  updated_at: string;
  next_delivery_timestamp?: string; // computed for UI
}

export interface GroupContribution {
  id: string;
  wish_id: string;
  contributor_name: string;
  message: string;
  image_url?: string;
  created_at: string;
  avatar_seed?: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  default_timezone: string;
  default_sender_alias: string;
  default_email_prefix: string;
  notify_on_delivery: boolean;
  notify_on_open: boolean;
  created_at: string;
  is_premium?: boolean;
}

export interface VibeConfig {
  id: WishVibe;
  name: string;
  emoji: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  borderGlow: string;
  defaultPrefix: string;
  defaultReveal: 'scratch' | 'envelope' | 'glitch';
  sampleSender: string;
  sampleMessage: string;
  sampleRoastIntro?: string;
}

export const VIBE_CONFIGS: Record<WishVibe, VibeConfig> = {
  roast: {
    id: 'roast',
    name: 'Brutal Roast',
    emoji: '🔥',
    tagline: 'Ruthless love & hilarious truth bombs',
    bgGradient: 'from-amber-950/80 via-zinc-950 to-red-950/80',
    accentColor: '#f97316',
    textColor: 'text-amber-400',
    borderGlow: 'border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.25)]',
    defaultPrefix: 'roast',
    defaultReveal: 'scratch',
    sampleSender: 'Anonymous Roast Committee',
    sampleMessage:
      'Happy 27th Birthday! Scientists confirm you are officially too old to ever be considered a child prodigy. Please stop telling people you’re "still in your twenties" as if you aren’t 98% of the way to 30. Enjoy the cold pizza you left out last night.',
  },
  snarky: {
    id: 'snarky',
    name: 'Snarky & Sarcastic',
    emoji: '😏',
    tagline: 'Playful insults wrapped in affectionate sarcasm',
    bgGradient: 'from-purple-950/80 via-zinc-950 to-amber-950/80',
    accentColor: '#a855f7',
    textColor: 'text-purple-400',
    borderGlow: 'border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    defaultPrefix: 'truth',
    defaultReveal: 'glitch',
    sampleSender: 'A Concerned Realist',
    sampleMessage:
      'Another year wiser? Statistically unproven. But another year closer to complaining about lower back pain in normal conversations? 100% verified. Happy Birthday legend!',
  },
  sweet: {
    id: 'sweet',
    name: 'Sweet & Warm',
    emoji: '✨',
    tagline: 'Casual, joyous, and filled with great vibes',
    bgGradient: 'from-sky-950/80 via-zinc-950 to-emerald-950/80',
    accentColor: '#38bdf8',
    textColor: 'text-sky-400',
    borderGlow: 'border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.25)]',
    defaultPrefix: 'cheers',
    defaultReveal: 'envelope',
    sampleSender: 'Your Favorite Human',
    sampleMessage:
      'Happy Birthday to someone who makes every room brighter and every taco run 10x more chaotic! Wishing you the most incredible year ahead filled with wins and zero hangovers.',
  },
  sentimental: {
    id: 'sentimental',
    name: 'Tearjerker',
    emoji: '💌',
    tagline: 'Deeply heartfelt, emotional & unforgettable',
    bgGradient: 'from-rose-950/80 via-zinc-950 to-violet-950/80',
    accentColor: '#f43f5e',
    textColor: 'text-rose-400',
    borderGlow: 'border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.25)]',
    defaultPrefix: 'forever',
    defaultReveal: 'envelope',
    sampleSender: 'Someone who cherishes you',
    sampleMessage:
      'Looking back on everything we’ve walked through, I’m constantly reminded of how rare and genuine your friendship is. Thank you for showing up on my hardest days and celebrating my smallest wins. May this year bring you all the love you give so effortlessly to the world.',
  },
  custom: {
    id: 'custom',
    name: 'Secret Admirer',
    emoji: '🕶️',
    tagline: 'Mysterious, intriguing & encrypted',
    bgGradient: 'from-emerald-950/80 via-zinc-950 to-teal-950/80',
    accentColor: '#10b981',
    textColor: 'text-emerald-400',
    borderGlow: 'border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    defaultPrefix: 'secret',
    defaultReveal: 'scratch',
    sampleSender: 'Secret Admirer #404',
    sampleMessage:
      'A top secret file has been declassified on this exact date: you are undeniably special. Your kindness doesn’t go unnoticed, even from afar. Have a truly wonderful birthday.',
  },
};
