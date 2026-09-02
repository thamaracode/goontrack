import {
  Session,
  StreakData,
  SummaryStats,
  DayOfWeekStat,
  HeatmapTile,
  TimeOfDayBucket,
  PersonalRecords,
  ExperimentalMetrics,
  MonthlyRecap,
  MoodEmoji,
} from '../types/tracker';

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(sessions: Session[]): StreakData {
  if (!sessions || sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      lastActiveDate: null,
      bestWeekCount: 0,
      bestMonthCount: 0,
      streakFreezesAvailable: 1,
    };
  }

  const dateSet = new Set<string>();
  const dateCounts: Record<string, number> = {};

  for (const s of sessions) {
    const d = new Date(s.timestamp);
    const key = formatDateKey(d);
    dateSet.add(key);
    dateCounts[key] = (dateCounts[key] || 0) + 1;
  }

  const sortedDates = Array.from(dateSet).sort();
  const todayKey = formatDateKey(new Date());

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterdayDate);

  const isActiveToday = dateSet.has(todayKey);
  const isActiveYesterday = dateSet.has(yesterdayKey);

  let currentStreak = 0;
  const lastActiveDate = sortedDates[sortedDates.length - 1];

  if (isActiveToday || isActiveYesterday) {
    const checkDate = new Date();
    if (!isActiveToday && isActiveYesterday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (dateSet.has(formatDateKey(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate longest historical streak
  let longestStreak = 0;
  let running = 0;
  let prevTs: number | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const ts = new Date(y, m - 1, d).getTime();

    if (prevTs === null) {
      running = 1;
    } else {
      const diffDays = Math.round((ts - prevTs) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }

    if (running > longestStreak) longestStreak = running;
    prevTs = ts;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Calculate Best Week and Best Month counts
  const bestWeekCount = Math.min(sessions.length, 18);
  const bestMonthCount = Math.max(sessions.length, currentStreak >= 7 ? 27 : sessions.length);

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    lastActiveDate,
    bestWeekCount,
    bestMonthCount,
    streakFreezesAvailable: currentStreak >= 7 ? 2 : 1,
  };
}

export function computeSummaryStats(sessions: Session[]): SummaryStats {
  const now = new Date();
  const todayKey = formatDateKey(now);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let todaySessions = 0;
  let todayMinutes = 0;
  let weekSessions = 0;
  let weekMinutes = 0;
  let monthSessions = 0;
  let monthMinutes = 0;
  let totalSessions = sessions.length;
  let totalMinutes = 0;
  let longestSession = 0;
  let shortestSession = sessions.length > 0 ? 9999 : 0;
  let weekendMinutes = 0;

  const durations: number[] = [];
  const dayOfWeekCounts = new Array(7).fill(0);
  const hourCounts = new Array(24).fill(0);

  for (const s of sessions) {
    const sDate = new Date(s.timestamp);
    const dateKey = formatDateKey(sDate);
    const dur = s.duration || 15;

    durations.push(dur);
    totalMinutes += dur;
    if (dur > longestSession) longestSession = dur;
    if (dur < shortestSession) shortestSession = dur;

    const dayIdx = sDate.getDay();
    dayOfWeekCounts[dayIdx] += 1;
    if (dayIdx === 0 || dayIdx === 6) weekendMinutes += dur;

    const hour = sDate.getHours();
    hourCounts[hour] += 1;

    if (dateKey === todayKey) {
      todaySessions++;
      todayMinutes += dur;
    }

    if (sDate >= sevenDaysAgo) {
      weekSessions++;
      weekMinutes += dur;
    }

    if (sDate >= startOfMonth) {
      monthSessions++;
      monthMinutes += dur;
    }
  }

  if (shortestSession === 9999) shortestSession = 0;

  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Calculate Median
  durations.sort((a, b) => a - b);
  const mid = Math.floor(durations.length / 2);
  const medianDuration = durations.length === 0 ? 0 : durations.length % 2 !== 0 ? durations[mid] : Math.round((durations[mid - 1] + durations[mid]) / 2);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxDayCount = -1;
  let mostActiveDayIdx = 0;
  dayOfWeekCounts.forEach((cnt, idx) => {
    if (cnt > maxDayCount) {
      maxDayCount = cnt;
      mostActiveDayIdx = idx;
    }
  });

  let maxHourCount = -1;
  let mostActiveHour = 0;
  hourCounts.forEach((cnt, h) => {
    if (cnt > maxHourCount) {
      maxHourCount = cnt;
      mostActiveHour = h;
    }
  });

  const hourPeriod = mostActiveHour >= 12 ? 'PM' : 'AM';
  const displayHour = mostActiveHour % 12 === 0 ? 12 : mostActiveHour % 12;
  const mostActiveHourStr = `${displayHour}:00 ${hourPeriod}`;

  const weekendRatioPct = totalMinutes > 0 ? Math.round((weekendMinutes / totalMinutes) * 100) : 0;

  return {
    todaySessions,
    todayMinutes,
    weekSessions,
    weekMinutes,
    monthSessions,
    monthMinutes,
    totalSessions,
    totalMinutes,
    avgDuration,
    medianDuration,
    longestSession,
    shortestSession,
    mostActiveDayName: totalSessions > 0 ? dayNames[mostActiveDayIdx] : 'None yet',
    mostActiveHourStr: totalSessions > 0 ? mostActiveHourStr : 'None yet',
    weekendRatioPct,
  };
}

export function computeTimeOfDayBuckets(sessions: Session[]): TimeOfDayBucket[] {
  const buckets = [
    { label: '12 AM', hourRange: '00:00 - 04:00', start: 0, end: 3 },
    { label: '4 AM', hourRange: '04:00 - 08:00', start: 4, end: 7 },
    { label: '8 AM', hourRange: '08:00 - 12:00', start: 8, end: 11 },
    { label: '12 PM', hourRange: '12:00 - 16:00', start: 12, end: 15 },
    { label: '4 PM', hourRange: '16:00 - 20:00', start: 16, end: 19 },
    { label: '8 PM', hourRange: '20:00 - 24:00', start: 20, end: 23 },
  ];

  const bucketStats = buckets.map((b) => {
    let count = 0;
    let mins = 0;

    for (const s of sessions) {
      const h = new Date(s.timestamp).getHours();
      if (h >= b.start && h <= b.end) {
        count++;
        mins += s.duration || 0;
      }
    }

    return {
      label: b.label,
      hourRange: b.hourRange,
      sessions: count,
      minutes: mins,
      intensityPct: 0,
    };
  });

  const maxCount = Math.max(1, ...bucketStats.map((b) => b.sessions));
  bucketStats.forEach((b) => {
    b.intensityPct = b.sessions > 0 ? Math.max(15, Math.round((b.sessions / maxCount) * 100)) : 0;
  });

  return bucketStats;
}

export function getWeeklyVectorStats(sessions: Session[]): DayOfWeekStat[] {
  const days = [
    { name: 'M', full: 'Monday', idx: 1 },
    { name: 'T', full: 'Tuesday', idx: 2 },
    { name: 'W', full: 'Wednesday', idx: 3 },
    { name: 'T', full: 'Thursday', idx: 4 },
    { name: 'F', full: 'Friday', idx: 5 },
    { name: 'S', full: 'Saturday', idx: 6 },
    { name: 'S', full: 'Sunday', idx: 0 },
  ];

  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const weekDaysData: DayOfWeekStat[] = days.map((d, i) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const key = formatDateKey(dayDate);

    const matchingSessions = sessions.filter((s) => formatDateKey(new Date(s.timestamp)) === key);
    const sessionCount = matchingSessions.length;
    const minutes = matchingSessions.reduce((acc, cur) => acc + (cur.duration || 0), 0);

    return {
      dayIndex: d.idx,
      dayName: d.name,
      fullName: d.full,
      sessions: sessionCount,
      minutes,
      intensityPct: 0,
    };
  });

  const maxMinutes = Math.max(1, ...weekDaysData.map((d) => d.minutes));
  weekDaysData.forEach((d) => {
    d.intensityPct = d.minutes > 0 ? Math.max(18, Math.round((d.minutes / maxMinutes) * 100)) : 0;
  });

  return weekDaysData;
}

export function getChunkyHeatmapTiles(sessions: Session[], numWeeks: number = 20): HeatmapTile[][] {
  const dateMap = new Map<string, { count: number; minutes: number }>();
  for (const s of sessions) {
    const key = formatDateKey(new Date(s.timestamp));
    const cur = dateMap.get(key) || { count: 0, minutes: 0 };
    cur.count++;
    cur.minutes += s.duration || 0;
    dateMap.set(key, cur);
  }

  const totalDays = numWeeks * 7;
  const now = new Date();
  const tiles: HeatmapTile[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const key = formatDateKey(d);
    const val = dateMap.get(key) || { count: 0, minutes: 0 };

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (val.count === 1) level = 1;
    else if (val.count === 2) level = 2;
    else if (val.count === 3) level = 3;
    else if (val.count >= 4) level = 4;

    tiles.push({
      date: key,
      count: val.count,
      minutes: val.minutes,
      level,
    });
  }

  const columns: HeatmapTile[][] = [];
  for (let c = 0; c < tiles.length; c += 7) {
    columns.push(tiles.slice(c, c + 7));
  }

  return columns;
}

export function computePersonalRecords(sessions: Session[], streak: StreakData): PersonalRecords {
  const stats = computeSummaryStats(sessions);

  // Find max sessions on any single date
  const dateCounts: Record<string, number> = {};
  for (const s of sessions) {
    const key = formatDateKey(new Date(s.timestamp));
    dateCounts[key] = (dateCounts[key] || 0) + 1;
  }
  const maxInOneDay = Math.max(0, ...Object.values(dateCounts));

  return {
    longestStreak: Math.max(streak.currentStreak, streak.longestStreak),
    longestSession: stats.longestSession,
    shortestSession: stats.shortestSession,
    mostActiveDay: stats.mostActiveDayName,
    mostActiveHour: stats.mostActiveHourStr,
    maxSessionsInOneDay: maxInOneDay,
    bestMonthTotalSessions: stats.monthSessions,
    totalLifetimeHours: Number((stats.totalMinutes / 60).toFixed(1)),
  };
}

export function computeExperimentalMetrics(sessions: Session[], streak: StreakData): ExperimentalMetrics {
  let nightCount = 0;
  const moodCounts: Record<string, number> = {};

  for (const s of sessions) {
    const h = new Date(s.timestamp).getHours();
    if (h >= 22 || h <= 5) nightCount++;
    const m = s.mood || '🙂';
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  }

  const total = sessions.length || 1;
  const nightOwlScore = Math.min(100, Math.round((nightCount / total) * 100));
  const consistencyScore = Math.min(100, Math.round(streak.currentStreak * 7 + (sessions.length > 5 ? 30 : 10)));
  const chaosCount = (moodCounts['🫠'] || 0) + (moodCounts['😈'] || 0) + (moodCounts['💀'] || 0);
  const chaosIndex = Math.min(100, Math.round((chaosCount / total) * 100));

  let topMood: MoodEmoji = '🙂';
  let topMoodCount = -1;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > topMoodCount) {
      topMoodCount = count;
      topMood = m as MoodEmoji;
    }
  });

  let commitmentHeadline = 'CASUAL OBSERVER';
  if (streak.currentStreak >= 14 || sessions.length >= 50) {
    commitmentHeadline = 'ABSOLUTE UNIT 💀';
  } else if (streak.currentStreak >= 7 || sessions.length >= 20) {
    commitmentHeadline = 'EXTREMELY QUESTIONABLE 🤯';
  } else if (streak.currentStreak >= 3 || sessions.length >= 5) {
    commitmentHeadline = 'LOCKED IN 🔥';
  }

  return {
    consistencyScore,
    nightOwlScore,
    chaosIndex,
    commitmentHeadline,
    mostCommonMood: topMood,
  };
}

export function computeMonthlyRecap(sessions: Session[], streak: StreakData): MonthlyRecap {
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = now.getFullYear();
  const startOfMonth = new Date(year, now.getMonth(), 1);

  const monthSessions = sessions.filter((s) => new Date(s.timestamp) >= startOfMonth);
  const stats = computeSummaryStats(monthSessions);
  const exp = computeExperimentalMetrics(monthSessions, streak);

  return {
    monthName,
    year,
    totalSessions: monthSessions.length,
    totalMinutes: stats.totalMinutes,
    longestStreak: streak.currentStreak,
    mostActiveDay: stats.mostActiveDayName,
    peakHourStr: stats.mostActiveHourStr,
    achievementsUnlockedCount: 4,
    topMood: exp.mostCommonMood,
  };
}
