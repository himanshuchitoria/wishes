'use client';

import React from 'react';

interface WcLogoProps {
  className?: string;
  color?: string;
  size?: number;
}

// "vc" logo (often interpreted as a half-cut W + C)
// The left shape is a solid, stylized "v" with a vertical inner right cut.
// The right shape is a geometric "c" with strictly vertical cut terminals.
export default function WcLogo({ className = '', color = '#000000', size = 32 }: WcLogoProps) {
  // Adjusted aspect ratio to perfectly fit the geometric bounding box (185 x 120)
  const h = Math.round(size * 120 / 185);

  return (
    <svg
      viewBox="0 0 185 120"
      width={size}
      height={h}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="vc logo"
    >
      {/* Stylized "V" shape (Filled Polygon)
        - Symmetrical outer bounds slanting inward to the bottom.
        - The left arm is thicker at the bottom, while the right arm tapers.
        - The inner right notch features a perfectly vertical cut.
      */}
      <path
        d="M 10 10 L 45 10 L 75 75 L 75 10 L 110 10 L 85 110 L 35 110 Z"
        fill={color}
      />
      {/* Geometric "C" shape (Filled Compound Path)
        - Formed by a thick, perfectly circular outer and inner arc.
        - Both the top and bottom right terminals are cut perfectly vertically.
      */}
      <path
        d="M 175 11.01 A 50 50 0 1 0 175 108.99 L 175 71.18 A 15 15 0 1 1 175 48.82 Z"
        fill={color}
      />
    </svg>
  );
}