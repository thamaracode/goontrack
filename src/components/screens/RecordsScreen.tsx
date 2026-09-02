'use client';

import React from 'react';
import { Session, StreakData } from '../../types/tracker';
import { computePersonalRecords } from '../../lib/analytics';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface RecordsScreenProps {
  sessions: Session[];
  streak: StreakData;
}

export const RecordsScreen: React.FC<RecordsScreenProps> = ({ sessions, streak }) => {
  const records = computePersonalRecords(sessions, streak);

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">PERSONAL RECORDS</h2>
          <p className="text-xs font-bold text-goon-muted">ALL-TIME LIFETIME HIGHS</p>
        </div>
        <div className="text-3xl">🏆</div>
      </div>

      {/* Hero Record Banner */}
      <div className="rounded-4xl bg-gradient-to-r from-goon-surface via-goon-surfaceLight to-goon-surface border-2 border-goon-yellow/50 p-6 text-center shadow-chunky-yellow">
        <div className="text-4xl mb-1">👑</div>
        <div className="text-xs font-black text-goon-yellow uppercase tracking-wider mb-1">
          LIFETIME STREAK RECORD
        </div>
        <div className="text-5xl md:text-6xl font-black text-goon-text drop-shadow-[0_4px_0_#B45309]">
          {records.longestStreak} <span className="text-2xl font-bold text-goon-yellow">DAYS</span>
        </div>
        <p className="text-xs font-bold text-goon-muted mt-2">
          {streak.currentStreak === records.longestStreak && streak.currentStreak > 0
            ? '🔥 You are currently in your all-time longest streak!'
            : `Current streak: ${streak.currentStreak} days`}
        </p>
      </div>

      {/* Grid of 6 Chunky Records Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Longest Session */}
        <ChunkyCard
          shadowColor="pink"
          borderColor="pink"
          onClick={() => {
            arcadeSound.playAchievementFanfare();
            haptics.recordBroken();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-pink tracking-wider">LONGEST SESSION</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {records.longestSession} <span className="text-sm font-bold text-goon-muted">MINS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Max single duration
          </div>
        </ChunkyCard>

        {/* Most Sessions in One Day */}
        <ChunkyCard
          shadowColor="yellow"
          borderColor="yellow"
          onClick={() => {
            arcadeSound.playPop(800);
            haptics.tap();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-yellow tracking-wider">MAX DAILY SESSIONS</span>
            <span className="text-2xl">🚀</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {records.maxSessionsInOneDay} <span className="text-sm font-bold text-goon-muted">SESSIONS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Single 24-hour volume peak
          </div>
        </ChunkyCard>

        {/* Most Active Day */}
        <ChunkyCard
          shadowColor="green"
          borderColor="green"
          onClick={() => {
            arcadeSound.playPop(700);
            haptics.tap();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-green tracking-wider">TOP CADENCE DAY</span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-2xl font-black text-goon-text mb-1 truncate">
            {records.mostActiveDay}
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Most frequent rhythm
          </div>
        </ChunkyCard>

        {/* Most Active Hour */}
        <ChunkyCard
          shadowColor="purple"
          borderColor="purple"
          onClick={() => {
            arcadeSound.playPop(600);
            haptics.tap();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-purpleLight tracking-wider">PEAK CHRONOTYPE</span>
            <span className="text-2xl">🌙</span>
          </div>
          <div className="text-2xl font-black text-goon-text mb-1 truncate">
            {records.mostActiveHour}
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Most common time of day
          </div>
        </ChunkyCard>

        {/* Total Lifetime Hours */}
        <ChunkyCard
          shadowColor="cyan"
          borderColor="cyan"
          onClick={() => {
            arcadeSound.playPop(650);
            haptics.tap();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-cyan tracking-wider">LIFETIME HOURS</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {records.totalLifetimeHours} <span className="text-sm font-bold text-goon-muted">HRS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Across {sessions.length} total entries
          </div>
        </ChunkyCard>

        {/* Quick Shortest session */}
        <ChunkyCard
          shadowColor="dark"
          onClick={() => {
            arcadeSound.playPop(500);
            haptics.tap();
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-goon-muted tracking-wider">FASTEST BURST</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-black text-goon-text mb-1">
            {records.shortestSession} <span className="text-sm font-bold text-goon-muted">MINS</span>
          </div>
          <div className="text-[11px] font-bold text-goon-muted">
            Shortest logged burst
          </div>
        </ChunkyCard>
      </div>
    </div>
  );
};
