'use client';

import React from 'react';

interface WcLogoProps {
  className?: string;
  color?: string;
  size?: number;
}

// Stylistic "wc" logo SVG - handcrafted brushstroke style
export default function WcLogo({ className = '', color = '#000000', size = 32 }: WcLogoProps) {
  return (
    <svg
      viewBox="0 0 80 52"
      width={size}
      height={Math.round(size * 52 / 80)}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* "w" letter - stylistic with angled strokes */}
      <path
        d="M4 6 L13 42 L22 18 L31 42 L40 6"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* "c" letter - open arc shape */}
      <path
        d="M76 16 C68 8, 52 8, 46 22 C40 36, 48 48, 62 48 C70 48, 76 44, 78 38"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
