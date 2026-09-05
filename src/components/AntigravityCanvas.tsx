import React from 'react';
import { WishVibe, VIBE_CONFIGS } from '@/types';

interface AntigravityCanvasProps {
  vibe: WishVibe;
  headline?: string;
  body: string;
  senderAlias?: string;
  className?: string;
}

export default function AntigravityCanvas({
  vibe,
  headline = 'Happy Birthday',
  body,
  senderAlias,
  className = '',
}: AntigravityCanvasProps) {
  const config = VIBE_CONFIGS[vibe];

  return (
    <div className={`relative w-full h-full min-h-screen bg-[#0A0A0C] overflow-hidden perspective-[1000px] ${className}`}>
      {/* --- INJECTED ANIMATION STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          33% { transform: translateX(20px) translateY(-15px); }
          66% { transform: translateX(-15px) translateY(20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
        .animate-drift { animation: drift 20s ease-in-out infinite; }
        .animate-orbit { animation: orbit 25s linear infinite; }
        .editorial-hero { line-height: 0.85; letter-spacing: -0.04em; font-weight: 100; }
        .editorial-heavy { line-height: 0.85; letter-spacing: -0.02em; font-weight: 900; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}} />

      {/* LAYER 0: Void Background + Vibe specific radial gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-40 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.accentColor}33 0%, transparent 60%)`
        }}
      />

      {/* LAYER 1: Atmospheric Dust */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50 overflow-hidden mix-blend-screen">
        <div className="absolute top-[20%] left-[20%] w-64 h-64 rounded-full bg-white/5 blur-[100px] animate-drift" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full bg-white/5 blur-[120px] animate-drift" style={{ animationDelay: '-5s' }} />
      </div>

      {/* LAYER 2: Monolith Typography */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <h1 
          className="text-[30vw] text-white/5 editorial-heavy uppercase whitespace-nowrap animate-float-slow"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)', color: 'transparent' }}
        >
          {vibe}
        </h1>
      </div>

      {/* LAYER 4: Orbital Accents (Behind subject, rotating) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none w-[600px] h-[600px] opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-orbit">
          <circle cx="50" cy="50" r="48" fill="none" stroke={config.accentColor} strokeWidth="0.2" strokeDasharray="1 4" />
          <path d="M50 0 L50 100 M0 50 L100 50" stroke={config.accentColor} strokeWidth="0.1" opacity="0.5" />
          <circle cx="50" cy="2" r="1" fill={config.accentColor} />
          <circle cx="98" cy="50" r="1.5" fill={config.accentColor} />
        </svg>
      </div>

      {/* LAYER 3 & LAYER 6: Floating Subject & Hero Typography */}
      <div className="absolute inset-0 z-40 flex items-center justify-center p-8 perspective-[1000px]">
        <div className="glass-panel max-w-2xl w-full p-12 md:p-16 rounded-[2rem] animate-float-fast relative overflow-hidden transform-gpu"
             style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Subtle inner gradient tied to vibe */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${config.bgGradient}`} />

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            {/* Minimalist Vibe Tag */}
            <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-sm">{config.emoji}</span>
              <span className={`text-xs font-mono uppercase tracking-[0.2em] ${config.textColor}`}>
                {config.name}
              </span>
            </div>

            {/* Hero Typography */}
            <div className="space-y-6">
              {headline && (
                <h2 className="text-5xl md:text-7xl text-white editorial-hero">
                  {headline}
                </h2>
              )}
              <div className="w-12 h-[1px] bg-white/20 mx-auto" />
              <p className="text-xl md:text-3xl font-light text-white/80 leading-relaxed tracking-wide">
                "{body}"
              </p>
            </div>

            {/* Sender / Footer */}
            {senderAlias && (
              <div className="pt-8 w-full border-t border-white/5 flex flex-col items-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-white/40 font-mono">Sent from</span>
                <span className={`text-lg editorial-heavy ${config.textColor} uppercase tracking-widest`}>
                  {senderAlias}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LAYER 5: Glass Shards (Extreme Foreground Parallax) */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        {/* Shard 1 */}
        <div className="absolute top-[10%] left-[5%] w-32 h-64 animate-float-slow" style={{ animationDelay: '-2s', filter: 'blur(8px)' }}>
          <svg viewBox="0 0 100 200" fill="none" className="w-full h-full opacity-20">
            <polygon points="0,50 100,0 80,200 10,150" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Shard 2 */}
        <div className="absolute bottom-[5%] right-[5%] w-48 h-48 animate-float-fast" style={{ animationDelay: '-6s', filter: 'blur(12px)' }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-30 transform rotate-45">
            <polygon points="50,0 100,50 50,100 0,50" fill="url(#grad2)" />
            <defs>
              <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

    </div>
  );
}
