import { getUserProfile, updateUserProfile, getTodayString, getDailyLog, addShameEntry } from './storage';
import { calculateMissedGoalsDecay, decayXP } from './xp-calculator';
import { ShameEntry, DailyLog } from '@/types';

const STREAK_FREEZE_COST = 500;
const MAX_FREEZES_PER_WEEK = 1;

const STREAK_COMPLETION_THRESHOLD = 0.65;
const DECAY_PROCESSED_KEY = 'pq_decay_processed';

function getCompletion(log: DailyLog | null) {
  const settings = getUserProfile()?.settings;
  if (!log || !settings) return { completed: 0, total: 0, percentage: 0 };

  const total = settings.dailyDSAGoal + settings.dailyFundamentalsGoal + settings.dailyElectronicsGoal + settings.dailyNumericalGoal;
  const completed =
    Math.min(log.dsaProblems.length, settings.dailyDSAGoal) +
    (log.fundamentalsTopic ? settings.dailyFundamentalsGoal : 0) +
    (log.electronicsTopic ? settings.dailyElectronicsGoal : 0) +
    Math.min(log.numericalsSolved, settings.dailyNumericalGoal);

  return { completed, total, percentage: total === 0 ? 100 : Math.round((completed / total) * 100) };
}

export function isDayComplete(log: DailyLog | null, _dayNumber?: number): boolean {
  const { completed, total } = getCompletion(log);
  return total > 0 && completed / total >= STREAK_COMPLETION_THRESHOLD;
}

export function getTodayCompletionStatus(): {
  dsaDone: number;
  dsaTotal: number;
  fundamentalsDone: boolean;
  electronicsDone: boolean;
  eceDone: number;
  eceTotal: number;
  allComplete: boolean;
  completionPercent: number;
  streakEligible: boolean;
} {
  const log = getDailyLog(getTodayString());
  const settings = getUserProfile()?.settings;
  const progress = getCompletion(log);
  const dsaDone = log?.dsaProblems.length || 0;
  const dsaTotal = settings?.dailyDSAGoal || 0;
  const fundamentalsDone = Boolean(log?.fundamentalsTopic);
  const electronicsDone = Boolean(log?.electronicsTopic);
  const eceTotal = settings?.dailyElectronicsGoal || 0;
  const eceDone = electronicsDone ? eceTotal : 0;
  const allComplete = progress.total > 0 && progress.completed >= progress.total;
  const completionPercent = progress.percentage;
  const streakEligible = completionPercent >= STREAK_COMPLETION_THRESHOLD * 100;

  return {
    dsaDone,
    dsaTotal,
    fundamentalsDone,
    electronicsDone,
    eceDone,
    eceTotal,
    allComplete,
    completionPercent,
    streakEligible,
  };
}

