'use client';

import React, { useState } from 'react';
import { getDailyTransmission, DailyTransmission } from '../../lib/quotes';
import { BlobMascot } from '../vector/BlobMascot';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

export const DailyTransmissionCard: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const transmission: DailyTransmission = getDailyTransmission(new Date(), offset);

  const todayStr = new Date().toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const handleReroll = () => {
    arcadeSound.playPop(850);
    haptics.tap();
    setOffset((prev) => prev + 1);
  };

  const categoryBadgeColors = {
    MOTIVATION: 'bg-goon-yellow/10 border-goon-yellow/40 text-goon-yellow',
    DISCIPLINE: 'bg-goon-purple/10 border-goon-purple/40 text-goon-purpleLight',
    CHAOTIC: 'bg-goon-coral/10 border-goon-coral/40 text-goon-coral',
    DARK_HUMOR: 'bg-slate-800 border-goon-surfaceBorder text-goon-muted',
    STOIC: 'bg-goon-cyan/10 border-goon-cyan/40 text-goon-cyan',
    FUNNY: 'bg-goon-pink/10 border-goon-pink/40 text-goon-pink',
    LATE_NIGHT: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300',
    ACHIEVEMENT: 'bg-goon-green/10 border-goon-green/40 text-goon-green',
  };

  return (
    <div className="rounded-3xl bg-goon-surface border-2 border-goon-purple/40 p-5 shadow-chunky-purple relative overflow-hidden group select-none">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-goon-purple/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-goon-yellow tracking-wider uppercase flex items-center gap-1.5">
            <span>✦</span>
            <span>DAILY TRANSMISSION</span>
          </span>
          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
              categoryBadgeColors[transmission.category] || 'border-goon-surfaceBorder'
            }`}
          >
            {transmission.emoji} {transmission.categoryLabel}
          </span>
        </div>

        <button
          onClick={handleReroll}
          title="Reroll Transmission"
          className="p-1 rounded-lg text-goon-muted hover:text-goon-yellow hover:bg-goon-surfaceLight transition-all text-xs flex items-center gap-1 font-bold"
        >
          <span>🎲</span>
          <span className="text-[10px] hidden sm:inline">REROLL</span>
        </button>
      </div>

      {/* Main Content Layout (Quote + Side Mascot) */}
      <div className="flex items-center justify-between gap-4">
        {/* Quote text & Author */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-extrabold text-goon-text italic leading-snug tracking-tight">
            “{transmission.quote}”
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-bold text-goon-muted">
            <span className="text-goon-cyan font-black">— {transmission.author}</span>
            <span>•</span>
            <span>{todayStr}</span>
          </div>
        </div>

        {/* Side Reactive Mascot Vector */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <BlobMascot state={transmission.mascotPose} size="sm" speechQuote="" />
        </div>
      </div>
    </div>
  );
};
