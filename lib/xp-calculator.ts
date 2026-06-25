import { DSAProblem, FundamentalsTopic, ElectronicsTopic, UserProfile, DailyLog } from '@/types';
import { XP_VALUES, XP_DECAY, LEVEL_THRESHOLDS } from './constants';
import { getUserProfile, updateUserProfile, getTodayLog, saveDailyLog } from './storage';

export function getStreakMultiplier(streak: number): number {
  if (streak >= 28) return 2.0;
  if (streak >= 21) return 1.75;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
}

export function calculateDSAXP(problem: DSAProblem, isFirstOfDay: boolean): number {
  let xp = XP_VALUES.dsa[problem.difficulty];
  if (isFirstOfDay) {
    xp += XP_VALUES.dsa.firstOfDay;
  }
  return xp;
}

export function calculateFundamentalsXP(topic: FundamentalsTopic): number {
  let xp = XP_VALUES.fundamentals.topicComplete;
  if (topic.confidence >= 4) {
    xp += XP_VALUES.fundamentals.highConfidence;
  }
  if (topic.subTopics.length >= 4) {
    xp += XP_VALUES.fundamentals.allSubTopics;
  }
  return xp;
}

export function calculateElectronicsXP(topic: ElectronicsTopic, numericalCount: number): number {
  let xp = XP_VALUES.electronics.topicComplete;
  xp += numericalCount * XP_VALUES.electronics.numerical;
  if (numericalCount >= 5) {
    xp += XP_VALUES.electronics.numericalBonus;
  }
  return xp;
}

export function awardXP(baseXP: number): number {
  const profile = getUserProfile();
  if (!profile) return 0;

  const multiplier = getStreakMultiplier(profile.currentStreak);
  const finalXP = Math.floor(baseXP * multiplier);

  const todayLog = getTodayLog();
  todayLog.xpEarned += finalXP;
  saveDailyLog(todayLog);

  const newTotalXP = profile.totalXP + finalXP;
  const newLevel = calculateLevel(newTotalXP);

  updateUserProfile({
    totalXP: newTotalXP,
    level: newLevel,
  });

  return finalXP;
}

export function decayXP(amount: number): number {
  const profile = getUserProfile();
  if (!profile) return 0;

  const todayLog = getTodayLog();
  todayLog.xpDecayed += amount;
  saveDailyLog(todayLog);

  const newTotalXP = Math.max(0, profile.totalXP - amount);
  const newLevel = calculateLevel(newTotalXP);

  updateUserProfile({
    totalXP: newTotalXP,
    level: newLevel,
  });

  return amount;
}

export function calculateLevel(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xp) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  return 1;
}

export function getLevelInfo(level: number) {
  return LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
}

export function getNextLevelInfo(level: number) {
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === level + 1);
  return nextLevel || null;
}

export function getXPToNextLevel(totalXP: number, level: number): { current: number; required: number; percentage: number } {
  const currentLevelInfo = getLevelInfo(level);
  const nextLevelInfo = getNextLevelInfo(level);

  if (!nextLevelInfo) {
    return { current: totalXP, required: totalXP, percentage: 100 };
  }

  const xpInCurrentLevel = totalXP - currentLevelInfo.xp;
  const xpRequiredForLevel = nextLevelInfo.xp - currentLevelInfo.xp;
  const percentage = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForLevel) * 100));

  return {
    current: xpInCurrentLevel,
    required: xpRequiredForLevel,
    percentage,
  };
}

export function calculateMissedGoalsDecay(log: DailyLog, settings: { dailyDSAGoal: number; dailyFundamentalsGoal: number; dailyElectronicsGoal: number; dailyNumericalGoal: number }): number {
  let decay = 0;

  const dsaMissed = Math.max(0, settings.dailyDSAGoal - log.dsaProblems.length);
  decay += dsaMissed * XP_DECAY.missedDSA;

  if (settings.dailyFundamentalsGoal > 0 && !log.fundamentalsTopic) {
    decay += XP_DECAY.missedFundamentals;
  }

  if (settings.dailyElectronicsGoal > 0 && !log.electronicsTopic) {
    decay += XP_DECAY.missedElectronics;
  }

  const numericalsMissed = Math.max(0, settings.dailyNumericalGoal - log.numericalsSolved);
  decay += numericalsMissed * XP_DECAY.missedNumerical;

  return decay;
}

export function calculateStreakDeathPenalty(streakLength: number): number {
  if (streakLength >= 22) return XP_DECAY.streakBroken.days22_plus;
  if (streakLength >= 15) return XP_DECAY.streakBroken.days15_21;
  if (streakLength >= 8) return XP_DECAY.streakBroken.days8_14;
  return XP_DECAY.streakBroken.days1_7;
}
