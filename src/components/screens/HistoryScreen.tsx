'use client';

import React, { useState } from 'react';
import { Session, MoodEmoji } from '../../types/tracker';
import { ChunkyCard } from '../ui/ChunkyCard';
import { formatDateKey } from '../../lib/analytics';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface HistoryScreenProps {
  sessions: Session[];
  onDeleteSession: (id: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ sessions, onDeleteSession }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('ALL');
  const [durationFilter, setDurationFilter] = useState<'ALL' | '30' | '60'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'NIGHT' | 'DAY'>('ALL');

  const todayKey = formatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      !searchTerm ||
      (s.note && s.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      new Date(s.timestamp).toLocaleDateString().includes(searchTerm);

    const matchesMood = selectedMood === 'ALL' || s.mood === selectedMood;

    const matchesDuration =
      durationFilter === 'ALL' ||
      (durationFilter === '30' && s.duration >= 30) ||
      (durationFilter === '60' && s.duration >= 60);

    const hour = new Date(s.timestamp).getHours();
    const isNight = hour >= 22 || hour <= 5;
    const matchesTime =
      timeFilter === 'ALL' ||
      (timeFilter === 'NIGHT' && isNight) ||
      (timeFilter === 'DAY' && !isNight);

    return matchesSearch && matchesMood && matchesDuration && matchesTime;
  });

  // Group by date
  const groups: Record<string, Session[]> = {};
  for (const s of filteredSessions) {
    const key = formatDateKey(new Date(s.timestamp));
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }

  const groupKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const getGroupTitle = (key: string) => {
    if (key === todayKey) return 'TODAY';
    if (key === yesterdayKey) return 'YESTERDAY';
    const [y, m, d] = key.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this session record?')) {
      arcadeSound.playPop(300);
      haptics.tap();
      onDeleteSession(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">TIMELINE HISTORY</h2>
          <p className="text-xs font-bold text-goon-muted">SEARCH & MULTI-FILTER ARCHIVE</p>
        </div>
        <div className="text-xs font-bold text-goon-pink px-3 py-1.5 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder">
          {filteredSessions.length} / {sessions.length}
        </div>
      </div>

      {/* Search Bar & Multi-Filter Controls */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search by notes or date keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-goon-surface border-2 border-goon-surfaceBorder text-xs md:text-sm font-bold text-goon-text placeholder-goon-muted focus:outline-none focus:border-goon-purple shadow-sm"
        />

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {/* Mood Selector Chips */}
          <div className="flex items-center gap-1 bg-goon-surface p-1 rounded-xl border border-goon-surfaceBorder">
            {(['ALL', '🙂', '😎', '😈', '🫠', '💀'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  haptics.tap();
                }}
                className={`px-2 py-0.5 rounded-lg text-xs transition-all ${
                  selectedMood === m
                    ? 'bg-goon-purple text-goon-text font-black scale-105'
                    : 'text-goon-muted hover:text-goon-text'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Duration Chips */}
          <div className="flex items-center gap-1 bg-goon-surface p-1 rounded-xl border border-goon-surfaceBorder">
            {(['ALL', '30', '60'] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDurationFilter(d);
                  haptics.tap();
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                  durationFilter === d
                    ? 'bg-goon-yellow text-slate-950 font-black'
                    : 'text-goon-muted hover:text-goon-text'
                }`}
              >
                {d === 'ALL' ? 'All Mins' : `≥${d}m`}
              </button>
            ))}
          </div>

          {/* Time of Day Chips */}
          <div className="flex items-center gap-1 bg-goon-surface p-1 rounded-xl border border-goon-surfaceBorder">
            {(['ALL', 'NIGHT', 'DAY'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeFilter(t);
                  haptics.tap();
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                  timeFilter === t
                    ? 'bg-goon-pink text-slate-950 font-black'
                    : 'text-goon-muted hover:text-goon-text'
                }`}
              >
                {t === 'ALL' ? 'Any Time' : t === 'NIGHT' ? '🌙 Night' : '☀️ Day'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <ChunkyCard className="text-center py-12">
          <div className="text-4xl mb-3">🛸</div>
          <h3 className="text-base font-black text-goon-text mb-1">NO MATCHING SESSIONS</h3>
          <p className="text-xs font-bold text-goon-muted">
            Try adjusting your search query or filter chips.
          </p>
        </ChunkyCard>
      ) : (
        <div className="space-y-6">
          {groupKeys.map((key) => {
            const groupSessions = groups[key];
            const groupTitle = getGroupTitle(key);

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-black text-goon-yellow tracking-wider">
                    {groupTitle}
                  </span>
                  <div className="flex-1 h-[2px] bg-goon-surfaceBorder rounded-full" />
                </div>

                <div className="space-y-2.5">
                  {groupSessions.map((s) => {
                    const dateObj = new Date(s.timestamp);
                    const timeStr = dateObj.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <ChunkyCard
                        key={s.id}
                        shadowColor="dark"
                        className="!p-4 hover:border-goon-purple/60"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder flex items-center justify-center text-2xl shrink-0 shadow-sm">
                              {s.mood || '🙂'}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-goon-text">
                                  {s.duration} min
                                </span>
                                <span className="text-xs font-bold text-goon-muted">
                                  • {timeStr}
                                </span>
                              </div>
                              {s.note && (
                                <p className="text-xs font-bold text-goon-muted truncate mt-0.5">
                                  {s.note}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(s.id)}
                            title="Delete entry"
                            className="p-2 rounded-xl text-goon-muted hover:text-goon-coral hover:bg-goon-surfaceLight transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </ChunkyCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
