'use client';

import { useState } from 'react';
import { DSAProblem, DSATopic } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DSA_TOPICS } from '@/lib/constants';
import { generateId, getTodayLog, saveDailyLog } from '@/lib/storage';
import { calculateDSAXP, awardXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';

interface DSATrackerProps {
  onProblemAdded?: (problem: DSAProblem) => void;
}

export function DSATracker({ onProblemAdded }: DSATrackerProps) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [topic, setTopic] = useState<DSATopic>('arrays');
  const [platform, setPlatform] = useState<'leetcode' | 'bootcamp' | 'gfg' | 'other'>('leetcode');
  const [isBootcamp, setIsBootcamp] = useState(false);
  const [struggled, setStruggled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const log = getTodayLog();
    const isFirstOfDay = log.dsaProblems.length === 0;
    const baseXP = calculateDSAXP({ difficulty } as DSAProblem, isFirstOfDay);

    const problem: DSAProblem = {
      id: generateId(),
      name: name.trim(),
      platform: isBootcamp ? 'bootcamp' : platform,
      difficulty,
      topic,
      struggled,
      isBootcamp,
      timestamp: new Date().toISOString(),
      xpAwarded: baseXP,
    };

    log.dsaProblems.push(problem);
    saveDailyLog(log);

    const finalXP = awardXP(baseXP);
    problem.xpAwarded = finalXP;

    markTodayActive();

    setName('');
    setStruggled(false);
    setIsSubmitting(false);

    onProblemAdded?.(problem);
  };

  return (
    <Card>
      <CardHeader
        title="Log DSA Problem"
        subtitle="Track your problem-solving progress"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Problem Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Two Sum"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="easy">Easy (+50 XP)</option>
              <option value="medium">Medium (+100 XP)</option>
              <option value="hard">Hard (+200 XP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as DSATopic)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              {DSA_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as typeof platform)}
            disabled={isBootcamp}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          >
            <option value="leetcode">LeetCode</option>
            <option value="gfg">GeeksforGeeks</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBootcamp}
              onChange={(e) => setIsBootcamp(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">This is from today&apos;s bootcamp contest</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={struggled}
              onChange={(e) => setStruggled(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-zinc-300">I struggled with this (marks for extra practice)</span>
          </label>
        </div>

        <Button type="submit" disabled={!name.trim() || isSubmitting} className="w-full">
          {isSubmitting ? 'Adding...' : 'Add Problem'}
        </Button>
      </form>
    </Card>
  );
}

export function RecentProblems({ problems }: { problems: DSAProblem[] }) {
  if (problems.length === 0) {
    return (
      <Card>
        <CardHeader title="Today's Problems" subtitle="No problems logged yet" />
        <p className="text-zinc-500 text-center py-4">
          Start solving to see your progress here!
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Today's Problems"
        subtitle={`${problems.length} problem${problems.length !== 1 ? 's' : ''} solved`}
      />
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="flex items-center justify-between p-2 bg-zinc-900 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className={`
                w-2 h-2 rounded-full
                ${problem.difficulty === 'easy' ? 'bg-green-500' :
                  problem.difficulty === 'medium' ? 'bg-amber-500' : 'bg-red-500'}
              `} />
              <div>
                <p className="text-sm text-zinc-200">{problem.name}</p>
                <p className="text-xs text-zinc-500">
                  {problem.topic} • {problem.platform}
                  {problem.isBootcamp && ' • Bootcamp'}
                  {problem.struggled && ' • 💪 Struggled'}
                </p>
              </div>
            </div>
            <span className="text-emerald-400 text-sm">+{problem.xpAwarded} XP</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
