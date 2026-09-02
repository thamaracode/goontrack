'use client';

import React from 'react';
import { TabType } from '../../types/tracker';

interface NavIconProps {
  tab: TabType;
  isActive: boolean;
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ tab, isActive, className = 'w-5 h-5' }) => {
  switch (tab) {
    case 'home':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-goon-muted'}`}
        >
          <path
            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15C14.4477 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13H11C10.4477 13 10 13.4477 10 14V20C10 20.5523 9.55228 21 9 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.2 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="8.5" r="1.5" fill={isActive ? 'currentColor' : '#A1A1AA'} />
        </svg>
      );

    case 'calendar':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-goon-muted'}`}
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="4"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.15 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="17.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="17.5" r="1.5" fill={isActive ? '#FACC15' : 'currentColor'} stroke="none" />
          <circle cx="16" cy="17.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'analytics':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-pink drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]' : 'text-goon-muted'}`}
        >
          <rect
            x="3"
            y="13"
            width="4"
            height="8"
            rx="1.5"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.3 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect
            x="10"
            y="7"
            width="4"
            height="14"
            rx="1.5"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.4 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect
            x="17"
            y="3"
            width="4"
            height="18"
            rx="1.5"
            fill={isActive ? '#FACC15' : 'currentColor'}
            fillOpacity={isActive ? 0.8 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M3 9L9 5L15 9L21 3"
            stroke={isActive ? '#FACC15' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'records':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-goon-muted'}`}
        >
          <path
            d="M8 21H16M12 17V21M17 4H7C5.89543 4 5 4.89543 5 6V8C5 11.3137 7.68629 14 11 14H13C16.3137 14 19 11.3137 19 8V6C19 4.89543 18.1046 4 17 4Z"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.2 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 7H3C2.44772 7 2 7.44772 2 8C2 10.2091 3.79086 12 6 12H7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M19 7H21C21.5523 7 22 7.44772 22 8C22 10.2091 20.2091 12 18 12H17"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <polygon
            points="12,6 13,8.5 15.5,8.5 13.5,10 14.5,12.5 12,11 9.5,12.5 10.5,10 8.5,8.5 11,8.5"
            fill={isActive ? '#FACC15' : 'currentColor'}
            stroke="none"
          />
        </svg>
      );

    case 'achievements':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-purpleLight drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]' : 'text-goon-muted'}`}
        >
          <circle
            cx="12"
            cy="9"
            r="6"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.25 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8.21 13.89L7 22L12 19L17 22L15.79 13.88"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="12,6.5 13,8.5 15,8.5 13.5,10 14,12 12,10.8 10,12 10.5,10 9,8.5 11,8.5"
            fill={isActive ? '#F472B6' : 'currentColor'}
            stroke="none"
          />
        </svg>
      );

    case 'recap':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-green drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-goon-muted'}`}
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="18"
            rx="3"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.15 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 2H15C15.5523 2 16 2.44772 16 3V4C16 4.55228 15.5523 5 15 5H9C8.44772 5 8 4.55228 8 4V3C8 2.44772 8.44772 2 9 2Z"
            fill="currentColor"
            fillOpacity={0.4}
            strokeWidth="2"
          />
          <line x1="8" y1="9" x2="16" y2="9" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="13" x2="16" y2="13" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="17" x2="12" y2="17" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="15.5" cy="17" r="1.5" fill={isActive ? '#FACC15' : 'currentColor'} stroke="none" />
        </svg>
      );

    case 'history':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-goon-muted'}`}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.15 : 0}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <polyline
            points="12,7 12,12 15.5,14"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.3375 4.30397 18.9959 6.34778"
            stroke={isActive ? '#FACC15' : 'currentColor'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <polyline
            points="19,3 19,6.5 15.5,6.5"
            stroke={isActive ? '#FACC15' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'settings':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${className} ${isActive ? 'text-goon-coral drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]' : 'text-goon-muted'}`}
        >
          <circle
            cx="12"
            cy="12"
            r="3.2"
            fill={isActive ? 'currentColor' : 'none'}
            fillOpacity={isActive ? 0.3 : 0}
            strokeWidth="2.2"
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
};
