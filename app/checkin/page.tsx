'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getUserProfile, getTodayLog } from '@/lib/storage';
import { hasDebt, getDebtSummary, getTotalDebt } from '@/lib/debt-system';
import { UserProfile, DailyLog } from '@/types';

export default function CheckInPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [dismissCountdown, setDismissCountdown] = useState(10);
  const [acknowledged, setAcknowledged] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    const loadedProfile = getUserProfile();
    if (!loadedProfile) {
      router.push('/');
      return;
    }
    setProfile(loadedProfile);
    setLog(getTodayLog());
  }, [router]);

  useEffect(() => {
    if (dismissCountdown > 0) {
      const timer = setTimeout(() => setDismissCountdown(dismissCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanDismiss(true);
    }
  }, [dismissCountdown]);

  if (!profile || !log) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const debt = getTotalDebt();
  const inDebt = hasDebt();
  const debtSummary = getDebtSummary();

  const dsaProgress = log.dsaProblems.length;
  const dsaGoal = profile.settings.dailyDSAGoal;
  const fundamentalsDone = log.fundamentalsTopic !== null;
  const electronicsDone = log.electronicsTopic !== null;
  const numericalsProgress = log.numericalsSolved;
  const numericalsGoal = profile.settings.dailyNumericalGoal;

  const allGoalsMet =
    dsaProgress >= dsaGoal &&
    fundamentalsDone &&
    electronicsDone &&
    numericalsProgress >= numericalsGoal;

  const handleGoToDashboard = () => {
    router.push('/');
  };

  const handleDismiss = () => {
    if (inDebt && !acknowledged) {
      return;
    }
    router.push('/');
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⏰</div>
          <h1 className="text-2xl font-bold text-zinc-100">{currentTime} Check-in</h1>
          <p className="text-zinc-400 mt-1">Time to track your progress!</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-zinc-900 rounded-lg p-4">
            <h3 className="text-sm text-zinc-400 mb-3">Today&apos;s Status</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">DSA Problems</span>
                  <span className={dsaProgress >= dsaGoal ? 'text-emerald-400' : 'text-zinc-400'}>
                    {dsaProgress}/{dsaGoal}
                  </span>
                </div>
                <ProgressBar
                  current={dsaProgress}
                  max={dsaGoal}
                  color={dsaProgress >= dsaGoal ? 'bg-emerald-500' : 'bg-blue-500'}
                  showLabel={false}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">CS Fundamentals</span>
                <span className={`text-sm ${fundamentalsDone ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fundamentalsDone ? '✓ Done' : '✗ Not done'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Electronics</span>
                <span className={`text-sm ${electronicsDone ? 'text-emerald-400' : 'text-red-400'}`}>
                  {electronicsDone ? '✓ Done' : '✗ Not done'}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">Numericals</span>
                  <span className={numericalsProgress >= numericalsGoal ? 'text-emerald-400' : 'text-zinc-400'}>
                    {numericalsProgress}/{numericalsGoal}
                  </span>
                </div>
                <ProgressBar
                  current={numericalsProgress}
                  max={numericalsGoal}
                  color={numericalsProgress >= numericalsGoal ? 'bg-emerald-500' : 'bg-purple-500'}
                  showLabel={false}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {inDebt && (
            <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">⚠️</span>
                <h3 className="text-red-400 font-medium">Outstanding Debt</h3>
              </div>
              <p className="text-red-300 text-2xl font-bold mb-2">-{debt.totalXP} XP</p>
              <ul className="space-y-1">
                {debtSummary.map((item, i) => (
                  <li key={i} className="text-red-300/80 text-sm">• {item}</li>
                ))}
              </ul>
              <p className="text-red-300/60 text-xs mt-2">
                This debt grows 10% daily! Complete extra tasks to pay it off.
              </p>
            </div>
          )}

          {allGoalsMet && (
            <div className="bg-emerald-950/50 border border-emerald-700 rounded-lg p-4 text-center">
              <span className="text-3xl">🎉</span>
              <p className="text-emerald-400 font-medium mt-2">All goals completed!</p>
              <p className="text-emerald-300/70 text-sm">Keep up the amazing work!</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button onClick={handleGoToDashboard} className="w-full" size="lg">
            Go to Dashboard
          </Button>

          {inDebt && !acknowledged && (
            <label className="flex items-start gap-2 cursor-pointer p-3 bg-zinc-900 rounded-lg">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-zinc-300">
                I understand I have outstanding debt and accept the XP penalty if I don&apos;t pay it off
              </span>
            </label>
          )}

          <Button
            onClick={handleDismiss}
            variant="ghost"
            className="w-full"
            disabled={!canDismiss || (inDebt && !acknowledged)}
          >
            {!canDismiss
              ? `Dismiss (${dismissCountdown}s)`
              : inDebt && !acknowledged
              ? 'Acknowledge debt to dismiss'
              : 'Dismiss'}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between text-sm">
          <div>
            <span className="text-zinc-500">Streak:</span>
            <span className="text-orange-400 ml-1">🔥 {profile.currentStreak}</span>
          </div>
          <div>
            <span className="text-zinc-500">Level:</span>
            <span className="text-amber-400 ml-1">Lv.{profile.level}</span>
          </div>
          <div>
            <span className="text-zinc-500">XP:</span>
            <span className="text-emerald-400 ml-1">{profile.totalXP.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
