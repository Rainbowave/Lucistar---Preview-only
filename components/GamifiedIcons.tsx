import React from 'react';

export const IconGiftSearch = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Box Right */}
      <path d="M50 45 L85 30 L85 70 L50 85 Z" fill="#D49A00" />
      {/* Box Left */}
      <path d="M15 30 L50 45 L50 85 L15 70 Z" fill="#FFB800" />
      {/* Box Top */}
      <path d="M50 15 L85 30 L50 45 L15 30 Z" fill="#FFD600" />
      {/* Ribbon Right */}
      <path d="M60 40 L70 36 L70 76 L60 81 Z" fill="#FFFFFF" opacity="0.9" />
      {/* Ribbon Left */}
      <path d="M30 36 L40 40 L40 81 L30 76 Z" fill="#F0F0F0" opacity="0.9" />
      {/* Ribbon Top */}
      <path d="M40 20 L50 25 L60 20 L50 15 Z" fill="#FFFFFF" />
      <path d="M30 25 L40 30 L50 25 L40 20 Z" fill="#FFFFFF" />
      <path d="M50 25 L60 30 L70 25 L60 20 Z" fill="#FFFFFF" />
      
      {/* Magnifying Glass */}
      <g transform="translate(-5, -15)">
        <circle cx="40" cy="40" r="22" fill="#4A90E2" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M55 55 L75 75" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
        <path d="M30 30 A12 12 0 0 1 45 35" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </g>
    </g>
  </svg>
);

export const IconDice = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(5, 10)">
      {/* Back Dice */}
      <g transform="translate(15, -15)">
        <path d="M20 40 L60 25 L80 45 L40 60 Z" fill="#F5F5F5" />
        <path d="M20 40 L40 60 L40 80 L20 60 Z" fill="#E0E0E0" />
        <path d="M40 60 L80 45 L80 65 L40 80 Z" fill="#D6D6D6" />
        <path d="M20 60 L40 80 L40 88 L20 68 Z" fill="#9C27B0" />
        <path d="M40 80 L80 65 L80 73 L40 88 Z" fill="#7B1FA2" />
      </g>
      
      {/* Front Dice */}
      <g transform="translate(-10, 10)">
        {/* Base Purple */}
        <path d="M20 60 L40 80 L40 90 L20 70 Z" fill="#D500F9" />
        <path d="M40 80 L80 65 L80 75 L40 90 Z" fill="#AA00FF" />
        {/* White Top */}
        <path d="M20 40 L60 25 L80 45 L40 60 Z" fill="#FFFFFF" />
        {/* White Left */}
        <path d="M20 40 L40 60 L40 80 L20 60 Z" fill="#F5F5F5" />
        {/* White Right */}
        <path d="M40 60 L80 45 L80 65 L40 80 Z" fill="#E0E0E0" />
        
        {/* Dots */}
        <ellipse cx="40" cy="42" rx="4" ry="3" fill="#AA00FF" transform="rotate(-20 40 42)" />
        <ellipse cx="60" cy="35" rx="4" ry="3" fill="#AA00FF" transform="rotate(-20 60 35)" />
        <ellipse cx="50" cy="42" rx="4" ry="3" fill="#AA00FF" transform="rotate(-20 50 42)" />
        <ellipse cx="30" cy="50" rx="4" ry="3" fill="#AA00FF" transform="rotate(-20 30 50)" />
        <ellipse cx="70" cy="42" rx="4" ry="3" fill="#AA00FF" transform="rotate(-20 70 42)" />
      </g>
    </g>
  </svg>
);

export const IconChip = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* 3D Edge */}
      <circle cx="50" cy="55" r="40" fill="#1B5E20" />
      <path d="M10 55 A40 40 0 0 0 90 55 L90 45 A40 40 0 0 1 10 45 Z" fill="#2E7D32" />
      
      {/* Top Face */}
      <circle cx="50" cy="45" r="40" fill="#4CAF50" />
      <circle cx="50" cy="45" r="30" fill="#388E3C" />
      <circle cx="50" cy="45" r="28" fill="#4CAF50" />
      
      {/* White Dashes */}
      <g stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round">
        <path d="M50 5 L50 15" />
        <path d="M50 75 L50 85" />
        <path d="M10 45 L20 45" />
        <path d="M80 45 L90 45" />
        <path d="M22 17 L29 24" />
        <path d="M71 73 L78 80" />
        <path d="M22 73 L29 66" />
        <path d="M71 17 L78 24" />
      </g>
      
      {/* Crown */}
      <path d="M35 55 L40 35 L50 45 L60 35 L65 55 Z" fill="#FFFFFF" />
    </g>
  </svg>
);

export const IconPoll = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`transition-transform duration-300 hover:scale-110 hover:brightness-110 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* 3D Base */}
      <path d="M10 85 L90 85 L90 95 L10 95 Z" fill="#1E88E5" />
      <path d="M10 75 L90 75 L90 85 L10 85 Z" fill="#2196F3" />
      
      {/* Bar 1 (Left) */}
      <path d="M20 45 L35 45 L35 75 L20 75 Z" fill="#4CAF50" />
      <path d="M35 45 L40 40 L40 70 L35 75 Z" fill="#388E3C" />
      <path d="M20 45 L25 40 L40 40 L35 45 Z" fill="#81C784" />
      
      {/* Bar 2 (Middle) */}
      <path d="M45 25 L60 25 L60 75 L45 75 Z" fill="#FFC107" />
      <path d="M60 25 L65 20 L65 70 L60 75 Z" fill="#FFA000" />
      <path d="M45 25 L50 20 L65 20 L60 25 Z" fill="#FFD54F" />
      
      {/* Bar 3 (Right) */}
      <path d="M70 55 L85 55 L85 75 L70 75 Z" fill="#E91E63" />
      <path d="M85 55 L90 50 L90 70 L85 75 Z" fill="#C2185B" />
      <path d="M70 55 L75 50 L90 50 L85 55 Z" fill="#F06292" />
    </g>
  </svg>
);

export const IconFlame3D = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Flame Base */}
      <path d="M50 90 C 20 90 20 50 50 10 C 80 50 80 90 50 90 Z" fill="#FF3D00" />
      <path d="M50 90 C 20 90 20 50 50 10 C 80 50 80 90 50 90 Z" fill="url(#flameGrad1)" />
      {/* Inner Flame */}
      <path d="M50 85 C 30 85 35 60 50 30 C 65 60 70 85 50 85 Z" fill="#FFEA00" />
      {/* Highlight */}
      <path d="M40 75 C 35 75 35 60 45 45 C 40 60 45 75 40 75 Z" fill="#FFFFFF" opacity="0.5" />
      <defs>
        <linearGradient id="flameGrad1" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9100" />
          <stop offset="1" stopColor="#DD2C00" />
        </linearGradient>
      </defs>
    </g>
  </svg>
);

export const IconHeart3D = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* 3D Edge */}
      <path d="M50 85 L15 50 A 25 25 0 0 1 50 25 A 25 25 0 0 1 85 50 Z" fill="#C51162" />
      <path d="M50 90 L15 55 A 25 25 0 0 1 50 30 A 25 25 0 0 1 85 55 Z" fill="#F50057" />
      {/* Highlight */}
      <path d="M25 40 A 10 10 0 0 1 40 35" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);
