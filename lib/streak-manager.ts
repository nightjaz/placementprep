import { getUserProfile, updateUserProfile, getTodayString, getDailyLog, addShameEntry, saveDailyLog } from './storage';
import { calculateStreakDeathPenalty, decayXP, calculateMissedGoalsDecay } from './xp-calculator';
import { ShameEntry, DailyLog } from '@/types';
import { getScheduleByDay, getCurrentDay } from '@/data/schedule';

const DECAY_PROCESSED_KEY = 'pq_decay_processed';

const STREAK_FREEZE_COST = 500;
const MAX_FREEZES_PER_WEEK = 1;

const STREAK_COMPLETION_THRESHOLD = 0.7; // 70% of tasks must be done for streak to continue

export function isDayComplete(log: DailyLog | null, dayNumber: number): boolean {
  if (!log) return false;

  const schedule = getScheduleByDay(dayNumber);
  if (!schedule) return false;

  // Count completed DSA problems
  const completedProblems = new Set(log.dsaProblems.map(p => p.name));
  const dsaCompleted = schedule.problems.filter(p => completedProblems.has(p.name)).length;

  // Check fundamentals (1 task)
  const fundamentalsDone = log.fundamentalsTopic !== null ? 1 : 0;

  // Check electronics - each subtopic counts as a task
  // Backward compat: if electronicsTopic exists but subTopicsCompleted is empty/missing,
  // count as all subtopics done (old single-click completion)
  const eceSubtopicsTotal = schedule.ece.subtopics.length;
  let eceSubtopicsCompleted = 0;
  if (log.electronicsTopic) {
    const logged = log.electronicsTopic.subTopicsCompleted?.length || 0;
    eceSubtopicsCompleted = logged > 0 ? logged : eceSubtopicsTotal;
  }

  // Total tasks = DSA problems + fundamentals (1) + ECE subtopics
  const totalTasks = schedule.problems.length + 1 + eceSubtopicsTotal;
  const completedTasks = dsaCompleted + fundamentalsDone + eceSubtopicsCompleted;

  // Streak continues if at least 70% of tasks are done
  return completedTasks / totalTasks >= STREAK_COMPLETION_THRESHOLD;
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
  const dayNumber = getCurrentDay();
  const schedule = getScheduleByDay(dayNumber);
  const log = getDailyLog(getTodayString());

  if (!schedule) {
    return { dsaDone: 0, dsaTotal: 0, fundamentalsDone: false, electronicsDone: false, eceDone: 0, eceTotal: 0, allComplete: false, completionPercent: 0, streakEligible: false };
  }

  const completedProblems = new Set(log?.dsaProblems.map(p => p.name) || []);
  const dsaDone = schedule.problems.filter(p => completedProblems.has(p.name)).length;

  const fundamentalsDone = log?.fundamentalsTopic !== null;

  // ECE subtopics count individually
  // Backward compat: if electronicsTopic exists but subTopicsCompleted is empty, count as all done
  const eceTotal = schedule.ece.subtopics.length;
  let eceDone = 0;
  if (log?.electronicsTopic) {
    const logged = log.electronicsTopic.subTopicsCompleted?.length || 0;
    eceDone = logged > 0 ? logged : eceTotal;
  }
  const electronicsDone = eceDone === eceTotal;

  const allComplete = dsaDone === schedule.problems.length && fundamentalsDone && electronicsDone;

  // Calculate completion percentage - each ECE subtopic is a task
  const totalTasks = schedule.problems.length + 1 + eceTotal;
  const completedTasks = dsaDone + (fundamentalsDone ? 1 : 0) + eceDone;
  const completionPercent = Math.round((completedTasks / totalTasks) * 100);
  const streakEligible = completedTasks / totalTasks >= STREAK_COMPLETION_THRESHOLD;

  return {
    dsaDone,
    dsaTotal: schedule.problems.length,
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
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
    const wasActiveYesterday = yesterdayLog && (
      yesterdayLog.dsaProblems.length > 0 ||
      yesterdayLog.fundamentalsTopic !== null ||
      yesterdayLog.electronicsTopic !== null
    );

    if (wasActiveYesterday) {
      return { streakBroken: false, newStreak: profile.currentStreak, xpLost: 0, wasActive: false };
    }
  }

  if (daysSinceActive > 1 || (daysSinceActive === 1 && profile.currentStreak > 0)) {
    const penalty = calculateStreakDeathPenalty(profile.currentStreak);
    decayXP(penalty);

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
  const dayNumber = getCurrentDay();
  const log = getDailyLog(today);

  // Only count the day if ALL tasks are complete
  if (!isDayComplete(log, dayNumber)) {
    return;
  }

  // Already counted this day
  if (profile.lastActiveDate === today) {
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
  const profile = getUserProfile();
  if (!profile) return;

  // Apply decay for missed tasks from previous days
  applyMissedTasksDecay();

  // Check if yesterday was complete but streak wasn't updated
  const currentDay = getCurrentDay();
  if (currentDay > 1) {
    const yesterdayDate = getDateForDayNumber(currentDay - 1);
    const yesterdayLog = getDailyLog(yesterdayDate);

    if (isDayComplete(yesterdayLog, currentDay - 1) && profile.lastActiveDate !== yesterdayDate) {
      updateUserProfile({
        currentStreak: profile.currentStreak + 1,
        longestStreak: Math.max(profile.longestStreak, profile.currentStreak + 1),
        lastActiveDate: yesterdayDate,
      });
    }
  }
}

  // Recalculate streak based on consecutive complete days
  let streak = 0;
  let checkDay = getCurrentDay() - 1;

  while (checkDay >= 1) {
    const checkDate = getDateForDayNumber(checkDay);
    const log = getDailyLog(checkDate);

    if (isDayComplete(log, checkDay)) {
      streak++;
      checkDay--;
    } else {
      break;
    }
  }

  // Only update if we found a streak
  if (streak > 0) {
    updateUserProfile({
      currentStreak: streak,
      longestStreak: Math.max(profile.longestStreak, streak),
      lastActiveDate: getDateForDayNumber(getCurrentDay() - 1),
    });
  }
}

export function applyMissedTasksDecay(): void {
  if (typeof window === 'undefined') return;

  const profile = getUserProfile();
  if (!profile) return;

  const today = getTodayString();
  const lastProcessed = localStorage.getItem(DECAY_PROCESSED_KEY);

  // Already processed today
  if (lastProcessed === today) return;

  const currentDay = getCurrentDay();
  let totalDecay = 0;
  const missedItems: string[] = [];

  // Check all previous days for incomplete tasks
  for (let day = 1; day < currentDay; day++) {
    const dateStr = getDateForDayNumber(day);
    const log = getDailyLog(dateStr);
    const schedule = getScheduleByDay(day);

    if (!schedule) continue;

    // Check if this day's decay was already applied
    if (log?.xpDecayed && log.xpDecayed > 0) continue;

    const settings = {
      dailyDSAGoal: schedule.problems.length,
      dailyFundamentalsGoal: 1,
      dailyElectronicsGoal: 1,
      dailyNumericalGoal: 0,
    };

    const emptyLog: DailyLog = {
      date: dateStr,
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

    const dayLog = log || emptyLog;
    const decay = calculateMissedGoalsDecay(dayLog, settings);

    if (decay > 0) {
      totalDecay += decay;

      // Track what was missed
      const completedProblems = new Set(dayLog.dsaProblems.map(p => p.name));
      const dsaMissed = schedule.problems.length - schedule.problems.filter(p => completedProblems.has(p.name)).length;
      if (dsaMissed > 0) missedItems.push(`Day ${day}: ${dsaMissed} DSA problems`);
      if (!dayLog.fundamentalsTopic) missedItems.push(`Day ${day}: CS Fundamentals`);
      if (!dayLog.electronicsTopic) missedItems.push(`Day ${day}: Electronics`);

      // Mark this day's decay as applied
      dayLog.xpDecayed = decay;
      saveDailyLog(dayLog);
    }
  }

  if (totalDecay > 0) {
    decayXP(totalDecay);

    // Add to shame wall if harsh mode is on
    if (profile.settings.harshMode) {
      const shameEntry: ShameEntry = {
        date: today,
        missedGoals: missedItems,
        xpLost: totalDecay,
        debtIncurred: 0,
      };
      addShameEntry(shameEntry);
    }
  }

  // Mark today as processed
  localStorage.setItem(DECAY_PROCESSED_KEY, today);
}

function getDateForDayNumber(dayNumber: number): string {
  const start = new Date(2026, 5, 26); // June 26, 2026
  start.setDate(start.getDate() + dayNumber - 1);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
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
