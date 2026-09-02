export type MoodEmoji = '😐' | '🙂' | '😈' | '🫠' | '💀';

export interface Session {
  id: string;
  timestamp: string; // ISO 8601
  duration: number; // minutes
  mood: MoodEmoji;
  note?: string;
}

export type TabType = 'home' | 'analytics' | 'achievements' | 'history' | 'settings';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  lastActiveDate: string | null;
}

export type AchievementBadgeKey =
  | 'first_blood'
  | 'streak_7'
  | 'night_owl'
  | 'century'
  | 'marathon'
  | 'consistent_30'
  | 'zen_master'
  | 'hyperdrive';

export interface Achievement {
  id: AchievementBadgeKey;
  title: string;
  description: string;
  unlockedAt: string | null;
  progress: number;
  max: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  emoji: string;
}

export interface SummaryStats {
  todaySessions: number;
  todayMinutes: number;
  weekSessions: number;
  weekMinutes: number;
  monthSessions: number;
  monthMinutes: number;
  totalSessions: number;
  totalMinutes: number;
  avgDuration: number;
  longestSession: number;
  mostActiveDayName: string;
  mostActiveHourStr: string;
}

export interface DayOfWeekStat {
  dayIndex: number;
  dayName: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  fullName: string; // 'Monday', etc.
  sessions: number;
  minutes: number;
  intensityPct: number; // 0 to 100 for vector bar height
}

export interface HeatmapTile {
  date: string; // YYYY-MM-DD
  count: number;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface UserSettings {
  soundEnabled: boolean;
  dailyGoalSessions: number;
  dailyGoalMinutes: number;
  mascotAlias: string;
}
