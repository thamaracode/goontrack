'use client';

import React, { useRef, useState } from 'react';
import { UserSettings, ThemeKey, XPState } from '../../types/tracker';
import { ChunkyCard } from '../ui/ChunkyCard';
import { ResetDataModal } from '../modals/ResetDataModal';
import { THEMES, applyThemeVariables } from '../../lib/themes';
import { downloadCSV, downloadJSON } from '../../lib/export';
import { importDataJSON } from '../../lib/storage';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface SettingsScreenProps {
  settings: UserSettings;
  xpState: XPState;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onSeedDemoData: () => void;
  onNukeData: () => void;
  onDataChanged: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  xpState,
  onUpdateSettings,
  onSeedDemoData,
  onNukeData,
  onDataChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const themeList = Object.values(THEMES);

  const handleSelectTheme = (themeKey: ThemeKey, unlockLevel: number) => {
    if (xpState.level < unlockLevel) {
      arcadeSound.playPop(300);
      haptics.tap();
      setFeedback(`🔒 Unlocks at Level ${unlockLevel} (${THEMES[themeKey].name})`);
      return;
    }

    const updated = { ...settings, theme: themeKey };
    onUpdateSettings(updated);
    applyThemeVariables(themeKey);
    arcadeSound.playPop(750);
    haptics.tap();
    setFeedback(`🎨 Theme changed to ${THEMES[themeKey].name}!`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      if (res.success) {
        arcadeSound.playAchievementFanfare();
        haptics.levelUp();
        setFeedback(`Restored ${res.count} sessions successfully!`);
        onDataChanged();
      } else {
        setFeedback(`Import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">SETTINGS & THEMES</h2>
          <p className="text-xs font-bold text-goon-muted">THEMES, AUDIO & DATA SOVEREIGNTY</p>
        </div>
        <div className="text-2xl">⚙️</div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-goon-surfaceLight border-2 border-goon-yellow text-goon-yellow text-xs font-black text-center shadow-chunky-yellow animate-bounce">
          {feedback}
        </div>
      )}

      {/* 8-Theme Switcher Studio */}
      <ChunkyCard shadowColor="purple" borderColor="purple">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-goon-text uppercase tracking-wider">
              UNLOCKABLE THEMES
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">Level up to unlock new palettes</p>
          </div>
          <span className="text-xs font-bold text-goon-yellow px-2.5 py-1 rounded-xl bg-goon-surfaceLight border border-goon-surfaceBorder">
            LVL {xpState.level}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themeList.map((t) => {
            const isUnlocked = xpState.level >= t.unlockLevel;
            const isSelected = settings.theme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTheme(t.id, t.unlockLevel)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center relative ${
                  isSelected
                    ? 'border-goon-yellow bg-goon-surfaceLight shadow-chunky-yellow scale-105'
                    : isUnlocked
                    ? 'border-goon-surfaceBorder bg-goon-surface hover:border-goon-purple'
                    : 'border-goon-surfaceBorder bg-goon-bg opacity-50'
                }`}
              >
                {/* Palette color dots */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.accentPrimary }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.accentSecondary }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.accentHighlight }} />
                </div>

                <div className="text-xs font-black text-goon-text truncate">{t.name}</div>
                <div className="text-[10px] font-bold text-goon-muted mt-0.5">
                  {isUnlocked ? (isSelected ? '✓ ACTIVE' : 'UNLOCKED') : `🔒 LVL ${t.unlockLevel}`}
                </div>
              </div>
            );
          })}
        </div>
      </ChunkyCard>

      {/* Audio & Haptic Controls */}
      <ChunkyCard shadowColor="yellow" borderColor="yellow">
        <h3 className="text-sm font-black text-goon-text mb-3 uppercase tracking-wider">
          FEEDBACK & SENSORY
        </h3>

        <div className="space-y-2 divide-y divide-goon-surfaceBorder text-xs font-bold">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-goon-text">Arcade Audio Synthesizer</div>
              <div className="text-[10px] text-goon-muted">Procedural Web Audio beeps & fanfares</div>
            </div>
            <button
              onClick={() => {
                const updated = !settings.soundEnabled;
                onUpdateSettings({ ...settings, soundEnabled: updated });
                arcadeSound.setEnabled(updated);
                if (updated) arcadeSound.playPop(880);
                haptics.tap();
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all ${
                settings.soundEnabled
                  ? 'bg-goon-purple text-goon-text shadow-chunky-purple'
                  : 'bg-goon-surfaceLight text-goon-muted border border-goon-surfaceBorder'
              }`}
            >
              {settings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-goon-text">Mobile Haptic Vibration</div>
              <div className="text-[10px] text-goon-muted">Tactile Android tap feedback</div>
            </div>
            <button
              onClick={() => {
                const updated = !settings.hapticsEnabled;
                onUpdateSettings({ ...settings, hapticsEnabled: updated });
                haptics.setEnabled(updated);
                if (updated) haptics.tap();
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all ${
                settings.hapticsEnabled
                  ? 'bg-goon-pink text-slate-950 shadow-chunky-pink'
                  : 'bg-goon-surfaceLight text-goon-muted border border-goon-surfaceBorder'
              }`}
            >
              {settings.hapticsEnabled ? '📳 ON' : 'OFF'}
            </button>
          </div>
        </div>
      </ChunkyCard>

      {/* Data Sovereignty & Spreadsheet Export */}
      <ChunkyCard shadowColor="pink" borderColor="pink">
        <h3 className="text-sm font-black text-goon-text mb-4 uppercase tracking-wider">
          DATA SOVEREIGNTY & BACKUP
        </h3>

        <div className="space-y-3">
          {/* CSV Export */}
          <button
            onClick={() => {
              downloadCSV();
              arcadeSound.playSaveSession();
              haptics.tap();
              setFeedback('Downloaded CSV for Excel / Google Sheets!');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder hover:border-goon-green text-goon-text font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>📊</span>
              <span>EXPORT SPREADSHEET (.CSV)</span>
            </div>
            <span className="text-goon-green">EXCEL / SHEETS</span>
          </button>

          {/* JSON Export */}
          <button
            onClick={() => {
              downloadJSON();
              arcadeSound.playSaveSession();
              haptics.tap();
              setFeedback('Downloaded JSON complete backup!');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder hover:border-goon-purple text-goon-text font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>💾</span>
              <span>EXPORT BACKUP (.JSON)</span>
            </div>
            <span className="text-goon-yellow">BACKUP</span>
          </button>

          {/* JSON Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder hover:border-goon-pink text-goon-text font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>📂</span>
              <span>RESTORE / IMPORT BACKUP</span>
            </div>
            <span className="text-goon-pink">UPLOAD</span>
          </button>

          {/* Demo Seed */}
          <button
            onClick={() => {
              if (confirm('Load demo test dataset? (Generates 12-day streak & 27 sessions this month)')) {
                onSeedDemoData();
                arcadeSound.playAchievementFanfare();
                haptics.levelUp();
                setFeedback('Loaded demo telemetry dataset!');
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder hover:border-goon-yellow text-goon-text font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>⚡</span>
              <span>POPULATE DEMO DATA (12D STREAK)</span>
            </div>
            <span className="text-goon-yellow">SEED</span>
          </button>
        </div>
      </ChunkyCard>

      {/* ⚠️ DANGER ZONE: FACTORY RESET ALL DATA */}
      <div className="rounded-3xl bg-goon-surface border-2 border-goon-coral/60 p-5 shadow-chunky-pink space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="text-sm font-black text-goon-coral uppercase tracking-wider">
              DANGER ZONE: RESET ALL DATA
            </h3>
            <p className="text-[11px] font-bold text-goon-muted">
              Permanently wipe all local sessions, streaks, XP, and history
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            arcadeSound.playPop(400);
            haptics.tap();
            setIsResetModalOpen(true);
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-goon-coral/15 border-2 border-goon-coral text-goon-coral hover:bg-goon-coral hover:text-slate-950 font-black text-xs flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <span>🗑️</span>
            <span>RESET & PURGE ALL LOCAL DATA</span>
          </div>
          <span className="font-black uppercase tracking-wider">NUKE</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={() => {
          onNukeData();
          setFeedback('All local database records wiped.');
        }}
      />
    </div>
  );
};
