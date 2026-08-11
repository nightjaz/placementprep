'use client';

import { useMemo } from 'react';
import { UserProfile } from '@/types';
import { getDailyLogs } from '@/lib/storage';
import { Card, CardHeader } from '@/components/ui/Card';

export function PrepSnapshot({ profile }: { profile: UserProfile }) {
  const snapshot = useMemo(() => {
    const logs = Object.values(getDailyLogs());
    const problems = logs.flatMap(log => log.dsaProblems);
    return {
      activeDays: logs.filter(log => log.dsaProblems.length > 0 || log.fundamentalsTopic || log.electronicsTopic || log.numericalsSolved > 0).length,
      problems: problems.length,
      uniqueProblems: new Set(problems.map(problem => problem.name.trim().toLowerCase())).size,
      revision: problems.filter(problem => problem.struggled || problem.completionLevel === 'B' || problem.completionLevel === 'C').length,
      fundamentals: logs.filter(log => log.fundamentalsTopic && !log.fundamentalsTopic.topicName.includes('No CS')).length,
      electronics: logs.filter(log => log.electronicsTopic && !log.electronicsTopic.topicName.includes('No ECE')).length,
      numericals: logs.reduce((sum, log) => sum + log.numericalsSolved, 0),
    };
  }, []);

  const items = [
    { label: 'DSA solved', value: snapshot.problems, detail: `${snapshot.uniqueProblems} unique` },
    { label: 'CS topics', value: snapshot.fundamentals, detail: 'OS · DBMS · CN' },
    { label: 'Electronics', value: snapshot.electronics, detail: `${snapshot.numericals} numericals` },
    { label: 'Active days', value: snapshot.activeDays, detail: `${profile.longestStreak}d best streak` },
  ];

  return (
    <Card>
      <CardHeader title="Your prep snapshot" subtitle="All-time progress stored on this device" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-2xl font-semibold text-zinc-100">{item.value}</p>
            <p className="text-sm text-zinc-300 mt-1">{item.label}</p>
            <p className="text-xs text-zinc-600 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>
      {snapshot.revision > 0 && <p className="text-sm text-amber-300/80 mt-4">{snapshot.revision} attempts are marked for revision — a queue, not a penalty.</p>}
    </Card>
  );
}
