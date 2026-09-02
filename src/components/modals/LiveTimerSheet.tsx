'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MoodEmoji } from '../../types/tracker';
import { BlobMascot } from '../vector/BlobMascot';
import { arcadeSound } from '../../lib/audio';

interface LiveTimerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: { duration: number; mood: MoodEmoji; note?: string }) => void;
}

export const LiveTimerSheet: React.FC<LiveTimerSheetProps> = ({ isOpen, onClose, onSave }) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [mood, setMood] = useState<MoodEmoji>('😈');
  const [note, setNote] = useState<string>('Live active session');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isActive]);

  if (!isOpen) return null;

  const formatClock = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const duration = Math.max(1, Math.round(seconds / 60));
    onSave({
      duration,
      mood,
      note,
    });
    arcadeSound.playAchievementFanfare();
    setSeconds(0);
    setIsActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/75 backdrop-blur-md p-0 md:p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-pink/50 shadow-2xl p-6 pb-8 md:pb-6 text-center">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-goon-surfaceBorder">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <span className="text-base font-black text-goon-text">IN THE ZONE</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-goon-surfaceLight border border-goon-surfaceBorder text-goon-muted hover:text-goon-text flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Mascot */}
        <div className="my-2">
          <BlobMascot state={isActive ? 'FIRE' : 'HAPPY'} size="sm" speechQuote={isActive ? 'Focus mode engaged!' : 'Paused.'} />
        </div>

        {/* Big Clock Readout */}
        <div className="my-4">
          <div className="text-5xl md:text-6xl font-black text-goon-yellow tracking-wider drop-shadow-[0_4px_0_#B45309]">
            {formatClock(seconds)}
          </div>
          <div className="text-xs font-bold text-goon-cyan mt-1">
            {isActive ? '● ACTIVE FLOW TIMER' : 'PAUSED'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <button
            onClick={() => {
              setIsActive(!isActive);
              arcadeSound.playPop(isActive ? 400 : 700);
            }}
            className="py-2.5 px-6 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder font-black text-xs text-goon-text hover:border-goon-purple shadow-sm"
          >
            {isActive ? '⏸️ PAUSE' : '▶️ RESUME'}
          </button>

          <button
            onClick={() => {
              setSeconds(0);
              arcadeSound.playPop(300);
            }}
            className="py-2.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder font-black text-xs text-goon-muted hover:text-goon-text"
          >
            RESET
          </button>
        </div>

        {/* Finish & Save */}
        <button
          onClick={handleFinish}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-goon-pink via-goon-coral to-goon-yellow text-slate-950 font-black text-sm shadow-chunky-pink hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          COMPLETE & SAVE SESSION 🏆
        </button>
      </div>
    </div>
  );
};
