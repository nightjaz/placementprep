'use client';

import { getStreakMilestones } from '@/lib/streak-manager';
import { getStreakMultiplier } from '@/lib/xp-calculator';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const milestones = getStreakMilestones(currentStreak);
  const multiplier = getStreakMultiplier(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl">🔥</span>
            <span className="text-5xl font-bold text-orange-400">{currentStreak}</span>
          </div>
          <p className="text-zinc-400 mt-1">Day Streak</p>
        </div>
      </div>

      {multiplier > 1 && (
        <div className="text-center bg-orange-500/10 rounded-lg py-2 px-4 border border-orange-500/30">
          <span className="text-orange-400 font-medium">{multiplier}x XP Multiplier Active!</span>
        </div>
      )}

      {currentStreak > 0 && milestones.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 uppercase">Achievements</p>
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone, i) => (
              <span
                key={i}
                className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full"
              >
                {milestone}
              </span>
            ))}
          </div>
        </div>
      )}

      {nextMilestone && (
        <div className="text-center text-sm text-zinc-400">
          <span className="text-zinc-500">{nextMilestone.daysAway} days to </span>
          <span className="text-orange-300">{nextMilestone.name}</span>
        </div>
      )}

      <div className="flex justify-between text-sm pt-2 border-t border-zinc-700">
        <span className="text-zinc-500">Longest Streak</span>
        <span className="text-zinc-300">{longestStreak} days</span>
      </div>

      {currentStreak === 0 && (
        <div className="text-center text-zinc-500 py-2">
          <p>No active streak</p>
          <p className="text-xs mt-1">Complete today&apos;s goals to start a new streak!</p>
        </div>
      )}
    </div>
  );
}

function getNextMilestone(currentStreak: number): { name: string; daysAway: number } | null {
  const milestones = [
    { days: 3, name: '3-Day Warrior' },
    { days: 7, name: 'Week Champion' },
    { days: 14, name: 'Fortnight Legend' },
    { days: 21, name: 'Three Week Titan' },
    { days: 28, name: 'Month Master' },
    { days: 35, name: '5-Week Placement God' },
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
