'use client';

import React, { useState } from 'react';
import { Session, StreakData } from '../../types/tracker';
import { formatDateKey } from '../../lib/analytics';
import { ChunkyCard } from '../ui/ChunkyCard';
import { DayDetailModal } from '../modals/DayDetailModal';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface CalendarScreenProps {
  sessions: Session[];
  streak: StreakData;
  onAddSessionOnDate: (dateStr: string) => void;
  onDeleteSession: (id: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  sessions,
  streak,
  onAddSessionOnDate,
  onDeleteSession,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const todayKey = formatDateKey(new Date());

  // Navigation handlers
  const handlePrevMonth = () => {
    arcadeSound.playPop(550);
    haptics.tap();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    arcadeSound.playPop(650);
    haptics.tap();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    arcadeSound.playPop(750);
    haptics.tap();
    setCurrentDate(new Date());
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map of dateKey -> sessions
  const dateMap: Record<string, Session[]> = {};
  for (const s of sessions) {
    const key = formatDateKey(new Date(s.timestamp));
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push(s);
  }

  // Monthly stats for current viewing month
  let monthActiveDays = 0;
  let monthTotalSessions = 0;
  let monthTotalMinutes = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d);
    const key = formatDateKey(dObj);
    const sList = dateMap[key];
    if (sList && sList.length > 0) {
      monthActiveDays++;
      monthTotalSessions += sList.length;
      monthTotalMinutes += sList.reduce((acc, cur) => acc + (cur.duration || 0), 0);
    }
  }

  const monthConsistencyPct = Math.round((monthActiveDays / daysInMonth) * 100);
  const monthHrs = Math.floor(monthTotalMinutes / 60);
  const monthMinsRem = monthTotalMinutes % 60;

  // Calendar cells
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarCells = [];

  // Blank filler cells before 1st of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ type: 'empty', key: `empty-${i}` });
  }

  // Active days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dObj = new Date(year, month, day);
    const key = formatDateKey(dObj);
    const daySessions = dateMap[key] || [];
    const totalDayMins = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const isToday = key === todayKey;

    calendarCells.push({
      type: 'day',
      dayNumber: day,
      dateKey: key,
      sessions: daySessions,
      totalMinutes: totalDayMins,
      isToday,
      key: `day-${key}`,
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8 select-none">
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">CALENDAR VIEW</h2>
          <p className="text-xs font-bold text-goon-muted">MONTHLY ACTIVITY & DAILY TELEMETRY</p>
        </div>
        <div className="text-3xl">🗓️</div>
      </div>

      {/* Month Navigation Card */}
      <div className="rounded-3xl bg-goon-surface border-2 border-goon-purple/40 p-4 shadow-chunky-purple flex items-center justify-between gap-2">
        <button
          onClick={handlePrevMonth}
          className="px-3.5 py-2 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder hover:border-goon-purple text-goon-text font-black text-xs transition-all flex items-center gap-1"
        >
          <span>‹</span>
          <span className="hidden sm:inline">PREV</span>
        </button>

        <div className="text-center">
          <h3 className="text-base sm:text-lg font-black text-goon-yellow tracking-wider">
            {monthName} {year}
          </h3>
          <button
            onClick={handleToday}
            className="text-[10px] font-bold text-goon-cyan hover:underline mt-0.5"
          >
            Jump to Today
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="px-3.5 py-2 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder hover:border-goon-purple text-goon-text font-black text-xs transition-all flex items-center gap-1"
        >
          <span className="hidden sm:inline">NEXT</span>
          <span>›</span>
        </button>
      </div>

      {/* 4 Month Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-center">
          <div className="text-xl font-black text-goon-yellow">{monthActiveDays} / {daysInMonth}</div>
          <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">ACTIVE DAYS</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-center">
          <div className="text-xl font-black text-goon-pink">{monthTotalSessions}</div>
          <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">SESSIONS</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-center">
          <div className="text-xl font-black text-goon-cyan">{monthHrs}h {monthMinsRem}m</div>
          <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">TRACKED TIME</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-goon-surface border border-goon-surfaceBorder text-center">
          <div className="text-xl font-black text-goon-green">{monthConsistencyPct}%</div>
          <div className="text-[10px] font-black text-goon-muted uppercase mt-0.5">CONSISTENCY</div>
        </div>
      </div>

      {/* Main Interactive Calendar Grid */}
      <ChunkyCard shadowColor="purple" borderColor="purple" className="!p-4 sm:!p-6">
        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {dayNames.map((name) => (
            <div
              key={name}
              className="text-center text-[10px] sm:text-xs font-black text-goon-muted uppercase py-1"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarCells.map((cell) => {
            if (cell.type === 'empty') {
              return (
                <div
                  key={cell.key}
                  className="min-h-[64px] sm:min-h-[84px] rounded-2xl bg-goon-surfaceLight/20 border border-transparent opacity-30"
                />
              );
            }

            const hasSessions = cell.sessions && cell.sessions.length > 0;
            const topMood = hasSessions ? cell.sessions[0].mood || '🙂' : null;

            return (
              <div
                key={cell.key}
                onClick={() => {
                  arcadeSound.playPop(600 + (cell.dayNumber || 1) * 10);
                  haptics.tap();
                  setSelectedDayDate(cell.dateKey!);
                }}
                className={`min-h-[64px] sm:min-h-[84px] p-1.5 sm:p-2 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  cell.isToday
                    ? 'border-goon-yellow bg-goon-surfaceLight shadow-chunky-yellow scale-[1.02]'
                    : hasSessions
                    ? 'border-goon-purple/70 bg-goon-surface hover:border-goon-pink hover:scale-105 shadow-sm'
                    : 'border-goon-surfaceBorder bg-goon-surfaceLight/40 hover:border-goon-purple/40 hover:bg-goon-surfaceLight'
                }`}
              >
                {/* Top Row: Day Number & Today indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      cell.isToday
                        ? 'text-goon-yellow'
                        : hasSessions
                        ? 'text-goon-text'
                        : 'text-goon-muted'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.isToday && (
                    <span className="w-2 h-2 rounded-full bg-goon-yellow animate-ping" />
                  )}
                </div>

                {/* Middle / Bottom Content: Mood & Mins */}
                {hasSessions ? (
                  <div className="mt-1 flex flex-col items-center justify-center">
                    <span className="text-base sm:text-2xl leading-none drop-shadow-sm group-hover:scale-110 transition-transform">
                      {topMood}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-goon-cyan mt-1 truncate">
                      {cell.totalMinutes}m
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-goon-muted font-bold">＋</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ChunkyCard>

      {/* Day Detail Modal for Clicked Date */}
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
