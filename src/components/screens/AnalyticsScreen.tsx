'use client';

import React, { useState } from 'react';
import { Session, SummaryStats } from '../../types/tracker';
import { getWeeklyVectorStats, getChunkyHeatmapTiles } from '../../lib/analytics';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';

interface AnalyticsScreenProps {
  sessions: Session[];
  stats: SummaryStats;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ sessions, stats }) => {
  const weeklyData = getWeeklyVectorStats(sessions);
  const heatmapColumns = getChunkyHeatmapTiles(sessions, 20);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
          <p className="text-xs font-bold text-goon-muted">WEEKLY RHYTHM & HEATMAP</p>
        </div>
        <div className="text-2xl">📊</div>
      </div>

      {/* Weekly Vector Activity Bar Chart */}
      <ChunkyCard shadowColor="purple" borderColor="purple">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-goon-text tracking-wider uppercase">
              WEEKLY ACTIVITY
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">Current week volume</p>
          </div>
          <span className="text-xs font-bold text-goon-yellow px-2.5 py-1 rounded-xl bg-goon-surfaceLight border border-goon-surfaceBorder">
            {stats.weekSessions} sessions
          </span>
        </div>

        {/* Vector Bar Container */}
        <div className="flex items-end justify-between gap-2 h-44 px-2 pt-4 pb-2 border-b-2 border-goon-surfaceBorder">
          {weeklyData.map((d) => {
            const hasData = d.sessions > 0;
            const barHeight = hasData ? `${Math.max(16, d.intensityPct)}%` : '6%';

            return (
              <div
                key={d.fullName}
                onClick={() => {
                  arcadeSound.playPop(500 + d.dayIndex * 50);
                  setSelectedDay(`${d.fullName}: ${d.sessions} session(s), ${d.minutes} mins`);
                }}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar Value Tooltip on hover */}
                {hasData && (
                  <span className="text-[10px] font-black text-goon-yellow mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.minutes}m
                  </span>
                )}

                {/* Chunky Vector Rounded Bar */}
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

        {/* Day Labels Underneath */}
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

        {selectedDay && (
          <div className="mt-3 text-center text-xs font-bold text-goon-yellow bg-goon-surfaceLight p-2 rounded-xl border border-goon-surfaceBorder">
            {selectedDay}
          </div>
        )}
      </ChunkyCard>

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            THIS WEEK
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.weekSessions}</div>
          <div className="text-[11px] font-bold text-goon-pink">{stats.weekMinutes} mins total</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            AVG DURATION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.avgDuration}m</div>
          <div className="text-[11px] font-bold text-goon-cyan">Per session</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            LONGEST SESSION
          </div>
          <div className="text-2xl font-black text-goon-text">{stats.longestSession}m</div>
          <div className="text-[11px] font-bold text-goon-yellow">Personal record</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            MOST ACTIVE DAY
          </div>
          <div className="text-xl font-black text-goon-text truncate">{stats.mostActiveDayName}</div>
          <div className="text-[11px] font-bold text-goon-green">Peak cadence</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            MOST ACTIVE HOUR
          </div>
          <div className="text-xl font-black text-goon-text truncate">{stats.mostActiveHourStr}</div>
          <div className="text-[11px] font-bold text-goon-purpleLight">Chronotype</div>
        </ChunkyCard>

        <ChunkyCard shadowColor="dark" className="!p-4">
          <div className="text-[10px] font-black text-goon-muted tracking-wider uppercase mb-1">
            TOTAL TIME
          </div>
          <div className="text-xl font-black text-goon-text">
            {(stats.totalMinutes / 60).toFixed(1)} hrs
          </div>
          <div className="text-[11px] font-bold text-goon-coral">{stats.totalSessions} sessions</div>
        </ChunkyCard>
      </div>

      {/* Chunky Calendar Heatmap */}
      <ChunkyCard shadowColor="pink" borderColor="pink">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-goon-text tracking-wider uppercase">
              CALENDAR HEATMAP
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">Chunky vector tiles (20 weeks)</p>
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
                      arcadeSound.playPop(600);
                      setSelectedDay(`${tile.date}: ${tile.count} session(s) (${tile.minutes} mins)`);
                    }}
                    className={`w-4 h-4 rounded-md border-2 transition-transform cursor-pointer hover:scale-125 ${
                      tileColors[tile.level]
                    }`}
                    title={`${tile.date}: ${tile.count} session(s) (${tile.minutes}m)`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </ChunkyCard>
    </div>
  );
};
