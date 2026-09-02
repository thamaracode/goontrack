import { Session } from '../types/tracker';
import { loadSessions, loadSettings } from './storage';

export function exportSessionsToCSV(sessions: Session[]): string {
  const headers = ['Session_ID', 'Timestamp_ISO', 'Date', 'Time', 'Duration_Minutes', 'Mood', 'Notes'];

  const rows = sessions.map((s) => {
    const d = new Date(s.timestamp);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const cleanNote = s.note ? `"${s.note.replace(/"/g, '""')}"` : '""';

    return [
      s.id,
      s.timestamp,
      dateStr,
      timeStr,
      s.duration,
      s.mood || '🙂',
      cleanNote,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(): void {
  const sessions = loadSessions();
  const csvContent = exportSessionsToCSV(sessions);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `goontrack_sessions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(): void {
  const payload = {
    app: 'GOONTRACK',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    sessions: loadSessions(),
    settings: loadSettings(),
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `goontrack_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
