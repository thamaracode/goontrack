'use client';

import React from 'react';
import { TabType, StreakData } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';

interface DesktopSidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenLog: () => void;
  streak: StreakData;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLog,
  streak,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: string; desc: string }> = [
    { id: 'home', label: 'Home', icon: '🏠', desc: 'Overview & Streak' },
    { id: 'analytics', label: 'Stats', icon: '📊', desc: 'Charts & Heatmap' },
    { id: 'achievements', label: 'Awards', icon: '🏆', desc: 'Trophies & Badges' },
    { id: 'history', label: 'History', icon: '📈', desc: 'Session Timeline' },
    { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Data & Privacy' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-goon-surface border-r-2 border-goon-surfaceBorder p-6 select-none shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-goon-purple via-goon-pink to-goon-yellow flex items-center justify-center text-2xl shadow-chunky-purple">
          🟣
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-goon-text">GOONTRACK</h1>
          <p className="text-[11px] font-bold text-goon-muted">PERSONAL HABIT ARCADE</p>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={() => {
          arcadeSound.playPop(880);
          onOpenLog();
        }}
        className="w-full mb-8 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-goon-pink via-goon-coral to-goon-yellow text-slate-950 font-black text-sm tracking-wide shadow-chunky-pink hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">＋</span>
        <span>LOG SESSION</span>
      </button>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                arcadeSound.playPop(isActive ? 600 : 750);
                onSelectTab(tab.id);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all ${
                isActive
                  ? 'bg-goon-surfaceLight text-goon-yellow font-black border-2 border-goon-purple/50 shadow-chunky-purple'
                  : 'text-goon-muted hover:text-goon-text hover:bg-goon-surfaceLight/50'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <div>
                <div className="text-sm font-bold leading-none mb-1">{tab.label}</div>
                <div className="text-[10px] text-goon-muted">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Streak Badge */}
      <div className="p-4 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder text-center">
        <div className="flex items-center justify-center gap-1 text-xs font-bold text-goon-yellow mb-1">
          <span>🔥</span>
          <span>{streak.currentStreak} DAY STREAK</span>
        </div>
        <p className="text-[10px] text-goon-muted">100% Local-First & Private</p>
      </div>
    </aside>
  );
};
