'use client';

import React, { useState } from 'react';
import { computeCosmicTime } from '../../lib/timeScale';
import { ChunkyCard } from './ChunkyCard';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface CosmicTimeCardProps {
  totalMinutes: number;
}

export const CosmicTimeCard: React.FC<CosmicTimeCardProps> = ({ totalMinutes }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const cosmic = computeCosmicTime(totalMinutes);

  const units = [
    { label: 'Milliseconds', value: cosmic.milliseconds, emoji: '⚡', color: 'text-goon-yellow', desc: 'Atomic clock precision' },
    { label: 'Seconds', value: cosmic.seconds, emoji: '⏱️', color: 'text-goon-cyan', desc: 'Raw elapsed seconds' },
    { label: 'Minutes', value: cosmic.minutes, emoji: '⏳', color: 'text-goon-pink', desc: 'Standard habit units' },
    { label: 'Solar Hours', value: cosmic.hours, emoji: '🕐', color: 'text-goon-purpleLight', desc: 'Earth rotation fraction' },
    { label: 'Days', value: cosmic.days, emoji: '📅', color: 'text-goon-green', desc: 'Full planetary cycles' },
    { label: 'Lunar Months', value: cosmic.lunarMonths, emoji: '🌖', color: 'text-indigo-300', desc: 'Synodic moon periods' },
    { label: 'Solar Years', value: cosmic.solarYears, emoji: '☀️', color: 'text-amber-400', desc: 'Earth orbit around Sun' },
    { label: 'Decades', value: cosmic.decades, emoji: '🏛️', color: 'text-rose-400', desc: 'Ten-year epochs' },
    { label: 'Centuries', value: cosmic.centuries, emoji: '👑', color: 'text-fuchsia-400', desc: '100-year historical span' },
    { label: 'Millennia', value: cosmic.millennia, emoji: '🪐', color: 'text-violet-400', desc: '1,000-year civilizational span' },
    { label: 'Galactic Years', value: cosmic.galacticYears, emoji: '🌌', color: 'text-sky-300', desc: 'Milky Way rotation scale (230M yrs)' },
  ];

  return (
    <ChunkyCard shadowColor="purple" borderColor="purple" className="relative overflow-hidden select-none">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-goon-purple/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-sm font-black text-goon-text uppercase tracking-wider flex items-center gap-1.5">
            <span>🌌</span>
            <span>COSMIC TIME MATRIX (MS TO CENTURIES)</span>
          </h3>
          <p className="text-[11px] font-bold text-goon-muted">
            All-time telemetry converted into universal physics time scales
          </p>
        </div>
        <span className="text-xs font-bold text-goon-yellow px-2.5 py-1 rounded-xl bg-goon-surfaceLight border border-goon-surfaceBorder">
          {totalMinutes} mins total
        </span>
      </div>

      {/* Grid of Cosmic Units */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 relative z-10">
        {units.map((u) => (
          <div
            key={u.label}
            onClick={() => {
              arcadeSound.playPop(700);
              haptics.tap();
            }}
            className="p-3 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder hover:border-goon-purple/60 hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-goon-muted uppercase tracking-wider">{u.label}</span>
              <span className="text-base">{u.emoji}</span>
            </div>
            <div className={`text-xs sm:text-sm font-black ${u.color} truncate`} title={u.value}>
              {u.value}
            </div>
            <div className="text-[9px] font-bold text-goon-muted mt-0.5 opacity-80 group-hover:opacity-100">
              {u.desc}
            </div>
          </div>
        ))}
      </div>
    </ChunkyCard>
  );
};
