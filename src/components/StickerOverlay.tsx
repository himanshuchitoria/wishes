'use client';

import React from 'react';
import { CanvasElement } from '@/types';

interface StickerOverlayProps {
  elements: CanvasElement[];
}

/**
 * Renders sticker/emoji canvas elements as absolutely-positioned overlays
 * on top of a reveal card. The parent must have `position: relative`.
 */
export default function StickerOverlay({ elements }: StickerOverlayProps) {
  if (!elements || elements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-30">
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {el.type === 'sticker' ? (
            <div className="bg-yellow-300 text-black border-2 sm:border-[3px] border-black font-black uppercase tracking-tight text-xs sm:text-sm px-2.5 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md whitespace-nowrap">
              {el.content}
            </div>
          ) : el.type === 'text' ? (
            <div className="bg-white/90 text-black border border-black font-bold text-xs px-2 py-0.5 shadow-md rounded">
              {el.content}
            </div>
          ) : (
            <div
              style={{
                fontSize: `${el.fontSize || 32}px`,
                lineHeight: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.35)',
              }}
            >
              {el.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
