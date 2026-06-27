'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DailyLog } from '@/types';
import { CountdownTimer } from '@/components/dashboard/CountdownTimer';
import { XPDisplay } from '@/components/dashboard/XPDisplay';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { DebtDisplay } from '@/components/dashboard/DebtDisplay';
import { LaggingTopics } from '@/components/dashboard/LaggingTopics';
import { DSATracker, RecentProblems } from '@/components/tracking/DSATracker';
import { FundamentalsTracker } from '@/components/tracking/FundamentalsTracker';
import { ElectronicsTracker } from '@/components/tracking/ElectronicsTracker';
import { TodaySchedule } from '@/components/schedule/TodaySchedule';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { HeatMap } from '@/components/calendar/HeatMap';
import { RoastDisplay } from '@/components/roasts/RoastDisplay';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTodayLog } from '@/lib/storage';
import { getCurrentDay } from '@/data/schedule';
import { initializeStreakFromHistory } from '@/lib/streak-manager';
import Link from 'next/link';

interface DashboardProps {
  profile: UserProfile;
  onRefresh: () => void;
}

type Tab = 'overview' | 'dsa' | 'fundamentals' | 'electronics' | 'calendar';

export function Dashboard({ profile, onRefresh }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [log, setLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    initializeStreakFromHistory();
    setLog(getTodayLog());
  }, []);

  const refreshLog = () => {
    setLog(getTodayLog());
    onRefresh();
  };

  if (!log) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg" />
              <h1 className="text-lg font-semibold tracking-tight">PlacementQuest</h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">🔥 Streak</span>
                <span className="text-orange-400 font-medium">{profile.currentStreak}d</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">XP</span>
                <span className="text-emerald-400 font-medium">{profile.totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Level</span>
                <span className="text-amber-400 font-medium">{profile.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-zinc-900/50 border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'dsa', label: 'DSA' },
              { id: 'fundamentals', label: 'CS Fundamentals' },
              { id: 'electronics', label: 'Electronics' },
              { id: 'calendar', label: 'Calendar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all relative
                  ${activeTab === tab.id
                    ? 'text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LaggingTopics onComplete={refreshLog} />

              <RoastDisplay />

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CountdownTimer targetDate={profile.placementDate} />
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Current Day</p>
                    <p className="text-4xl font-bold text-zinc-100">{getCurrentDay()}</p>
                    <p className="text-zinc-500 text-sm">of 35</p>
                  </div>
                </Card>
              </div>

              <TodaySchedule onProblemComplete={refreshLog} />

              <HeatMap />

              <Card>
                <CardHeader title="Progress" />
                <XPDisplay
                  totalXP={profile.totalXP}
                  level={profile.level}
                  streak={profile.currentStreak}
                />
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader title="🔥 Streak" />
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
                    Log DSA Problem
                  </Button>
                  <Button
                    onClick={() => setActiveTab('fundamentals')}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    Log CS Topic
                  </Button>
                  <Button
                    onClick={() => setActiveTab('electronics')}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    Log Electronics
                  </Button>
                  <Link href="/shame-wall" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-500 hover:text-red-400"
                    >
                      View Shame Wall
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

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalendarGrid />
            <div className="space-y-6">
              <HeatMap />
              <Card>
                <CardHeader title="Legend" />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-emerald-500/80" />
                    <span className="text-zinc-400">All problems completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-amber-500/80" />
                    <span className="text-zinc-400">Partial completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-red-500/80" />
                    <span className="text-zinc-400">Missed day</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-blue-500/80" />
                    <span className="text-zinc-400">Today</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
