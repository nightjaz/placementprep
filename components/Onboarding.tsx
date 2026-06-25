'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface OnboardingProps {
  onComplete: (placementDate: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [placementDate, setPlacementDate] = useState('');

  const handleComplete = () => {
    if (placementDate) {
      onComplete(placementDate);
    }
  };

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 35);
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">⚔️</div>
            <h1 className="text-3xl font-bold text-zinc-100">PlacementQuest</h1>
            <p className="text-zinc-400">
              Your gamified placement preparation companion.
              Track DSA, CS fundamentals, and Electronics with XP, streaks, and harsh accountability.
            </p>
            <div className="space-y-2 text-left bg-zinc-900 p-4 rounded-lg">
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Track 8 DSA problems daily
              </p>
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> CS Fundamentals revision
              </p>
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Electronics topics + numericals
              </p>
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> XP, levels, and streaks
              </p>
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="text-red-400">⚠</span> Harsh mode: Debt + Shame Wall
              </p>
            </div>
            <Button onClick={() => setStep(2)} className="w-full" size="lg">
              Let&apos;s Begin
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <h2 className="text-2xl font-bold text-zinc-100">When are your placements?</h2>
              <p className="text-zinc-400 mt-2">
                This helps us create your countdown and pace your preparation.
              </p>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Placement Start Date</label>
              <input
                type="date"
                value={placementDate}
                onChange={(e) => setPlacementDate(e.target.value)}
                min={minDate}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {placementDate && (
              <div className="bg-zinc-900 p-4 rounded-lg text-center">
                <p className="text-zinc-400">You have</p>
                <p className="text-4xl font-bold text-emerald-400">
                  {Math.ceil((new Date(placementDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-zinc-400">days to prepare</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="secondary" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!placementDate}
                className="flex-1"
              >
                Start Quest
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
