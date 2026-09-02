import { Session, UserSettings, Achievement } from '../types/tracker';
import { DEFAULT_ACHIEVEMENTS } from './achievements';

const SESSIONS_KEY = 'goontrack_sessions_v2';
const SETTINGS_KEY = 'goontrack_settings_v2';
const ACHIEVEMENTS_KEY = 'goontrack_achievements_v2';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  dailyGoalSessions: 2,
  dailyGoalMinutes: 45,
  mascotAlias: 'Blobby',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function loadSessions(): Session[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to localStorage:', err);
  }
}

export function addSession(sessionData: Omit<Session, 'id'>): Session {
  const current = loadSessions();
  const newSession: Session = {
    ...sessionData,
    id: 'gt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
  };
  const updated = [newSession, ...current];
  saveSessions(updated);
  return newSession;
}

export function deleteSession(id: string): Session[] {
  const current = loadSessions();
  const updated = current.filter((s) => s.id !== id);
  saveSessions(updated);
  return updated;
}

export function loadSettings(): UserSettings {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadAchievements(): Achievement[] {
  if (!isClient()) return DEFAULT_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return DEFAULT_ACHIEVEMENTS;
    const stored: Achievement[] = JSON.parse(raw);
    return DEFAULT_ACHIEVEMENTS.map((def) => {
      const match = stored.find((s) => s.id === def.id);
      return match ? { ...def, ...match } : def;
    });
  } catch {
    return DEFAULT_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (err) {
    console.error('Failed to save achievements:', err);
  }
}

export function exportAllDataJSON(): string {
  const payload = {
    app: 'GOONTRACK',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    sessions: loadSessions(),
    settings: loadSettings(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDataJSON(jsonStr: string): { success: boolean; count?: number; error?: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.sessions || !Array.isArray(data.sessions)) {
      return { success: false, error: 'Invalid JSON: missing sessions array' };
    }
    saveSessions(data.sessions);
    if (data.settings) saveSettings(data.settings);
    return { success: true, count: data.sessions.length };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function nukeAllData(): void {
  if (!isClient()) return;
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
}

/**
 * Generate a lively seed dataset with a 12-day streak and 27 sessions this month
 * to perfectly match the design specification!
 */
export function generateSeedMockData(): Session[] {
  const moods: Array<'😐' | '🙂' | '😈' | '🫠' | '💀'> = ['🙂', '😈', '🫠', '🙂', '😈'];
  const notes = [
    'Cruised into deep focus.',
    'Degenerate rabbit hole exploration.',
    'Brain melted into pure vector flow.',
    'Quick dopamine check-in.',
    'Committed to the bit.',
    'Unreasonable momentum sustained.',
  ];

  const sessions: Session[] = [];
  const now = new Date();

  // 12-day consecutive streak leading up to today
  for (let dayOffset = 11; dayOffset >= 0; dayOffset--) {
    const d = new Date(now);
    d.setDate(now.getDate() - dayOffset);

    // Number of sessions: 2 today, 2-3 earlier
    const count = dayOffset === 0 ? 2 : (dayOffset % 3 === 0 ? 3 : 2);

    for (let sIdx = 0; sIdx < count; sIdx++) {
      const sessionDate = new Date(d);
      const hours = [2, 14, 18, 21, 23];
      const h = hours[(dayOffset + sIdx * 2) % hours.length];
      sessionDate.setHours(h, Math.floor(Math.random() * 45), 0);

      const duration = [17, 24, 31, 42, 55, 60][(dayOffset + sIdx) % 6];
      const mood = moods[(dayOffset + sIdx) % moods.length];
      const note = sIdx === 0 ? notes[(dayOffset) % notes.length] : undefined;

      sessions.push({
        id: 'seed_' + dayOffset + '_' + sIdx,
        timestamp: sessionDate.toISOString(),
        duration,
        mood,
        note,
      });
    }
  }

  saveSessions(sessions);
  return sessions;
}
