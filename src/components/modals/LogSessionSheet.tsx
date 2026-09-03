'use client';

import React, { useState } from 'react';
import { MoodEmoji } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';
import { calculateSessionXP } from '../../lib/xp';
import { haptics } from '../../lib/haptics';

type DurationUnit = 'ms' | 'sec' | 'min' | 'hrs' | 'days' | 'weeks' | 'months';

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
  const [unit, setUnit] = useState<DurationUnit>('min');
  const [unitValue, setUnitValue] = useState<number>(30);
  const [mood, setMood] = useState<MoodEmoji>('🙂');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  // Convert current unit value into total fractional/whole minutes
  const computeMinutes = (u: DurationUnit, val: number): number => {
    switch (u) {
      case 'ms':
        return Number((val / (1000 * 60)).toFixed(4));
      case 'sec':
        return Number((val / 60).toFixed(2));
      case 'min':
        return val;
      case 'hrs':
        return Math.round(val * 60);
      case 'days':
        return Math.round(val * 1440);
      case 'weeks':
        return Math.round(val * 10080);
      case 'months':
        return Math.round(val * 43800);
      default:
        return val;
    }
  };

  const totalMinutes = computeMinutes(unit, unitValue);
  const estimatedXP = calculateSessionXP(Math.max(1, Math.round(totalMinutes)), currentStreak);

  // Unit configurations
  const unitConfigs: Record<
    DurationUnit,
    {
      label: string;
      emoji: string;
      min: number;
      max: number;
      step: number;
      presets: { label: string; val: number }[];
    }
  > = {
    ms: {
      label: 'Milliseconds',
      emoji: '⚡',
      min: 500,
      max: 3600000,
      step: 500,
      presets: [
        { label: '500ms', val: 500 },
        { label: '1,000ms', val: 1000 },
        { label: '60,000ms', val: 60000 },
        { label: '900,000ms (15m)', val: 900000 },
        { label: '1,800,000ms (30m)', val: 1800000 },
      ],
    },
    sec: {
      label: 'Seconds',
      emoji: '⏱️',
      min: 5,
      max: 7200,
      step: 15,
      presets: [
        { label: '30s', val: 30 },
        { label: '60s', val: 60 },
        { label: '300s (5m)', val: 300 },
        { label: '900s (15m)', val: 900 },
        { label: '1800s (30m)', val: 1800 },
        { label: '3600s (1h)', val: 3600 },
      ],
    },
    min: {
      label: 'Minutes',
      emoji: '⏳',
      min: 1,
      max: 240,
      step: 1,
      presets: [
        { label: '5m', val: 5 },
        { label: '15m', val: 15 },
        { label: '24m', val: 24 },
        { label: '30m', val: 30 },
        { label: '45m', val: 45 },
        { label: '60m', val: 60 },
        { label: '90m', val: 90 },
        { label: '120m', val: 120 },
      ],
    },
    hrs: {
      label: 'Hours',
      emoji: '🕐',
      min: 0.5,
      max: 24,
      step: 0.5,
      presets: [
        { label: '1h', val: 1 },
        { label: '2h', val: 2 },
        { label: '4h', val: 4 },
        { label: '8h', val: 8 },
        { label: '12h', val: 12 },
        { label: '24h', val: 24 },
      ],
    },
    days: {
      label: 'Days',
      emoji: '📅',
      min: 1,
      max: 30,
      step: 1,
      presets: [
        { label: '1d', val: 1 },
        { label: '2d', val: 2 },
        { label: '3d', val: 3 },
        { label: '5d', val: 5 },
        { label: '7d (1w)', val: 7 },
        { label: '14d (2w)', val: 14 },
      ],
    },
    weeks: {
      label: 'Weeks',
      emoji: '🌖',
      min: 1,
      max: 12,
      step: 1,
      presets: [
        { label: '1 week', val: 1 },
        { label: '2 weeks', val: 2 },
        { label: '3 weeks', val: 3 },
        { label: '4 weeks', val: 4 },
      ],
    },
    months: {
      label: 'Months',
      emoji: '🌕',
      min: 1,
      max: 12,
      step: 1,
      presets: [
        { label: '1 month', val: 1 },
        { label: '2 months', val: 2 },
        { label: '3 months', val: 3 },
        { label: '6 months', val: 6 },
        { label: '12 months', val: 12 },
      ],
    },
  };

  const currentCfg = unitConfigs[unit];
  const moodOptions: MoodEmoji[] = ['😐', '🙂', '😎', '😈', '🫠', '💀'];

  const handleUnitChange = (newUnit: DurationUnit) => {
    arcadeSound.playPop(650);
    haptics.tap();
    setUnit(newUnit);
    // Reset to a reasonable default preset for the new unit
    const defaultVal =
      newUnit === 'ms'
        ? 1800000
        : newUnit === 'sec'
        ? 1800
        : newUnit === 'min'
        ? 30
        : newUnit === 'hrs'
        ? 2
        : newUnit === 'days'
        ? 1
        : newUnit === 'weeks'
        ? 1
        : 1;
    setUnitValue(defaultVal);
  };

  const handleSave = () => {
    arcadeSound.playSaveSession();
    haptics.success();
    onSave({
      duration: Math.max(1, Math.round(totalMinutes)),
      mood,
      note: note.trim() || undefined,
      customDate: initialDateStr,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg rounded-t-4xl md:rounded-4xl bg-goon-surface border-2 border-goon-purple/50 shadow-2xl p-6 pb-8 md:pb-6 space-y-4 relative max-h-[92vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-goon-surfaceBorder">
          <div>
            <h2 className="text-xl font-black text-goon-text tracking-tight flex items-center gap-2">
              <span>🧬</span>
              <span>LOG SESSION</span>
            </h2>
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

        {/* ⚡ UNIT SELECTOR TABS (MS TO MONTHS) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-goon-muted uppercase tracking-wider block">
            SELECT DURATION SCALE (MS TO MONTHS)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 bg-goon-bg p-1.5 rounded-2xl border border-goon-surfaceBorder">
            {(['ms', 'sec', 'min', 'hrs', 'days', 'weeks', 'months'] as DurationUnit[]).map((uKey) => {
              const isActive = unit === uKey;
              const cfg = unitConfigs[uKey];
              return (
                <button
                  key={uKey}
                  type="button"
                  onClick={() => handleUnitChange(uKey)}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all ${
                    isActive
                      ? 'bg-goon-surfaceLight text-goon-yellow shadow-chunky-purple border border-goon-purple/60 scale-105'
                      : 'text-goon-muted hover:text-goon-text'
                  }`}
                >
                  <span className="text-xs">{cfg.emoji}</span>
                  <span className="uppercase">{uKey}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Value Display + Slider */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-goon-muted uppercase tracking-wider">
              {currentCfg.label.toUpperCase()}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-goon-yellow">
                {unit === 'ms' ? unitValue.toLocaleString() : unitValue}
              </span>
              <span className="text-xs font-black text-goon-cyan uppercase">{unit}</span>
            </div>
          </div>

          <input
            type="range"
            min={currentCfg.min}
            max={currentCfg.max}
            step={currentCfg.step}
            value={unitValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              setUnitValue(val);
              arcadeSound.playPop(400 + Math.min(400, val / 10));
              haptics.tap();
            }}
            className="w-full h-3 bg-goon-bg rounded-lg appearance-none cursor-pointer accent-goon-yellow"
          />

          {/* Preset Buttons for the Selected Unit */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentCfg.presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setUnitValue(p.val);
                  arcadeSound.playPop(600);
                  haptics.tap();
                }}
                className={`py-1 px-2.5 rounded-xl text-xs font-black transition-all ${
                  unitValue === p.val
                    ? 'bg-goon-yellow text-slate-950 shadow-chunky-yellow scale-105'
                    : 'bg-goon-bg text-goon-muted border border-goon-surfaceBorder hover:text-goon-text'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Live Cosmic Conversion Helper Tag */}
          <div className="pt-2 border-t border-goon-surfaceBorder/60 flex items-center justify-between text-[10px] font-bold text-goon-muted">
            <span>Equivalent:</span>
            <span className="text-goon-purpleLight font-black">
              ≈ {totalMinutes >= 1 ? `${totalMinutes.toLocaleString()} mins` : `${(totalMinutes * 60).toFixed(1)} secs`} ({((totalMinutes / 1440)).toFixed(3)} days)
            </span>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-goon-muted uppercase tracking-wider">
            HOW ARE YOU FEELING?
          </label>
          <div className="grid grid-cols-6 gap-2">
            {moodOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMood(m);
                  arcadeSound.playPop(550);
                  haptics.tap();
                }}
                className={`py-3 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                  mood === m
                    ? 'bg-goon-surfaceLight border-2 border-goon-pink shadow-chunky-pink scale-110'
                    : 'bg-goon-surfaceLight/50 border-2 border-goon-surfaceBorder hover:border-goon-purple/40 opacity-70'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-goon-muted uppercase tracking-wider">
            OPTIONAL NOTE
          </label>
          <input
            type="text"
            placeholder="e.g. Late night session / deep flow / dialed in..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder text-sm text-goon-text placeholder-goon-muted focus:outline-none focus:border-goon-purple shadow-sm font-medium"
          />
        </div>

        {/* Dopamine Reward & Action Button */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-goon-yellow px-1">
            <span>Dopamine Reward:</span>
            <span className="flex items-center gap-1 text-sm text-goon-yellow">
              <span>+{estimatedXP} XP</span>
              <span>⚡</span>
            </span>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-base tracking-wide shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>SAVE TELEMETRY</span>
            <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
