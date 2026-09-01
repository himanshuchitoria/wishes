'use client';

import React, { useState, useEffect } from 'react';
import { getCountdown } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  variant?: 'card' | 'compact' | 'hero';
}

export default function CountdownTimer({
  targetDate,
  onExpire,
  variant = 'card',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getCountdown(targetDate);
      setTimeLeft(updated);
      if (updated.isExpired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
        <span>🎉 IT’S BIRTHDAY TIME! UNLOCKED</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
        <Clock className="w-3 h-3 text-rose-400" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-lg min-w-[62px] sm:min-w-[74px]"
        >
          <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
