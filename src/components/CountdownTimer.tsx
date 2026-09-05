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
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase animate-pulse">
        <span>🎉 IT'S BIRTHDAY TIME! UNLOCKED</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
        <Clock className="w-3.5 h-3.5 text-black" />
        <span>
          {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
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
          className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[62px] sm:min-w-[74px]"
        >
          <span className="text-xl sm:text-2xl font-black font-mono text-black tracking-tight">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-[10px] font-black text-black uppercase tracking-wider mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
