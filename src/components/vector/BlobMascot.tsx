'use client';

import React, { useState } from 'react';
import { MascotMoodState } from '../../lib/mascot';
import { arcadeSound } from '../../lib/audio';

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
      {/* Playful Speech Bubble */}
      {speechQuote && (
        <div className="mb-3 px-4 py-2 rounded-2xl bg-goon-surfaceLight border-2 border-goon-purple/40 text-goon-text text-xs md:text-sm font-bold shadow-chunky-purple max-w-xs text-center relative animate-bounce-soft">
          <span>“{speechQuote}”</span>
          {/* Speech bubble pointer */}
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
          {/* Ambient Glow */}
          <ellipse cx="100" cy="180" rx="60" ry="12" fill="#0A0614" opacity="0.6" />

          {/* Main Blob Body */}
          <path
            d="M50,150 C20,130 20,80 50,50 C80,20 120,20 150,50 C180,80 180,130 150,150 C120,175 80,175 50,150 Z"
            fill="url(#mascotGradient)"
            stroke="#100B1F"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* Belly Highlight / Organic Blob Detail */}
          <path
            d="M65,135 C50,115 50,85 70,65 C90,45 110,45 130,65 C150,85 150,115 135,135 C115,150 85,150 65,135 Z"
            fill="#A78BFA"
            opacity="0.35"
          />

          {/* Tiny Arms */}
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

          {/* Expressions Morphing based on State */}
          {state === 'FIRE' ? (
            /* Flame Eyes & Confident Grin */
            <g>
              {/* Flame Eyebrows */}
              <path d="M60,65 Q75,55 90,68" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
              <path d="M140,65 Q125,55 110,68" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
              {/* Eyes with fire glow */}
              <circle cx="75" cy="85" r="14" fill="#FACC15" stroke="#100B1F" strokeWidth="5" />
              <circle cx="125" cy="85" r="14" fill="#FACC15" stroke="#100B1F" strokeWidth="5" />
              <circle cx="78" cy="83" r="5" fill="#100B1F" />
              <circle cx="128" cy="83" r="5" fill="#100B1F" />
              {/* Happy Open Grin */}
              <path d="M80,112 Q100,135 120,112 Z" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
            </g>
          ) : state === 'COOL' ? (
            /* Cool Sunglasses */
            <g>
              {/* Sunglasses frame */}
              <path
                d="M52,75 L95,75 C95,95 60,95 55,85 Z"
                fill="#100B1F"
                stroke="#FACC15"
                strokeWidth="4"
              />
              <path
                d="M148,75 L105,75 C105,95 140,95 145,85 Z"
                fill="#100B1F"
                stroke="#FACC15"
                strokeWidth="4"
              />
              <line x1="95" y1="78" x2="105" y2="78" stroke="#FACC15" strokeWidth="4" />
              {/* Smirk */}
              <path d="M85,115 Q105,122 120,110" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : state === 'MIND_BLOWN' ? (
            /* Mind Blown Star Eyes & Big Gasp Mouth */
            <g>
              {/* Star Eyes */}
              <text x="60" y="98" fontSize="28" fill="#FACC15">★</text>
              <text x="112" y="98" fontSize="28" fill="#FACC15">★</text>
              {/* Big O Mouth */}
              <ellipse cx="100" cy="120" rx="14" ry="18" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
            </g>
          ) : state === 'MELTING' ? (
            /* Melting / Dazed Spirals */
            <g>
              <ellipse cx="75" cy="85" rx="14" ry="8" fill="#22D3EE" stroke="#100B1F" strokeWidth="5" />
              <ellipse cx="125" cy="85" rx="14" ry="8" fill="#22D3EE" stroke="#100B1F" strokeWidth="5" />
              {/* Wobbly wavy mouth */}
              <path d="M75,115 Q85,108 95,118 T115,112 T125,118" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : state === 'SKULL' ? (
            /* X Eyes & Droopy Mouth */
            <g>
              {/* X Eyes */}
              <path d="M65,75 L85,95 M85,75 L65,95" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
              <path d="M115,75 L135,95 M135,75 L115,95" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
              {/* Droopy line mouth */}
              <path d="M80,122 Q100,112 120,122" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Default Friendly Happy Eyes */
            <g>
              <ellipse cx="75" cy="85" rx="12" ry="16" fill="#F8FAFC" stroke="#100B1F" strokeWidth="5" />
              <ellipse cx="125" cy="85" rx="12" ry="16" fill="#F8FAFC" stroke="#100B1F" strokeWidth="5" />
              {/* Pupils */}
              <circle cx="78" cy="85" r="7" fill="#100B1F" />
              <circle cx="128" cy="85" r="7" fill="#100B1F" />
              {/* Pupil Highlights */}
              <circle cx="81" cy="81" r="3" fill="#FFFFFF" />
              <circle cx="131" cy="81" r="3" fill="#FFFFFF" />
              {/* Cute Smile */}
              <path d="M82,112 Q100,128 118,112" stroke="#100B1F" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Rosy Blushing Cheeks */}
          <circle cx="55" cy="102" r="10" fill="#F472B6" opacity="0.6" />
          <circle cx="145" cy="102" r="10" fill="#F472B6" opacity="0.6" />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="mascotGradient" x1="50" y1="30" x2="150" y2="170" gradientUnits="userSpaceOnUse">
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
