import { UserProfile, DailyLog, Quest, TopicProgress, WeeklyStats, ShameEntry, DebtRecord } from '@/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from './constants';

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getTodayString(): string {
  const now = new Date();
  // Day starts at 6 AM IST - subtract 6 hours to get the "logical" day
  const adjusted = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const year = adjusted.getFullYear();
  const month = String(adjusted.getMonth() + 1).padStart(2, '0');
  const day = String(adjusted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getEmptyDebt(): DebtRecord {
  return {
    dsaProblems: 0,
    fundamentalsTopics: 0,
    electronicsTopics: 0,
    numericals: 0,
    totalDebtXP: 0,
    lastUpdated: getTodayString(),
    history: [],
  };
}

export function getUserProfile(): UserProfile | null {
  const profile = getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  if (profile && !profile.settings.enabledEceCategories) {
    profile.settings.enabledEceCategories = DEFAULT_SETTINGS.enabledEceCategories;
  }
  return profile;
}

export function createUserProfile(placementDate: string): UserProfile {
  const profile: UserProfile = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    placementDate,
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: getTodayString(),
    debt: getEmptyDebt(),
    settings: DEFAULT_SETTINGS,
  };
  setItem(STORAGE_KEYS.USER_PROFILE, profile);
  return profile;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const profile = getUserProfile();
  if (!profile) return null;
  const updated = { ...profile, ...updates };
  setItem(STORAGE_KEYS.USER_PROFILE, updated);
  return updated;
}

export function getDailyLogs(): Record<string, DailyLog> {
  return getItem<Record<string, DailyLog>>(STORAGE_KEYS.DAILY_LOGS) || {};
}

export function getDailyLog(date: string): DailyLog | null {
  const logs = getDailyLogs();
  return logs[date] || null;
}

export function getTodayLog(): DailyLog {
  const today = getTodayString();
  const existing = getDailyLog(today);
  if (existing) return existing;

  const newLog: DailyLog = {
    date: today,
    dsaProblems: [],
    fundamentalsTopic: null,
    electronicsTopic: null,
    numericalsSolved: 0,
    checkIns: [],
    xpEarned: 0,
    xpDecayed: 0,
    questsCompleted: [],
    debtPaid: [],
    notes: '',
  };
  saveDailyLog(newLog);
  return newLog;
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  logs[log.date] = log;
  setItem(STORAGE_KEYS.DAILY_LOGS, logs);
}

export function getQuests(): Quest[] {
  return getItem<Quest[]>(STORAGE_KEYS.QUESTS) || [];
}

export function saveQuests(quests: Quest[]): void {
  setItem(STORAGE_KEYS.QUESTS, quests);
}

export function getTopicProgress(): TopicProgress[] {
  return getItem<TopicProgress[]>(STORAGE_KEYS.TOPIC_PROGRESS) || [];
}

export function saveTopicProgress(progress: TopicProgress[]): void {
  setItem(STORAGE_KEYS.TOPIC_PROGRESS, progress);
}

export function getWeeklyStats(): WeeklyStats[] {
  return getItem<WeeklyStats[]>(STORAGE_KEYS.WEEKLY_STATS) || [];
}

export function saveWeeklyStats(stats: WeeklyStats[]): void {
  setItem(STORAGE_KEYS.WEEKLY_STATS, stats);
}

export function getShameWall(): ShameEntry[] {
  return getItem<ShameEntry[]>(STORAGE_KEYS.SHAME_WALL) || [];
}

export function addShameEntry(entry: ShameEntry): void {
  const wall = getShameWall();
  wall.push(entry);
  setItem(STORAGE_KEYS.SHAME_WALL, wall);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
