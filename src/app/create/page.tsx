'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Wand2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users,
  Flame,
  Heart,
  Globe,
  ImagePlus,
  X,
  Loader2,
  Music,
  Play,
  Square,
  RotateCw,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Smile,
  Eye,
  Check,
  Volume2,
  VolumeX,
  Sparkle,
} from 'lucide-react';
import {
  Wish,
  WishVibe,
  CardTheme,
  ParticleEffect,
  CanvasElement,
  RevealType,
  VIBE_CONFIGS,
} from '@/types';
import VibeSlider from '@/components/VibeSlider';
import AIAssistantModal from '@/components/AIAssistantModal';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

// Preview Components
import ScratchCard from '@/components/ScratchCard';
import EnvelopeReveal from '@/components/EnvelopeReveal';
import GlitchReveal from '@/components/GlitchReveal';
import InstantReveal from '@/components/InstantReveal';
import StickerOverlay from '@/components/StickerOverlay';
import BackgroundEffects from '@/components/BackgroundEffects';

// Templates
import SweetTemplate from '@/components/templates/SweetTemplate';
import SentimentalTemplate from '@/components/templates/SentimentalTemplate';
import RoastTemplate from '@/components/templates/RoastTemplate';
import SnarkyTemplate from '@/components/templates/SnarkyTemplate';
import CustomTemplate from '@/components/templates/CustomTemplate';

const TIMEZONES = [
  { label: 'Asia/Kolkata (IST +5:30)', value: 'Asia/Kolkata' },
  { label: 'America/New_York (EST -5:00)', value: 'America/New_York' },
  { label: 'America/Los_Angeles (PST -8:00)', value: 'America/Los_Angeles' },
  { label: 'America/Chicago (CST -6:00)', value: 'America/Chicago' },
  { label: 'Europe/London (GMT +0:00)', value: 'Europe/London' },
  { label: 'Europe/Paris (CET +1:00)', value: 'Europe/Paris' },
  { label: 'Asia/Tokyo (JST +9:00)', value: 'Asia/Tokyo' },
  { label: 'Asia/Singapore (SGT +8:00)', value: 'Asia/Singapore' },
  { label: 'Australia/Sydney (AEDT +11:00)', value: 'Australia/Sydney' },
];

// ─── Options Configurations ──────────────────────────────────────────────────
const REVEAL_STYLES: { id: RevealType; title: string; emoji: string; badge: string; desc: string }[] = [
  {
    id: 'scratch',
    title: 'Scratch-Off Lottery',
    emoji: '🪙',
    badge: 'Suspenseful',
    desc: 'Recipient rubs off metallic foil with finger or mouse to uncover the surprise message.',
  },
  {
    id: 'envelope',
    title: 'Wax-Sealed Letter',
    emoji: '✉️',
    badge: 'Cinematic',
    desc: 'A royal envelope where cracking the authentic wax seal slides out the birthday letter.',
  },
  {
    id: 'glitch',
    title: 'Hacker Terminal BSOD',
    emoji: '⚡',
    badge: 'Humorous / Tech',
    desc: 'A hilarious simulated system crash that decrypts memory blocks to expose the roast.',
  },
  {
    id: 'instant',
    title: 'Instant Party Explosion',
    emoji: '💥',
    badge: 'High-Energy',
    desc: 'No delay — explodes into high-octane celebration immediately with bursts of confetti.',
  },
];

const ATMOSPHERE_FX: { id: ParticleEffect; label: string; emoji: string; tag: string }[] = [
  { id: 'confetti', label: 'Confetti Storm', emoji: '🎊', tag: 'Classic' },
  { id: 'hearts', label: 'Floating Hearts', emoji: '💖', tag: 'Romantic' },
  { id: 'fireworks', label: 'Midnight Fireworks', emoji: '🎆', tag: 'Spectacular' },
  { id: 'sparkles', label: 'Golden Sparkles', emoji: '✨', tag: 'Magical' },
  { id: 'snow', label: 'Gentle Snow', emoji: '❄️', tag: 'Dreamy' },
  { id: 'none', label: 'Clean Minimal', emoji: '🖤', tag: 'Quiet' },
];

const SOUNDTRACKS: { id: string; label: string; emoji: string; genre: string; desc: string }[] = [
  { id: 'acoustic', label: 'Acoustic Warmth', emoji: '🎸', genre: 'Folk / Indie', desc: 'Warm fingerpicked guitar chords for heartfelt moments' },
  { id: 'lofi', label: 'Lofi Chillhop', emoji: '☕', genre: 'Chill Beats', desc: 'Cozy vinyl beats & Rhodes keyboard progressions' },
  { id: '8bit', label: '8-Bit Retro Chiptune', emoji: '🕹️', genre: 'Arcade Synth', desc: 'Nostalgic arcade birthday theme that brings smiles' },
  { id: 'synthwave', label: 'Neon Synthwave', emoji: '🌆', genre: 'Retro Electro', desc: 'Pumping bassline with 80s futuristic energy' },
  { id: 'fanfare', label: 'Royal Fanfare', emoji: '🎺', genre: 'Triumphant Brass', desc: 'Epic royal brass horns celebrating another orbit' },
  { id: 'none', label: 'Silent / Pure Ambiance', emoji: '🔇', genre: 'Muted', desc: 'Card will open in quiet serenity' },
];

