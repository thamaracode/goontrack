'use client';

import React from 'react';
import { TabType } from '../../types/tracker';
import { arcadeSound } from '../../lib/audio';

interface MobileBottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'analytics', label: 'Stats', icon: '📊' },
    { id: 'achievements', label: 'Awards', icon: '🏆' },
    { id: 'history', label: 'History', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-goon-bg/95 border-t-2 border-goon-surfaceBorder backdrop-blur-xl px-2 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                arcadeSound.playPop(isActive ? 600 : 750);
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-goon-surfaceLight text-goon-yellow font-black scale-105 border border-goon-purple/40 shadow-chunky-purple'
                  : 'text-goon-muted hover:text-goon-text'
              }`}
            >
              <span className="text-xl leading-none mb-1">{tab.icon}</span>
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
