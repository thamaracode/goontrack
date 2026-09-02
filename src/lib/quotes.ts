import { MascotMoodState } from './mascot';

export type QuoteCategory =
  | 'MOTIVATION'
  | 'DISCIPLINE'
  | 'CHAOTIC'
  | 'DARK_HUMOR'
  | 'STOIC'
  | 'FUNNY'
  | 'LATE_NIGHT'
  | 'ACHIEVEMENT';

export interface DailyTransmission {
  id: string;
  category: QuoteCategory;
  categoryLabel: string;
  emoji: string;
  quote: string;
  author: string;
  mascotPose: MascotMoodState;
}

export const DAILY_TRANSMISSIONS: DailyTransmission[] = [
  {
    id: 'dt_1',
    category: 'DISCIPLINE',
    categoryLabel: 'Discipline',
    emoji: '🧠',
    quote: 'Discipline is choosing what you want most over what you want now.',
    author: 'Operational Protocol',
    mascotPose: 'COOL',
  },
  {
    id: 'dt_2',
    category: 'STOIC',
    categoryLabel: 'Stoic',
    emoji: '🗿',
    quote: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    mascotPose: 'NORMAL',
  },
  {
    id: 'dt_3',
    category: 'CHAOTIC',
    categoryLabel: 'Chaotic',
    emoji: '😈',
    quote: 'If you are going to commit to the bit, commit with maximum statistical density.',
    author: 'System Subroutine 0x99',
    mascotPose: 'MELTING',
  },
  {
    id: 'dt_4',
    category: 'MOTIVATION',
    categoryLabel: 'Motivation',
    emoji: '🔥',
    quote: 'The secret of getting ahead is getting started. The streak begins with day one.',
    author: 'Mark Twain',
    mascotPose: 'STREAKING',
  },
  {
    id: 'dt_5',
    category: 'DARK_HUMOR',
    categoryLabel: 'Dark Humor',
    emoji: '💀',
    quote: 'Humanity invented supercomputers, space telescopes, and particle colliders. You are using this to track your dopamine flux.',
    author: 'The Machine',
    mascotPose: 'LOST',
  },
  {
    id: 'dt_6',
    category: 'LATE_NIGHT',
    categoryLabel: 'Late-Night',
    emoji: '🌙',
    quote: 'The midnight hour belongs to dreamers, nocturnal wanderers, and unlogged sessions.',
    author: 'Night Watch Protocol',
    mascotPose: 'NIGHT',
  },
  {
    id: 'dt_7',
    category: 'FUNNY',
    categoryLabel: 'Funny',
    emoji: '😂',
    quote: 'Even the most legendary marathons were just someone refusing to stand up for an unreasonably long time.',
    author: 'Blobby',
    mascotPose: 'COOL',
  },
  {
    id: 'dt_8',
    category: 'ACHIEVEMENT',
    categoryLabel: 'Achievement',
    emoji: '🏆',
    quote: 'Small daily disciplines compounded over time create monumental records.',
    author: 'Core Engine',
    mascotPose: 'RECORD',
  },
  {
    id: 'dt_9',
    category: 'DISCIPLINE',
    categoryLabel: 'Discipline',
    emoji: '🧠',
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant',
    mascotPose: 'COOL',
  },
  {
    id: 'dt_10',
    category: 'STOIC',
    categoryLabel: 'Stoic',
    emoji: '🗿',
    quote: 'Waste no more time arguing about what a good tracker should be. Be one.',
    author: 'Stoic Archive',
    mascotPose: 'NORMAL',
  },
  {
    id: 'dt_11',
    category: 'CHAOTIC',
    categoryLabel: 'Chaotic',
    emoji: '😈',
    quote: 'Why merely exist in the dopamine matrix when you can generate high-fidelity charts about it?',
    author: 'Degenerate AI Core',
    mascotPose: 'MELTING',
  },
  {
    id: 'dt_12',
    category: 'MOTIVATION',
    categoryLabel: 'Motivation',
    emoji: '🔥',
    quote: 'It always seems impossible until it is logged.',
    author: 'Telemetry Archive',
    mascotPose: 'STREAKING',
  },
];

export function getDailyTransmission(date: Date = new Date(), seedOffset: number = 0): DailyTransmission {
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash + seedOffset) % DAILY_TRANSMISSIONS.length;
  return DAILY_TRANSMISSIONS[index];
}
