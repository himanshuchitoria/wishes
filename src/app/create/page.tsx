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
import { Wish, WishVibe, CardTheme, ParticleEffect, CanvasElement, RevealType, VIBE_CONFIGS } from '@/types';
import VibeSlider from '@/components/VibeSlider';
import AIAssistantModal from '@/components/AIAssistantModal';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

// Import Templates for Live Preview
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

export default function ImmersiveWishStudio() {
  const router = useRouter();
  const { toast } = useToast();

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('00:00:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const [vibe, setVibe] = useState<WishVibe>('sweet');
  
  const [headline, setHeadline] = useState('');
  const [message, setMessage] = useState('');
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiInputs, setAiInputs] = useState<{ fact1: string; fact2: string; fact3: string; insideJoke?: string } | undefined>();

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderAlias, setSenderAlias] = useState('Secret Admirer');
  const [senderPrefix, setSenderPrefix] = useState('secret');
  const [isGroupBoard, setIsGroupBoard] = useState(true);
  const [realName, setRealName] = useState('');

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
    
    // Set initial config
    const config = VIBE_CONFIGS['sweet'];
    setHeadline('Happy Birthday!');
    setMessage(config.sampleMessage);
  }, []);

  const handleVibeChange = (newVibe: WishVibe) => {
    setVibe(newVibe);
    const config = VIBE_CONFIGS[newVibe];
    setSenderPrefix(config.defaultPrefix);
    if (!message || message === VIBE_CONFIGS['sweet'].sampleMessage || message === VIBE_CONFIGS['roast'].sampleMessage || message === VIBE_CONFIGS['snarky'].sampleMessage || message === VIBE_CONFIGS['sentimental'].sampleMessage || message === VIBE_CONFIGS['custom'].sampleMessage) {
       setMessage(config.sampleMessage);
    }
    if (!senderAlias || senderAlias === 'Secret Admirer' || senderAlias === 'The Anti-Aging Police') {
       setSenderAlias(config.sampleSender);
    }
    setHeadline(
      newVibe === 'roast' ? '⚠️ NOTICE OF ACCELERATED AGING' :
      newVibe === 'sentimental' ? 'To the rarest soul I know' :
      newVibe === 'snarky' ? '>> SYSTEM WARNING' :
      'Happy Birthday!'
    );
  };

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
        revealType: 'scratch',
        effects: 'confetti',
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
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/storage/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload media file');
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
      
      if (!res.ok) throw new Error(`Backend error: ${await res.text()}`);
      
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
        };
      case 'snarky':
        return {
          bg: 'bg-zinc-950',
          bgEffect: 'bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30',
          text: 'text-cyan-400 font-mono',
          heading: 'font-bold uppercase tracking-tight text-fuchsia-500',
          card: 'bg-black/60 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-lg',
          input: 'bg-black/80 border border-zinc-800 text-zinc-200 focus:border-cyan-500 placeholder-zinc-700 font-mono rounded-md',
          btn: 'bg-cyan-500 text-black font-bold font-mono rounded-md hover:bg-cyan-400',
        };
      case 'sentimental':
        return {
          bg: 'bg-[#fdfbf7]',
          bgEffect: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f1ebe1] via-transparent to-transparent opacity-60',
          text: 'text-[#4a4036] font-[family-name:var(--font-playfair)]',
          heading: 'font-medium tracking-tight',
          card: 'bg-white/80 border border-[#e6dfd3] shadow-sm backdrop-blur-md rounded-2xl',
          input: 'bg-transparent border-b border-[#d3cabc] text-[#4a4036] focus:border-[#8b7d6b] placeholder-[#a89f91] rounded-none px-0 font-[family-name:var(--font-playfair)]',
          btn: 'bg-[#4a4036] text-[#fdfbf7] font-light rounded-full hover:bg-[#2d261e]',
        };
      case 'custom':
        return {
          bg: 'bg-[#050505]',
          bgEffect: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent',
          text: 'text-[#d4af37]',
          heading: 'font-light tracking-widest uppercase',
          card: 'bg-zinc-900/50 border border-[#d4af37]/20 backdrop-blur-md rounded-none',
          input: 'bg-black border border-[#d4af37]/20 text-[#d4af37] focus:border-[#d4af37] placeholder-[#d4af37]/30 rounded-none',
          btn: 'bg-[#d4af37] text-black font-semibold tracking-widest uppercase rounded-none hover:bg-white',
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
      headline,
      body: message,
      mediaUrl: mediaPreview || undefined,
    },
    status: 'scheduled',
    group_token: 'preview',
    is_group_board: isGroupBoard,
    reveal_token: 'preview',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-700 ${styles.bg}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${styles.bgEffect}`} />
      
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Left Column: Form Controls */}
        <div className={`w-full lg:w-5/12 flex flex-col gap-6 transition-all duration-700 ${styles.text}`}>
          <div className="mb-2">
             <h1 className={`text-4xl ${styles.heading}`}>Design Studio</h1>
             <p className="opacity-70 mt-1 text-sm">Create a hyper-personalized immersive experience.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
             
             {/* 1. Aesthetic / Vibe */}
             <div className={`p-6 transition-all duration-500 ${styles.card}`}>
                <h3 className={`text-xl mb-4 ${styles.heading}`}>1. Choose Aesthetic</h3>
                <VibeSlider value={vibe} onChange={handleVibeChange} />
             </div>
             
             {/* 2. Target Info */}
             <div className={`p-6 transition-all duration-500 ${styles.card} space-y-4`}>
                <h3 className={`text-xl mb-4 ${styles.heading}`}>2. The Target</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Birthdate</label>
                    <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input} [&>option]:bg-zinc-900 [&>option]:text-white`}>
                      {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                    </select>
                  </div>
                </div>
             </div>
             
             {/* 3. Message */}
             <div className={`p-6 transition-all duration-500 ${styles.card} space-y-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl ${styles.heading}`}>3. The Message</h3>
                  <button type="button" onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-500 rounded text-xs font-bold hover:bg-amber-500/30">
                    <Wand2 className="w-3.5 h-3.5" /> AI Writer
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Headline</label>
                  <input type="text" required value={headline} onChange={(e) => setHeadline(e.target.value)} className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Body</label>
                  <textarea rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Photo (Optional)</label>
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} className={`w-full px-3.5 py-2.5 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 ${styles.input}`} />
                </div>
             </div>
             
             {/* 4. Delivery Options */}
             <div className={`p-6 transition-all duration-500 ${styles.card} space-y-4`}>
                <h3 className={`text-xl mb-4 ${styles.heading}`}>4. Delivery</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold opacity-90">Send Anonymously</h4>
                    <p className="text-xs opacity-60">Hide your real identity</p>
                  </div>
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-5 h-5 cursor-pointer accent-current" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Sender Alias</label>
                  <input type="text" value={senderAlias} onChange={(e) => setSenderAlias(e.target.value)} className={`w-full px-3.5 py-2.5 outline-none transition-all ${styles.input}`} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-sm font-bold opacity-90">Enable Group Board</h4>
                    <p className="text-xs opacity-60">Let friends add notes</p>
                  </div>
                  <input type="checkbox" checked={isGroupBoard} onChange={(e) => setIsGroupBoard(e.target.checked)} className="w-5 h-5 cursor-pointer accent-current" />
                </div>
             </div>
             
             <button type="submit" disabled={isSubmitting} className={`w-full py-4 px-6 flex items-center justify-center gap-2 transition-all ${styles.btn}`}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>{isSubmitting ? (isUploading ? 'Uploading...' : 'Locking in...') : 'Schedule Delivery'}</span>
             </button>
          </form>
        </div>
        
        {/* Right Column: Live Preview Container */}
        <div className="w-full lg:w-7/12 lg:sticky lg:top-24 h-[700px] lg:h-[calc(100vh-140px)] flex flex-col relative z-20 perspective-[1000px]">
           <div className="mb-2 flex items-center justify-between px-2">
             <span className={`text-xs font-bold uppercase tracking-wider ${styles.text} opacity-60`}>Live Reveal Preview</span>
             <span className={`text-[10px] uppercase tracking-widest ${styles.text} opacity-40`}>Updates instantly</span>
           </div>
           
           {/* Scaled Window to show templates exactly as they will look */}
           <div className={`flex-1 rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-700 ${vibe === 'roast' ? 'border-8 border-black' : vibe === 'snarky' ? 'border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]' : 'border-4 border-white/10'}`}>
              <div className="absolute inset-0 origin-top-left" style={{ width: '100%', height: '100%' }}>
                 <div className="relative w-full h-full pointer-events-none">
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
              </div>
              
              {/* Fake Browser Chrome overlay for aesthetics */}
              <div className="absolute top-0 left-0 w-full h-8 bg-black/20 backdrop-blur-md flex items-center px-4 gap-2 border-b border-white/10 z-50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="mx-auto text-[9px] text-white/50 tracking-widest uppercase truncate max-w-[50%]">
                  chitoria.dev/reveal/{vibe}-preview
                </div>
              </div>
           </div>
        </div>

      </div>

      <AIAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} vibe={vibe} recipientName={name} onApply={handleApplyAi} />
    </div>
  );
}
