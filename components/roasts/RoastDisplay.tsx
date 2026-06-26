'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { getRandomRoast, getRandomCelebration } from '@/lib/roast-generator';
import { getStreakData, getTodayCompletionStatus } from '@/lib/streak-manager';
import { getTotalDebt } from '@/lib/debt-system';
import { getCurrentDay } from '@/data/schedule';

interface RoastDisplayProps {
  forceShow?: boolean;
}

export function RoastDisplay({ forceShow = false }: RoastDisplayProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isRoast, setIsRoast] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const streakData = getStreakData();
    const debt = getTotalDebt();
    const completion = getTodayCompletionStatus();

    // If day is complete, show celebration
    if (completion.allComplete) {
      setMessage(getRandomCelebration(streakData.currentStreak));
      setIsRoast(false);
      setVisible(true);
      return;
    }

    const shouldShowRoast = forceShow ||
      streakData.currentStreak === 0 ||
      debt.totalXP > 0 ||
      streakData.missedDays > 0;

    if (shouldShowRoast) {
      const missedDays = streakData.missedDays || (streakData.currentStreak === 0 ? 1 : 0);
      setMessage(getRandomRoast(missedDays));
      setIsRoast(true);
      setVisible(true);
    }
  }, [forceShow]);

  if (!visible || !message) {
    return null;
  }

  if (!isRoast) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-emerald-900/40 border border-emerald-500/30 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="relative text-center">
          <p className="text-2xl md:text-3xl font-bold text-emerald-300 leading-tight">
            {message}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-emerald-600 hover:text-emerald-400 transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950/50 via-red-900/40 to-red-950/50 border border-red-500/30 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.15),transparent_50%)]" />
      <div className="relative text-center">
        <p className="text-xl md:text-2xl font-bold text-red-300 leading-tight">
          {message}
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-400 transition-colors p-1"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ShameWall() {
  const [missedDays, setMissedDays] = useState<string[]>([]);

  useEffect(() => {
    const startDate = new Date('2026-06-26');
    const today = new Date();
    const missed: string[] = [];

    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < daysDiff; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const stored = localStorage.getItem(`daily_log_${dateStr}`);
      if (stored) {
        const log = JSON.parse(stored);
        if (!log.dsaProblems || log.dsaProblems.length === 0) {
          missed.push(dateStr);
        }
      } else if (i < daysDiff) {
        missed.push(dateStr);
      }
    }

    setMissedDays(missed);
  }, []);

  if (missedDays.length === 0) {
    return null;
  }

  return (
    <Card variant="danger">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <h3 className="text-sm font-medium text-red-400">Shame Wall</h3>
      </div>

      <div className="space-y-1">
        {missedDays.slice(-5).map((date) => (
          <div
            key={date}
            className="flex items-center gap-2 text-xs text-red-300/70 py-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-500/50" />
            <span>{new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
            <span className="text-red-500/50">— Zero progress</span>
          </div>
        ))}
      </div>

      {missedDays.length > 5 && (
        <p className="text-xs text-red-500/50 mt-2">
          +{missedDays.length - 5} more days of nothing
        </p>
      )}
    </Card>
  );
}
