'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { getScheduleByDay, getCurrentDay } from '@/data/schedule';
import { getDailyLog } from '@/lib/storage';

function getHeatMapData(): { day: number; intensity: number; problems: number }[] {
  const currentDay = getCurrentDay();
  const startDate = new Date('2026-06-26');
  const data: { day: number; intensity: number; problems: number }[] = [];

  for (let day = 1; day <= 35; day++) {
    const schedule = getScheduleByDay(day);
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + day - 1);
    const dateStr = dayDate.toISOString().split('T')[0];

    const log = getDailyLog(dateStr);
    const problemsDone = log?.dsaProblems?.length || 0;
    const problemsTotal = schedule?.problems?.length || 6;

    let intensity = 0;
    if (day <= currentDay) {
      const ratio = problemsDone / problemsTotal;
      if (ratio >= 1) intensity = 4;
      else if (ratio >= 0.75) intensity = 3;
      else if (ratio >= 0.5) intensity = 2;
      else if (ratio > 0) intensity = 1;
      else intensity = 0;
    }

    data.push({ day, intensity, problems: problemsDone });
  }

  return data;
}

export function HeatMap() {
  const data = getHeatMapData();
  const currentDay = getCurrentDay();
  const totalProblems = data.reduce((sum, d) => sum + d.problems, 0);

  const intensityColors = [
    'bg-zinc-800/50',
    'bg-emerald-900/60',
    'bg-emerald-700/70',
    'bg-emerald-500/80',
    'bg-emerald-400',
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-zinc-300">Progress</p>
        <p className="text-xs text-zinc-500">{totalProblems} problems</p>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {data.map((d) => (
          <div
            key={d.day}
            className={`
              aspect-square rounded-sm
              ${intensityColors[d.intensity]}
              ${d.day === currentDay ? 'ring-1 ring-blue-400' : ''}
            `}
            title={`Day ${d.day}: ${d.problems} problems`}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 mt-3">
        <span className="text-xs text-zinc-600">Less</span>
        {intensityColors.map((color, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
        ))}
        <span className="text-xs text-zinc-600">More</span>
      </div>
    </Card>
  );
}
