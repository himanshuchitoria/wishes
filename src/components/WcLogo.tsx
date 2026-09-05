'use client';

import React from 'react';

interface WcLogoProps {
  className?: string;
  color?: string;
  size?: number;
}

// "wc" logo — half-cut W (left stroke is straight vertical) + open C arc
// The W has: vertical down | then V-shape \/ then diagonal up /
// This creates the distinctive "half-W" look shown in the reference image
export default function WcLogo({ className = '', color = '#000000', size = 32 }: WcLogoProps) {
  const h = Math.round(size * 54 / 82);
  return (
    <svg
      viewBox="0 0 82 54"
      width={size}
      height={h}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="wc logo"
    >
      {/* 
        Half-cut "W": 
          - Left leg: straight VERTICAL down (the "half cut" — no diagonal)  
          - Then V-shape going down-right then up-right
          - Then diagonal down-right then up-right to end
        Result looks like: |\/\/ which reads as a W whose left side is vertical
      */}
      <path
        d="M4 4 L4 42 L18 20 L32 42 L44 4"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* 
        Open "C":
          Starts top-right, curves around to form an open arc 
      */}
      <path
        d="M78 14 C70 5, 54 5, 48 22 C42 38, 51 50, 66 50 C73 50, 78 46, 80 40"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