const BADGE_STAMPS = [
  '🔥 CERTIFIED OLD',
  '⚠️ 100% UNFILTERED',
  '👑 VIP BIRTHDAY',
  '🚨 AGE ALARM',
  '💎 LEVEL UP',
  '🥂 CHEERS',
  '🎂 AGED TO PERFECTION',
  '🦖 ANCIENT RELIC',
];

const EMOJI_STAMPS = [
  '🎂', '🎉', '🥳', '🎁', '💀', '😈', '✨', '💖',
  '🔥', '🍕', '🚀', '🦖', '🍾', '👾', '🕶️', '🫡',
];

const HEADLINE_PRESETS: Record<WishVibe, string[]> = {
  roast: [
    '⚠️ NOTICE OF ACCELERATED AGING',
    '💀 SYSTEM ERROR: SUBJECT TOO OLD',
    '🦖 ANCIENT SPECIMEN DETECTED',
    '🧓 ONE YEAR CLOSER TO RETIREMENT',
  ],
  sweet: [
    'Happy Birthday Sunshine! ✨',
    'Another Year More Fabulous! 💖',
    'To The Sweetest Soul On Earth 🍰',
    'Cheers To Your Best Year Yet! 🥂',
  ],
  sentimental: [
    'To The Rarest Soul I Know 🕊️',
    'Thank You For Being You 🤍',
    'Every Year With You Is A Gift 🌟',
    'To Countless More Memories 🥂',
  ],
  snarky: [
    '>> SYSTEM OVERRIDE INITIATED',
    '⚡ 404: AGE NOT FOUND',
    '🕶️ CLASSIFIED INTELLIGENCE FILE',
    '🚨 CODE RED: BIRTHDAY IMMINENT',
  ],
  custom: [
    '👑 VIP BIRTHDAY DECREE',
    '✨ CELEBRATING ROYALTY',
    '💎 THE GOLD STANDARD',
    '🍾 POPPING BOTTLES FOR A LEGEND',
  ],
};

const SENDER_ALIAS_SUGGESTIONS = [
  'The Anti-Aging Police',
  'A Secret Admirer',
  'Your Favorite Chaos Agent',
  'Anonymous Bestie',
  'The Birthday Commission',
];

