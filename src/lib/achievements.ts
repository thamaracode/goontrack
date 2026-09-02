import { Achievement, Session, StreakData } from '../types/tracker';
import { formatDateKey } from './analytics';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'FIRST BLOOD',
    description: 'Log your very first session to initialize Goontrack.',
    unlockedAt: null,
    progress: 0,
    max: 1,
    rarity: 'COMMON',
    emoji: '⚡',
  },
  {
    id: 'streak_7',
    title: '7 DAYS 🔥',
    description: 'Reach a 7-day streak. The neural link is stabilized.',
    unlockedAt: null,
    progress: 0,
    max: 7,
    rarity: 'RARE',
    emoji: '🔥',
  },
  {
    id: 'night_owl',
    title: 'NIGHT OWL 🌙',
    description: 'Log a session during late night hours (01:00 - 05:00).',
    unlockedAt: null,
    progress: 0,
    max: 1,
    rarity: 'RARE',
    emoji: '🦉',
  },
  {
    id: 'century',
    title: 'CENTURY 💯',
    description: 'Reach 100 total tracked sessions in your lifetime archive.',
    unlockedAt: null,
    progress: 0,
    max: 100,
    rarity: 'EPIC',
    emoji: '🏆',
  },
  {
    id: 'marathon',
    title: 'MARATHON 🏃',
    description: 'Log a single session lasting 60 minutes or longer.',
    unlockedAt: null,
    progress: 0,
    max: 1,
    rarity: 'EPIC',
    emoji: '⏱️',
  },
  {
    id: 'consistent_30',
    title: 'CONSISTENT 📅',
    description: 'Attain a legendary 30-day streak of pure dedication.',
    unlockedAt: null,
    progress: 0,
    max: 30,
    rarity: 'LEGENDARY',
    emoji: '👑',
  },
  {
    id: 'zen_master',
    title: 'CHAOS & MELT 🫠',
    description: 'Log 5 sessions tagged with 🫠 or 😈 mood.',
    unlockedAt: null,
    progress: 0,
    max: 5,
    rarity: 'RARE',
    emoji: '🫠',
  },
  {
    id: 'hyperdrive',
    title: 'HYPERDRIVE 🚀',
    description: 'Log 4 or more sessions in a single calendar day.',
    unlockedAt: null,
    progress: 0,
    max: 4,
    rarity: 'EPIC',
    emoji: '🚀',
  },
];

export function evaluateAchievements(
  sessions: Session[],
  streak: StreakData,
  currentAchievements: Achievement[] = DEFAULT_ACHIEVEMENTS
): { updated: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const nowStr = new Date().toISOString();

  const totalCount = sessions.length;
  const bestStreak = Math.max(streak.currentStreak, streak.longestStreak);

  const dayCounts: Record<string, number> = {};
  let hasNightOwl = false;
  let hasMarathon = false;
  let chaoticMoodCount = 0;

  for (const s of sessions) {
    const d = new Date(s.timestamp);
    const dayKey = formatDateKey(d);
    dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;

    const hour = d.getHours();
    if (hour >= 1 && hour < 5) hasNightOwl = true;
    if (s.duration >= 60) hasMarathon = true;
    if (s.mood === '🫠' || s.mood === '😈') chaoticMoodCount++;
  }

  const maxDailyCount = Math.max(0, ...Object.values(dayCounts));

  const updated = currentAchievements.map((ach) => {
    let progress = ach.progress;
    const wasUnlocked = !!ach.unlockedAt;

    switch (ach.id) {
      case 'first_blood':
        progress = Math.min(1, totalCount);
        break;
      case 'streak_7':
        progress = Math.min(7, bestStreak);
        break;
      case 'night_owl':
        progress = hasNightOwl ? 1 : 0;
        break;
      case 'century':
        progress = Math.min(100, totalCount);
        break;
      case 'marathon':
        progress = hasMarathon ? 1 : 0;
        break;
      case 'consistent_30':
        progress = Math.min(30, bestStreak);
        break;
      case 'zen_master':
        progress = Math.min(5, chaoticMoodCount);
        break;
      case 'hyperdrive':
        progress = Math.min(4, maxDailyCount);
        break;
      default:
        break;
    }

    const isUnlockedNow = progress >= ach.max;
    let unlockedAt = ach.unlockedAt;

    if (isUnlockedNow && !wasUnlocked) {
      unlockedAt = nowStr;
      newlyUnlocked.push({
        ...ach,
        progress,
        unlockedAt,
      });
    }

    return {
      ...ach,
      progress,
      unlockedAt,
    };
  });

  return { updated, newlyUnlocked };
}
