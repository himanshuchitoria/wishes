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
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
            fontSize: `${el.fontSize || 28}px`,
            lineHeight: 1,
            userSelect: 'none',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {el.content}
        </div>
      ))}
    </div>
  );
}
