'use client';

import React from 'react';

export interface NavIconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Custom Artistic Neo-Brutalist Pop-Art Icons for chitoria.dev
 * Handcrafted with punchy weights, comic detailing, and thematic metaphors.
 * Completely distinct from generic AI/Lucide outline icons.
 */

// 1. Dashboard: Chunky Retro Calendar with Spiral Binding & Comic Star Stamp
export function NavDashboardIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Twin Spiral Binder Rings */}
      <rect x="6" y="1.5" width="2.5" height="4" rx="1" fill={color} />
      <rect x="15.5" y="1.5" width="2.5" height="4" rx="1" fill={color} />
      
      {/* Calendar Card Frame */}
      <rect x="3" y="3.5" width="18" height="17.5" rx="2" stroke={color} strokeWidth="2.2" />
      
      {/* Header Divider Line */}
      <path d="M3 8.5h18" stroke={color} strokeWidth="2.2" />
      
      {/* Left Data Status Ticks */}
      <path d="M6.5 12h3M6.5 15.5h4.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      
      {/* Right Pop-Art 4-Point Comic Star Stamp */}
      <path
        d="M15.5 10.8l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"
        fill={color}
      />
    </svg>
  );
}

// 2. Studio: Comic Stylus / Magic Wand with an Energetic Starburst Explosion & Sparks
export function NavStudioIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Angled Wand Shaft */}
      <path d="M3 21l8.5-8.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      {/* Wand Grip & Tip Bands */}
      <path d="M5 19l2-2" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 15l2-2" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      
      {/* Explosive Comic Starburst at Tip */}
      <path
        d="M18 2.5l1.2 3.8 3.8 1.2-3.8 1.2L18 12.5l-1.2-3.8-3.8-1.2 3.8-1.2z"
        fill={color}
      />
      {/* Floating Action Sparks */}
      <circle cx="10.5" cy="5.5" r="1" fill={color} />
      <path d="M21 14.5h2M22 13.5v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="20" r="0.75" fill={color} />
    </svg>
  );
}

// 3. Queue (The Arsenal): Classic Comic Round Time-Bomb with Sizzling Zigzag Fuse & Spark
export function NavQueueIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Round Bomb Body */}
      <circle cx="10" cy="14" r="7" stroke={color} strokeWidth="2.2" />
      
      {/* Comic Highlight Arc inside Bomb */}
      <path d="M7 11.5a4.2 4.2 0 0 1 4.5-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Bomb Collar / Neck */}
      <path d="M8.5 6.5h3v1.5h-3z" fill={color} />
      
      {/* S-Curved Fuse */}
      <path
        d="M10 6.5C10 4 12.5 3.5 14 5s3 1 4-.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Exploding Spark on Fuse Tip */}
      <path
        d="M18.5 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"
        fill={color}
      />
      {/* Mini Detonation Embers */}
      <circle cx="21.5" cy="2" r="0.8" fill={color} />
      <circle cx="16" cy="1" r="0.6" fill={color} />
    </svg>
  );
}

// 4. Settings: Chunky 8-Tooth Neobrutalist Cog with Slotted Center Bolt
export function NavSettingsIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Heavy 8-Tooth Cog Profile */}
      <path
        d="M9.5 2h5l.8 2.8 2.2.9 2.5-1.5 3.5 3.5-1.5 2.5.9 2.2 2.8.8v5l-2.8.8-.9 2.2 1.5 2.5-3.5 3.5-2.5-1.5-2.2.9-.8 2.8h-5l-.8-2.8-2.2-.9-2.5 1.5-3.5-3.5 1.5-2.5-.9-2.2-2.8-.8v-5l2.8-.8.9-2.2-1.5-2.5 3.5-3.5 2.5 1.5 2.2-.9z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Central Bolt Cutout */}
      <circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="2" />
      {/* Slotted Screw Head Mark */}
      <path d="M10.5 12h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 5. User / Sign In: Comic VIP Pass / Backstage Laminate Badge with Lanyard Loop & Avatar
export function NavUserIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Badge Frame */}
      <rect x="4.5" y="3.5" width="15" height="17.5" rx="2" stroke={color} strokeWidth="2.2" />
      
      {/* Lanyard Oval Slot */}
      <rect x="10" y="5" width="4" height="1.8" rx="0.9" fill={color} />
      
      {/* Character Avatar Head */}
      <circle cx="12" cy="11.5" r="2.8" stroke={color} strokeWidth="2" />
      {/* Shoulders */}
      <path d="M7.5 18c0-2.2 2-3.5 4.5-3.5s4.5 1.3 4.5 3.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 6. Logout: Comic Exit Portal / Eject Door with Blasting Arrow & Motion Streaks
export function NavLogoutIcon({ className = '', size = 16, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Doorway Bracket */}
      <path
        d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Blasting Arrow */}
      <path
        d="M10 12h11m-3.5-3.5l3.5 3.5-3.5 3.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Speed Action Dashes */}
      <path d="M12 8.5h2M12 15.5h2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 7. Mobile Menu (Hamburger): Staggered Chunky Comic Lines
export function NavMenuIcon({ className = '', size = 20, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6h18" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M3 12h11" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="18" cy="12" r="1.5" fill={color} />
      <path d="M3 18h18" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

// 8. Mobile Close (X): Comic Cross with Impact Sparks
export function NavCloseIcon({ className = '', size = 20, color = 'currentColor' }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1" fill={color} />
      <circle cx="20.5" cy="12" r="1" fill={color} />
      <circle cx="12" cy="20.5" r="1" fill={color} />
      <circle cx="3.5" cy="12" r="1" fill={color} />
    </svg>
  );
}
