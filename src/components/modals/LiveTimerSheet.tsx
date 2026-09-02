'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MoodEmoji } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';
import { calculateSessionXP } from '../../lib/xp';
import { haptics } from '../../lib/haptics';

interface LiveTimerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: { duration: number; mood: MoodEmoji; note?: string }) => void;
  currentStreak?: number;
}

export const LiveTimerSheet: React.FC<LiveTimerSheetProps> = ({
  isOpen,
  onClose,
  onSave,
  currentStreak = 0,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodEmoji>('🙂');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isRunning]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const durationInMins = Math.max(1, Math.round(secondsElapsed / 60));
  const estimatedXP = calculateSessionXP(durationInMins, currentStreak);

  const handleFinish = () => {
    arcadeSound.playSaveSession();
    haptics.success();
    onSave({
      duration: durationInMins,
      mood: selectedMood,
      note: 'Live Flow Session',
    });
    setSecondsElapsed(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-pink/50 shadow-2xl p-6 pb-8 md:pb-6 text-center space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-goon-surfaceBorder">
          <div className="text-left">
            <h2 className="text-lg font-black text-goon-text">FLOW STOPWATCH</h2>
            <p className="text-xs font-bold text-goon-muted">Live session active</p>
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

        {/* Animated Stopwatch Display */}
        <div className="py-4">
          <div className="w-20 h-20 mx-auto mb-3 text-4xl animate-bounce">
            🟣
          </div>
          <div className="text-6xl font-black text-goon-yellow tracking-wider font-mono drop-shadow-[0_4px_0_#B45309]">
            {timeFormatted}
          </div>
          <div className="text-xs font-black text-goon-pink uppercase tracking-widest mt-2">
            +{estimatedXP} XP ACCUMULATED ⚡
          </div>
        </div>

        {/* Mood Selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-goon-muted uppercase tracking-wider block">
            HOW WAS THE FLOW?
          </label>
          <div className="flex justify-center gap-2">
            {(['😐', '🙂', '😎', '😈', '🫠', '💀'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  arcadeSound.playPop(600);
                  haptics.tap();
                }}
                className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-all ${
                  selectedMood === m
                    ? 'bg-goon-surfaceLight border-2 border-goon-pink scale-110 shadow-chunky-pink'
                    : 'bg-goon-surfaceLight/50 border border-transparent opacity-60'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-goon-pink via-goon-coral to-goon-yellow text-slate-950 font-black text-base tracking-wide shadow-chunky-pink hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            FINISH & LOG FLOW ⚡
          </button>

          <button
            onClick={() => {
              setIsRunning(!isRunning);
              arcadeSound.playPop(500);
              haptics.tap();
            }}
            className="w-full py-2 text-xs font-bold text-goon-muted hover:text-goon-text"
          >
            {isRunning ? '⏸️ Pause Timer' : '▶️ Resume Timer'}
          </button>
        </div>
      </div>
    </div>
  );
};
