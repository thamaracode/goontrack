'use client';

import React, { useState } from 'react';
import { Session, StreakData, SummaryStats } from '../../types/tracker';
import {
  getWeeklyVectorStats,
  getChunkyHeatmapTiles,
  computeTimeOfDayBuckets,
  computeExperimentalMetrics,
} from '../../lib/analytics';
import { ChunkyCard } from '../ui/ChunkyCard';
import { CosmicTimeCard } from '../ui/CosmicTimeCard';
import { DayDetailModal } from '../modals/DayDetailModal';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface AnalyticsScreenProps {
  sessions: Session[];
  streak: StreakData;
  stats: SummaryStats;
  onAddSessionOnDate: (dateStr: string) => void;
  onDeleteSession: (id: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  sessions,
  streak,
  stats,
  onAddSessionOnDate,
  onDeleteSession,
}) => {
  const weeklyData = getWeeklyVectorStats(sessions);
  const heatmapColumns = getChunkyHeatmapTiles(sessions, 20);
  const timeOfDayData = computeTimeOfDayBuckets(sessions);
  const exp = computeExperimentalMetrics(sessions, streak);

  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const tileColors = {
    0: 'bg-goon-surfaceLight border-goon-surfaceBorder',
    1: 'bg-goon-purple/40 border-goon-purple/60',
    2: 'bg-goon-purple border-goon-purpleLight',
    3: 'bg-goon-pink border-goon-coral',
    4: 'bg-goon-yellow border-white shadow-sm',
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Screen Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">ANALYTICS & STATS</h2>
          <p className="text-xs font-bold text-goon-muted">DEEP TIME & CHRONOTYPE TELEMETRY</p>
        </div>
        <div className="text-2xl">📊</div>
      </div>

      {/* 🌌 Cosmic Time Matrix (Milliseconds to Centuries) */}
      <CosmicTimeCard totalMinutes={stats.totalMinutes} />

      {/* Experimental Funny Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ChunkyCard shadowColor="yellow" className="!p-3.5 text-center">
          <div className="text-[10px] font-black text-goon-yellow uppercase tracking-wider mb-0.5">
            CONSISTENCY
          </div>
          <div className="text-2xl font-black text-goon-text">{exp.consistencyScore} <span className="text-xs font-bold text-goon-muted">/100</span></div>
          <div className="text-[10px] font-bold text-goon-muted mt-0.5">Rhythm Index</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="purple" className="!p-3.5 text-center">
          <div className="text-[10px] font-black text-goon-purpleLight uppercase tracking-wider mb-0.5">
            NIGHT OWL
          </div>
          <div className="text-2xl font-black text-goon-text">{exp.nightOwlScore} <span className="text-xs font-bold text-goon-muted">/100</span></div>
          <div className="text-[10px] font-bold text-goon-muted mt-0.5">Late Hours Shift</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="pink" className="!p-3.5 text-center">
          <div className="text-[10px] font-black text-goon-pink uppercase tracking-wider mb-0.5">
            CHAOS METER
          </div>
          <div className="text-2xl font-black text-goon-text">{exp.chaosIndex} <span className="text-xs font-bold text-goon-muted">/100</span></div>
          <div className="text-[10px] font-bold text-goon-muted mt-0.5">Degeneracy Score</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="green" className="!p-3.5 text-center">
          <div className="text-[10px] font-black text-goon-green uppercase tracking-wider mb-0.5">
            COMMITMENT
          </div>
          <div className="text-xs font-black text-goon-text truncate mt-1.5">{exp.commitmentHeadline}</div>
          <div className="text-[10px] font-bold text-goon-muted mt-0.5">Calculated Status</div>
        </ChunkyCard>
      </div>

      {/* 6-Block Time of Day Histogram */}
      <ChunkyCard shadowColor="purple" borderColor="purple">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-goon-text tracking-wider uppercase">
              TIME-OF-DAY CHRONOTYPE
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">24-hour distribution & peak hours</p>
          </div>
          <span className="text-xs font-bold text-goon-cyan px-2.5 py-1 rounded-xl bg-goon-surfaceLight border border-goon-surfaceBorder">
            🌙 Peak: {stats.mostActiveHourStr}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 pt-2 border-b-2 border-goon-surfaceBorder pb-2 h-36 items-end">
          {timeOfDayData.map((b) => (
            <div key={b.label} className="flex flex-col items-center justify-end h-full group">
              <span className="text-[10px] font-black text-goon-yellow mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {b.sessions}s
              </span>
              <div
                className={`w-full max-w-[32px] rounded-t-xl transition-all duration-300 border-2 ${
                  b.sessions > 0
                    ? 'bg-gradient-to-t from-goon-purple via-goon-pink to-goon-yellow border-goon-surfaceBorder shadow-chunky-purple'
                    : 'bg-goon-surfaceLight/60 border-goon-surfaceBorder/40'
                }`}
                style={{ height: `${b.sessions > 0 ? b.intensityPct : 6}%` }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-2 pt-2 text-center">
          {timeOfDayData.map((b) => (
            <div key={b.label} className="text-[11px] font-black text-goon-muted">
              {b.label}
            </div>
          ))}
        </div>
      </ChunkyCard>

      {/* Weekly Vector Activity Bar Chart */}
      <ChunkyCard shadowColor="pink" borderColor="pink">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-goon-text tracking-wider uppercase">
              WEEKLY ACTIVITY
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">Monday through Sunday cadence</p>
          </div>
          <span className="text-xs font-bold text-goon-yellow px-2.5 py-1 rounded-xl bg-goon-surfaceLight border border-goon-surfaceBorder">
            {stats.weekSessions} sessions
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-40 px-2 pt-2 pb-2 border-b-2 border-goon-surfaceBorder">
          {weeklyData.map((d) => {
            const hasData = d.sessions > 0;
            const barHeight = hasData ? `${Math.max(16, d.intensityPct)}%` : '6%';

            return (
              <div
                key={d.fullName}
                onClick={() => {
                  arcadeSound.playPop(500 + d.dayIndex * 40);
                  haptics.tap();
                }}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {hasData && (
                  <span className="text-[10px] font-black text-goon-yellow mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.minutes}m
                  </span>
                )}
                <div
                  className={`w-full max-w-[36px] rounded-t-2xl transition-all duration-300 border-2 ${
                    hasData
                      ? 'bg-gradient-to-t from-goon-purple via-goon-pink to-goon-yellow border-goon-surfaceBorder shadow-chunky-purple group-hover:scale-105'
                      : 'bg-goon-surfaceLight/60 border-goon-surfaceBorder/40'
                  }`}
                  style={{ height: barHeight }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between px-2 pt-2">
          {weeklyData.map((d) => (
            <span
              key={d.fullName}
              className="flex-1 text-center text-xs font-black text-goon-muted uppercase"
            >
              {d.dayName}
            </span>
          ))}
        </div>
      </ChunkyCard>

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            AVERAGE DURATION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.avgDuration}m</div>
          <div className="text-[11px] font-bold text-goon-cyan">Mean focus span</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            MEDIAN DURATION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.medianDuration}m</div>
          <div className="text-[11px] font-bold text-goon-yellow">Middle 50th percentile</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            WEEKEND RATIO
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.weekendRatioPct}%</div>
          <div className="text-[11px] font-bold text-goon-pink">Saturday/Sunday share</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            LONGEST SESSION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.longestSession}m</div>
          <div className="text-[11px] font-bold text-goon-green">Peak marathon</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            SHORTEST SESSION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.shortestSession}m</div>
          <div className="text-[11px] font-bold text-goon-purpleLight">Quickest burst</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            MOST COMMON MOOD
          </div>
          <div className="text-2xl font-black text-goon-text">{exp.mostCommonMood}</div>
          <div className="text-[11px] font-bold text-goon-coral">Frequent vibe</div>
        </ChunkyCard>
      </div>

      {/* Interactive Chunky Calendar Heatmap */}
      <ChunkyCard shadowColor="yellow" borderColor="yellow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-goon-text tracking-wider uppercase">
              CALENDAR HEATMAP (TAP A DAY)
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">Tap any tile to inspect daily history</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-goon-muted">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-goon-surfaceLight border border-goon-surfaceBorder" />
              <span className="w-2.5 h-2.5 rounded-md bg-goon-purple/40 border border-goon-purple/60" />
              <span className="w-2.5 h-2.5 rounded-md bg-goon-purple" />
              <span className="w-2.5 h-2.5 rounded-md bg-goon-pink" />
              <span className="w-2.5 h-2.5 rounded-md bg-goon-yellow" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-1.5 min-w-[480px]">
            {heatmapColumns.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col gap-1.5">
                {col.map((tile) => (
                  <div
                    key={tile.date}
                    onClick={() => {
                      arcadeSound.playPop(650);
                      haptics.tap();
                      setSelectedDayDate(tile.date);
                    }}
                    className={`w-4 h-4 rounded-md border-2 transition-transform cursor-pointer hover:scale-125 ${
                      tileColors[tile.level]
                    }`}
                    title={`${tile.date}: ${tile.count} session(s)`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </ChunkyCard>

      {/* Heatmap Day Detail Modal */}
      <DayDetailModal
        dateStr={selectedDayDate}
        sessions={sessions}
        onClose={() => setSelectedDayDate(null)}
        onAddSessionOnDate={(dStr) => {
          setSelectedDayDate(null);
          onAddSessionOnDate(dStr);
        }}
        onDeleteSession={onDeleteSession}
      />
    </div>
  );
};
