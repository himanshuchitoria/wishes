'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { soundFX } from '@/lib/audio';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Wait for the auth callback to set the session
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast('Invalid or expired reset link.', 'error');
        router.push('/auth');
      } else {
        setVerifying(false);
      }
    };
    checkSession();
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast('Password must be at least 6 characters.', 'error');
      return;
    }
    soundFX.playPop();
    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase is not configured");
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast('Password updated successfully! Welcome back.', 'success');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Failed to update password', 'error');
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase text-2xl tracking-widest text-black">
        VERIFYING SECURE LINK...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full relative flex flex-col items-center justify-center px-4 pt-24 pb-12 selection:bg-cyan-400 selection:text-black">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
      />

      <div className="w-full max-w-md bg-yellow-400 p-6 sm:p-10 border-[6px] sm:border-[8px] border-black shadow-[12px_12px_0_0_#000] relative z-20 transform -rotate-1">
        
        <div className="absolute -top-5 -left-5 bg-rose-500 text-white px-4 py-2 border-[4px] border-black shadow-[4px_4px_0_0_#000] transform -rotate-6">
          <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            SECURE OVERRIDE
          </span>
        </div>

        <div className="space-y-2 mt-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tighter uppercase leading-none">
            UPDATE PASSCODE
          </h1>
          <p className="text-sm font-bold text-black/60 uppercase tracking-widest bg-white inline-block px-2 border-[4px] border-black shadow-[2px_2px_0_0_#000]">
            Enter your new credentials below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">
              New Passcode
            </label>
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
            <p className="text-xs font-bold text-black/50 mt-2 uppercase">Must be at least 6 characters.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 text-base sm:text-lg font-black uppercase text-white bg-rose-500 border-[6px] border-black hover:bg-black hover:text-rose-500 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000] transition-all group"
          >
            {loading ? 'ENCRYPTING...' : 'SAVE NEW PASSCODE'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
