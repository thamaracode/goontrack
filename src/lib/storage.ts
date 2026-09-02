import { Session, UserSettings, Achievement } from '../types/tracker';
import { DEFAULT_ACHIEVEMENTS } from './achievements';

const SESSIONS_KEY = 'goontrack_sessions_v2';
const SETTINGS_KEY = 'goontrack_settings_v2';
const ACHIEVEMENTS_KEY = 'goontrack_achievements_v2';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'purple',
  dailyGoalSessions: 2,
  dailyGoalMinutes: 45,
  mascotAlias: 'Blobby',
};

// Sessions Persistence
export function loadSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // safe fallback
  }
}

export function addSession(session: Omit<Session, 'id'>): Session {
  const sessions = loadSessions();
  const newSession: Session = {
    ...session,
    id: 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
  };
  const updated = [newSession, ...sessions];
  saveSessions(updated);
  return newSession;
}

export function deleteSession(id: string): Session[] {
  const sessions = loadSessions();
  const updated = sessions.filter((s) => s.id !== id);
  saveSessions(updated);
  return updated;
}

// Settings Persistence
export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // safe fallback
  }
}

// Achievements Persistence
export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return DEFAULT_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return DEFAULT_ACHIEVEMENTS;
    const parsed: Achievement[] = JSON.parse(raw);
    return DEFAULT_ACHIEVEMENTS.map((def) => {
      const match = parsed.find((p) => p.id === def.id);
      return match ? { ...def, ...match } : def;
    });
  } catch {
    return DEFAULT_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // safe fallback
  }
}

// Demo Dataset Generator
export function generateSeedMockData(): Session[] {
  const moods: Session['mood'][] = ['🙂', '😈', '🫠', '🙂', '😈'];
  const notes = [
    'Cruised into deep focus flow.',
    'Late night dopamine exploration.',
    'Committed to the bit with high telemetry.',
    'Flow state achieved. Neural link stabilized.',
    'Weekend momentum check-in.',
  ];

  const sessions: Session[] = [];
  const now = new Date();

  // Create 12 consecutive active days
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const count = i === 0 ? 2 : i % 3 === 0 ? 3 : 2;

    for (let j = 0; j < count; j++) {
      const sDate = new Date(d);
      const hours = [2, 14, 18, 21][(i + j) % 4];
      sDate.setHours(hours, 30, 0, 0);

      sessions.push({
        id: `seed_${i}_${j}`,
        timestamp: sDate.toISOString(),
        duration: [17, 24, 31, 42, 55][(i + j) % 5],
        mood: moods[(i + j) % moods.length],
        note: j === 0 ? notes[i % notes.length] : undefined,
      });
    }
  }

  saveSessions(sessions);
  return sessions;
}

// Import JSON
export function importDataJSON(jsonStr: string): { success: boolean; count?: number; error?: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || !Array.isArray(data.sessions)) {
      return { success: false, error: 'Invalid backup format: Missing sessions array.' };
    }
    saveSessions(data.sessions);
    if (data.settings) {
      saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    }
    return { success: true, count: data.sessions.length };
  } catch (err: any) {
    return { success: false, error: err.message || 'JSON parse error.' };
  }
}

// Complete Wipe
export function nukeAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch {
    // safe fallback
  }
}
