import { Achievement, Session, StreakData } from '../types/tracker';
import { formatDateKey } from './analytics';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'FIRST LOG',
    description: 'Log your very first session to initialize Goontrack.',
    unlockedAt: null,
    progress: 0,
    max: 1,
    rarity: 'COMMON',
    emoji: '⚡',
    xpReward: 100,
  },
  {
    id: 'streak_7',
    title: '7 DAYS 🔥',
    description: 'Reach a 7-day streak. Neural link fully stabilized.',
    unlockedAt: null,
    progress: 0,
    max: 7,
    rarity: 'RARE',
    emoji: '🔥',
    xpReward: 250,
  },
  {
    id: 'night_owl',
    title: 'NIGHT OWL 🌙',
    description: 'Log 10 sessions during late night hours (after midnight).',
    unlockedAt: null,
    progress: 0,
    max: 10,
    rarity: 'RARE',
    emoji: '🦉',
    xpReward: 200,
  },
  {
    id: 'early_bird',
    title: 'EARLY BIRD ☀️',
    description: 'Log 5 sessions before 08:00 AM in the morning.',
    unlockedAt: null,
    progress: 0,
    max: 5,
    rarity: 'RARE',
    emoji: '🌅',
    xpReward: 200,
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
    xpReward: 500,
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
    xpReward: 300,
  },
  {
    id: 'consistent_30',
    title: 'CONSISTENCY 📅',
    description: 'Attain a legendary 30-day streak of pure dedication.',
    unlockedAt: null,
    progress: 0,
    max: 30,
    rarity: 'LEGENDARY',
    emoji: '👑',
    xpReward: 1000,
  },
  {
    id: 'the_machine',
    title: 'THE MACHINE ⚙️',
    description: 'Complete 250 total sessions across all time.',
    unlockedAt: null,
    progress: 0,
    max: 250,
    rarity: 'LEGENDARY',
    emoji: '🤖',
    xpReward: 1500,
  },
  {
    id: 'absolute_unit',
    title: 'ABSOLUTE UNIT 💀',
    description: 'Reach 100 total hours of logged time.',
    unlockedAt: null,
    progress: 0,
    max: 100,
    rarity: 'LEGENDARY',
    emoji: '💀',
    xpReward: 2000,
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
    xpReward: 250,
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
    xpReward: 400,
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
  const totalHours = Math.floor(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);

  const dayCounts: Record<string, number> = {};
  let nightOwlCount = 0;
  let earlyBirdCount = 0;
  let hasMarathon = false;
  let chaoticMoodCount = 0;

  for (const s of sessions) {
    const d = new Date(s.timestamp);
    const dayKey = formatDateKey(d);
    dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;

    const hour = d.getHours();
    if (hour >= 0 && hour <= 4) nightOwlCount++;
    if (hour >= 5 && hour < 8) earlyBirdCount++;
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
        progress = Math.min(10, nightOwlCount);
        break;
      case 'early_bird':
        progress = Math.min(5, earlyBirdCount);
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
      case 'the_machine':
        progress = Math.min(250, totalCount);
        break;
      case 'absolute_unit':
        progress = Math.min(100, totalHours);
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
