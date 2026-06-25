'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DailyLog } from '@/types';
import { CountdownTimer } from '@/components/dashboard/CountdownTimer';
import { XPDisplay } from '@/components/dashboard/XPDisplay';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { DebtDisplay } from '@/components/dashboard/DebtDisplay';
import { DSATracker, RecentProblems } from '@/components/tracking/DSATracker';
import { FundamentalsTracker } from '@/components/tracking/FundamentalsTracker';
import { ElectronicsTracker } from '@/components/tracking/ElectronicsTracker';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTodayLog } from '@/lib/storage';
import Link from 'next/link';

interface DashboardProps {
  profile: UserProfile;
  onRefresh: () => void;
}

type Tab = 'overview' | 'dsa' | 'fundamentals' | 'electronics';

export function Dashboard({ profile, onRefresh }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [log, setLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    setLog(getTodayLog());
  }, []);

  const refreshLog = () => {
    setLog(getTodayLog());
    onRefresh();
  };

  if (!log) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚔️</span>
              <h1 className="text-xl font-bold">PlacementQuest</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-400">🔥 {profile.currentStreak}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-emerald-400">{profile.totalXP.toLocaleString()} XP</span>
                <span className="text-zinc-500">|</span>
                <span className="text-amber-400">Lv.{profile.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'dsa', label: 'DSA', icon: '💻' },
              { id: 'fundamentals', label: 'CS Fundamentals', icon: '📚' },
              { id: 'electronics', label: 'Electronics', icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-200'}
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CountdownTimer targetDate={profile.placementDate} />
              </Card>

              <Card>
                <CardHeader title="Level Progress" />
                <XPDisplay
                  totalXP={profile.totalXP}
                  level={profile.level}
                  streak={profile.currentStreak}
                />
              </Card>

              <DailyProgress log={log} settings={profile.settings} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader title="Streak" />
                <StreakDisplay
                  currentStreak={profile.currentStreak}
                  longestStreak={profile.longestStreak}
                />
              </Card>

              <DebtDisplay />

              <Card>
                <CardHeader title="Quick Actions" />
                <div className="space-y-2">
                  <Button
                    onClick={() => setActiveTab('dsa')}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">💻</span> Log DSA Problem
                  </Button>
                  <Button
                    onClick={() => setActiveTab('fundamentals')}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">📚</span> Log CS Topic
                  </Button>
                  <Button
                    onClick={() => setActiveTab('electronics')}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">⚡</span> Log Electronics
                  </Button>
                  <Link href="/shame-wall" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300"
                    >
                      <span className="mr-2">💀</span> Shame Wall
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'dsa' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DSATracker onProblemAdded={refreshLog} />
            <RecentProblems problems={log.dsaProblems} />
          </div>
        )}

        {activeTab === 'fundamentals' && (
          <div className="max-w-xl mx-auto">
            <FundamentalsTracker
              onTopicAdded={refreshLog}
              currentTopic={log.fundamentalsTopic}
            />
          </div>
        )}

        {activeTab === 'electronics' && (
          <div className="max-w-xl mx-auto">
            <ElectronicsTracker
              onTopicAdded={refreshLog}
              currentTopic={log.electronicsTopic}
              currentNumericals={log.numericalsSolved}
            />
          </div>
        )}
      </main>
    </div>
  );
}
