'use client';

import React from 'react';
import { Achievement } from '../../types/tracker';
import { VectorBadge } from '../vector/VectorBadges';
import { ChunkyCard } from '../ui/ChunkyCard';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;

  const rarityColors = {
    COMMON: 'text-goon-muted border-goon-surfaceBorder bg-goon-surfaceLight',
    RARE: 'text-goon-cyan border-goon-cyan/40 bg-goon-cyan/10',
    EPIC: 'text-goon-pink border-goon-pink/40 bg-goon-pink/10',
    LEGENDARY: 'text-goon-yellow border-goon-yellow/40 bg-goon-yellow/10',
  };

  const handleCardClick = (ach: Achievement) => {
    if (ach.unlockedAt) {
      arcadeSound.playAchievementFanfare();
      haptics.levelUp();
    } else {
      arcadeSound.playPop(450);
      haptics.tap();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-goon-text tracking-tight">ARCADE TROPHIES</h2>
          <p className="text-xs font-bold text-goon-muted">UNLOCKED ACHIEVEMENTS & XP REWARDS</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-2xl bg-goon-surfaceLight border border-goon-purple/40 text-xs font-black text-goon-yellow shadow-chunky-purple">
          🏆 {unlockedCount} / {achievements.length} UNLOCKED
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          const progressPct = Math.min(100, Math.round((ach.progress / ach.max) * 100));

          return (
            <ChunkyCard
              key={ach.id}
              shadowColor={isUnlocked ? 'purple' : 'dark'}
              borderColor={isUnlocked ? 'purple' : 'default'}
              onClick={() => handleCardClick(ach)}
              className={`flex flex-col justify-between transition-all ${
                isUnlocked ? 'hover:scale-[1.02]' : 'opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start gap-4">
                  {/* Vector Badge Icon */}
                  <div className="shrink-0">
                    <VectorBadge
                      badgeKey={ach.id}
                      unlocked={isUnlocked}
                      className="w-14 h-14"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm font-black text-goon-text tracking-tight truncate">
                        {ach.title}
                      </h3>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          rarityColors[ach.rarity]
                        }`}
                      >
                        {ach.rarity}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-goon-muted leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div className="mt-4 pt-3 border-t border-goon-surfaceBorder">
                <div className="flex items-center justify-between text-[11px] font-black mb-1.5">
                  <span className={isUnlocked ? 'text-goon-yellow' : 'text-goon-muted'}>
                    {isUnlocked ? '✓ UNLOCKED' : `PROGRESS: ${ach.progress}/${ach.max}`}
                  </span>
                  <span className="text-goon-cyan font-black">+{ach.xpReward} XP</span>
                </div>

                <div className="w-full bg-goon-bg h-2 rounded-full overflow-hidden border border-goon-surfaceBorder">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-goon-yellow to-goon-coral'
                        : 'bg-gradient-to-r from-goon-purple to-goon-pink'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </ChunkyCard>
          );
        })}
      </div>
    </div>
  );
};
