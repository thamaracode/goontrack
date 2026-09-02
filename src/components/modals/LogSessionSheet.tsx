'use client';

import React, { useState } from 'react';
import { MoodEmoji } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';
import { calculateSessionXP } from '../../lib/xp';
import { haptics } from '../../lib/haptics';

interface LogSessionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: { duration: number; mood: MoodEmoji; note?: string; customDate?: string }) => void;
  currentStreak?: number;
  initialDateStr?: string;
}

export const LogSessionSheet: React.FC<LogSessionSheetProps> = ({
  isOpen,
  onClose,
  onSave,
  currentStreak = 0,
  initialDateStr,
}) => {
  const [duration, setDuration] = useState<number>(24);
  const [mood, setMood] = useState<MoodEmoji>('🙂');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const estimatedXP = calculateSessionXP(duration, currentStreak);

  const durationPresets = [5, 15, 24, 30, 45, 60, 90];
  const moodOptions: MoodEmoji[] = ['😐', '🙂', '😎', '😈', '🫠', '💀'];

  const handleSave = () => {
    arcadeSound.playSaveSession();
    haptics.success();
    onSave({
      duration,
      mood,
      note: note.trim() || undefined,
      customDate: initialDateStr,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-purple/50 shadow-2xl p-6 pb-8 md:pb-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-goon-surfaceBorder">
          <div>
            <h2 className="text-xl font-black text-goon-text tracking-tight">LOG SESSION</h2>
            <p className="text-xs font-bold text-goon-muted">
              {initialDateStr ? `Telemetry for ${initialDateStr}` : 'Track focus, duration & mood'}
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

        {/* Duration Slider + Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-goon-muted uppercase tracking-wider">
              DURATION
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-goon-yellow">{duration}</span>
              <span className="text-xs font-bold text-goon-muted">MINUTES</span>
            </div>
          </div>

          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={duration}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              arcadeSound.playPop(400 + Number(e.target.value) * 4);
              haptics.tap();
            }}
            className="w-full h-3 bg-goon-surfaceLight rounded-lg appearance-none cursor-pointer accent-goon-yellow"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {durationPresets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setDuration(p);
                  arcadeSound.playPop(600);
                  haptics.tap();
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                  duration === p
                    ? 'bg-goon-purple text-goon-text shadow-chunky-purple scale-105'
                    : 'bg-goon-surfaceLight text-goon-muted hover:text-goon-text border border-goon-surfaceBorder'
                }`}
              >
                {p}m
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-goon-muted uppercase tracking-wider block">
            HOW ARE YOU FEELING?
          </label>
          <div className="grid grid-cols-6 gap-2">
            {moodOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMood(m);
                  arcadeSound.playPop(700);
                  haptics.tap();
                }}
                className={`py-2.5 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                  mood === m
                    ? 'bg-goon-surfaceLight border-2 border-goon-pink scale-110 shadow-chunky-pink'
                    : 'bg-goon-surfaceLight/50 border-2 border-transparent hover:border-goon-surfaceBorder opacity-70'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-goon-muted uppercase tracking-wider block">
            OPTIONAL NOTE
          </label>
          <input
            type="text"
            placeholder="e.g. Couldn't sleep / late night session / deep focus..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder text-xs md:text-sm font-bold text-goon-text placeholder-goon-muted focus:outline-none focus:border-goon-purple shadow-sm"
          />
        </div>

        {/* Estimated XP Badge & Save Button */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-goon-muted px-1">
            <span>Dopamine Reward:</span>
            <span className="text-goon-yellow font-black">+{estimatedXP} XP ⚡</span>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-base tracking-wide shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>SAVE TELEMETRY</span>
            <span className="text-lg leading-none">⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