export default function ImmersiveWishStudio() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Core Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('00:00:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Customization State
  const [vibe, setVibe] = useState<WishVibe>('sweet');
  const [revealType, setRevealType] = useState<RevealType>('scratch');
  const [effects, setEffects] = useState<ParticleEffect>('confetti');
  const [musicTrack, setMusicTrack] = useState<string>('acoustic');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Message & Media
  const [headline, setHeadline] = useState('Happy Birthday!');
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiInputs, setAiInputs] = useState<{ fact1: string; fact2: string; fact3: string; insideJoke?: string } | undefined>();

  // Delivery & Identity
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderAlias, setSenderAlias] = useState('Secret Admirer');
  const [senderPrefix, setSenderPrefix] = useState('secret');
  const [isGroupBoard, setIsGroupBoard] = useState(true);
  const [realName, setRealName] = useState('');

  // Audio Preview & Live Interaction
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'canvas' | 'unbox'>('canvas');
  const [unboxedInPreview, setUnboxedInPreview] = useState<boolean>(false);
  const [previewSimulationKey, setPreviewSimulationKey] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load User Profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/settings`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile.display_name) setRealName(profile.display_name);
          else if (session?.user?.user_metadata?.full_name) setRealName(session.user.user_metadata.full_name);
        } else if (session?.user?.user_metadata?.full_name) {
          setRealName(session.user.user_metadata.full_name);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();

    // Initial message from sweet vibe config
    const config = VIBE_CONFIGS['sweet'];
    setMessage(config.sampleMessage);
    setHeadline(HEADLINE_PRESETS['sweet'][0]);

    return () => {
      soundFX.stopTrack();
    };
  }, []);

  // Sync vibe changes with defaults
  const handleVibeChange = (newVibe: WishVibe) => {
    soundFX.playPop();
    setVibe(newVibe);
    const config = VIBE_CONFIGS[newVibe];
    setSenderPrefix(config.defaultPrefix);

    const oldSamples = Object.values(VIBE_CONFIGS).map((c) => c.sampleMessage);
    if (!message || oldSamples.includes(message)) {
      setMessage(config.sampleMessage);
    }
    const oldSenders = Object.values(VIBE_CONFIGS).map((c) => c.sampleSender);
    if (!senderAlias || oldSenders.includes(senderAlias)) {
      setSenderAlias(config.sampleSender);
    }
    setHeadline(HEADLINE_PRESETS[newVibe][0]);

    // Recommend best matching reveal & music for vibe
    if (newVibe === 'roast') {
      setRevealType('scratch');
      setEffects('fireworks');
      setMusicTrack('8bit');
    } else if (newVibe === 'snarky') {
      setRevealType('glitch');
      setEffects('confetti');
      setMusicTrack('synthwave');
    } else if (newVibe === 'sentimental') {
      setRevealType('envelope');
      setEffects('sparkles');
      setMusicTrack('acoustic');
    } else if (newVibe === 'custom') {
      setRevealType('instant');
      setEffects('sparkles');
      setMusicTrack('fanfare');
    } else {
      setRevealType('scratch');
      setEffects('confetti');
      setMusicTrack('lofi');
    }
  };

  // Audio track audition
  const handleToggleTrack = (trackId: string) => {
    soundFX.playPop();
    if (playingTrack === trackId) {
      soundFX.stopTrack();
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
      soundFX.playTrack(trackId);
    }
  };

  // Sticker Stamp Actions
  const handleAddSticker = (content: string, isBadge: boolean) => {
    soundFX.playPop();
    const newEl: CanvasElement = {
      id: Math.random().toString(36).substring(2, 9),
      type: isBadge ? 'sticker' : 'emoji',
      content,
      x: Math.floor(Math.random() * 50) + 25,
      y: Math.floor(Math.random() * 50) + 25,
      rotation: Math.floor((Math.random() - 0.5) * 30),
      scale: 1,
      fontSize: isBadge ? 14 : 32,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    toast(`Stamped "${content}" onto card!`, 'success');
  };

  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    soundFX.playPop();
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const handleRemoveElement = (id: string) => {
    soundFX.playPop();
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleClearStickers = () => {
    soundFX.playPop();
    setElements([]);
    setSelectedElementId(null);
    toast('Cleared all stickers from card', 'info');
  };

  // Photo Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast('File too large (max 5MB)', 'error');
        return;
      }
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      soundFX.playPop();
      toast('Photo attached to reveal card!', 'success');
    }
  };

  const handleRemovePhoto = () => {
    setMediaFile(null);
    setMediaPreview(null);
    soundFX.playPop();
  };

  // AI Assistant Draft Apply
  const handleApplyAi = (
    genHeadline: string,
    genBody: string,
    inputs: { fact1: string; fact2: string; fact3: string; insideJoke?: string }
  ) => {
    setHeadline(genHeadline);
    setMessage(genBody);
    setAiInputs(inputs);
    toast('AI Draft injected into your wish!', 'success');
  };

  // Step Validation & Navigation
  const handleNext = (targetStep: number) => {
    if (targetStep > currentStep) {
      if (currentStep === 3) {
        if (!name || !email || !birthDate) {
          toast('Please enter recipient name, email, and birthdate.', 'error');
          return;
        }
        if (!headline || !message) {
          toast('Please write a headline and message.', 'error');
          return;
        }
      }
    }
    soundFX.playPop();
    setCurrentStep(targetStep);
  };

  // Final Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    setIsSubmitting(true);

    const newWish: Wish = {
      id: crypto.randomUUID(),
      user_id: 'user_himanshu_01',
      recipient_name: name,
      recipient_email: email,
      recipient_phone: phone,
      birth_date: birthDate,
      delivery_time: deliveryTime,
      delivery_timezone: timezone,
      vibe,
      is_anonymous: isAnonymous,
      sender_alias: senderAlias,
      sender_email_prefix: senderPrefix,
      message_payload: {
        headline,
        body: message,
        theme: 'dark-ember',
        revealType,
        effects,
        musicTrack,
        elements,
        aiPromptInputs: aiInputs,
      },
      status: 'scheduled',
      group_token: crypto.randomUUID(),
      is_group_board: isGroupBoard,
      reveal_token: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (!supabase) throw new Error('Supabase not loaded');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast('You must be logged in to schedule a wish.', 'error');
        setIsSubmitting(false);
        return;
      }

      if (mediaFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', mediaFile);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/storage/upload`, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!uploadRes.ok) throw new Error('Failed to upload media file');
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          newWish.message_payload.mediaUrl = uploadData.url;
        }
        setIsUploading(false);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/wishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newWish),
      });

      if (!res.ok) throw new Error(`Backend error: ${await res.text()}`);

      soundFX.stopTrack();
      soundFX.playCelebration();
      toast(`Wish for ${name} locked in for midnight delivery!`, 'success');
      setTimeout(() => router.push('/dashboard'), 600);
    } catch (e) {
      console.error(e);
      toast('Failed to save wish. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  // Aesthetic Maps
  const getVibeStyles = (v: WishVibe) => {
    switch (v) {
      case 'roast':
        return {
          bg: 'bg-[#FFeb3b]',
          bgEffect: 'bg-[radial-gradient(circle,_#000_2px,_transparent_2.5px)] bg-[size:15px_15px] opacity-20',
          text: 'text-black',
          heading: 'font-black uppercase tracking-tighter',
          card: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
          input: 'bg-white border-4 border-black text-black placeholder-black/50 focus:border-red-500 font-bold uppercase rounded-none',
          btn: 'bg-[#2196F3] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-black rounded-none hover:translate-y-1 hover:shadow-none',
          btnSecondary: 'bg-white text-black border-4 border-black uppercase font-black rounded-none hover:bg-zinc-100',
        };
      case 'snarky':
        return {
          bg: 'bg-zinc-950',
          bgEffect: 'bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30',
          text: 'text-cyan-400 font-mono',
          heading: 'font-bold uppercase tracking-tight text-fuchsia-500',
          card: 'bg-black/80 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-lg',
          input: 'bg-black/90 border border-zinc-800 text-zinc-200 focus:border-cyan-500 placeholder-zinc-700 font-mono rounded-md',
          btn: 'bg-cyan-500 text-black font-bold font-mono rounded-md hover:bg-cyan-400',
          btnSecondary: 'bg-black text-cyan-500 border border-cyan-500/50 font-mono rounded-md hover:bg-cyan-500/10',
        };
      case 'sentimental':
        return {
          bg: 'bg-[#fdfbf7]',
          bgEffect: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f1ebe1] via-transparent to-transparent opacity-60',
          text: 'text-[#4a4036] font-[family-name:var(--font-playfair)]',
          heading: 'font-medium tracking-tight',
          card: 'bg-white/85 border border-[#e6dfd3] shadow-sm backdrop-blur-md rounded-2xl',
          input: 'bg-transparent border-b-2 border-[#d3cabc] text-[#4a4036] focus:border-[#8b7d6b] placeholder-[#a89f91] rounded-none px-1 font-[family-name:var(--font-playfair)]',
          btn: 'bg-[#4a4036] text-[#fdfbf7] font-medium rounded-full hover:bg-[#2d261e]',
          btnSecondary: 'bg-transparent text-[#4a4036] border border-[#d3cabc] font-medium rounded-full hover:bg-[#f1ebe1]',
        };
      case 'custom':
        return {
          bg: 'bg-[#050505]',
          bgEffect: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent',
          text: 'text-[#d4af37]',
          heading: 'font-light tracking-widest uppercase',
          card: 'bg-zinc-900/70 border border-[#d4af37]/30 backdrop-blur-md rounded-none shadow-[0_0_20px_rgba(212,175,55,0.1)]',
          input: 'bg-black border border-[#d4af37]/30 text-[#d4af37] focus:border-[#d4af37] placeholder-[#d4af37]/40 rounded-none',
          btn: 'bg-[#d4af37] text-black font-semibold tracking-widest uppercase rounded-none hover:bg-white',
          btnSecondary: 'bg-transparent text-[#d4af37] border border-[#d4af37]/50 font-semibold tracking-widest uppercase rounded-none hover:bg-[#d4af37]/10',
        };
      case 'sweet':
      default:
        return {
          bg: 'bg-[#4c1d95]',
          bgEffect: '',
          text: 'text-white font-[family-name:var(--font-inter)]',
          heading: 'font-bold tracking-tight',
          card: 'bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl rounded-3xl',
          input: 'bg-white/5 border border-white/20 text-white focus:border-yellow-400 placeholder-white/40 rounded-xl',
          btn: 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg',
          btnSecondary: 'bg-white/10 text-white font-bold rounded-xl hover:bg-white/20',
        };
    }
  };

  const styles = getVibeStyles(vibe);

  // Live Preview Wish Payload
  const previewWish: Wish = {
    id: 'preview',
    user_id: 'preview',
    recipient_name: name || 'Your Recipient',
    recipient_email: email,
    recipient_phone: phone,
    birth_date: birthDate || '2000-01-01',
    delivery_time: deliveryTime,
    delivery_timezone: timezone,
    vibe,
    is_anonymous: isAnonymous,
    sender_alias: senderAlias,
    sender_email_prefix: senderPrefix,
    message_payload: {
      headline: headline || 'Happy Birthday!',
      body: message || 'Have a great day!',
      mediaUrl: mediaPreview || undefined,
      revealType,
      effects,
      musicTrack,
      elements,
    },
    status: 'scheduled',
    group_token: 'preview',
    is_group_board: isGroupBoard,
    reveal_token: 'preview',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const STEPS_NAV = [
    { num: 1, title: 'Vibe & Reveal' },
    { num: 2, title: 'Atmosphere' },
    { num: 3, title: 'Target & Text' },
    { num: 4, title: 'Stickers' },
    { num: 5, title: 'Delivery' },
  ];

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-700 ${styles.bg}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${styles.bgEffect}`} />

      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 h-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-8 lg:gap-10 items-start relative z-10">

        {/* ─── Left Column: Multi-Step Customization Suite ─────────────────── */}
        <div className={`w-full lg:w-5/12 flex flex-col gap-6 transition-all duration-700 ${styles.text}`}>

          {/* Header & Step Pills */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl sm:text-4xl ${styles.heading}`}>Design Studio</h1>
                <p className="opacity-75 mt-1 text-xs sm:text-sm">
                  Craft an unforgettable, unboxable birthday experience.
                </p>
              </div>
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-current/10 border border-current/20">
                Step {currentStep} of 5
              </span>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {STEPS_NAV.map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => handleNext(s.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    currentStep === s.num
                      ? 'bg-current text-zinc-950 shadow-md scale-105'
                      : 'bg-current/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ─── STEP 1: Vibe & Reveal Mechanism ───────────────────────────── */}
            {currentStep === 1 && (
              <div className={`p-6 transition-all duration-500 ${styles.card} space-y-6 animate-in fade-in slide-in-from-right-4`}>
                <div>
                  <h3 className={`text-xl mb-1 ${styles.heading}`}>1. Choose Aesthetic Archetype</h3>
                  <p className="text-xs opacity-70 mb-4">The core tone of voice and visual aura of the wish.</p>
                  <VibeSlider value={vibe} onChange={handleVibeChange} />
                </div>

                <div className="pt-2 border-t border-current/15">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-90">Unboxing Mechanism</h4>
                    <span className="text-[11px] opacity-60">How the recipient unlocks the card</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REVEAL_STYLES.map((r) => {
                      const isSelected = revealType === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => {
                            soundFX.playPop();
                            setRevealType(r.id);
                            setUnboxedInPreview(false);
                            setPreviewSimulationKey((k) => k + 1);
                          }}
                          className={`p-3.5 rounded-xl cursor-pointer border-2 transition-all text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-current bg-current/15 shadow-md scale-[1.02]'
                              : 'border-current/20 bg-current/5 hover:border-current/50 hover:bg-current/10'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-2xl">{r.emoji}</span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-current text-zinc-950' : 'bg-current/10 opacity-70'}`}>
                                {r.badge}
                              </span>
                            </div>
                            <h5 className="text-sm font-black tracking-tight">{r.title}</h5>
                            <p className="text-xs opacity-75 mt-1 leading-snug">{r.desc}</p>
                          </div>
                          <div className="mt-2 text-right">
                            {isSelected && <span className="text-xs font-bold">✓ Selected</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleNext(2)}
                    className={`px-6 py-3 flex items-center gap-2 ${styles.btn}`}
                  >
                    Next: Atmosphere FX <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: Atmosphere & Audio Soundtrack ─────────────────────── */}
            {currentStep === 2 && (
              <div className={`p-6 transition-all duration-500 ${styles.card} space-y-6 animate-in fade-in slide-in-from-right-4`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xl ${styles.heading}`}>2. Celebration Atmosphere</h3>
                    <Sparkles className="w-4 h-4 opacity-70" />
                  </div>
                  <p className="text-xs opacity-70 mb-4">Particles that detonate into the air once unlocked.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ATMOSPHERE_FX.map((fx) => {
                      const isSelected = effects === fx.id;
                      return (
                        <button
                          key={fx.id}
                          type="button"
                          onClick={() => {
                            soundFX.playPop();
                            setEffects(fx.id);
                          }}
                          className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                            isSelected
                              ? 'border-current bg-current/20 shadow-md scale-105'
                              : 'border-current/20 bg-current/5 hover:border-current/40 hover:bg-current/10'
                          }`}
                        >
                          <span className="text-2xl">{fx.emoji}</span>
                          <span className="text-xs font-bold">{fx.label}</span>
                          <span className="text-[10px] opacity-60 uppercase">{fx.tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Soundtrack selector with Live Audition */}
                <div className="pt-2 border-t border-current/15">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-90">Soundtrack & Audio Mood</h4>
                    <span className="text-[11px] opacity-60">Audition real synthesized tracks</span>
                  </div>
                  <p className="text-xs opacity-70 mb-3">Loops automatically in the recipient's ear upon opening.</p>

                  <div className="space-y-2">
                    {SOUNDTRACKS.map((st) => {
                      const isSelected = musicTrack === st.id;
                      const isCurrentlyPlaying = playingTrack === st.id;

                      return (
                        <div
                          key={st.id}
                          className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition-all ${
                            isSelected
                              ? 'border-current bg-current/15 shadow-md'
                              : 'border-current/20 bg-current/5 hover:border-current/40'
                          }`}
                        >
                          <div
                            onClick={() => {
                              soundFX.playPop();
                              setMusicTrack(st.id);
                            }}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <span className="text-2xl">{st.emoji}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{st.label}</span>
                                <span className="text-[10px] opacity-60 uppercase font-mono px-1.5 py-0.5 rounded bg-current/10">
                                  {st.genre}
                                </span>
                              </div>
                              <p className="text-xs opacity-75">{st.desc}</p>
                            </div>
                          </div>

                          {/* Audition Button */}
                          {st.id !== 'none' && (
                            <button
                              type="button"
                              onClick={() => handleToggleTrack(st.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                isCurrentlyPlaying
                                  ? 'bg-amber-400 text-black shadow-md animate-pulse'
                                  : 'bg-current/10 hover:bg-current/20 text-current'
                              }`}
                            >
                              {isCurrentlyPlaying ? (
                                <>
                                  <Square className="w-3 h-3 fill-current" /> Stop
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" /> Audition
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleNext(1)}
                    className={`px-4 py-3 flex items-center gap-2 ${styles.btnSecondary}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNext(3)}
                    className={`px-6 py-3 flex items-center gap-2 ${styles.btn}`}
                  >
                    Next: Target & Message <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Target Details & Message Studio ─────────────────────── */}
            {currentStep === 3 && (
              <div className={`p-6 transition-all duration-500 ${styles.card} space-y-4 animate-in fade-in slide-in-from-right-4`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl ${styles.heading}`}>3. The Target & Custom Message</h3>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-black uppercase hover:bg-amber-500/30 transition-colors shadow-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> AI Ghostwriter
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                      Delivery Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input} [&>option]:bg-zinc-900 [&>option]:text-white`}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Headline with Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
                      Card Headline
                    </label>
                    <span className="text-[11px] opacity-60">Click preset to apply</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {HEADLINE_PRESETS[vibe].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          soundFX.playPop();
                          setHeadline(preset);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${
                          headline === preset
                            ? 'bg-current text-zinc-950 border-current shadow-sm'
                            : 'border-current/20 bg-current/5 hover:bg-current/15'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter bold headline..."
                    className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`}
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                    The Main Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something heartfelt, unhinged, or hilarious..."
                    className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input} resize-none`}
                  />
                </div>

                {/* Photo / Memory upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                    Portrait Photo / Memory (Optional)
                  </label>
                  {mediaPreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-current/30 p-2 flex items-center gap-3 bg-current/5">
                      <img src={mediaPreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-xs font-bold truncate">{mediaFile?.name || 'Uploaded photo'}</p>
                        <p className="text-[10px] opacity-60">Ready to display on card</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileSelect}
                      className={`w-full px-3.5 py-2.5 outline-none transition-all file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-black file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 ${styles.input}`}
                    />
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleNext(2)}
                    className={`px-4 py-3 flex items-center gap-2 ${styles.btnSecondary}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNext(4)}
                    className={`px-6 py-3 flex items-center gap-2 ${styles.btn}`}
                  >
                    Next: Interactive Stickers <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 4: Interactive Sticker & Stamp Studio ─────────────────── */}
            {currentStep === 4 && (
              <div className={`p-6 transition-all duration-500 ${styles.card} space-y-5 animate-in fade-in slide-in-from-right-4`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xl ${styles.heading}`}>4. Stamp Badges & Emojis</h3>
                    {elements.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearStickers}
                        className="text-xs text-red-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All ({elements.length})
                      </button>
                    )}
                  </div>
                  <p className="text-xs opacity-70 mb-3">
                    Click any badge or emoji to stamp it onto the card. You can rotate and scale them below.
                  </p>
                </div>

                {/* Badges Tray */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
                    Neo-Brutalist Badges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_STAMPS.map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => handleAddSticker(badge, true)}
                        className="bg-yellow-300 text-black border-2 border-black font-black uppercase text-xs px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded"
                      >
                        + {badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emojis Tray */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
                    Celebration Emojis
                  </h4>
                  <div className="grid grid-cols-8 gap-1.5 bg-black/20 p-2 rounded-xl border border-current/20">
                    {EMOJI_STAMPS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleAddSticker(emoji, false)}
                        className="h-10 text-xl flex items-center justify-center rounded-lg hover:bg-current/20 hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stamped Elements Control Panel */}
                {elements.length > 0 && (
                  <div className="pt-3 border-t border-current/15 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Stamped Stickers ({elements.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {elements.map((el) => {
                        const isSelected = selectedElementId === el.id;
                        return (
                          <div
                            key={el.id}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                              isSelected
                                ? 'bg-current/15 border-current font-bold'
                                : 'bg-current/5 border-current/20'
                            }`}
                          >
                            <span className="truncate max-w-[120px]">{el.content}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                title="Rotate Left"
                                onClick={() => handleUpdateElement(el.id, { rotation: el.rotation - 15 })}
                                className="p-1 rounded bg-current/10 hover:bg-current/20"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Rotate Right"
                                onClick={() => handleUpdateElement(el.id, { rotation: el.rotation + 15 })}
                                className="p-1 rounded bg-current/10 hover:bg-current/20"
                              >
                                <RotateCw className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Scale Down"
                                onClick={() => handleUpdateElement(el.id, { scale: Math.max(0.6, el.scale - 0.2) })}
                                className="p-1 rounded bg-current/10 hover:bg-current/20"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Scale Up"
                                onClick={() => handleUpdateElement(el.id, { scale: Math.min(2.5, el.scale + 0.2) })}
                                className="p-1 rounded bg-current/10 hover:bg-current/20"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Remove"
                                onClick={() => handleRemoveElement(el.id)}
                                className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleNext(3)}
                    className={`px-4 py-3 flex items-center gap-2 ${styles.btnSecondary}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNext(5)}
                    className={`px-6 py-3 flex items-center gap-2 ${styles.btn}`}
                  >
                    Next: Delivery Options <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 5: Delivery Options & Final Lock-in ───────────────────── */}
            {currentStep === 5 && (
              <div className={`p-6 transition-all duration-500 ${styles.card} space-y-5 animate-in fade-in slide-in-from-right-4`}>
                <h3 className={`text-xl ${styles.heading}`}>5. Delivery & Privacy Options</h3>

                {/* Anonymous switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-current/5 border border-current/15">
                  <div>
                    <h4 className="text-sm font-bold">Send Anonymously</h4>
                    <p className="text-xs opacity-70">Keep your identity completely classified</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-current"
                  />
                </div>

                {/* Sender Alias with quick suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
                      Sender Moniker / Alias
                    </label>
                    <span className="text-[11px] opacity-60">Pick preset or type your own</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {SENDER_ALIAS_SUGGESTIONS.map((alias) => (
                      <button
                        key={alias}
                        type="button"
                        onClick={() => {
                          soundFX.playPop();
                          setSenderAlias(alias);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${
                          senderAlias === alias
                            ? 'bg-current text-zinc-950 border-current shadow-sm'
                            : 'border-current/20 bg-current/5 hover:bg-current/15'
                        }`}
                      >
                        {alias}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={senderAlias}
                    onChange={(e) => setSenderAlias(e.target.value)}
                    className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`}
                  />
                </div>

                {/* Group Board Option */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-current/5 border border-current/15">
                  <div>
                    <h4 className="text-sm font-bold">Enable Collaborative Board</h4>
                    <p className="text-xs opacity-70">Allows other friends to pin birthday notes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGroupBoard}
                    onChange={(e) => setIsGroupBoard(e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-current"
                  />
                </div>

                {/* Final Recap */}
                <div className="p-4 rounded-xl bg-black/20 border border-current/20 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-70">Target:</span>
                    <span className="font-bold">{name || 'Unnamed'} ({birthDate || 'Date missing'})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Aesthetic:</span>
                    <span className="font-bold capitalize">{vibe} Vibe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Unboxing Style:</span>
                    <span className="font-bold capitalize">{revealType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Soundtrack:</span>
                    <span className="font-bold capitalize">{musicTrack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Atmosphere FX:</span>
                    <span className="font-bold capitalize">{effects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Stickers Placed:</span>
                    <span className="font-bold">{elements.length} stickers</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleNext(4)}
                    className={`px-4 py-3 flex items-center gap-2 ${styles.btnSecondary}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 transition-all ${styles.btn}`}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span>{isSubmitting ? (isUploading ? 'Uploading Media...' : 'Locking In...') : 'Schedule Midnight Delivery'}</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* ─── Right Column: Interactive Dual-Mode Preview Suite ────────────── */}
        <div className="w-full lg:w-7/12 lg:sticky lg:top-24 h-[640px] lg:h-[calc(100vh-140px)] flex flex-col relative z-20 pb-12 lg:pb-0">

          {/* Mode Switcher & Track Controls */}
          <div className="mb-3 flex items-center justify-between px-2 gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setPreviewMode('canvas');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  previewMode === 'canvas'
                    ? 'bg-white text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Design Canvas
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setPreviewMode('unbox');
                  setUnboxedInPreview(false);
                  setPreviewSimulationKey((k) => k + 1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  previewMode === 'unbox'
                    ? 'bg-amber-400 text-zinc-950 shadow-md animate-pulse'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Test Unboxing 🎮
              </button>
            </div>

            {/* Replay button if in unbox mode */}
            {previewMode === 'unbox' && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setUnboxedInPreview(false);
                  setPreviewSimulationKey((k) => k + 1);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Re-test
              </button>
            )}

            {/* Soundtrack Audition Toggle */}
            {musicTrack !== 'none' && (
              <button
                type="button"
                onClick={() => handleToggleTrack(musicTrack)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                  playingTrack === musicTrack
                    ? 'bg-amber-400 text-black border-amber-300 shadow-lg'
                    : 'bg-black/40 text-white border-white/10 hover:bg-black/60'
                }`}
              >
                {playingTrack === musicTrack ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <Music className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Soundtrack</span>
              </button>
            )}
          </div>

          {/* Scaled Window Frame */}
          <div
            key={previewSimulationKey}
            className={`flex-1 rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-700 bg-zinc-950 ${
              vibe === 'roast'
                ? 'border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
                : vibe === 'snarky'
                ? 'border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.25)]'
                : 'border-4 border-white/15'
            }`}
          >
            {/* Top Browser Chrome Bar */}
            <div className="absolute top-0 left-0 w-full h-8 bg-black/40 backdrop-blur-md flex items-center px-4 gap-2 border-b border-white/10 z-50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <div className="mx-auto text-[10px] text-white/60 tracking-widest uppercase truncate max-w-[60%] font-mono">
                chitoria.dev/reveal/{previewWish.recipient_name.toLowerCase().replace(/\s+/g, '-') || 'preview'}
              </div>
            </div>

            {/* Inner Content Display */}
            <div className="absolute inset-0 pt-8 overflow-hidden">
              {previewMode === 'canvas' ? (
                /* ── Mode 1: Design Canvas (Full revealed card with stickers) ── */
                <div className="relative w-full h-full">
                  {(() => {
                    const props = { wish: previewWish, hasUnboxed: true, onUnbox: () => {} };
                    switch (vibe) {
                      case 'sweet': return <SweetTemplate {...props} />;
                      case 'sentimental': return <SentimentalTemplate {...props} />;
                      case 'roast': return <RoastTemplate {...props} />;
                      case 'snarky': return <SnarkyTemplate {...props} />;
                      case 'custom': return <CustomTemplate {...props} />;
                      default: return <SweetTemplate {...props} />;
                    }
                  })()}
                </div>
              ) : (
                /* ── Mode 2: Test-Drive Unbox Simulator ── */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  {!unboxedInPreview ? (
                    <div className="w-full max-w-md">
                      {revealType === 'scratch' ? (
                        <div className="space-y-3">
                          <p className="text-center text-xs text-orange-400 font-bold uppercase tracking-wider">
                            🪙 Test Scratching With Mouse!
                          </p>
                          <ScratchCard
                            headline={headline}
                            body={message}
                            senderAlias={senderAlias}
                            isAnonymous={isAnonymous}
                            mediaUrl={mediaPreview || undefined}
                            elements={elements}
                            onRevealed={() => {
                              soundFX.playCelebration();
                              setUnboxedInPreview(true);
                              toast('🎉 Unboxed successfully!', 'success');
                            }}
                          />
                        </div>
                      ) : revealType === 'envelope' ? (
                        <EnvelopeReveal
                          headline={headline}
                          body={message}
                          senderAlias={senderAlias}
                          isAnonymous={isAnonymous}
                          mediaUrl={mediaPreview || undefined}
                          elements={elements}
                          onRevealed={() => {
                            soundFX.playCelebration();
                            setUnboxedInPreview(true);
                            toast('💌 Envelope opened!', 'success');
                          }}
                        />
                      ) : revealType === 'glitch' ? (
                        <GlitchReveal
                          headline={headline}
                          body={message}
                          senderAlias={senderAlias}
                          isAnonymous={isAnonymous}
                          mediaUrl={mediaPreview || undefined}
                          elements={elements}
                          onRevealed={() => {
                            soundFX.playCelebration();
                            setUnboxedInPreview(true);
                            toast('⚡ Decrypted successfully!', 'success');
                          }}
                        />
                      ) : (
                        <InstantReveal
                          headline={headline}
                          body={message}
                          senderAlias={senderAlias}
                          isAnonymous={isAnonymous}
                          mediaUrl={mediaPreview || undefined}
                          elements={elements}
                          onRevealed={() => {
                            soundFX.playCelebration();
                            setUnboxedInPreview(true);
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    /* Once unboxed during simulation */
                    <div className="relative w-full h-full">
                      {(() => {
                        const props = { wish: previewWish, hasUnboxed: true, onUnbox: () => {} };
                        switch (vibe) {
                          case 'sweet': return <SweetTemplate {...props} />;
                          case 'sentimental': return <SentimentalTemplate {...props} />;
                          case 'roast': return <RoastTemplate {...props} />;
                          case 'snarky': return <SnarkyTemplate {...props} />;
                          case 'custom': return <CustomTemplate {...props} />;
                          default: return <SweetTemplate {...props} />;
                        }
                      })()}
                    </div>
                  )}

                  {/* Atmospheric FX trigger in preview */}
                  <BackgroundEffects effect={effects} trigger={unboxedInPreview} />
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        vibe={vibe}
        recipientName={name}
        onApply={handleApplyAi}
      />
    </div>
  );
}
