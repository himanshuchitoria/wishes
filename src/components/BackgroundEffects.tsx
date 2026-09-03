'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ParticleEffect } from '@/types';

interface BackgroundEffectsProps {
  effect: ParticleEffect;
  trigger: boolean; // becomes true when reveal is completed
}

// ─── Floating particle animation (hearts / snow / sparkles) ──────────────────
function FloatingParticles({ symbols, colors }: { symbols: string[]; colors: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    const spawn = () => {
      const el = document.createElement('div');
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const size = 16 + Math.random() * 22;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * 100;
      const duration = 4000 + Math.random() * 6000;
      const drift = (Math.random() - 0.5) * 60;

      el.textContent = sym;
      el.style.cssText = `
        position: fixed;
        bottom: -40px;
        left: ${startX}vw;
        font-size: ${size}px;
        color: ${color};
        opacity: ${0.5 + Math.random() * 0.5};
        pointer-events: none;
        user-select: none;
        z-index: 10;
        animation: floatUp ${duration}ms ease-in forwards;
        --drift: ${drift}px;
      `;

      document.body.appendChild(el);
      particles.push(el);

      setTimeout(() => {
        el.remove();
        particles.splice(particles.indexOf(el), 1);
      }, duration);
    };

    // Inject keyframes if not present
    if (!document.getElementById('float-keyframes')) {
      const style = document.createElement('style');
      style.id = 'float-keyframes';
      style.textContent = `
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-50vh) translateX(var(--drift)) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(-110vh) translateX(calc(var(--drift) * 2)) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    spawn();
    const interval = setInterval(spawn, 400);
    return () => {
      clearInterval(interval);
      particles.forEach(p => p.remove());
    };
  }, [symbols, colors]);

  return <div ref={containerRef} className="sr-only" aria-hidden />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BackgroundEffects({ effect, trigger }: BackgroundEffectsProps) {
  const firedRef = useRef(false);

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { x: 0.1, y: 0.4 }, angle: 60 }), 300);
    setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { x: 0.9, y: 0.4 }, angle: 120 }), 500);
  }, []);

  const fireFireworks = useCallback(() => {
    const fire = (opts: confetti.Options) => confetti({ ...opts, startVelocity: 30, spread: 360, ticks: 60 });
    const positions = [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.5, y: 0.2 }, { x: 0.15, y: 0.6 }, { x: 0.85, y: 0.6 }];
    positions.forEach((origin, i) => {
      setTimeout(() => fire({ particleCount: 60, origin, colors: ['#f59e0b', '#f97316', '#ef4444', '#ffffff'] }), i * 250);
    });
  }, []);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    if (effect === 'confetti') fireConfetti();
    if (effect === 'fireworks') fireFireworks();
    if (effect === 'sparkles') {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.5 },
        shapes: ['star'],
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'],
        scalar: 0.8,
      });
    }
  }, [trigger, effect, fireConfetti, fireFireworks]);

  if (!trigger) return null;

  return (
    <>
      {effect === 'hearts' && (
        <FloatingParticles
          symbols={['❤️', '💖', '💕', '💗', '💝', '🩷', '💓']}
          colors={['#f43f5e', '#ec4899', '#fb7185', '#fda4af']}
        />
      )}
      {effect === 'snow' && (
        <FloatingParticles
          symbols={['❄️', '🌨', '❅', '❆', '·', '•']}
          colors={['#bfdbfe', '#dbeafe', '#e0f2fe', '#ffffff']}
        />
      )}
    </>
  );
}
