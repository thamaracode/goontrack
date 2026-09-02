import { Session, StreakData } from '../types/tracker';

export type MascotMoodState = 'IDLE' | 'HAPPY' | 'COOL' | 'FIRE' | 'MIND_BLOWN' | 'MELTING' | 'SKULL';

export interface MascotStatus {
  state: MascotMoodState;
  emoji: string;
  tagline: string;
  speechQuote: string;
}

export function getMascotStatus(streak: StreakData, latestSession?: Session): MascotStatus {
  const currentStreak = streak.currentStreak;
  const isToday = streak.isActiveToday;

  if (currentStreak === 0 && !isToday) {
    return {
      state: 'SKULL',
      emoji: '💀',
      tagline: 'System Idling',
      speechQuote: 'Streak dormant. Tap + LOG to wake me up!',
    };
  }

  if (currentStreak >= 14 || (currentStreak > 0 && currentStreak === streak.longestStreak && currentStreak >= 7)) {
    return {
      state: 'MIND_BLOWN',
      emoji: '🤯',
      tagline: 'Unstoppable Momentum',
      speechQuote: 'Personal record territory. You are truly committed to the bit.',
    };
  }

  if (currentStreak >= 7) {
    return {
      state: 'FIRE',
      emoji: '🔥',
      tagline: 'Locked In',
      speechQuote: isToday
        ? 'Neural sync maintained. Streak shielded for today!'
        : "You're absolutely committed to the bit. Log today to keep the fire burning.",
    };
  }

  if (currentStreak >= 3) {
    return {
      state: 'COOL',
      emoji: '😎',
      tagline: 'Cruising Altitude',
      speechQuote: isToday
        ? 'Dopamine flux nominal. Smooth sailing!'
        : '3+ days rolling. Keep the momentum going!',
    };
  }

  if (latestSession?.mood === '🫠') {
    return {
      state: 'MELTING',
      emoji: '🫠',
      tagline: 'Brain Melt State',
      speechQuote: 'Sensory overload logged. Hydrate and bask in the stats.',
    };
  }

  if (latestSession?.mood === '😈') {
    return {
      state: 'FIRE',
      emoji: '😈',
      tagline: 'Mischievous Energy',
      speechQuote: 'Unreasonable velocity detected. Stats duly updated.',
    };
  }

  if (isToday) {
    return {
      state: 'HAPPY',
      emoji: '🙂',
      tagline: 'Synced Today',
      speechQuote: 'Session recorded! Another brick in the great pyramid of procrastination.',
    };
  }

  return {
    state: 'IDLE',
    emoji: '😐',
    tagline: 'Standing By',
    speechQuote: 'Awaiting operator input. + LOG whenever inspiration strikes.',
  };
}
