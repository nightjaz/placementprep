'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { getRandomRoast } from '@/lib/roast-generator';
import { getStreakData } from '@/lib/streak-manager';
import { getTotalDebt } from '@/lib/debt-system';
import { getCurrentDay } from '@/data/schedule';

interface RoastDisplayProps {
  forceShow?: boolean;
}

export function RoastDisplay({ forceShow = false }: RoastDisplayProps) {
  const [roast, setRoast] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const streakData = getStreakData();
    const debt = getTotalDebt();
    const currentDay = getCurrentDay();

    const shouldShowRoast = forceShow ||
      streakData.currentStreak === 0 ||
      debt.totalXP > 0 ||
      streakData.missedDays > 0;

    if (shouldShowRoast) {
      const missedDays = streakData.missedDays || (streakData.currentStreak === 0 ? 1 : 0);
      const newRoast = getRandomRoast(missedDays);
      setRoast(newRoast);
      setVisible(true);
    }
  }, [forceShow]);

  if (!visible || !roast) {
    return null;
  }

  return (
    <Card variant="danger" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 to-transparent" />

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="w-1 h-full min-h-[40px] bg-red-500/50 rounded-full flex-shrink-0" />
          <div>
            <p className="text-sm text-red-200/90 leading-relaxed">
              {roast}
            </p>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute top-0 right-0 text-zinc-600 hover:text-zinc-400 transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Card>
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
