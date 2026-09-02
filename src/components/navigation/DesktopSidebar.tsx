'use client';

import React from 'react';
import { TabType, StreakData, XPState } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface DesktopSidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenLog: () => void;
  streak: StreakData;
  xpState: XPState;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLog,
  streak,
  xpState,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home Dashboard', icon: '🏠' },
    { id: 'calendar', label: 'Calendar View', icon: '🗓️' },
    { id: 'analytics', label: 'Telemetry & Stats', icon: '📊' },
    { id: 'records', label: 'Personal Records', icon: '🏆' },
    { id: 'achievements', label: 'Arcade Awards', icon: '🎖️' },
    { id: 'recap', label: 'Monthly Recap', icon: '📋' },
    { id: 'history', label: 'Timeline History', icon: '📈' },
    { id: 'settings', label: 'Settings & Themes', icon: '⚙️' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-goon-surface border-r-2 border-goon-surfaceBorder p-6 shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Logo & Mascot header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-goon-purple to-goon-pink flex items-center justify-center text-xl shadow-chunky-purple">
          🟣
        </div>
        <div>
          <h1 className="text-lg font-black text-goon-text tracking-tight leading-none">
            GOONTRACK
          </h1>
          <span className="text-[10px] font-bold text-goon-muted uppercase tracking-wider">
            PERSONAL HABIT ARCADE
          </span>
        </div>
      </div>

      {/* Quick Level Pill */}
      <div className="mb-6 p-3 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder">
        <div className="flex items-center justify-between text-xs font-black mb-1">
          <span className="text-goon-yellow">LVL {xpState.level}</span>
          <span className="text-goon-muted">{xpState.progressPct}%</span>
        </div>
        <div className="w-full bg-goon-bg h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-goon-purple to-goon-yellow"
            style={{ width: `${xpState.progressPct}%` }}
          />
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => {
          arcadeSound.playPop(880);
          haptics.tap();
          onOpenLog();
        }}
        className="w-full mb-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-goon-yellow via-goon-coral to-goon-pink text-slate-950 font-black text-sm tracking-wide shadow-chunky-yellow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg leading-none">＋</span>
        <span>LOG SESSION</span>
      </button>

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                arcadeSound.playPop(650);
                haptics.tap();
                onSelectTab(tab.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left transition-all ${
                isActive
                  ? 'bg-goon-surfaceLight text-goon-yellow shadow-chunky-purple border-2 border-goon-purple/50'
                  : 'text-goon-muted hover:text-goon-text hover:bg-goon-surfaceLight/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mini Streak Pill in footer */}
      <div className="pt-4 border-t-2 border-goon-surfaceBorder">
        <div className="p-3 rounded-2xl bg-goon-surfaceLight border border-goon-surfaceBorder text-center">
          <div className="text-[10px] font-black text-goon-muted uppercase tracking-wider mb-0.5">
            CURRENT STREAK
          </div>
          <div className="text-base font-black text-goon-yellow flex items-center justify-center gap-1">
            <span>🔥</span>
            <span>{streak.currentStreak} DAYS</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
