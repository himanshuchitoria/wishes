import React from 'react';

// The classic 4-point yellow sparkle from the Figma reference
export const Sparkle = ({ className = '', style = {} }: { className?: string, style?: React.CSSProperties }) => (
  <svg 
    className={`absolute ${className}`} 
    style={style}
    viewBox="0 0 44 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M22 0C22 12.15 31.85 22 44 22C31.85 22 22 31.85 22 44C22 31.85 12.15 22 0 22C12.15 22 22 12.15 22 0Z" 
      fill="#FFD700" 
    />
  </svg>
);

// Floating ribbon/confetti element
export const Ribbon = ({ className = '', color = '#6B21A8' }: { className?: string, color?: string }) => (
  <svg 
    className={`absolute opacity-50 ${className}`} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M10 50 Q 25 10 50 50 T 90 50" 
      stroke={color} 
      strokeWidth="12" 
      strokeLinecap="round" 
      fill="none"
    />
  </svg>
);

// The dashed corner curve from the Figma reference
export const DashedCorner = ({ className = '', position = 'bottom-left' }: { className?: string, position?: 'bottom-left' | 'bottom-right' }) => {
  const rotation = position === 'bottom-left' ? 'rotate-0' : 'rotate-90';
  
  return (
    <svg 
      className={`absolute ${rotation} ${className}`} 
      width="150" 
      height="150" 
      viewBox="0 0 150 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M0 150C82.8427 150 150 82.8427 150 0" 
        stroke="white" 
        strokeWidth="2" 
        strokeDasharray="4 6"
      />
    </svg>
  );
};
