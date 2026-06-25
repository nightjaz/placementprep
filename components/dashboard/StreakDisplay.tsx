'use client';

import { getStreakMilestones } from '@/lib/streak-manager';
import { getStreakMultiplier } from '@/lib/xp-calculator';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const multiplier = getStreakMultiplier(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-5xl font-bold text-zinc-100">{currentStreak}</p>
        <p className="text-zinc-500 text-sm mt-1">day streak</p>
      </div>

      {multiplier > 1 && (
        <div className="text-center py-2 bg-orange-500/10 rounded-lg">
          <span className="text-orange-400 text-sm font-medium">{multiplier}x XP bonus</span>
        </div>
      )}

      {nextMilestone && currentStreak > 0 && (
        <div className="text-center text-sm">
          <span className="text-zinc-600">{nextMilestone.daysAway}d to </span>
          <span className="text-zinc-400">{nextMilestone.name}</span>
        </div>
      )}

      <div className="flex justify-between text-sm pt-3 border-t border-zinc-800">
        <span className="text-zinc-600">Best</span>
        <span className="text-zinc-400">{longestStreak} days</span>
      </div>

      {currentStreak === 0 && (
        <p className="text-zinc-600 text-sm text-center">
          Complete today to start a streak
        </p>
      )}
    </div>
  );
}

function getNextMilestone(currentStreak: number): { name: string; daysAway: number } | null {
  const milestones = [
    { days: 3, name: '1.1x bonus' },
    { days: 7, name: '1.25x bonus' },
    { days: 14, name: '1.5x bonus' },
    { days: 21, name: '1.75x bonus' },
    { days: 28, name: '2x bonus' },
  ];

  for (const milestone of milestones) {
    if (currentStreak < milestone.days) {
      return {
        name: milestone.name,
        daysAway: milestone.days - currentStreak,
      };
    }
  }

  return null;
}
