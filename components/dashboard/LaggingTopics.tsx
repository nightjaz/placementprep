'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { getCurrentDay, getScheduleByDay, DaySchedule } from '@/data/schedule';
import { getDailyLog, saveDailyLog, generateId } from '@/lib/storage';
import { DailyLog } from '@/types';
import { calculateFundamentalsXP, calculateElectronicsXP, awardXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';
import { FundamentalsTopic, ElectronicsTopic, FundamentalsCategory, ElectronicsCategory } from '@/types';

interface LaggingTopicsProps {
  onComplete?: () => void;
}

interface LaggingItem {
  day: number;
  date: string;
  type: 'dsa' | 'cs' | 'ece';
  label: string;
  detail: string;
  schedule: DaySchedule;
}

function getDateForDayNumber(dayNumber: number): string {
  const start = new Date(2026, 5, 26); // June 26, 2026
  start.setDate(start.getDate() + dayNumber - 1);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function LaggingTopics({ onComplete }: LaggingTopicsProps) {
  const [laggingItems, setLaggingItems] = useState<LaggingItem[]>([]);

  const calculateLagging = () => {
    const currentDay = getCurrentDay();
    const items: LaggingItem[] = [];

    // Check all days from day 1 to yesterday (not including today)
    for (let day = 1; day < currentDay; day++) {
      const schedule = getScheduleByDay(day);
      if (!schedule) continue;

      const dateStr = getDateForDayNumber(day);
      const log = getDailyLog(dateStr);

      // Check DSA problems
      const completedProblems = new Set(log?.dsaProblems.map(p => p.name) || []);
      const dsaDone = schedule.problems.filter(p => completedProblems.has(p.name)).length;
      if (dsaDone < schedule.problems.length && schedule.problems.length > 0) {
        items.push({
          day,
          date: dateStr,
          type: 'dsa',
          label: `Day ${day} DSA`,
          detail: `${dsaDone}/${schedule.problems.length} - ${schedule.topic}`,
          schedule,
        });
      }

      // Check CS fundamentals
      if (!log?.fundamentalsTopic) {
        items.push({
          day,
          date: dateStr,
          type: 'cs',
          label: `Day ${day} ${schedule.cs.category}: ${schedule.cs.topic}`,
          detail: schedule.cs.subtopics.join(', '),
          schedule,
        });
      }

      // Check Electronics
      if (!log?.electronicsTopic) {
        items.push({
          day,
          date: dateStr,
          type: 'ece',
          label: `Day ${day} ${schedule.ece.category}: ${schedule.ece.topic}`,
          detail: schedule.ece.subtopics.join(', '),
          schedule,
        });
      }
    }

    setLaggingItems(items);
  };

  useEffect(() => {
    calculateLagging();
  }, []);

  const refresh = () => {
    calculateLagging();
    onComplete?.();
  };

  const handleQuickComplete = (item: LaggingItem) => {
    const existing = getDailyLog(item.date);
    const log: DailyLog = existing || {
      date: item.date,
      dsaProblems: [],
      fundamentalsTopic: null,
      electronicsTopic: null,
      numericalsSolved: 0,
      checkIns: [],
      xpEarned: 0,
      xpDecayed: 0,
      questsCompleted: [],
      debtPaid: [],
      notes: '',
    };

    if (item.type === 'cs') {
      const categoryMap: Record<string, FundamentalsCategory> = {
        'OS': 'os',
        'DBMS': 'dbms',
        'CN': 'cn',
      };

      const topic: FundamentalsTopic = {
        id: generateId(),
        category: categoryMap[item.schedule.cs.category] || 'os',
        topicName: item.schedule.cs.topic,
        subTopics: item.schedule.cs.subtopics,
        confidence: 3,
        resourcesUsed: [],
        timestamp: new Date().toISOString(),
        xpAwarded: 0,
      };

      const baseXP = calculateFundamentalsXP(topic);
      const finalXP = awardXP(baseXP);
      topic.xpAwarded = finalXP;

      log.fundamentalsTopic = topic;
      saveDailyLog(log);
    }

    if (item.type === 'ece') {
      const categoryMap: Record<string, ElectronicsCategory> = {
        'Digital': 'digital',
        'Analog': 'analog',
        'Embedded': 'embedded',
      };

      const topic: ElectronicsTopic = {
        id: generateId(),
        category: categoryMap[item.schedule.ece.category] || 'digital',
        topicName: item.schedule.ece.topic,
        formulasPracticed: [],
        subTopicsCompleted: item.schedule.ece.subtopics,
        numericalCount: 0,
        confidence: 3,
        timestamp: new Date().toISOString(),
        xpAwarded: 0,
      };

      const baseXP = calculateElectronicsXP(topic, 0);
      const finalXP = awardXP(baseXP);
      topic.xpAwarded = finalXP;

      log.electronicsTopic = topic;
      log.numericalsSolved = 0;
      saveDailyLog(log);
    }

    // Update streak if this is today
    const today = getCurrentDay();
    if (item.day === today) {
      markTodayActive();
    }

    refresh();
  };

  if (laggingItems.length === 0) return null;

  const csItems = laggingItems.filter(i => i.type === 'cs');
  const eceItems = laggingItems.filter(i => i.type === 'ece');
  const dsaItems = laggingItems.filter(i => i.type === 'dsa');

  return (
    <Card variant="danger">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xl">!</span>
            <h3 className="text-red-400 font-semibold text-lg">Lagging Behind</h3>
          </div>
          <span className="text-red-300/70 text-sm">{laggingItems.length} incomplete</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* CS Fundamentals */}
          {csItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-red-300/80 text-xs font-medium uppercase tracking-wider">CS Fundamentals ({csItems.length})</p>
              {csItems.slice(0, 5).map((item) => (
                <div
                  key={`${item.day}-${item.type}`}
                  className="flex items-center justify-between bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-red-300 text-sm font-medium truncate">{item.label}</p>
                    <p className="text-red-400/60 text-xs truncate">{item.detail}</p>
                  </div>
                  <button
                    onClick={() => handleQuickComplete(item)}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded transition-colors ml-2 flex-shrink-0"
                  >
                    Done
                  </button>
                </div>
              ))}
              {csItems.length > 5 && (
                <p className="text-red-400/50 text-xs">+{csItems.length - 5} more</p>
              )}
            </div>
          )}

          {/* Electronics */}
          {eceItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-red-300/80 text-xs font-medium uppercase tracking-wider">Electronics ({eceItems.length})</p>
              {eceItems.slice(0, 5).map((item) => (
                <div
                  key={`${item.day}-${item.type}`}
                  className="flex items-center justify-between bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-red-300 text-sm font-medium truncate">{item.label}</p>
                    <p className="text-red-400/60 text-xs truncate">{item.detail}</p>
                  </div>
                  <button
                    onClick={() => handleQuickComplete(item)}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded transition-colors ml-2 flex-shrink-0"
                  >
                    Done
                  </button>
                </div>
              ))}
              {eceItems.length > 5 && (
                <p className="text-red-400/50 text-xs">+{eceItems.length - 5} more</p>
              )}
            </div>
          )}

          {/* DSA */}
          {dsaItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-red-300/80 text-xs font-medium uppercase tracking-wider">DSA ({dsaItems.length})</p>
              {dsaItems.slice(0, 5).map((item) => (
                <div
                  key={`${item.day}-${item.type}`}
                  className="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2"
                >
                  <p className="text-red-300 text-sm font-medium truncate">{item.label}</p>
                  <p className="text-red-400/60 text-xs truncate">{item.detail}</p>
                </div>
              ))}
              {dsaItems.length > 5 && (
                <p className="text-red-400/50 text-xs">+{dsaItems.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
