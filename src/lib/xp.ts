import { Session, StreakData, XPState, ThemeKey } from '../types/tracker';

export function calculateSessionXP(duration: number, currentStreak: number): number {
  const baseXP = 50;
  const durationBonus = Math.round(duration * 2); // 2 XP per minute
  const streakMultiplier = 1 + Math.min(2, currentStreak * 0.05); // up to 2x for high streak
  return Math.round((baseXP + durationBonus) * streakMultiplier);
}

export function getLevelForXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number; title: string; progressPct: number } {
  let level = 1;
  let prevLevelThreshold = 0;
  let nextThreshold = 250;

  // Level curve: 250, 600, 1100, 1750, 2550, etc.
  while (totalXP >= nextThreshold && level < 100) {
    level++;
    prevLevelThreshold = nextThreshold;
    nextThreshold = prevLevelThreshold + Math.round(200 * Math.pow(level, 1.3));
  }

  const currentLevelXP = totalXP - prevLevelThreshold;
  const neededForNext = nextThreshold - prevLevelThreshold;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentLevelXP / neededForNext) * 100)));

  const titles: Record<number, string> = {
    1: 'Novice Tracker',
    2: 'Dopamine Apprentice',
    3: 'Focus Scout',
    4: 'Habit Knight',
    5: 'Flow Alchemist',
    6: 'Arcade Champion',
    7: 'Sensory Overlord',
    8: 'Transcendent Entity',
  };

  const title = titles[Math.min(8, level)] || 'Absolute Unit 💀';

  return {
    level,
    currentXP: currentLevelXP,
    nextLevelXP: neededForNext,
    title,
    progressPct,
  };
}

export function computeTotalXP(sessions: Session[], streak: StreakData): XPState {
  let totalXP = 0;
  for (const s of sessions) {
    totalXP += calculateSessionXP(s.duration || 15, streak.currentStreak);
  }

  const { level, currentXP, nextLevelXP, title, progressPct } = getLevelForXP(totalXP);

  return {
    level,
    currentXP,
    nextLevelXP,
    totalXP,
    title,
    progressPct,
  };
}

export function getThemeUnlockRequirement(theme: ThemeKey): { requiredLevel: number; isUnlocked: boolean } {
  const requirements: Record<ThemeKey, number> = {
    purple: 1,
    cyber: 2,
    sunset: 3,
    acid: 4,
    ocean: 5,
    candy: 6,
    mono: 7,
    arcade: 8,
  };
  return {
    requiredLevel: requirements[theme] || 1,
    isUnlocked: true, // we will evaluate with user level
  };
}
