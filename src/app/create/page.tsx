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
} from 'lucide-react';
import { Wish, WishVibe, CardTheme, ParticleEffect, CanvasElement, RevealType, VIBE_CONFIGS, CARD_THEME_CONFIGS } from '@/types';
import PhoneMockup from '@/components/PhoneMockup';
import DesignStudio from '@/components/DesignStudio';
import AIAssistantModal from '@/components/AIAssistantModal';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

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

export default function WishStudioPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@example.com');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1998-09-08');
  const [deliveryTime, setDeliveryTime] = useState('00:00:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const [vibe, setVibe] = useState<WishVibe>('roast');
  const [revealType, setRevealType] = useState<RevealType>('scratch');

  const [headline, setHeadline] = useState('⚠️ NOTICE OF ACCELERATED AGING');
  const [message, setMessage] = useState(
    'Happy 28th Birthday Alex! Scientists have officially confirmed that your knees now predict the weather better than the national meteorological department. Stop claiming you "just like staying in" — you’re simply exhausted by 9:30 PM. Enjoy your cold pizza and ibuprofen!'
  );
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
    }
  };
  const [aiInputs, setAiInputs] = useState<{ fact1: string; fact2: string; fact3: string; insideJoke?: string } | undefined>();

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderAlias, setSenderAlias] = useState('The Anti-Aging Police');
  const [senderPrefix, setSenderPrefix] = useState('roast');
  const [isGroupBoard, setIsGroupBoard] = useState(true);
  const [realName, setRealName] = useState('Himanshu');

  // Design Studio State
  const [theme, setTheme] = useState<CardTheme>('dark-ember');
  const [effects, setEffects] = useState<ParticleEffect>('confetti');
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/settings`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        
        if (res.ok) {
          const profile = await res.json();
          if (profile.display_name) {
            setRealName(profile.display_name);
          } else if (session?.user?.user_metadata?.full_name) {
            setRealName(session.user.user_metadata.full_name);
          }
        } else if (session?.user?.user_metadata?.full_name) {
          setRealName(session.user.user_metadata.full_name);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleVibeChange = (newVibe: WishVibe) => {
    setVibe(newVibe);
    const config = VIBE_CONFIGS[newVibe];
    setSenderPrefix(config.defaultPrefix);
    setRevealType(config.defaultReveal);
    setMessage(config.sampleMessage);
    setSenderAlias(config.sampleSender);
    setHeadline(
      newVibe === 'roast'
        ? '⚠️ NOTICE OF ACCELERATED AGING'
        : newVibe === 'sentimental'
        ? 'To the rarest soul I know'
        : 'Happy Birthday!'
    );
  };

  const handleApplyAi = (
    genHeadline: string,
    genBody: string,
    inputs: { fact1: string; fact2: string; fact3: string; insideJoke?: string }
  ) => {
    setHeadline(genHeadline);
    setMessage(genBody);
    setAiInputs(inputs);
    toast('AI Draft inserted into your wish!', 'success');
  };

  const handleStepChange = (targetStep: number) => {
    // Going backwards is always allowed
    if (targetStep < currentStep) {
      soundFX.playPop();
      setCurrentStep(targetStep);
      return;
    }
    
    // Validate Step 1
    if (currentStep === 1 && (!name.trim() || !email.trim() || !birthDate)) {
      toast('Please fill out all required fields before proceeding.', 'error');
      return;
    }
    
    // Validate Step 3
    if (currentStep === 3 && (!headline.trim() || !message.trim())) {
      toast('Please write a headline and message first.', 'error');
      return;
    }
    
    // Prevent jumping multiple steps ahead
    if (targetStep > currentStep + 1) {
      toast('Please proceed one step at a time.', 'error');
      return;
    }

    soundFX.playPop();
    setCurrentStep(targetStep);
  };

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
        theme,
        revealType,
        effects,
        elements: elements.length > 0 ? elements : undefined,
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
      
      // Upload media file if exists
      if (mediaFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', mediaFile);
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/storage/upload`, {
          method: 'POST',
          body: formData,
          // Note: When using FormData, fetch automatically sets the correct Content-Type with boundary
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload media file');
        }
        
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          newWish.message_payload.mediaUrl = uploadData.url;
        }
        setIsUploading(false);
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/wishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(newWish)
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Backend error: ${errText}`);
      }
      
      soundFX.playCelebration();
      toast(`Wish for ${name} locked in for midnight delivery!`, 'success');

      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } catch (e) {
      console.error(e);
      toast('Failed to save wish. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              Creation Wizard
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Step {currentStep} of 4</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Wish Studio & AI Writer
          </h1>
        </div>

        {/* Step breadcrumbs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => handleStepChange(step)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentStep === step
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {step === 1 ? '1. Target' : step === 2 ? '2. Vibe' : step === 3 ? '3. Content' : '4. Delivery'}
            </button>
          ))}
        </div>
      </div>

      {/* Split-screen Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4-Step Interactive Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-zinc-900/70 border border-zinc-800 shadow-2xl space-y-6">
            {/* Step 1: The Target */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-400" />
                    <span>Who is this celebration for?</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Set their details and local timezone so the system triggers at exact midnight.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Recipient's Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Recipient's Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Recipient's Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:scale-[1.02] transition-all"
                  >
                    <span>Next: Choose Vibe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: The Design Studio */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span>Design Studio</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Pick a vibe, card theme, reveal mechanic, particle effect, and drop stickers.
                  </p>
                </div>

                <DesignStudio
                  vibe={vibe}
                  theme={theme}
                  revealType={revealType as RevealType}
                  effects={effects}
                  elements={elements}
                  onVibeChange={handleVibeChange}
                  onThemeChange={setTheme}
                  onRevealChange={(r) => setRevealType(r)}
                  onEffectsChange={setEffects}
                  onElementsChange={setElements}
                />

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => { soundFX.playPop(); setCurrentStep(1); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:scale-[1.02] transition-all"
                  >
                    <span>Next: Write Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Content & AI Writer */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Message Studio</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Write your own note or let AI weave in their funny quirks.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setIsAiModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-md"
                  >
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>AI Assistant ✨</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Headline / Card Title
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    Attach a Photo (Optional)
                  </label>
                  {!mediaPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-6 h-6 text-zinc-500 mb-2" />
                        <p className="text-xs text-zinc-400 font-medium">Click to upload an image</p>
                        <p className="text-[10px] text-zinc-500 mt-1">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} />
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img src={mediaPreview} alt="Preview" className="h-32 rounded-xl object-cover border border-zinc-800" />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFile(null);
                          setMediaPreview(null);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-zinc-800 text-zinc-300 hover:text-white rounded-full shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStepChange(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:scale-[1.02] transition-all"
                  >
                    <span>Next: Delivery & Alias</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Delivery & Disguise */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span>Delivery & Disguise</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Configure identity protection, sender email prefix, and collaborative options.
                  </p>
                </div>

                {/* Anonymous Toggle */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Send Anonymously</h4>
                    <p className="text-xs text-zinc-400">Hides your real identity from the recipient</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      soundFX.playPop();
                      const isAnon = e.target.checked;
                      setIsAnonymous(isAnon);
                      if (!isAnon) {
                        setSenderAlias(realName);
                        if (realName) {
                          setSenderPrefix(realName.toLowerCase().replace(/[^a-z0-9]/g, ''));
                        }
                      } else {
                        // Reset back to vibe default if toggled back to anonymous
                        const config = VIBE_CONFIGS[vibe];
                        setSenderAlias(config.sampleSender);
                      }
                    }}
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Sender Alias */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Sender Display Alias
                  </label>
                  <input
                    type="text"
                    value={senderAlias}
                    onChange={(e) => setSenderAlias(e.target.value)}
                    placeholder="e.g. Anti-Aging Police, Secret Admirer, Himanshu"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Email prefix selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Delivery Address Prefix
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={senderPrefix}
                      onChange={(e) => setSenderPrefix(e.target.value)}
                      className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-amber-400 font-mono focus:outline-none focus:border-rose-500"
                    >
                      <option value="roast">roast</option>
                      <option value="cheers">cheers</option>
                      <option value="forever">forever</option>
                      <option value="truth">truth</option>
                      <option value="secret">secret</option>
                      <option value="anonymous">anonymous</option>
                      {!isAnonymous && realName && (
                        <option value={realName.toLowerCase().replace(/[^a-z0-9]/g, '')}>
                          {realName.toLowerCase().replace(/[^a-z0-9]/g, '')}
                        </option>
                      )}
                    </select>
                    <span className="text-sm text-zinc-400 font-mono">@chitoria.dev</span>
                  </div>
                </div>

                {/* Group Board Toggle */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>Enable Collaborative Group Board</span>
                    </h4>
                    <p className="text-xs text-zinc-400">Generates a public link for friend circles to drop notes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGroupBoard}
                    onChange={(e) => {
                      soundFX.playPop();
                      setIsGroupBoard(e.target.checked);
                    }}
                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 shadow-xl shadow-rose-500/25 hover:scale-[1.02] transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isSubmitting ? (isUploading ? 'Uploading photo...' : 'Locking in...') : 'Lock It In & Schedule 🚀'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Sticky Live Phone Mockup Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Reveal Preview
            </span>
            <span className="text-[11px] text-zinc-500">Updates live as you type</span>
          </div>

          <PhoneMockup
            recipientName={name || 'Alex'}
            vibe={vibe}
            headline={headline}
            body={message}
            senderAlias={senderAlias}
            isAnonymous={isAnonymous}
            revealType={revealType}
          />
        </div>
      </div>

      {/* AI Assistant Modal */}
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
