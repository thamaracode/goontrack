'use client';

import React from 'react';
import { Achievement } from '../../types/tracker';
import { VectorBadge } from '../vector/VectorBadges';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;
  const totalCount = achievements.length;
  const pct = Math.round((unlockedCount / (totalCount || 1)) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">ARCADE TROPHIES</h2>
          <p className="text-xs font-bold text-goon-muted">MILESTONES & VECTOR BADGES</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-2xl bg-goon-surfaceLight border-2 border-goon-purple/40 text-goon-yellow font-black text-xs shadow-chunky-purple">
          {unlockedCount} / {totalCount} ({pct}%)
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          const progressPct = Math.min(100, Math.round((ach.progress / (ach.max || 1)) * 100));

          const rarityBadges = {
            COMMON: 'bg-goon-surfaceLight text-goon-muted border-goon-surfaceBorder',
            RARE: 'bg-goon-purple/30 text-goon-purpleLight border-goon-purple/50',
            EPIC: 'bg-goon-pink/30 text-goon-pink border-goon-pink/50',
            LEGENDARY: 'bg-goon-yellow/30 text-goon-yellow border-goon-yellow/50',
          };

          return (
            <ChunkyCard
              key={ach.id}
              shadowColor={isUnlocked ? 'yellow' : 'dark'}
              borderColor={isUnlocked ? 'yellow' : 'default'}
              onClick={() => {
                if (isUnlocked) {
                  arcadeSound.playAchievementFanfare();
                } else {
                  arcadeSound.playPop(350);
                }
              }}
              className={isUnlocked ? 'hover:scale-[1.02]' : 'opacity-70'}
            >
              <div className="flex items-start gap-4">
                {/* Handcrafted Vector Badge */}
                <VectorBadge badgeKey={ach.id} unlocked={isUnlocked} className="w-16 h-16 shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-black text-goon-text truncate">
                      {isUnlocked ? ach.title : '████████'}
                    </h3>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${rarityBadges[ach.rarity]}`}>
                      {ach.rarity}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-goon-muted mb-3 leading-snug">
                    {isUnlocked ? ach.description : '? ??? ?? (LOCKED)'}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-goon-muted">
                      <span>{isUnlocked ? 'UNLOCKED' : 'PROGRESS'}</span>
                      <span>
                        {ach.progress} / {ach.max}
                      </span>
                    </div>
                    <div className="w-full bg-goon-bg h-2 rounded-full overflow-hidden border border-goon-surfaceBorder">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-goon-yellow to-goon-coral'
                            : 'bg-goon-purple/50'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ChunkyCard>
          );
        })}
      </div>
    </div>
  );
};
