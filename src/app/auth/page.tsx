'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, Flame, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

const SpeechBubble = ({ text, author }: { text: string, author: string }) => (
  <div className="relative w-full transform rotate-2">
    <div className="bg-white border-[6px] border-black p-6 shadow-[8px_8px_0_0_#000] relative z-10">
      <p className="font-black uppercase text-xl leading-tight text-black">
        "{text}"
      </p>
    </div>
    <svg className="absolute -bottom-6 left-10 w-8 h-8 z-20" viewBox="0 0 50 50">
      <path d="M0,0 L0,50 L50,0 Z" fill="#fff" stroke="#000" strokeWidth="6" />
    </svg>
    <div className="mt-8 ml-8">
      <span className="font-black uppercase text-lg text-black bg-cyan-400 px-3 py-1 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-2 inline-block">
        {author}
      </span>
    </div>
  </div>
);

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const { toast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    soundFX.playPop();
    setLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } else {
        // Mock demo signin
        setTimeout(() => {
          toast('Signed in successfully with Google (Demo Mode)', 'success');
          router.push('/dashboard');
        }, 600);
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Google Auth failed', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    setLoading(true);

    try {
      if (supabase) {
        if (mode === 'signin') {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          toast('Welcome back!', 'success');
          setTimeout(() => { window.location.href = '/dashboard'; }, 300);
          return;
        } else if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          if (error) throw error;
          toast('Account created! Check your email to confirm.', 'success');
          setMode('signin');
          setLoading(false);
          return;
        } else if (mode === 'forgot') {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          toast('Password reset link sent to your email.', 'info');
          setMode('signin');
          setLoading(false);
          return;
        }
      } else {
        toast('Authentication service is not configured.', 'error');
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 items-center justify-center gap-8 sm:gap-12 lg:gap-24 relative overflow-hidden bg-white text-black selection:bg-cyan-400 selection:text-black">
      
      {/* Global Halftone Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      {/* Massive Background Text behind everything */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden z-[1] flex justify-center pointer-events-none select-none opacity-10 transform -rotate-12">
        <h1 className="text-[30vw] font-black uppercase leading-[0.8] text-black">
          ACCESS
        </h1>
      </div>

      {/* Left Form Panel */}
      <div className="w-full max-w-md bg-yellow-400 p-5 sm:p-10 border-[6px] sm:border-[8px] border-black shadow-[12px_12px_0_0_#000] sm:shadow-[16px_16px_0_0_#000] relative z-20 transform -rotate-1">
        
        {/* Header Badge */}
        <div className="absolute -top-5 -left-5 bg-rose-500 text-white px-4 py-2 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-6">
          <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            {reason === 'save-board' ? 'SAVE BOARD' : 'HQ LOGIN'}
          </span>
        </div>

        {/* Header Text */}
        <div className="space-y-2 mt-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tighter uppercase leading-none">
            {mode === 'signin'
              ? 'WELCOME BACK'
              : mode === 'signup'
              ? 'NEW RECRUIT'
              : 'RESET COMMS'}
          </h1>
          <p className="text-sm sm:text-base font-bold text-black/60 uppercase tracking-widest bg-white inline-block px-2 border-[4px] border-black shadow-[2px_2px_0_0_#000]">
            {reason === 'save-board'
              ? 'Secure your collaborative board'
              : 'Never miss a birthday again.'}
          </p>
        </div>

        {/* Google OAuth button */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-[4px] border-black text-black font-black uppercase text-sm sm:text-base hover:bg-black hover:text-white shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000] transition-all mb-6 group"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5 group-hover:bg-transparent transition-colors" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1 bg-black" />
            <span className="text-xs font-black text-black uppercase tracking-widest bg-white px-2 border-[2px] border-black shadow-[2px_2px_0_0_#000]">
              OR MANUAL
            </span>
            <div className="flex-1 h-1 bg-black" />
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">
                Your Codename (Full Name)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-black" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Himanshu Chitoria"
                  className="w-full pl-12 pr-4 py-3 bg-white border-[4px] border-black text-base font-bold text-black placeholder:text-black/40 focus:outline-none focus:bg-cyan-100 shadow-[4px_4px_0_0_#000]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-black" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-white border-[4px] border-black text-base font-bold text-black placeholder:text-black/40 focus:outline-none focus:bg-cyan-100 shadow-[4px_4px_0_0_#000]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black text-black uppercase tracking-widest">
                  Passcode
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold uppercase tracking-widest bg-white px-2 py-0.5 border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors"
                  >
                    Lost it?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-black" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white border-[4px] border-black text-base font-bold text-black placeholder:text-black/40 focus:outline-none focus:bg-cyan-100 shadow-[4px_4px_0_0_#000]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 mt-4 text-base sm:text-lg font-black uppercase text-white bg-rose-500 border-[6px] border-black hover:bg-black hover:text-rose-500 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000] transition-all group"
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : mode === 'signin' ? (
              <span>ENTER COMMAND CENTER</span>
            ) : mode === 'signup' ? (
              <span>CREATE ACCOUNT</span>
            ) : (
              <span>SEND RESET SIGNAL</span>
            )}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-6 text-center text-sm font-bold uppercase tracking-widest text-black">
          {mode === 'signin' ? (
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>NO ACCOUNT YET?</span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="bg-black text-white px-3 py-1 border-[2px] border-black hover:bg-white hover:text-black shadow-[2px_2px_0_0_#fff] transition-all"
              >
                SIGN UP FREE
              </button>
            </p>
          ) : (
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>ALREADY HAVE CLEARANCE?</span>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="bg-black text-white px-3 py-1 border-[2px] border-black hover:bg-white hover:text-black shadow-[2px_2px_0_0_#fff] transition-all"
              >
                SIGN IN
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right Side Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-center max-w-lg z-20">
        
        <div className="mb-12">
          <div className="inline-block bg-black text-white px-4 py-1 border-[4px] border-black transform rotate-2 shadow-[4px_4px_0_0_rgba(6,182,212,1)] mb-4">
             <span className="text-sm font-black uppercase tracking-widest">TRANSMISSIONS</span>
          </div>
          <SpeechBubble text="My best friend spent 10 minutes trying to guess who roasted his cold pizza obsession." author="JESSICA D." />
        </div>

        <div className="space-y-4 text-sm font-black uppercase tracking-widest text-black">
          <div className="flex items-center gap-3 bg-white p-3 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-1">
            <CheckCircle2 className="w-5 h-5 fill-emerald-400 text-black" />
            <span>ENCRYPTED POSTGRESQL STORAGE</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform rotate-1">
            <CheckCircle2 className="w-5 h-5 fill-emerald-400 text-black" />
            <span>AUTOMATIC TIMEZONE CONVERSION</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-2">
            <CheckCircle2 className="w-5 h-5 fill-emerald-400 text-black" />
            <span>ZERO SPAM GUARANTEE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center font-black uppercase text-2xl tracking-widest">
        LOADING AUTH...
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
