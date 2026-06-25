'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { getLevelInfo, getXPToNextLevel, getNextLevelInfo } from '@/lib/xp-calculator';
import { getStreakMultiplier } from '@/lib/xp-calculator';

interface XPDisplayProps {
  totalXP: number;
  level: number;
  streak: number;
}

export function XPDisplay({ totalXP, level, streak }: XPDisplayProps) {
  const levelInfo = getLevelInfo(level);
  const nextLevelInfo = getNextLevelInfo(level);
  const { current, required, percentage } = getXPToNextLevel(totalXP, level);
  const multiplier = getStreakMultiplier(streak);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-100">Level {level}</span>
            <span className="text-zinc-500">{levelInfo.title}</span>
          </div>
          {multiplier > 1 && (
            <p className="text-emerald-400/80 text-sm mt-1">{multiplier}x XP multiplier</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-400">{totalXP.toLocaleString()}</p>
          <p className="text-zinc-600 text-xs">total XP</p>
        </div>
      </div>

      {nextLevelInfo ? (
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Progress to Level {level + 1}</span>
            <span>{percentage}%</span>
          </div>
          <ProgressBar
            current={current}
            max={required}
            color="bg-amber-500"
            showLabel={false}
            size="sm"
          />
          <p className="text-zinc-600 text-xs mt-1.5">{nextLevelInfo.title}</p>
        </div>
      ) : (
        <div className="text-center py-3 bg-zinc-900 rounded-lg">
          <p className="text-amber-400 text-sm font-medium">Max Level</p>
        </div>
      )}
    </div>
  );
}