function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getYesterdayString(): string {
  const now = new Date();
  // Day starts at 6 AM IST - subtract 6 hours to get the "logical" day
  const adjusted = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  adjusted.setDate(adjusted.getDate() - 1);
  const year = adjusted.getFullYear();
  const month = String(adjusted.getMonth() + 1).padStart(2, '0');
  const day = String(adjusted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function checkAndUpdateStreak(): {
  streakBroken: boolean;
  newStreak: number;
  xpLost: number;
  wasActive: boolean;
} {
  const profile = getUserProfile();
  if (!profile) {
    return { streakBroken: false, newStreak: 0, xpLost: 0, wasActive: false };
  }

  const today = getTodayString();
  const lastActive = profile.lastActiveDate;
  const daysSinceActive = getDaysBetween(lastActive, today);

  if (daysSinceActive === 0) {
    return { streakBroken: false, newStreak: profile.currentStreak, xpLost: 0, wasActive: true };
  }

  if (daysSinceActive === 1) {
    const yesterdayLog = getDailyLog(getYesterdayString());
    const wasActiveYesterday = isDayComplete(yesterdayLog);

    if (wasActiveYesterday) {
      return { streakBroken: false, newStreak: profile.currentStreak, xpLost: 0, wasActive: false };
    }
  }

  if (daysSinceActive > 1 || (daysSinceActive === 1 && profile.currentStreak > 0)) {
    // Missing a day resets the active streak but never removes earned XP.
    const penalty = 0;

    const missedDates: string[] = [];
    for (let i = 1; i < daysSinceActive; i++) {
      const missedDate = new Date(lastActive);
      missedDate.setDate(missedDate.getDate() + i);
      missedDates.push(missedDate.toISOString().split('T')[0]);
    }

    if (profile.settings.harshMode && profile.currentStreak > 0) {
      const shameEntry: ShameEntry = {
        date: today,
        missedGoals: [`Broke ${profile.currentStreak}-day streak!`, ...missedDates.map(d => `Missed: ${d}`)],
        xpLost: penalty,
        debtIncurred: 0,
      };
      addShameEntry(shameEntry);
    }

    updateUserProfile({
      currentStreak: 0,
      lastActiveDate: today,
    });

    return {
      streakBroken: true,
      newStreak: 0,
      xpLost: penalty,
      wasActive: false
    };
  }

  return { streakBroken: false, newStreak: profile.currentStreak, xpLost: 0, wasActive: false };
}

export function incrementStreak(): number {
  const profile = getUserProfile();
  if (!profile) return 0;

  const today = getTodayString();
  const newStreak = profile.currentStreak + 1;
  const newLongest = Math.max(profile.longestStreak, newStreak);

  updateUserProfile({
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
  });

  return newStreak;
}

export function markTodayActive(): void {
  const profile = getUserProfile();
  if (!profile) return;

  const today = getTodayString();
  const log = getDailyLog(today);

  if (!isDayComplete(log)) {
    return;
  }

  // Already counted this day
  if (profile.lastActiveDate === today && profile.currentStreak > 0) {
    return;
  }

  // Check if streak should be broken first
  const { streakBroken } = checkAndUpdateStreak();

  if (streakBroken || profile.currentStreak === 0) {
    updateUserProfile({
      currentStreak: 1,
      longestStreak: Math.max(profile.longestStreak, 1),
      lastActiveDate: today,
    });
  } else {
    incrementStreak();
  }
}

export function initializeStreakFromHistory(): void {
  applyMissedTasksDecay();
}

export function applyMissedTasksDecay(): void {
  if (typeof window === 'undefined') return;
  const profile = getUserProfile();
  if (!profile?.settings.xpDecayEnabled) return;

  const yesterday = getYesterdayString();
  if (localStorage.getItem(DECAY_PROCESSED_KEY) === yesterday) return;

  const log = getDailyLog(yesterday) || {
    date: yesterday,
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
  const requested = calculateMissedGoalsDecay(log, profile.settings);
  const actual = decayXP(requested);
  localStorage.setItem(DECAY_PROCESSED_KEY, yesterday);

  if (actual > 0 && profile.settings.harshMode) {
    addShameEntry({ date: getTodayString(), missedGoals: [`Missed daily goals on ${yesterday}`], xpLost: actual, debtIncurred: 0 });
  }
}

export function getStreakMilestones(streak: number): string[] {
  const milestones: string[] = [];
  if (streak >= 3) milestones.push('3-Day Warrior (1.1x XP)');
  if (streak >= 7) milestones.push('Week Champion (1.25x XP)');
  if (streak >= 14) milestones.push('Fortnight Legend (1.5x XP)');
  if (streak >= 21) milestones.push('Three Week Titan (1.75x XP)');
  if (streak >= 28) milestones.push('Month Master (2x XP)');
  if (streak >= 35) milestones.push('5-Week Placement God!');
  return milestones;
}

export function getStreakData(): {
  currentStreak: number;
  longestStreak: number;
  missedDays: number;
  freezesUsedThisWeek: number;
  canUseFreeze: boolean;
} {
  const profile = getUserProfile();
  if (!profile) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      missedDays: 0,
      freezesUsedThisWeek: 0,
      canUseFreeze: false,
    };
  }

  const freezesUsed = getFreezesUsedThisWeek();
  const canUseFreeze = freezesUsed < MAX_FREEZES_PER_WEEK && profile.totalXP >= STREAK_FREEZE_COST;

  const today = getTodayString();
  const lastActive = profile.lastActiveDate;
  const missedDays = getDaysBetween(lastActive, today) - 1;

  return {
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    missedDays: Math.max(0, missedDays),
    freezesUsedThisWeek: freezesUsed,
    canUseFreeze,
  };
}

function getFreezesUsedThisWeek(): number {
  if (typeof window === 'undefined') return 0;
  const weekStart = getWeekStart();
  const stored = localStorage.getItem(`streak_freezes_${weekStart}`);
  return stored ? parseInt(stored, 10) : 0;
}

function getWeekStart(): string {
  const now = new Date();
  // Day starts at 6 AM IST - subtract 6 hours to get the "logical" day
  const adjusted = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const dayOfWeek = adjusted.getDay();
  const diff = adjusted.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(adjusted.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

export function useStreakFreeze(): { success: boolean; message: string } {
  const profile = getUserProfile();
  if (!profile) {
    return { success: false, message: 'No profile found' };
  }

  if (profile.totalXP < STREAK_FREEZE_COST) {
    return { success: false, message: `Need ${STREAK_FREEZE_COST} XP to freeze streak` };
  }

  const freezesUsed = getFreezesUsedThisWeek();
  if (freezesUsed >= MAX_FREEZES_PER_WEEK) {
    return { success: false, message: 'Already used freeze this week' };
  }

  decayXP(STREAK_FREEZE_COST);

  const weekStart = getWeekStart();
  localStorage.setItem(`streak_freezes_${weekStart}`, String(freezesUsed + 1));

  const today = getTodayString();
  updateUserProfile({ lastActiveDate: today });

  return { success: true, message: `Streak frozen! -${STREAK_FREEZE_COST} XP` };
}

export function getStreakFreezeInfo(): {
  cost: number;
  freezesUsed: number;
  maxFreezes: number;
  canUse: boolean;
} {
  const profile = getUserProfile();
  const freezesUsed = getFreezesUsedThisWeek();
  const canUse = freezesUsed < MAX_FREEZES_PER_WEEK && (profile?.totalXP ?? 0) >= STREAK_FREEZE_COST;

  return {
    cost: STREAK_FREEZE_COST,
    freezesUsed,
    maxFreezes: MAX_FREEZES_PER_WEEK,
    canUse,
  };
}
