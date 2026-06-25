'use client';

import { useState } from 'react';
import { getStreakMilestones, useStreakFreeze, getStreakFreezeInfo } from '@/lib/streak-manager';
import { getStreakMultiplier } from '@/lib/xp-calculator';
import { Button } from '@/components/ui/Button';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  onFreezeUsed?: () => void;
}

export function StreakDisplay({ currentStreak, longestStreak, onFreezeUsed }: StreakDisplayProps) {
  const [freezeMessage, setFreezeMessage] = useState<string | null>(null);
  const multiplier = getStreakMultiplier(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);
  const freezeInfo = getStreakFreezeInfo();

  const handleFreeze = () => {
    const result = useStreakFreeze();
    setFreezeMessage(result.message);
    if (result.success && onFreezeUsed) {
      onFreezeUsed();
    }
    setTimeout(() => setFreezeMessage(null), 3000);
  };

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

      {currentStreak > 0 && (
        <div className="pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-600">Streak Freeze</span>
            <span className="text-xs text-zinc-500">
              {freezeInfo.freezesUsed}/{freezeInfo.maxFreezes} used this week
            </span>
          </div>
          <Button
            onClick={handleFreeze}
            disabled={!freezeInfo.canUse}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Freeze Streak ({freezeInfo.cost} XP)
          </Button>
          {freezeMessage && (
            <p className={`text-xs mt-2 text-center ${
              freezeMessage.includes('frozen') ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {freezeMessage}
            </p>
          )}
        </div>
      )}

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
