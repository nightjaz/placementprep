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

  const flameIntensity = Math.min(currentStreak, 28);
  const flameHeight = currentStreak === 0 ? 40 : Math.min(40 + flameIntensity * 3, 120);
  const glowOpacity = currentStreak === 0 ? 0 : Math.min(0.2 + flameIntensity * 0.025, 0.9);
  const flameColor = currentStreak === 0
    ? 'from-zinc-600 to-zinc-700'
    : currentStreak < 7
      ? 'from-orange-400 to-orange-600'
      : currentStreak < 14
        ? 'from-orange-300 to-red-500'
        : currentStreak < 21
          ? 'from-yellow-300 to-orange-500'
          : 'from-yellow-200 to-orange-400';

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="relative" style={{ height: `${flameHeight + 30}px` }}>
          {currentStreak > 0 && (
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: `radial-gradient(circle, rgba(251, 146, 60, ${glowOpacity}) 0%, transparent 70%)`,
                transform: 'scale(1.5)',
              }}
            />
          )}
          <svg
            viewBox="0 0 64 96"
            className="relative z-10"
            style={{ height: `${flameHeight}px`, width: 'auto' }}
          >
            {currentStreak > 0 ? (
              <>
                <defs>
                  <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#fde047" />
                  </linearGradient>
                  <linearGradient id="innerFlame" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#fdba74" />
                    <stop offset="100%" stopColor="#fef3c7" />
                  </linearGradient>
                  <filter id="flameGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M32 4 C32 4 8 32 8 56 C8 72 18 88 32 88 C46 88 56 72 56 56 C56 32 32 4 32 4 Z"
                  fill="url(#flameGradient)"
                  filter="url(#flameGlow)"
                  className="animate-pulse"
                  style={{ animationDuration: `${Math.max(2 - flameIntensity * 0.05, 0.8)}s` }}
                />
                <path
                  d="M32 32 C32 32 20 48 20 62 C20 72 25 80 32 80 C39 80 44 72 44 62 C44 48 32 32 32 32 Z"
                  fill="url(#innerFlame)"
                  className="animate-pulse"
                  style={{ animationDuration: `${Math.max(1.5 - flameIntensity * 0.03, 0.6)}s` }}
                />
              </>
            ) : (
              <>
                <rect x="28" y="60" width="8" height="32" fill="#52525b" rx="2" />
                <ellipse cx="32" cy="56" rx="6" ry="4" fill="#71717a" />
                <path
                  d="M32 48 C32 48 28 52 28 54 C28 56 30 56 32 56 C34 56 36 56 36 54 C36 52 32 48 32 48 Z"
                  fill="#a1a1aa"
                  opacity="0.5"
                />
              </>
            )}
          </svg>
        </div>
        <div className="text-center mt-2">
          <p className="text-5xl font-bold text-zinc-100">{currentStreak}</p>
          <p className="text-zinc-500 text-sm mt-1">day streak</p>
        </div>
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
