'use client';

import React, { useState } from 'react';
import { MascotMoodState } from '../../lib/mascot';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface BlobMascotProps {
  state: MascotMoodState;
  speechQuote?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BlobMascot: React.FC<BlobMascotProps> = ({
  state,
  speechQuote = "You're absolutely committed to the bit.",
  size = 'md',
}) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    arcadeSound.playMascotSqueak();
    haptics.tap();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);
  };

  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36 md:w-44 md:h-44',
    lg: 'w-48 h-48 md:w-56 md:h-56',
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Speech Bubble */}
      {speechQuote && (
        <div className="mb-3 px-4 py-2 rounded-2xl bg-goon-surfaceLight border-2 border-goon-purple/40 text-goon-text text-xs md:text-sm font-bold shadow-chunky-purple max-w-xs text-center relative animate-bounce-soft">
          <span>“{speechQuote}”</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-goon-surfaceLight" />
        </div>
      )}

      {/* Vector Blob Mascot Character */}
      <div
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform duration-200 ${dimensions[size]} ${
          isBouncing ? 'scale-110 animate-wiggle' : 'hover:scale-105'
        }`}
        title="Tap Blobby!"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,92,246,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient Ground Shadow */}
          <ellipse cx="100" cy="180" rx="60" ry="12" fill="#0A0614" opacity="0.6" />

          {/* Main Blob Body */}
          <path
            d="M50,150 C20,130 20,80 50,50 C80,20 120,20 150,50 C180,80 180,130 150,150 C120,175 80,175 50,150 Z"
            fill="url(#mascotGradientV2)"
            stroke="#100B1F"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* Belly Highlight */}
          <path
            d="M65,135 C50,115 50,85 70,65 C90,45 110,45 130,65 C150,85 150,115 135,135 C115,150 85,150 65,135 Z"
            fill="#A78BFA"
            opacity="0.35"
          />

          {/* Arms */}
          <path
            d="M28,110 C15,115 15,125 25,130 C35,135 40,125 35,115 Z"
            fill="#8B5CF6"
            stroke="#100B1F"
            strokeWidth="6"
          />
          <path
            d="M172,110 C185,115 185,125 175,130 C165,135 160,125 165,115 Z"
            fill="#8B5CF6"
            stroke="#100B1F"
            strokeWidth="6"
          />

          {/* Dynamic Accessories & Expressions */}
          {state === 'NIGHT' ? (
            /* Night Owl Sleeping Cap & Cozy Closed Eyes */
            <g>
              {/* Sleeping Nightcap */}
              <path d="M50,45 Q100,10 150,45 Q120,15 170,30 L160,45 Z" fill="#22D3EE" stroke="#100B1F" strokeWidth="5" />
              <circle cx="170" cy="30" r="8" fill="#FACC15" stroke="#100B1F" strokeWidth="3" />
              {/* Sleepy Moon curve eyes */}
              <path d="M65,90 Q75,100 85,90" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M115,90 Q125,100 135,90" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Little sleepy snore Z */}
              <text x="145" y="65" fontSize="16" fontWeight="bold" fill="#FACC15">Z</text>
              <text x="160" y="52" fontSize="12" fontWeight="bold" fill="#FACC15">z</text>
              {/* Cute tiny mouth */}
              <ellipse cx="100" cy="115" rx="5" ry="6" fill="#F472B6" stroke="#100B1F" strokeWidth="4" />
            </g>
          ) : state === 'STREAKING' ? (
            /* Flame Crown & Fire Eyes */
            <g>
              {/* Mini Flame Crown */}
              <path d="M80,30 L90,15 L100,28 L110,12 L120,30 Z" fill="#FACC15" stroke="#100B1F" strokeWidth="4" />
              <circle cx="75" cy="85" r="14" fill="#FACC15" stroke="#100B1F" strokeWidth="5" />
              <circle cx="125" cy="85" r="14" fill="#FACC15" stroke="#100B1F" strokeWidth="5" />
              <circle cx="78" cy="83" r="5" fill="#100B1F" />
              <circle cx="128" cy="83" r="5" fill="#100B1F" />
              <path d="M80,112 Q100,135 120,112 Z" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
            </g>
          ) : state === 'COOL' ? (
            /* Cool Sunglasses & Smirk */
            <g>
              <path d="M52,75 L95,75 C95,95 60,95 55,85 Z" fill="#100B1F" stroke="#FACC15" strokeWidth="4" />
              <path d="M148,75 L105,75 C105,95 140,95 145,85 Z" fill="#100B1F" stroke="#FACC15" strokeWidth="4" />
              <line x1="95" y1="78" x2="105" y2="78" stroke="#FACC15" strokeWidth="4" />
              <path d="M85,115 Q105,122 120,110" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : state === 'RECORD' ? (
            /* Star Eyes & Big Gasp */
            <g>
              <text x="60" y="98" fontSize="28" fill="#FACC15">★</text>
              <text x="112" y="98" fontSize="28" fill="#FACC15">★</text>
              <ellipse cx="100" cy="120" rx="14" ry="18" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
            </g>
          ) : state === 'MELTING' ? (
            /* Melting Dazed Eyes & Wavy Mouth */
            <g>
              <ellipse cx="75" cy="85" rx="14" ry="8" fill="#22D3EE" stroke="#100B1F" strokeWidth="5" />
              <ellipse cx="125" cy="85" rx="14" ry="8" fill="#22D3EE" stroke="#100B1F" strokeWidth="5" />
              <path d="M75,115 Q85,108 95,118 T115,112 T125,118" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : state === 'LOST' ? (
            /* X Eyes & Droopy Mouth */
            <g>
              <path d="M65,75 L85,95 M85,75 L65,95" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
              <path d="M115,75 L135,95 M135,75 L115,95" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
              <path d="M80,122 Q100,112 120,122" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Default Friendly Smile */
            <g>
              <ellipse cx="75" cy="85" rx="12" ry="16" fill="#F8FAFC" stroke="#100B1F" strokeWidth="5" />
              <ellipse cx="125" cy="85" rx="12" ry="16" fill="#F8FAFC" stroke="#100B1F" strokeWidth="5" />
              <circle cx="78" cy="85" r="7" fill="#100B1F" />
              <circle cx="128" cy="85" r="7" fill="#100B1F" />
              <circle cx="81" cy="81" r="3" fill="#FFFFFF" />
              <circle cx="131" cy="81" r="3" fill="#FFFFFF" />
              <path d="M82,112 Q100,128 118,112" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <circle cx="55" cy="102" r="10" fill="#F472B6" opacity="0.6" />
          <circle cx="145" cy="102" r="10" fill="#F472B6" opacity="0.6" />

          {/* Gradient */}
          <defs>
            <linearGradient id="mascotGradientV2" x1="50" y1="30" x2="150" y2="170" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
