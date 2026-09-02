'use client';

import React from 'react';
import { TabType } from '../../types/tracker';
import { NavIcon } from '../vector/NavIcons';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface MobileBottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'calendar', label: 'Cal' },
    { id: 'analytics', label: 'Stats' },
    { id: 'records', label: 'Records' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleTabClick = (tabId: TabType) => {
    arcadeSound.playPop(700);
    haptics.tap();
    onSelectTab(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-goon-bg/95 backdrop-blur-md border-t-2 border-goon-surfaceBorder px-1 py-2 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150 relative ${
              isActive
                ? 'bg-goon-surfaceLight text-goon-yellow font-black border border-goon-purple/40 shadow-chunky-purple scale-105'
                : 'text-goon-muted hover:text-goon-text'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 mb-0.5">
              <NavIcon tab={tab.id} isActive={isActive} className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
