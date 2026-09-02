import { Session, StreakData, SummaryStats, DayOfWeekStat, HeatmapTile } from '../types/tracker';

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
    };
  }

  const dateSet = new Set<string>();
  for (const s of sessions) {
    const d = new Date(s.timestamp);
    dateSet.add(formatDateKey(d));
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

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    lastActiveDate,
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

  const dayOfWeekCounts = new Array(7).fill(0);
  const hourCounts = new Array(24).fill(0);

  for (const s of sessions) {
    const sDate = new Date(s.timestamp);
    const dateKey = formatDateKey(sDate);
    const dur = s.duration || 15;

    totalMinutes += dur;
    if (dur > longestSession) longestSession = dur;

    const dayIdx = sDate.getDay();
    dayOfWeekCounts[dayIdx] += 1;

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

  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

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
    longestSession,
    mostActiveDayName: totalSessions > 0 ? dayNames[mostActiveDayIdx] : 'None yet',
    mostActiveHourStr: totalSessions > 0 ? mostActiveHourStr : 'None yet',
  };
}

export function getWeeklyVectorStats(sessions: Session[]): DayOfWeekStat[] {
  // ISO Week: Mon (1) to Sun (0/7)
  const days = [
    { name: 'M', full: 'Monday', idx: 1 },
    { name: 'T', full: 'Tuesday', idx: 2 },
    { name: 'W', full: 'Wednesday', idx: 3 },
    { name: 'T', full: 'Thursday', idx: 4 },
    { name: 'F', full: 'Friday', idx: 5 },
    { name: 'S', full: 'Saturday', idx: 6 },
    { name: 'S', full: 'Sunday', idx: 0 },
  ];

  // Look at current week
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sun
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

  // Split into columns of 7 days
  const columns: HeatmapTile[][] = [];
  for (let c = 0; c < tiles.length; c += 7) {
    columns.push(tiles.slice(c, c + 7));
  }

  return columns;
}
