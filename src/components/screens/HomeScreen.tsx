'use client';

import React from 'react';
import { Session, StreakData, SummaryStats } from '../../types/tracker';
import { getMascotStatus } from '../../lib/mascot';
import { BlobMascot } from '../vector/BlobMascot';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';

interface HomeScreenProps {
  sessions: Session[];
  streak: StreakData;
  stats: SummaryStats;
  onOpenLog: () => void;
  onOpenLiveTimer: () => void;
  onQuickLog: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  sessions,
  streak,
  stats,
  onOpenLog,
  onOpenLiveTimer,
  onQuickLog,
}) => {
  const latestSession = sessions[0];
  const mascotStatus = getMascotStatus(streak, latestSession);

  // Time format helper
  const totalHrs = Math.floor(stats.totalMinutes / 60);
  const totalMinsRem = stats.totalMinutes % 60;
  const timeFormatted = `${totalHrs}h ${totalMinsRem}m`;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🟣</span>
          <span className="font-black text-lg tracking-tight text-goon-text">GOONTRACK</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-goon-surfaceLight border border-goon-surfaceBorder text-xs font-bold text-goon-yellow">
          <span>🔥</span>
          <span>{streak.currentStreak} DAYS</span>
        </div>
      </div>

      {/* Hero Mascot & Streak Presentation */}
      <div className="rounded-4xl bg-gradient-to-b from-goon-surfaceLight to-goon-surface border-2 border-goon-purple/40 p-6 md:p-8 text-center shadow-chunky-purple relative overflow-hidden">
        {/* Soft Background Radial Blobs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-goon-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-goon-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Mascot Vector Artwork */}
          <BlobMascot
            state={mascotStatus.state}
            speechQuote={mascotStatus.speechQuote}
            size="md"
          />

          {/* Big Chunky Streak Title */}
          <div className="mt-4 mb-1">
            <span className="text-5xl md:text-7xl font-black text-goon-yellow tracking-tight drop-shadow-[0_4px_0_#B45309]">
              {streak.currentStreak}
            </span>
            <span className="text-2xl md:text-4xl font-extrabold text-goon-text ml-3 tracking-wide">
              {streak.currentStreak === 1 ? 'DAY STREAK 🔥' : 'DAYS STREAK 🔥'}
            </span>
          </div>

          <p className="text-xs md:text-sm font-bold text-goon-muted max-w-md mx-auto mb-6">
            “Current Status: {mascotStatus.tagline}” — {streak.isActiveToday ? 'Activity recorded for today!' : 'Pending today’s session.'}
          </p>

          {/* Today Quick Badges */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-3.5 py-1.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-xs font-bold text-goon-cyan flex items-center gap-1.5 shadow-sm">
              <span>⏱️</span>
              <span>{stats.todayMinutes}m today</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-xs font-bold text-goon-pink flex items-center gap-1.5 shadow-sm">
              <span>⚡</span>
              <span>{stats.todaySessions} {stats.todaySessions === 1 ? 'session' : 'sessions'}</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={() => {
                arcadeSound.playPop(880);
                onOpenLog();
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-sm tracking-wide shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="text-lg">＋</span>
              <span>LOG SESSION</span>
            </button>

            <button
              onClick={() => {
                arcadeSound.playPop(520);
                onQuickLog();
              }}
              className="py-3.5 px-4 rounded-2xl bg-goon-surface border-2 border-goon-purple/50 text-goon-purpleLight font-black text-xs shadow-chunky-purple hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Instant 1-Click +15m log"
            >
              ⚡ QUICK +15m
            </button>

            <button
              onClick={() => {
                arcadeSound.playPop(660);
                onOpenLiveTimer();
              }}
              className="py-3.5 px-4 rounded-2xl bg-goon-surface border-2 border-goon-pink/50 text-goon-pink font-black text-xs shadow-chunky-pink hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Live stopwatch"
            >
              ⏱️ IN THE ZONE
            </button>
          </div>
        </div>
      </div>

      {/* 3 Chunky Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Streak */}
        <ChunkyCard shadowColor="yellow" borderColor="yellow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-yellow tracking-wider">STREAK</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {streak.currentStreak} <span className="text-sm font-bold text-goon-muted">DAYS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Record: {streak.longestStreak} days
          </div>
        </ChunkyCard>

        {/* Card 2: This Month */}
        <ChunkyCard shadowColor="pink" borderColor="pink">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-pink tracking-wider">THIS MONTH</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {stats.monthSessions} <span className="text-sm font-bold text-goon-muted">SESSIONS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Avg ~{stats.avgDuration}m / session
          </div>
        </ChunkyCard>

        {/* Card 3: Total Time */}
        <ChunkyCard shadowColor="purple" borderColor="purple">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-purpleLight tracking-wider">TOTAL TIME</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {timeFormatted}
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Across {stats.totalSessions} all-time sessions
          </div>
        </ChunkyCard>
      </div>
    </div>
  );
};
