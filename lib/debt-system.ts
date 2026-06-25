import { DebtRecord, DebtEvent, DailyLog, UserSettings, DebtPayment } from '@/types';
import { getUserProfile, updateUserProfile, getTodayString, addShameEntry } from './storage';
import { XP_DECAY } from './constants';

export function calculateDailyDebt(
  log: DailyLog,
  settings: UserSettings
): { dsaMissed: number; fundMissed: number; elecMissed: number; numMissed: number; totalXP: number } {
  const dsaMissed = Math.max(0, settings.dailyDSAGoal - log.dsaProblems.length);
  const fundMissed = settings.dailyFundamentalsGoal > 0 && !log.fundamentalsTopic ? 1 : 0;
  const elecMissed = settings.dailyElectronicsGoal > 0 && !log.electronicsTopic ? 1 : 0;
  const numMissed = Math.max(0, settings.dailyNumericalGoal - log.numericalsSolved);

  const totalXP = (dsaMissed * 75) + (fundMissed * 150) + (elecMissed * 150) + (numMissed * 20);

  return { dsaMissed, fundMissed, elecMissed, numMissed, totalXP };
}

export function addDebt(
  category: 'dsa' | 'fundamentals' | 'electronics' | 'numerical',
  amount: number
): DebtRecord | null {
  const profile = getUserProfile();
  if (!profile) return null;

  const debt = { ...profile.debt };
  const today = getTodayString();

  switch (category) {
    case 'dsa':
      debt.dsaProblems += amount;
      debt.totalDebtXP += amount * 75;
      break;
    case 'fundamentals':
      debt.fundamentalsTopics += amount;
      debt.totalDebtXP += amount * 150;
      break;
    case 'electronics':
      debt.electronicsTopics += amount;
      debt.totalDebtXP += amount * 150;
      break;
    case 'numerical':
      debt.numericals += amount;
      debt.totalDebtXP += amount * 20;
      break;
  }

  debt.history.push({
    date: today,
    type: 'incurred',
    category,
    amount,
    xpImpact: category === 'dsa' ? amount * 75 :
              category === 'numerical' ? amount * 20 : amount * 150,
  });

  debt.lastUpdated = today;
  updateUserProfile({ debt });

  return debt;
}

export function payDebt(payment: DebtPayment): DebtRecord | null {
  const profile = getUserProfile();
  if (!profile) return null;

  const debt = { ...profile.debt };
  const today = getTodayString();

  switch (payment.category) {
    case 'dsa':
      debt.dsaProblems = Math.max(0, debt.dsaProblems - payment.amount);
      break;
    case 'fundamentals':
      debt.fundamentalsTopics = Math.max(0, debt.fundamentalsTopics - payment.amount);
      break;
    case 'electronics':
      debt.electronicsTopics = Math.max(0, debt.electronicsTopics - payment.amount);
      break;
    case 'numerical':
      debt.numericals = Math.max(0, debt.numericals - payment.amount);
      break;
  }

  debt.totalDebtXP = Math.max(0, debt.totalDebtXP - payment.xpRecovered);

  debt.history.push({
    date: today,
    type: 'paid',
    category: payment.category,
    amount: payment.amount,
    xpImpact: -payment.xpRecovered,
  });

  debt.lastUpdated = today;
  updateUserProfile({ debt });

  return debt;
}

export function applyDailyInterest(): DebtRecord | null {
  const profile = getUserProfile();
  if (!profile || profile.debt.totalDebtXP === 0) return null;

  const debt = { ...profile.debt };
  const today = getTodayString();

  if (debt.lastUpdated === today) {
    return debt;
  }

  const interest = Math.ceil(debt.totalDebtXP * XP_DECAY.debtInterestRate);

  debt.totalDebtXP += interest;
  debt.history.push({
    date: today,
    type: 'interest',
    category: 'dsa',
    amount: 0,
    xpImpact: interest,
  });

  debt.lastUpdated = today;
  updateUserProfile({ debt });

  if (profile.settings.harshMode && interest > 0) {
    addShameEntry({
      date: today,
      missedGoals: [`Debt interest: +${interest} XP added to your debt`],
      xpLost: 0,
      debtIncurred: interest,
    });
  }

  return debt;
}

export function getTotalDebt(): {
  dsaProblems: number;
  fundamentalsTopics: number;
  electronicsTopics: number;
  numericals: number;
  totalXP: number;
} {
  const profile = getUserProfile();
  if (!profile) {
    return { dsaProblems: 0, fundamentalsTopics: 0, electronicsTopics: 0, numericals: 0, totalXP: 0 };
  }

  return {
    dsaProblems: profile.debt.dsaProblems,
    fundamentalsTopics: profile.debt.fundamentalsTopics,
    electronicsTopics: profile.debt.electronicsTopics,
    numericals: profile.debt.numericals,
    totalXP: profile.debt.totalDebtXP,
  };
}

export function hasDebt(): boolean {
  const debt = getTotalDebt();
  return debt.totalXP > 0;
}

export function getDebtSummary(): string[] {
  const debt = getTotalDebt();
  const summary: string[] = [];

  if (debt.dsaProblems > 0) {
    summary.push(`${debt.dsaProblems} DSA problem${debt.dsaProblems > 1 ? 's' : ''}`);
  }
  if (debt.fundamentalsTopics > 0) {
    summary.push(`${debt.fundamentalsTopics} Fundamentals topic${debt.fundamentalsTopics > 1 ? 's' : ''}`);
  }
  if (debt.electronicsTopics > 0) {
    summary.push(`${debt.electronicsTopics} Electronics topic${debt.electronicsTopics > 1 ? 's' : ''}`);
  }
  if (debt.numericals > 0) {
    summary.push(`${debt.numericals} numerical${debt.numericals > 1 ? 's' : ''}`);
  }

  return summary;
}
