'use client';

import React, { useState } from 'react';
import { MoodEmoji } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';

interface LogSessionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: { duration: number; mood: MoodEmoji; note?: string }) => void;
}

export const LogSessionSheet: React.FC<LogSessionSheetProps> = ({ isOpen, onClose, onSave }) => {
  const [duration, setDuration] = useState<number>(24);
  const [mood, setMood] = useState<MoodEmoji>('🙂');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const moods: MoodEmoji[] = ['😐', '🙂', '😈', '🫠', '💀'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      duration: Number(duration) || 15,
      mood,
      note: note.trim() ? note.trim() : undefined,
    });
    arcadeSound.playSaveSession();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/75 backdrop-blur-md p-0 md:p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-purple/50 shadow-2xl p-6 pb-8 md:pb-6 relative animate-bounce-soft">
        {/* Top Handle for mobile */}
        <div className="w-12 h-1.5 bg-goon-surfaceBorder rounded-full mx-auto mb-4 md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-goon-surfaceBorder">
          <div>
            <h2 className="text-xl font-black text-goon-text tracking-tight">LOG SESSION</h2>
            <p className="text-xs font-bold text-goon-muted">Keep it fast: enter duration & mood</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-goon-surfaceLight border border-goon-surfaceBorder flex items-center justify-center text-goon-muted hover:text-goon-text"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Duration Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-goon-muted uppercase tracking-wider">
                DURATION
              </label>
              <span className="text-lg font-black text-goon-yellow">
                {duration} minutes
              </span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {[5, 15, 24, 30, 45, 60].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => {
                    setDuration(m);
                    arcadeSound.playPop(550 + m * 5);
                  }}
                  className={`py-2 rounded-2xl text-xs font-black transition-all border ${
                    duration === m
                      ? 'bg-goon-yellow text-slate-950 border-white shadow-chunky-yellow scale-105'
                      : 'bg-goon-surfaceLight text-goon-text border-goon-surfaceBorder hover:border-goon-purple'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>

            <input
              type="range"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-goon-yellow cursor-pointer"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-black text-goon-muted uppercase tracking-wider mb-2">
              MOOD
            </label>
            <div className="flex items-center justify-between gap-2 p-2 bg-goon-surfaceLight rounded-2xl border-2 border-goon-surfaceBorder">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => {
                    setMood(m);
                    arcadeSound.playPop(650);
                  }}
                  className={`flex-1 py-2 text-2xl md:text-3xl rounded-xl transition-all ${
                    mood === m
                      ? 'bg-goon-surface scale-125 border-2 border-goon-pink shadow-chunky-pink'
                      : 'opacity-50 hover:opacity-100 hover:scale-110'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-black text-goon-muted uppercase tracking-wider mb-1.5">
              OPTIONAL NOTE
            </label>
            <input
              type="text"
              placeholder="e.g. Deep rabbit hole session..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder text-sm font-bold text-goon-text placeholder-goon-muted focus:outline-none focus:border-goon-purple"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-base tracking-wide shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            SAVE SESSION ⚡
          </button>
        </form>
      </div>
    </div>
  );
};
