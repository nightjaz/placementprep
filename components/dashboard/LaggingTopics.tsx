'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { getTodayCompletionStatus } from '@/lib/streak-manager';
import { getCurrentDay, getScheduleByDay } from '@/data/schedule';
import { getTodayLog, saveDailyLog, generateId } from '@/lib/storage';
import { calculateFundamentalsXP, calculateElectronicsXP, awardXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';
import { FundamentalsTopic, ElectronicsTopic, FundamentalsCategory, ElectronicsCategory } from '@/types';

interface LaggingTopicsProps {
  onComplete?: () => void;
}

export function LaggingTopics({ onComplete }: LaggingTopicsProps) {
  const [status, setStatus] = useState<ReturnType<typeof getTodayCompletionStatus> | null>(null);
  const [schedule, setSchedule] = useState<ReturnType<typeof getScheduleByDay>>(null);

  useEffect(() => {
    setStatus(getTodayCompletionStatus());
    setSchedule(getScheduleByDay(getCurrentDay()));
  }, []);

  const refresh = () => {
    setStatus(getTodayCompletionStatus());
    onComplete?.();
  };

  if (!status || !schedule) return null;

  const laggingItems: { type: 'dsa' | 'cs' | 'ece'; label: string; detail: string }[] = [];

  if (status.dsaDone < status.dsaTotal) {
    laggingItems.push({
      type: 'dsa',
      label: 'DSA Problems',
      detail: `${status.dsaDone}/${status.dsaTotal} done`,
    });
  }

  if (!status.fundamentalsDone) {
    laggingItems.push({
      type: 'cs',
      label: schedule.cs.category,
      detail: schedule.cs.topic,
    });
  }

  if (!status.electronicsDone) {
    laggingItems.push({
      type: 'ece',
      label: schedule.ece.category,
      detail: schedule.ece.topic,
    });
  }

  if (laggingItems.length === 0) return null;

  const handleQuickComplete = (type: 'cs' | 'ece') => {
    const log = getTodayLog();

    if (type === 'cs' && schedule) {
      const categoryMap: Record<string, FundamentalsCategory> = {
        'OS': 'os',
        'DBMS': 'dbms',
        'CN': 'cn',
      };

      const topic: FundamentalsTopic = {
        id: generateId(),
        category: categoryMap[schedule.cs.category] || 'os',
        topicName: schedule.cs.topic,
        subTopics: schedule.cs.subtopics,
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
      markTodayActive();
    }

    if (type === 'ece' && schedule) {
      const categoryMap: Record<string, ElectronicsCategory> = {
        'Digital': 'digital',
        'Analog': 'analog',
        'Embedded': 'embedded',
      };

      const topic: ElectronicsTopic = {
        id: generateId(),
        category: categoryMap[schedule.ece.category] || 'digital',
        topicName: schedule.ece.topic,
        formulasPracticed: [],
        subTopicsCompleted: schedule.ece.subtopics,
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
      markTodayActive();
    }

    refresh();
  };

  const streakWarning = !status.streakEligible;

  return (
    <Card variant="danger">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">!</span>
            <h3 className="text-red-400 font-medium">Lagging Behind</h3>
          </div>
          <span className="text-zinc-500 text-sm">{status.completionPercent}% done</span>
        </div>

        {streakWarning && (
          <p className="text-red-300/70 text-xs">
            Need 70% to maintain streak — complete more tasks!
          </p>
        )}

        <div className="space-y-2">
          {laggingItems.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-red-300 text-sm font-medium">{item.label}</p>
                <p className="text-red-400/60 text-xs">{item.detail}</p>
              </div>
              {(item.type === 'cs' || item.type === 'ece') && (
                <button
                  onClick={() => handleQuickComplete(item.type as 'cs' | 'ece')}
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded transition-colors"
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
