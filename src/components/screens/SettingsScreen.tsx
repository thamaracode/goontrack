'use client';

import React, { useRef, useState } from 'react';
import { UserSettings } from '../../types/tracker';
import { ChunkyCard } from '../ui/ChunkyCard';
import { exportAllDataJSON, importDataJSON } from '../../lib/storage';
import { arcadeSound } from '../../lib/audio';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onSeedDemoData: () => void;
  onNukeData: () => void;
  onDataChanged: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onSeedDemoData,
  onNukeData,
  onDataChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const json = exportAllDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goontrack_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      arcadeSound.playSaveSession();
      setFeedback('JSON backup successfully exported!');
    } catch {
      setFeedback('Export failed.');
    }
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
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">SETTINGS & PRIVACY</h2>
          <p className="text-xs font-bold text-goon-muted">DATA SOVEREIGNTY & SOUND</p>
        </div>
        <div className="text-2xl">⚙️</div>
      </div>

      {/* Privacy Guarantee Pill Card */}
      <ChunkyCard shadowColor="green" borderColor="green">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="text-sm font-black text-goon-green mb-0.5">100% PRIVATE LOCAL STORAGE</h3>
            <p className="text-xs font-bold text-goon-muted leading-relaxed">
              Zero cloud servers, zero analytics trackers, zero account requirements. Everything stays inside your local browser database.
            </p>
          </div>
        </div>
      </ChunkyCard>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-goon-surfaceLight border-2 border-goon-yellow text-goon-yellow text-xs font-black text-center shadow-chunky-yellow">
          {feedback}
        </div>
      )}

      {/* Audio & Preferences */}
      <ChunkyCard shadowColor="purple" borderColor="purple">
        <h3 className="text-sm font-black text-goon-text mb-4 uppercase tracking-wider">
          PREFERENCES
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-goon-surfaceBorder">
          <div>
            <div className="text-sm font-bold text-goon-text">Arcade Audio Synthesizer</div>
            <div className="text-[11px] font-bold text-goon-muted">Retro beeps, chimes & fanfares</div>
          </div>
          <button
            onClick={() => {
              const updated = !settings.soundEnabled;
              onUpdateSettings({ ...settings, soundEnabled: updated });
              arcadeSound.setEnabled(updated);
              if (updated) arcadeSound.playPop(880);
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all ${
              settings.soundEnabled
                ? 'bg-goon-purple text-goon-text shadow-chunky-purple'
                : 'bg-goon-surfaceLight text-goon-muted border border-goon-surfaceBorder'
            }`}
          >
            {settings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>
      </ChunkyCard>

      {/* Data Sovereignty Actions */}
      <ChunkyCard shadowColor="pink" borderColor="pink">
        <h3 className="text-sm font-black text-goon-text mb-4 uppercase tracking-wider">
          DATA MANAGEMENT
        </h3>

        <div className="space-y-3">
          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder hover:border-goon-purple text-goon-text font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>💾</span>
              <span>EXPORT BACKUP (.JSON)</span>
            </div>
            <span className="text-goon-yellow">DOWNLOAD</span>
          </button>

          {/* Import */}
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

          {/* Seed Demo */}
          <button
            onClick={() => {
              if (confirm('Load demo test dataset? (Generates 12-day streak & 27 sessions this month)')) {
                onSeedDemoData();
                arcadeSound.playAchievementFanfare();
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

          {/* Nuke Data */}
          <button
            onClick={() => {
              if (confirm('⚠️ WARNING: This will permanently erase all your sessions and streaks. Are you sure?')) {
                onNukeData();
                arcadeSound.playPop(200);
                setFeedback('All local records purged.');
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-coral/40 text-goon-coral hover:bg-goon-coral/10 font-black text-xs flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span>🗑️</span>
              <span>FACTORY RESET / NUKE ALL DATA</span>
            </div>
            <span>ERASE</span>
          </button>
        </div>
      </ChunkyCard>
    </div>
  );
};
