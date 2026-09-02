'use client';

import React from 'react';
import { Session } from '../../types/tracker';
import { ChunkyCard } from '../ui/ChunkyCard';
import { formatDateKey } from '../../lib/analytics';
import { arcadeSound } from '../../lib/audio';

interface HistoryScreenProps {
  sessions: Session[];
  onDeleteSession: (id: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ sessions, onDeleteSession }) => {
  const todayKey = formatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  // Group sessions by date
  const groups: Record<string, Session[]> = {};
  for (const s of sessions) {
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
      onDeleteSession(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">TIMELINE HISTORY</h2>
          <p className="text-xs font-bold text-goon-muted">CHRONOLOGICAL SESSIONS</p>
        </div>
        <div className="text-xs font-bold text-goon-pink px-3 py-1.5 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder">
          {sessions.length} total
        </div>
      </div>

      {sessions.length === 0 ? (
        <ChunkyCard className="text-center py-12">
          <div className="text-4xl mb-3">🛸</div>
          <h3 className="text-base font-black text-goon-text mb-1">NO SESSIONS RECORDED</h3>
          <p className="text-xs font-bold text-goon-muted">
            Tap + LOG on the home tab to start your streak archive!
          </p>
        </ChunkyCard>
      ) : (
        <div className="space-y-6">
          {groupKeys.map((key) => {
            const groupSessions = groups[key];
            const groupTitle = getGroupTitle(key);

            return (
              <div key={key} className="space-y-3">
                {/* Section Date Header */}
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-black text-goon-yellow tracking-wider">
                    {groupTitle}
                  </span>
                  <div className="flex-1 h-[2px] bg-goon-surfaceBorder rounded-full" />
                </div>

                {/* Session Entries */}
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
                            {/* Mood Emoji Icon Avatar */}
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
