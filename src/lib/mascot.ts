import { Session, StreakData } from '../types/tracker';

export type MascotMoodState = 'NORMAL' | 'STREAKING' | 'COOL' | 'RECORD' | 'NIGHT' | 'LOST' | 'ACHIEVEMENT' | 'MELTING' | 'DEAD';
export type MascotState = MascotMoodState;

export interface MascotStatus {
  state: MascotMoodState;
  emoji: string;
  tagline: string;
  speechQuote: string;
}

export function getMascotStatus(streak: StreakData, latestSession?: Session): MascotStatus {
  const currentStreak = streak.currentStreak;
  const isToday = streak.isActiveToday;
  const currentHour = new Date().getHours();

  if (currentStreak === 0 && !isToday) {
    return {
      state: 'LOST',
      emoji: '💀',
      tagline: 'System Idling',
      speechQuote: 'Streak dormant. Tap + LOG to wake me up!',
    };
  }

  // Late night hour condition
  if (currentHour >= 0 && currentHour <= 4) {
    return {
      state: 'NIGHT',
      emoji: '🌙',
      tagline: 'Degenerate Hours',
      speechQuote: 'Night owl shift detected. Hydrate and bask in the vector glow.',
    };
  }

  if (currentStreak >= 14 || (currentStreak > 0 && currentStreak === streak.longestStreak && currentStreak >= 7)) {
    return {
      state: 'RECORD',
      emoji: '🤯',
      tagline: 'Unstoppable Momentum',
      speechQuote: 'Personal record territory. You are truly committed to the bit.',
    };
  }

  if (currentStreak >= 7) {
    return {
      state: 'STREAKING',
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
      speechQuote: 'Sensory overload logged. Basin in pure vector flow.',
    };
  }

  if (isToday) {
    return {
      state: 'NORMAL',
      emoji: '🙂',
      tagline: 'Synced Today',
      speechQuote: 'Session recorded! Another brick in the great pyramid of procrastination.',
    };
  }

  return {
    state: 'NORMAL',
    emoji: '🙂',
    tagline: 'Standing By',
    speechQuote: 'Awaiting operator input. + LOG whenever inspiration strikes.',
  };
}
