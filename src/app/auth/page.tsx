'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, Flame, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

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
          // Full page reload so the server-side session cookie is respected by middleware
          setTimeout(() => { window.location.href = '/dashboard'; }, 300);
          return;
        } else if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          if (error) throw error;
          toast('Account created! Check your email to confirm, then sign in.', 'success');
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 items-center justify-center">
      {/* Left Form Panel */}
      <div className="w-full max-w-md p-6 sm:p-10 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            {reason === 'save-board' ? 'Save Your Group Board' : 'Frictionless Entry'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'signin'
              ? 'Welcome back'
              : mode === 'signup'
              ? 'Create your account'
              : 'Reset your password'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {reason === 'save-board'
              ? 'Create a quick account to manage your collaborative birthday board.'
              : 'Never miss another friend’s birthday again.'}
          </p>
        </div>

        {/* Google OAuth button */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">
              Or with email
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Himanshu Chitoria"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/25 transition-all"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'signin' ? (
              <span>Sign In to Dashboard</span>
            ) : mode === 'signup' ? (
              <span>Create Free Account</span>
            ) : (
              <span>Send Reset Instructions</span>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-2 text-center text-xs text-zinc-400">
          {mode === 'signin' ? (
            <p>
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-rose-400 font-bold hover:underline ml-1"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-rose-400 font-bold hover:underline ml-1"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right Side Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-center max-w-md ml-16 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Why Creators Love chitoria.dev
          </span>
          <h3 className="text-2xl font-black text-white">
            "My best friend spent 10 minutes trying to guess who roasted his cold pizza obsession."
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
              JD
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Jessica Daniels</h5>
              <p className="text-[10px] text-zinc-500">Scheduled 4 wishes in 2026</p>
            </div>
          </div>
          <p className="text-xs text-zinc-300 italic">
            &ldquo;The timezone midnight trigger worked flawlessly for my sister in London while I was in San Francisco.&rdquo;
          </p>
        </div>

        <div className="space-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Supabase PostgreSQL storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automatic timezone conversion engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero spam guarantee with safe moderation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500 text-xs">Loading Auth...</div>}>
      <AuthContent />
    </Suspense>
  );
}
