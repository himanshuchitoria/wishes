export type WishVibe = 'roast' | 'sentimental' | 'sweet' | 'snarky' | 'custom';

export type WishStatus = 'draft' | 'scheduled' | 'delivered' | 'failed' | 'cancelled';

export type DeliveryMethod = 'email' | 'sms' | 'link';

export interface WishPayload {
  headline?: string;
  body: string;
  theme?: 'dark-ember' | 'rose-gold' | 'neon-glitch' | 'pastel-joy' | 'midnight-gold';
  aiPromptInputs?: {
    fact1: string;
    fact2: string;
    fact3: string;
    insideJoke?: string;
  };
  revealType?: 'scratch' | 'envelope' | 'glitch' | 'instant';
  mediaUrl?: string;
  musicTrack?: string;
}

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
