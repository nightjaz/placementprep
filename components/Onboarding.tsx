'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SCHEDULE, getTotalProblems } from '@/data/schedule';

interface OnboardingProps {
  onComplete: (placementDate: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const totalProblems = getTotalProblems();
  const day1 = SCHEDULE[0];

  const handleStart = () => {
    onComplete('2026-08-01');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">PlacementQuest</h1>
            <p className="text-zinc-500 mt-2">
              35 days. {totalProblems} problems. One goal.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Timeline</span>
              <span className="text-zinc-200 text-sm font-medium">June 26 — Aug 1</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Total Problems</span>
              <span className="text-zinc-200 text-sm font-medium">{totalProblems}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Days 1-10</span>
              <span className="text-blue-400 text-sm">6 problems/day</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Days 11-30</span>
              <span className="text-amber-400 text-sm">7-8 problems/day</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-500 text-sm">Days 31-35</span>
              <span className="text-purple-400 text-sm">Revision</span>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Day 1 Preview</p>
            <p className="text-zinc-300 text-sm font-medium mb-2">{day1.topic}</p>
            <div className="flex flex-wrap gap-1.5">
              {day1.problems.slice(0, 3).map((p) => (
                <span key={p.name} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                  {p.name}
                </span>
              ))}
              <span className="text-xs text-zinc-600 px-2 py-1">+{day1.problems.length - 3} more</span>
            </div>
          </div>

          <Button onClick={handleStart} className="w-full" size="lg">
            Begin Day 1
          </Button>
        </div>
      </Card>
    </div>
  );
}
