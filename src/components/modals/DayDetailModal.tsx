'use client';

import React from 'react';
import { Session, MoodEmoji } from '../../types/tracker';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface DayDetailModalProps {
  dateStr: string | null;
  sessions: Session[];
  onClose: () => void;
  onAddSessionOnDate: (dateStr: string) => void;
  onDeleteSession: (id: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dateStr,
  sessions,
  onClose,
  onAddSessionOnDate,
  onDeleteSession,
}) => {
  if (!dateStr) return null;

  const daySessions = sessions.filter((s) => s.timestamp.startsWith(dateStr));
  const totalMins = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);

  const [y, m, d] = dateStr.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-purple/50 shadow-2xl p-6 pb-8 md:pb-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-goon-surfaceBorder shrink-0">
          <div>
            <h2 className="text-lg font-black text-goon-text">{formattedDate}</h2>
            <p className="text-xs font-bold text-goon-yellow">
              {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'} • {totalMins} mins total
            </p>
          </div>
          <button
            onClick={() => {
              arcadeSound.playPop(400);
              haptics.tap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-goon-surfaceLight border border-goon-surfaceBorder text-goon-muted hover:text-goon-text flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {daySessions.length === 0 ? (
            <div className="py-8 text-center text-goon-muted text-xs font-bold">
              <div className="text-3xl mb-2">💤</div>
              No telemetry recorded on this date.
            </div>
          ) : (
            daySessions.map((s) => {
              const timeStr = new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <ChunkyCard key={s.id} shadowColor="dark" className="!p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.mood || '🙂'}</span>
                      <div>
                        <div className="text-sm font-black text-goon-text">
                          {s.duration} min <span className="text-xs font-bold text-goon-muted">• {timeStr}</span>
                        </div>
                        {s.note && <div className="text-xs font-bold text-goon-muted">{s.note}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        haptics.tap();
                        onDeleteSession(s.id);
                      }}
                      className="p-1.5 rounded-lg text-goon-muted hover:text-goon-coral transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </ChunkyCard>
              );
            })
          )}
        </div>

        {/* Action button */}
        <div className="pt-4 mt-2 border-t-2 border-goon-surfaceBorder shrink-0">
          <button
            onClick={() => {
              haptics.tap();
              onAddSessionOnDate(dateStr);
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-goon-purple via-goon-pink to-goon-yellow text-slate-950 font-black text-xs shadow-chunky-purple hover:scale-[1.02] transition-all"
          >
            ＋ ADD SESSION FOR THIS DAY
          </button>
        </div>
      </div>
    </div>
  );
};
