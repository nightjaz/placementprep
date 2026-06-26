'use client';

import { useState } from 'react';
import { ElectronicsTopic, ElectronicsCategory } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ELECTRONICS_TOPICS } from '@/lib/constants';
import { generateId, getTodayLog, saveDailyLog } from '@/lib/storage';
import { calculateElectronicsXP, awardXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';

interface ElectronicsTrackerProps {
  onTopicAdded?: (topic: ElectronicsTopic, numericals: number) => void;
  currentTopic?: ElectronicsTopic | null;
  currentNumericals?: number;
}

export function ElectronicsTracker({ onTopicAdded, currentTopic, currentNumericals = 0 }: ElectronicsTrackerProps) {
  const [category, setCategory] = useState<ElectronicsCategory>('analog');
  const [topicId, setTopicId] = useState('');
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [numericalCount, setNumericalCount] = useState(0);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryData = ELECTRONICS_TOPICS[category];
  const selectedTopicData = categoryData.topics.find(t => t.id === topicId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !selectedTopicData) return;

    setIsSubmitting(true);

    const topic: ElectronicsTopic = {
      id: generateId(),
      category,
      topicName: selectedTopicData.name,
      formulasPracticed: [],
      subTopicsCompleted: selectedSubtopics,
      numericalCount,
      confidence,
      timestamp: new Date().toISOString(),
      xpAwarded: 0,
    };

    const baseXP = calculateElectronicsXP(topic, numericalCount);
    topic.xpAwarded = baseXP;

    const log = getTodayLog();
    log.electronicsTopic = topic;
    log.numericalsSolved = numericalCount;
    saveDailyLog(log);

    const finalXP = awardXP(baseXP);
    topic.xpAwarded = finalXP;

    markTodayActive();

    setTopicId('');
    setSelectedSubtopics([]);
    setNumericalCount(0);
    setConfidence(3);
    setIsSubmitting(false);

    onTopicAdded?.(topic, numericalCount);
  };

  if (currentTopic) {
    return (
      <Card variant="success">
        <CardHeader title="Electronics" subtitle="Today's topic completed!" />
        <div className="text-center py-4">
          <p className="text-emerald-400 font-medium">{currentTopic.topicName}</p>
          <p className="text-zinc-500 text-sm mt-1">
            {currentTopic.category.charAt(0).toUpperCase() + currentTopic.category.slice(1)} •
            {currentNumericals} numericals • Confidence: {currentTopic.confidence}/5
          </p>
          <p className="text-emerald-400 mt-2">+{currentTopic.xpAwarded} XP earned</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Log Electronics Topic"
        subtitle="Track your ECE revision"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ElectronicsCategory);
              setTopicId('');
              setSelectedSubtopics([]);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {Object.entries(ELECTRONICS_TOPICS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Topic</label>
          <select
            value={topicId}
            onChange={(e) => {
              setTopicId(e.target.value);
              setSelectedSubtopics([]);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select a topic</option>
            {categoryData.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTopicData && (
          <div className="bg-zinc-900/50 p-3 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">
              Sub-topics completed ({selectedSubtopics.length}/{selectedTopicData.subTopics.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTopicData.subTopics.map((sub) => {
                const isSelected = selectedSubtopics.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSelectedSubtopics(prev =>
                        isSelected
                          ? prev.filter(s => s !== sub)
                          : [...prev, sub]
                      );
                    }}
                    className={`
                      text-xs px-2 py-1 rounded border transition-colors
                      ${isSelected
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}
                    `}
                  >
                    {isSelected && '✓ '}{sub}
                  </button>
                );
              })}
            </div>
            {selectedTopicData.subTopics.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSubtopics(selectedTopicData.subTopics)}
                className="text-xs text-emerald-500 hover:text-emerald-400 mt-2"
              >
                Select all
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Numericals Solved</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setNumericalCount(Math.max(0, numericalCount - 1))}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              -
            </button>
            <span className="text-2xl font-bold text-zinc-100 min-w-[40px] text-center">
              {numericalCount}
            </span>
            <button
              type="button"
              onClick={() => setNumericalCount(numericalCount + 1)}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              +
            </button>
            <span className="text-sm text-zinc-500">
              (+{numericalCount * 20} XP{numericalCount >= 5 ? ' + 50 bonus!' : ''})
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Confidence Level</label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setConfidence(level)}
                className={`
                  flex-1 py-2 rounded-lg border transition-colors
                  ${confidence === level
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={!topicId || isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Complete Topic'}
        </Button>
      </form>
    </Card>
  );
}
