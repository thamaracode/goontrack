'use client';

import React from 'react';
import { AchievementBadgeKey } from '../../types/tracker';

interface VectorBadgeProps {
  badgeKey: AchievementBadgeKey;
  unlocked: boolean;
  className?: string;
}

export const VectorBadge: React.FC<VectorBadgeProps> = ({
  badgeKey,
  unlocked,
  className = 'w-16 h-16',
}) => {
  const filterStyle = unlocked ? '' : 'filter grayscale opacity-40 contrast-75';

  return (
    <div className={`relative flex items-center justify-center ${className} ${filterStyle} select-none`}>
      {badgeKey === 'first_blood' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#8B5CF6" stroke="#100B1F" strokeWidth="6" />
          <polygon points="52,18 32,52 48,52 44,82 68,44 52,44" fill="#FACC15" stroke="#100B1F" strokeWidth="4" />
        </svg>
      )}

      {badgeKey === 'streak_7' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 88,32 88,78 50,96 12,78 12,32" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
          <path d="M50,22 C62,38 72,55 64,74 C58,82 42,82 36,74 C28,55 42,42 50,22 Z" fill="#FACC15" stroke="#100B1F" strokeWidth="4" />
          <path d="M50,42 C56,52 60,62 56,72 C52,76 46,76 44,72 C40,62 46,55 50,42 Z" fill="#FB7185" />
        </svg>
      )}

      {badgeKey === 'night_owl' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#1A1230" stroke="#8B5CF6" strokeWidth="6" />
          <path d="M58,22 C42,26 34,42 38,58 C42,74 58,82 72,74 C58,80 44,70 42,56 C40,42 48,28 58,22 Z" fill="#FACC15" stroke="#100B1F" strokeWidth="4" />
          <circle cx="68" cy="30" r="3" fill="#F472B6" />
          <circle cx="30" cy="35" r="2" fill="#22D3EE" />
          <circle cx="28" cy="65" r="3" fill="#34D399" />
        </svg>
      )}

      {badgeKey === 'early_bird' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#FACC15" stroke="#100B1F" strokeWidth="6" />
          <circle cx="50" cy="50" r="24" fill="#FF5A78" stroke="#100B1F" strokeWidth="4" />
          <line x1="50" y1="14" x2="50" y2="22" stroke="#100B1F" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="78" x2="50" y2="86" stroke="#100B1F" strokeWidth="4" strokeLinecap="round" />
          <line x1="14" y1="50" x2="22" y2="50" stroke="#100B1F" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="50" x2="86" y2="50" stroke="#100B1F" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}

      {badgeKey === 'century' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="15" y="15" width="70" height="70" rx="18" fill="#FACC15" stroke="#100B1F" strokeWidth="6" />
          <path d="M30,35 L70,35 L62,60 C60,68 40,68 38,60 Z" fill="#F8FAFC" stroke="#100B1F" strokeWidth="4" />
          <rect x="44" y="65" width="12" height="12" fill="#8B5CF6" stroke="#100B1F" strokeWidth="4" />
          <rect x="34" y="77" width="32" height="8" rx="3" fill="#100B1F" />
          <text x="50" y="52" fontSize="16" fontWeight="900" textAnchor="middle" fill="#8B5CF6">100</text>
        </svg>
      )}

      {badgeKey === 'the_machine' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="20" width="60" height="60" rx="14" fill="#6366F1" stroke="#100B1F" strokeWidth="6" />
          <rect x="30" y="32" width="12" height="12" rx="3" fill="#22D3EE" stroke="#100B1F" strokeWidth="3" />
          <rect x="58" y="32" width="12" height="12" rx="3" fill="#22D3EE" stroke="#100B1F" strokeWidth="3" />
          <line x1="36" y1="62" x2="64" y2="62" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
          <line x1="50" y1="10" x2="50" y2="20" stroke="#100B1F" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="10" r="4" fill="#FF5A78" />
        </svg>
      )}

      {badgeKey === 'absolute_unit' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#121212" stroke="#FF007F" strokeWidth="6" />
          <ellipse cx="50" cy="46" rx="20" ry="18" fill="#F8FAFC" stroke="#100B1F" strokeWidth="4" />
          <circle cx="42" cy="46" r="5" fill="#100B1F" />
          <circle cx="58" cy="46" r="5" fill="#100B1F" />
          <rect x="44" y="62" width="12" height="10" rx="2" fill="#F8FAFC" stroke="#100B1F" strokeWidth="3" />
        </svg>
      )}

      {badgeKey === 'marathon' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#22D3EE" stroke="#100B1F" strokeWidth="6" />
          <rect x="46" y="18" width="8" height="10" fill="#100B1F" rx="2" />
          <circle cx="50" cy="54" r="28" fill="#F8FAFC" stroke="#100B1F" strokeWidth="5" />
          <line x1="50" y1="54" x2="50" y2="36" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="54" x2="64" y2="54" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="54" r="4" fill="#100B1F" />
        </svg>
      )}

      {badgeKey === 'consistent_30' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#F472B6" stroke="#100B1F" strokeWidth="6" />
          <path d="M22,65 L32,32 L44,48 L50,26 L56,48 L68,32 L78,65 Z" fill="#FACC15" stroke="#100B1F" strokeWidth="5" />
          <circle cx="50" cy="24" r="5" fill="#34D399" stroke="#100B1F" strokeWidth="3" />
          <circle cx="32" cy="30" r="4" fill="#8B5CF6" stroke="#100B1F" strokeWidth="3" />
          <circle cx="68" cy="30" r="4" fill="#8B5CF6" stroke="#100B1F" strokeWidth="3" />
        </svg>
      )}

      {badgeKey === 'zen_master' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#34D399" stroke="#100B1F" strokeWidth="6" />
          <path d="M30,55 Q50,25 70,55 Q50,85 30,55 Z" fill="#8B5CF6" stroke="#100B1F" strokeWidth="4" />
          <circle cx="50" cy="55" r="8" fill="#FACC15" stroke="#100B1F" strokeWidth="3" />
        </svg>
      )}

      {badgeKey === 'hyperdrive' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#FB7185" stroke="#100B1F" strokeWidth="6" />
          <path d="M50,18 C62,32 64,52 64,68 L36,68 C36,52 38,32 50,18 Z" fill="#F8FAFC" stroke="#100B1F" strokeWidth="4" />
          <polygon points="36,52 24,68 36,68" fill="#FACC15" stroke="#100B1F" strokeWidth="3" />
          <polygon points="64,52 76,68 64,68" fill="#FACC15" stroke="#100B1F" strokeWidth="3" />
          <circle cx="50" cy="40" r="6" fill="#22D3EE" stroke="#100B1F" strokeWidth="3" />
          <polygon points="44,68 50,82 56,68" fill="#FACC15" stroke="#100B1F" strokeWidth="3" />
        </svg>
      )}
    </div>
  );
};
