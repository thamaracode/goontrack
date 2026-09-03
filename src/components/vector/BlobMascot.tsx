'use client';

import React, { useState } from 'react';
import { MascotState } from '../../lib/mascot';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface BlobMascotProps {
  state?: MascotState;
  quote?: string;
  speechQuote?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const BlobMascot: React.FC<BlobMascotProps> = ({
  state = 'NORMAL',
  quote,
  speechQuote,
  size = 'md',
  interactive = true,
}) => {
  const displayQuote = quote || speechQuote;
  const [isDarting, setIsDarting] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(0);

  const handleTap = () => {
    if (!interactive) return;
    arcadeSound.playPop(850 + Math.random() * 150);
    haptics.tap();
    setIsDarting(true);
    setBubbleCount((c) => c + 1);
    setTimeout(() => setIsDarting(false), 600);
  };

  const dimClass =
    size === 'sm'
      ? 'w-16 h-16'
      : size === 'lg'
      ? 'w-48 h-48 md:w-56 md:h-56'
      : 'w-36 h-36 md:w-44 md:h-44';

  const isTurbo = state === 'STREAKING' || state === 'RECORD';
  const isDead = state === 'DEAD';

  return (
    <div className="flex flex-col items-center justify-center select-none relative group">
      {/* Interactive Speech Bubble */}
      {displayQuote && (
        <div className="mb-3 px-4 py-2 rounded-2xl bg-goon-surfaceLight border-2 border-goon-purple/40 text-goon-text text-xs font-bold shadow-chunky-purple max-w-xs text-center animate-bounce-soft relative z-20">
          <span className="text-goon-yellow font-black mr-1">“</span>
          <span>{displayQuote}</span>
          <span className="text-goon-yellow font-black ml-1">”</span>
          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-goon-purple/60" />
        </div>
      )}

      {/* The Swimmer Vector Canvas */}
      <div
        onClick={handleTap}
        className={`relative ${dimClass} transition-all duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${isDarting ? 'translate-x-4 -translate-y-2' : ''}`}
        title="The Swimmer — Tap to swim!"
      >
        {/* Swimmer Bubble Trail on Dart */}
        {isDarting && (
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none animate-ping">
            <span className="w-2 h-2 rounded-full bg-goon-yellow/80" />
            <span className="w-3 h-3 rounded-full bg-goon-cyan/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-goon-purple/80" />
          </div>
        )}

        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full drop-shadow-[0_12px_24px_rgba(245,158,11,0.25)] ${
            isDead ? 'rotate-90 opacity-80' : 'animate-swimmer-bob'
          }`}
        >
          {/* Drop shadow underneath */}
          <ellipse cx="100" cy="180" rx="55" ry="10" fill="#040D12" opacity="0.6" />

          {/* Gradients */}
          <defs>
            <linearGradient id="swimmerBodyGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="75%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>

            <linearGradient id="swimmerShineGrad" x1="80" y1="40" x2="160" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* 🧬 Wiggling Swimmer Tail */}
          <g className={isTurbo ? 'animate-swimmer-turbo-tail' : 'animate-swimmer-tail'}>
            <path
              d="M 95,95 C 65,115 45,95 28,125 C 18,142 22,156 14,168 C 10,174 6,178 2,182 C 10,172 20,162 26,148 C 42,112 68,135 90,108 Z"
              fill="url(#swimmerBodyGrad)"
              stroke="#07151D"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Inner tail fluid sheen */}
            <path
              d="M 85,98 C 60,115 45,102 32,126 C 24,138 25,148 18,158 C 22,150 28,140 33,132 C 45,110 65,124 82,106 Z"
              fill="#FDE047"
              opacity="0.45"
            />
          </g>

          {/* 🧬 Rounded Head Cell Body */}
          <path
            d="M 90,55 C 105,35 145,35 165,55 C 185,75 185,115 165,135 C 145,155 105,155 90,135 C 75,115 75,75 90,55 Z"
            fill="url(#swimmerBodyGrad)"
            stroke="#07151D"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Head Specular Highlight Glint */}
          <path
            d="M 105,52 C 120,40 148,40 160,52 C 168,60 170,72 165,82 C 158,68 142,55 125,52 C 115,50 108,50 105,52 Z"
            fill="url(#swimmerShineGrad)"
          />

          {/* Tiny cute fin / arm */}
          <path
            d="M 135,138 C 130,152 142,155 148,145 Z"
            fill="#EA580C"
            stroke="#07151D"
            strokeWidth="4"
          />

          {/* Expressions & Accessories */}
          {state === 'STREAKING' ? (
            /* 🔥 Flame Hair & Star Eyes */
            <g>
              {/* Flame Crown */}
              <path
                d="M 115,40 Q 120,15 130,28 Q 140,8 148,25 Q 158,12 160,38 Z"
                fill="url(#flameGrad)"
                stroke="#07151D"
                strokeWidth="4"
              />
              {/* Star Eyes */}
              <polygon
                points="120,80 123,88 131,88 125,93 127,101 120,96 113,101 115,93 109,88 117,88"
                fill="#07151D"
              />
              <polygon
                points="155,80 158,88 166,88 160,93 162,101 155,96 148,101 150,93 144,88 152,88"
                fill="#07151D"
              />
              {/* Determined Open Grin */}
              <path
                d="M 125,112 Q 138,128 150,112 Z"
                fill="#07151D"
                stroke="#07151D"
                strokeWidth="3"
              />
              <path d="M 130,115 Q 138,122 145,115 Z" fill="#F43F5E" />
              {/* Cheek Blush */}
              <circle cx="108" cy="105" r="7" fill="#F43F5E" opacity="0.6" />
              <circle cx="168" cy="105" r="7" fill="#F43F5E" opacity="0.6" />
            </g>
          ) : state === 'COOL' ? (
            /* 😎 Sunglasses & Smirk */
            <g>
              <path
                d="M 105,78 L 132,78 C 132,95 108,95 106,86 Z"
                fill="#07151D"
                stroke="#FDE047"
                strokeWidth="3"
              />
              <path
                d="M 142,78 L 168,78 C 168,95 144,95 142,86 Z"
                fill="#07151D"
                stroke="#FDE047"
                strokeWidth="3"
              />
              <line x1="132" y1="80" x2="142" y2="80" stroke="#FDE047" strokeWidth="3" />
              <line x1="110" y1="82" x2="120" y2="90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="146" y1="82" x2="156" y2="90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              {/* Smirk */}
              <path d="M 128,112 Q 142,120 152,108" stroke="#07151D" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          ) : state === 'RECORD' ? (
            /* 👑 Royal Crown & Gleaming Eyes */
            <g>
              <path
                d="M 118,42 L 126,22 L 138,34 L 150,20 L 158,40 Z"
                fill="#FDE047"
                stroke="#07151D"
                strokeWidth="4"
              />
              <circle cx="126" cy="22" r="3" fill="#EA580C" />
              <circle cx="150" cy="20" r="3" fill="#EA580C" />
              {/* Cute Shiny Eyes */}
              <circle cx="122" cy="85" r="11" fill="#07151D" />
              <circle cx="125" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="119" cy="88" r="2" fill="#FFFFFF" />

              <circle cx="154" cy="85" r="11" fill="#07151D" />
              <circle cx="157" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="151" cy="88" r="2" fill="#FFFFFF" />

              <path d="M 128,110 Q 138,124 148,110 Z" fill="#07151D" />
            </g>
          ) : state === 'DEAD' ? (
            /* 💀 X X Eyes */
            <g>
              <line x1="115" y1="78" x2="128" y2="92" stroke="#07151D" strokeWidth="5" strokeLinecap="round" />
              <line x1="128" y1="78" x2="115" y2="92" stroke="#07151D" strokeWidth="5" strokeLinecap="round" />

              <line x1="148" y1="78" x2="161" y2="92" stroke="#07151D" strokeWidth="5" strokeLinecap="round" />
              <line x1="161" y1="78" x2="148" y2="92" stroke="#07151D" strokeWidth="5" strokeLinecap="round" />

              <ellipse cx="138" cy="115" rx="7" ry="9" fill="#07151D" />
              <path d="M 138,118 Q 142,130 148,124" stroke="#F43F5E" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          ) : state === 'NIGHT' ? (
            /* 🌙 Sleepy Nightcap */
            <g>
              <path
                d="M 120,45 C 130,20 170,15 182,30 C 190,40 188,60 175,65 Z"
                fill="#0284C7"
                stroke="#07151D"
                strokeWidth="4"
              />
              <circle cx="185" cy="30" r="6" fill="#FDE047" stroke="#07151D" strokeWidth="3" />
              {/* Closed Sleepy Eyes */}
              <path d="M 115,88 Q 123,94 130,88" stroke="#07151D" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 146,88 Q 154,94 162,88" stroke="#07151D" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Tiny Snooze */}
              <circle cx="138" cy="108" r="3" fill="#07151D" />
            </g>
          ) : (
            /* 🟢 NORMAL: Big Shiny Anime Cell Eyes & Smile */
            <g>
              <circle cx="122" cy="85" r="11" fill="#07151D" />
              <circle cx="125" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="119" cy="88" r="2" fill="#FFFFFF" />

              <circle cx="154" cy="85" r="11" fill="#07151D" />
              <circle cx="157" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="151" cy="88" r="2" fill="#FFFFFF" />

              {/* Rosy Blush */}
              <circle cx="108" cy="100" r="7" fill="#EA580C" opacity="0.4" />
              <circle cx="168" cy="100" r="7" fill="#EA580C" opacity="0.4" />

              {/* Happy Open Smile */}
              <path d="M 128,106 Q 138,120 148,106 Z" fill="#07151D" />
              <path d="M 132,108 Q 138,114 144,108 Z" fill="#F43F5E" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
