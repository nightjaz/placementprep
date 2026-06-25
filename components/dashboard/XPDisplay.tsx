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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-amber-400">Lv.{level}</span>
            <span className="text-lg text-zinc-300">{levelInfo.title}</span>
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            {totalXP.toLocaleString()} XP total
            {multiplier > 1 && (
              <span className="text-emerald-400 ml-2">({multiplier}x multiplier active!)</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-400">{totalXP.toLocaleString()}</span>
          <p className="text-zinc-500 text-sm">Total XP</p>
        </div>
      </div>

      {nextLevelInfo && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zinc-400">Progress to Level {level + 1}</span>
            <span className="text-zinc-300">{nextLevelInfo.title}</span>
          </div>
          <ProgressBar
            current={current}
            max={required}
            color="bg-amber-500"
            showLabel
          />
        </div>
      )}

      {!nextLevelInfo && (
        <div className="text-center py-4 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-lg">
          <p className="text-amber-400 font-bold">MAX LEVEL REACHED!</p>
          <p className="text-zinc-400 text-sm">You are the Placement Champion!</p>
        </div>
      )}
    </div>
  );
}
