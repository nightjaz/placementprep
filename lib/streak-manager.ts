import { getUserProfile, updateUserProfile, getTodayString, getDailyLog, addShameEntry } from './storage';
import { calculateStreakDeathPenalty, decayXP } from './xp-calculator';
import { ShameEntry } from '@/types';

function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
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
  if (profile.lastActiveDate !== today) {
    const { streakBroken } = checkAndUpdateStreak();
    if (!streakBroken) {
      incrementStreak();
    } else {
      updateUserProfile({
        currentStreak: 1,
        lastActiveDate: today,
      });
    }
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
