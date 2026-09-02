export type MoodEmoji = '😐' | '🙂' | '😎' | '😈' | '🫠' | '💀';

export interface Session {
  id: string;
  timestamp: string; // ISO 8601
  duration: number; // minutes
  mood: MoodEmoji;
  note?: string;
}

export type TabType = 'home' | 'calendar' | 'analytics' | 'records' | 'achievements' | 'recap' | 'history' | 'settings';

export type ThemeKey = 'purple' | 'cyber' | 'sunset' | 'acid' | 'ocean' | 'candy' | 'mono' | 'arcade';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  lastActiveDate: string | null;
  bestWeekCount: number;
  bestMonthCount: number;
  streakFreezesAvailable: number;
}

export interface XPState {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  title: string;
  progressPct: number;
}

export type AchievementBadgeKey =
  | 'first_blood'
  | 'streak_7'
  | 'night_owl'
  | 'century'
  | 'marathon'
  | 'consistent_30'
  | 'the_machine'
  | 'absolute_unit'
  | 'early_bird'
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
  xpReward: number;
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
  medianDuration: number;
  longestSession: number;
  shortestSession: number;
  mostActiveDayName: string;
  mostActiveHourStr: string;
  weekendRatioPct: number;
}

export interface TimeOfDayBucket {
  label: string;
  hourRange: string;
  sessions: number;
  minutes: number;
  intensityPct: number;
}

export interface DayOfWeekStat {
  dayIndex: number;
  dayName: string;
  fullName: string;
  sessions: number;
  minutes: number;
  intensityPct: number;
}

export interface HeatmapTile {
  date: string;
  count: number;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface PersonalRecords {
  longestStreak: number;
  longestSession: number;
  shortestSession: number;
  mostActiveDay: string;
  mostActiveHour: string;
  maxSessionsInOneDay: number;
  bestMonthTotalSessions: number;
  totalLifetimeHours: number;
}

export interface ExperimentalMetrics {
  consistencyScore: number;
  nightOwlScore: number;
  chaosIndex: number;
  commitmentHeadline: string;
  mostCommonMood: MoodEmoji;
}

export interface MonthlyRecap {
  monthName: string;
  year: number;
  totalSessions: number;
  totalMinutes: number;
  longestStreak: number;
  mostActiveDay: string;
  peakHourStr: string;
  achievementsUnlockedCount: number;
  topMood: MoodEmoji;
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: ThemeKey;
  dailyGoalSessions: number;
  dailyGoalMinutes: number;
  mascotAlias: string;
}
