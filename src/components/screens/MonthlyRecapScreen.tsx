'use client';

import React from 'react';
import { Session, StreakData } from '../../types/tracker';
import { computeMonthlyRecap } from '../../lib/analytics';
import { BlobMascot } from '../vector/BlobMascot';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface MonthlyRecapScreenProps {
  sessions: Session[];
  streak: StreakData;
}

export const MonthlyRecapScreen: React.FC<MonthlyRecapScreenProps> = ({ sessions, streak }) => {
  const recap = computeMonthlyRecap(sessions, streak);
  const totalHrs = Math.floor(recap.totalMinutes / 60);
  const totalMinsRem = recap.totalMinutes % 60;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">MONTHLY RECAP</h2>
          <p className="text-xs font-bold text-goon-muted">{recap.monthName} {recap.year} DOSSIER</p>
        </div>
        <div className="text-3xl">🗓️</div>
      </div>

      {/* Main Vector Recap Presentation Card */}
      <div className="rounded-4xl bg-gradient-to-b from-goon-surfaceLight via-goon-surface to-goon-surface border-2 border-goon-purple/50 p-6 md:p-8 text-center shadow-chunky-purple relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-goon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <BlobMascot state="STREAKING" size="md" speechQuote="Here's your monthly statistical debrief!" />

          <h3 className="text-2xl md:text-3xl font-black text-goon-yellow tracking-tight mt-3 mb-1">
            {recap.monthName} RECAP
          </h3>
          <p className="text-xs font-bold text-goon-muted mb-6">
            Everything you accomplished this month in numbers.
          </p>

          {/* 4 Chunky Metrics inside Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl mb-6">
            <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder">
              <div className="text-2xl md:text-3xl font-black text-goon-yellow">{recap.totalSessions}</div>
              <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">TOTAL SESSIONS</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder">
              <div className="text-2xl md:text-3xl font-black text-goon-pink">{totalHrs}h {totalMinsRem}m</div>
              <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">TOTAL TIME</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder">
              <div className="text-2xl md:text-3xl font-black text-goon-cyan">{recap.longestStreak}D</div>
              <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">PEAK STREAK</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder">
              <div className="text-2xl md:text-3xl font-black text-goon-green">{recap.topMood}</div>
              <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">DOMINANT MOOD</div>
            </div>
          </div>

          {/* Deep Insight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
            <div className="px-3.5 py-1.5 rounded-xl bg-goon-surface border border-goon-surfaceBorder text-xs font-bold text-goon-muted">
              📅 Peak Day: <span className="text-goon-yellow font-black">{recap.mostActiveDay}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-goon-surface border border-goon-surfaceBorder text-xs font-bold text-goon-muted">
              🌙 Prime Hour: <span className="text-goon-purpleLight font-black">{recap.peakHourStr}</span>
            </div>
          </div>

          <button
            onClick={() => {
              arcadeSound.playAchievementFanfare();
              haptics.recordBroken();
            }}
            className="mt-6 py-3 px-8 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-xs tracking-wider shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CELEBRATE THIS MONTH 🎉
          </button>
        </div>
      </div>
    </div>
  );
};
