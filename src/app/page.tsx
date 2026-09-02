'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Session,
  UserSettings,
  Achievement,
  StreakData,
  SummaryStats,
  TabType,
  MoodEmoji,
} from '../types/tracker';
import {
  loadSessions,
  saveSessions,
  addSession,
  deleteSession,
  loadSettings,
  saveSettings,
  loadAchievements,
  saveAchievements,
  generateSeedMockData,
  nukeAllData,
  DEFAULT_SETTINGS,
} from '../lib/storage';
import { calculateStreak, computeSummaryStats } from '../lib/analytics';
import { evaluateAchievements, DEFAULT_ACHIEVEMENTS } from '../lib/achievements';
import { arcadeSound } from '../lib/audio';

import { DesktopSidebar } from '../components/navigation/DesktopSidebar';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';
import { HomeScreen } from '../components/screens/HomeScreen';
import { AnalyticsScreen } from '../components/screens/AnalyticsScreen';
import { AchievementsScreen } from '../components/screens/AchievementsScreen';
import { HistoryScreen } from '../components/screens/HistoryScreen';
import { SettingsScreen } from '../components/screens/SettingsScreen';
import { LogSessionSheet } from '../components/modals/LogSessionSheet';
import { LiveTimerSheet } from '../components/modals/LiveTimerSheet';

export default function AppShell() {
  const [isClient, setIsClient] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    isActiveToday: false,
    lastActiveDate: null,
  });
  const [stats, setStats] = useState<SummaryStats>({
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    weekMinutes: 0,
    monthSessions: 0,
    monthMinutes: 0,
    totalSessions: 0,
    totalMinutes: 0,
    avgDuration: 0,
    longestSession: 0,
    mostActiveDayName: 'None',
    mostActiveHourStr: 'None',
  });

  // Modal States
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isLiveTimerOpen, setIsLiveTimerOpen] = useState(false);

  // Confetti helper
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#8B5CF6', '#F472B6', '#FACC15', '#22D3EE', '#34D399'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Recalculate derived data
  const refreshData = useCallback((currentSessions: Session[]) => {
    const computedStreak = calculateStreak(currentSessions);
    setStreak(computedStreak);

    const computedStats = computeSummaryStats(currentSessions);
    setStats(computedStats);

    const currentAch = loadAchievements();
    const { updated, newlyUnlocked } = evaluateAchievements(
      currentSessions,
      computedStreak,
      currentAch
    );

    setAchievements(updated);
    saveAchievements(updated);

    if (newlyUnlocked.length > 0) {
      arcadeSound.playAchievementFanfare();
      triggerConfetti();
    }
  }, [triggerConfetti]);

  // Initial Data Load (clean empty state by default)
  useEffect(() => {
    setIsClient(true);
    const initialSessions = loadSessions();
    const loadedSettings = loadSettings();

    setSessions(initialSessions);
    setSettings(loadedSettings);
    arcadeSound.setEnabled(loadedSettings.soundEnabled);

    refreshData(initialSessions);
  }, [refreshData]);

  // Handlers
  const handleSaveSession = (newSessionData: { duration: number; mood: MoodEmoji; note?: string }) => {
    const saved = addSession({
      duration: newSessionData.duration,
      mood: newSessionData.mood,
      note: newSessionData.note,
      timestamp: new Date().toISOString(),
    });
    const updated = [saved, ...sessions];
    setSessions(updated);
    refreshData(updated);
    triggerConfetti();
  };

  const handleQuickLog = () => {
    const saved = addSession({
      duration: 15,
      mood: '🙂',
      timestamp: new Date().toISOString(),
      note: 'Quick +15m Check-in',
    });
    const updated = [saved, ...sessions];
    setSessions(updated);
    refreshData(updated);
    arcadeSound.playSaveSession();
    triggerConfetti();
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSessions(updated);
    refreshData(updated);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    arcadeSound.setEnabled(newSettings.soundEnabled);
  };

  const handleSeedDemo = () => {
    const demo = generateSeedMockData();
    setSessions(demo);
    refreshData(demo);
    triggerConfetti();
  };

  const handleNukeData = () => {
    nukeAllData();
    setSessions([]);
    const resetStreak: StreakData = {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      lastActiveDate: null,
    };
    setStreak(resetStreak);
    setStats(computeSummaryStats([]));
    setAchievements(DEFAULT_ACHIEVEMENTS);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#100B1F] flex items-center justify-center font-bold text-goon-purpleLight">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl animate-bounce">🟣</div>
          <span className="text-xs uppercase tracking-widest text-goon-muted">LOADING GOONTRACK...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-goon-bg flex flex-col md:flex-row text-goon-text">
      {/* Desktop Sidebar (Wide screens) */}
      <DesktopSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLog={() => setIsLogOpen(true)}
        streak={streak}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
        {currentTab === 'home' && (
          <HomeScreen
            sessions={sessions}
            streak={streak}
            stats={stats}
            onOpenLog={() => setIsLogOpen(true)}
            onOpenLiveTimer={() => setIsLiveTimerOpen(true)}
            onQuickLog={handleQuickLog}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsScreen
            sessions={sessions}
            stats={stats}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsScreen
            achievements={achievements}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onSeedDemoData={handleSeedDemo}
            onNukeData={handleNukeData}
            onDataChanged={() => {
              const reloaded = loadSessions();
              setSessions(reloaded);
              refreshData(reloaded);
            }}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation (Phones & WebViews) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Modals / Bottom Sheets */}
      <LogSessionSheet
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        onSave={handleSaveSession}
      />

      <LiveTimerSheet
        isOpen={isLiveTimerOpen}
        onClose={() => setIsLiveTimerOpen(false)}
        onSave={handleSaveSession}
      />
    </div>
  );
}
