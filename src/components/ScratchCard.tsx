'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '@/lib/audio';
import { Sparkles } from 'lucide-react';
import ImageModal from './ImageModal';

interface ScratchCardProps {
  headline?: string;
  body: string;
  senderAlias?: string;
  isAnonymous?: boolean;
  mediaUrl?: string;
  onRevealed?: () => void;
  accentColor?: string;
}

export default function ScratchCard({
  headline,
  body,
  senderAlias,
  isAnonymous,
  mediaUrl,
  onRevealed,
  accentColor = '#f97316',
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDrawing = useRef(false);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw metallic textured scratch surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#27272a');
    gradient.addColorStop(0.5, '#3f3f46');
    gradient.addColorStop(1, '#18181b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative sparkles pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 1;
      ctx.fillRect(x, y, size, size);
    }

    // Centered label text
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE TO UNLOCK ✨', width / 2, height / 2 - 10);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillText('Use your finger or mouse to reveal', width / 2, height / 2 + 15);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const calculateScratchPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / 16;
    const percent = Math.round((transparentCount / totalSampled) * 100);
    setScratchPercent(percent);

    if (percent >= 45 && !isRevealed) {
      setIsRevealed(true);
      soundFX.playCelebration();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ff4500', '#fbbf24', '#f43f5e'],
      });
      if (onRevealed) onRevealed();
    }
  }, [isRevealed, onRevealed]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    soundFX.playScratch();
    calculateScratchPercent();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      isDrawing.current = true;
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing.current || e.touches.length === 0) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleQuickReveal = () => {
    setIsRevealed(true);
    soundFX.playCelebration();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f97316', '#f43f5e', '#fbbf24'],
    });
    if (onRevealed) onRevealed();
  };

  return (
    <div className="w-full space-y-3">
      <div
        ref={containerRef}
        className="relative w-full min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl bg-zinc-900 select-none touch-none"
      >
        {/* Underlying Secret Message (Revealed content) */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900">
          <div className="space-y-3">
            {headline && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                {headline}
              </div>
            )}
            
            {mediaUrl && (
              <div 
                className="w-full rounded-xl overflow-hidden border border-zinc-700/50 my-3 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <img src={mediaUrl} alt="Revealed content" className="w-full h-auto max-h-64 object-cover" />
              </div>
            )}
            
            <p className="text-base sm:text-lg text-zinc-100 font-medium leading-relaxed font-sans">
              &ldquo;{body}&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>
              {isAnonymous ? '🕶️ Sent Anonymously' : '💌 Sent with love'}
            </span>
            <span className="font-bold text-white">
              {senderAlias || 'A Secret Admirer'}
            </span>
          </div>
        </div>

        {/* Scratch Canvas Overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500"
          />
        )}
      </div>

      {/* Progress & Quick Reveal helper */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>Scratched: {scratchPercent}%</span>
        {!isRevealed && (
          <button
            onClick={handleQuickReveal}
            className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4"
          >
            Quick Reveal All ⚡
          </button>
        )}
      </div>
      
      <ImageModal 
        isOpen={isModalOpen}
        imageUrl={mediaUrl || null}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
