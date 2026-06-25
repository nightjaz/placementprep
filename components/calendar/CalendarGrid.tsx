'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { getScheduleByDay, getCurrentDay } from '@/data/schedule';
import { getDailyLog } from '@/lib/storage';

interface DayStatus {
  day: number;
  status: 'completed' | 'partial' | 'missed' | 'future' | 'today';
  problemsDone: number;
  problemsTotal: number;
  date: string;
}

function getDayStatuses(): DayStatus[] {
  const currentDay = getCurrentDay();
  const startDate = new Date('2026-06-26');
  const statuses: DayStatus[] = [];

  for (let day = 1; day <= 35; day++) {
    const schedule = getScheduleByDay(day);
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + day - 1);
    const dateStr = dayDate.toISOString().split('T')[0];

    const log = getDailyLog(dateStr);
    const problemsDone = log?.dsaProblems?.length || 0;
    const problemsTotal = schedule?.problems?.length || 6;

    let status: DayStatus['status'];
    if (day > currentDay) {
      status = 'future';
    } else if (day === currentDay) {
      status = 'today';
    } else if (problemsDone >= problemsTotal) {
      status = 'completed';
    } else if (problemsDone > 0) {
      status = 'partial';
    } else {
      status = 'missed';
    }

    statuses.push({
      day,
      status,
      problemsDone,
      problemsTotal,
      date: dateStr,
    });
  }

  return statuses;
}

export function CalendarGrid() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const statuses = getDayStatuses();
  const currentDay = getCurrentDay();

  const statusColors = {
    completed: 'bg-emerald-500/80 hover:bg-emerald-500',
    partial: 'bg-amber-500/80 hover:bg-amber-500',
    missed: 'bg-red-500/80 hover:bg-red-500',
    future: 'bg-zinc-800/50 hover:bg-zinc-700/50',
    today: 'bg-blue-500/80 hover:bg-blue-500 ring-2 ring-blue-400/50',
  };

  const selectedStatus = selectedDay ? statuses.find(s => s.day === selectedDay) : null;
  const selectedSchedule = selectedDay ? getScheduleByDay(selectedDay) : null;

  return (
    <Card>
      <CardHeader
        title="35-Day Journey"
        subtitle={`Day ${currentDay} of 35`}
      />

      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {statuses.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day === selectedDay ? null : day.day)}
            className={`
              aspect-square rounded-md flex items-center justify-center
              text-xs font-medium transition-all
              ${statusColors[day.status]}
              ${selectedDay === day.day ? 'ring-2 ring-white/30' : ''}
            `}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/80" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/80" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/80" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/80" />
          <span>Today</span>
        </div>
      </div>

      {selectedStatus && selectedSchedule && (
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Day {selectedStatus.day} — {selectedSchedule.topic}
              </p>
              <p className="text-xs text-zinc-500">{selectedStatus.date}</p>
            </div>
            <span className={`
              text-xs px-2 py-1 rounded
              ${selectedStatus.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedStatus.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                selectedStatus.status === 'missed' ? 'bg-red-500/20 text-red-400' :
                selectedStatus.status === 'today' ? 'bg-blue-500/20 text-blue-400' :
                'bg-zinc-700 text-zinc-400'}
            `}>
              {selectedStatus.problemsDone}/{selectedStatus.problemsTotal}
            </span>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {selectedSchedule.problems.map((problem, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm py-1.5 px-2 rounded bg-zinc-900/50"
              >
                <span className={`
                  w-1.5 h-1.5 rounded-full flex-shrink-0
                  ${problem.difficulty === 'E' ? 'bg-emerald-500' :
                    problem.difficulty === 'M' ? 'bg-amber-500' : 'bg-red-500'}
                `} />
                <span className="text-zinc-400 truncate">{problem.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500">
              <span className="text-zinc-400">CS:</span> {selectedSchedule.cs.topic}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="text-zinc-400">ECE:</span> {selectedSchedule.ece.topic}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
