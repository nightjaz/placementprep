'use client';

import { useState } from 'react';
import { FundamentalsTopic, FundamentalsCategory } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CS_FUNDAMENTALS } from '@/lib/constants';
import { generateId, getTodayLog, saveDailyLog } from '@/lib/storage';
import { calculateFundamentalsXP, awardXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';

interface FundamentalsTrackerProps {
  onTopicAdded?: (topic: FundamentalsTopic) => void;
  currentTopic?: FundamentalsTopic | null;
}

export function FundamentalsTracker({ onTopicAdded, currentTopic }: FundamentalsTrackerProps) {
  const [category, setCategory] = useState<FundamentalsCategory>('os');
  const [topicId, setTopicId] = useState('');
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtraForm, setShowExtraForm] = useState(false);

  const categoryData = CS_FUNDAMENTALS[category];
  const selectedTopicData = categoryData.topics.find(t => t.id === topicId);

  const handleSubTopicToggle = (subTopic: string) => {
    setSelectedSubTopics(prev =>
      prev.includes(subTopic)
        ? prev.filter(s => s !== subTopic)
        : [...prev, subTopic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !selectedTopicData) return;

    setIsSubmitting(true);

    const log = getTodayLog();
    const isAdditional = !!currentTopic;

    const topic: FundamentalsTopic = {
      id: generateId(),
      category,
      topicName: selectedTopicData.name,
      subTopics: selectedSubTopics,
      confidence,
      resourcesUsed: [],
      timestamp: new Date().toISOString(),
      xpAwarded: 0,
    };

    const baseXP = calculateFundamentalsXP(topic);
    topic.xpAwarded = baseXP;

    if (isAdditional && log.fundamentalsTopic) {
      // Add to existing topic's data
      log.fundamentalsTopic.subTopics = [
        ...new Set([...log.fundamentalsTopic.subTopics, ...selectedSubTopics])
      ];
      log.fundamentalsTopic.xpAwarded += baseXP;
    } else {
      log.fundamentalsTopic = topic;
    }
    saveDailyLog(log);

    const finalXP = awardXP(baseXP);
    if (!isAdditional) {
      topic.xpAwarded = finalXP;
    }

    markTodayActive();

    setTopicId('');
    setSelectedSubTopics([]);
    setConfidence(3);
    setIsSubmitting(false);
    setShowExtraForm(false);

    onTopicAdded?.(log.fundamentalsTopic!);
  };

  if (currentTopic && !showExtraForm) {
    return (
      <Card variant="success">
        <CardHeader title="CS Fundamentals" subtitle="Today's topic completed!" />
        <div className="text-center py-4">
          <p className="text-emerald-400 font-medium">{currentTopic.topicName}</p>
          <p className="text-zinc-500 text-sm mt-1">
            {currentTopic.category.toUpperCase()} • Confidence: {currentTopic.confidence}/5
          </p>
          <p className="text-emerald-400 mt-2">+{currentTopic.xpAwarded} XP earned</p>
        </div>
        <button
          onClick={() => setShowExtraForm(true)}
          className="w-full mt-2 text-sm text-zinc-500 hover:text-zinc-300 py-2 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
        >
          Log additional topic
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Log CS Fundamentals"
        subtitle="Track your theory revision"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as FundamentalsCategory);
              setTopicId('');
              setSelectedSubTopics([]);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {Object.entries(CS_FUNDAMENTALS).map(([key, value]) => (
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
              setSelectedSubTopics([]);
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
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Sub-topics covered</label>
            <div className="space-y-2">
              {selectedTopicData.subTopics.map((subTopic) => (
                <label key={subTopic} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubTopics.includes(subTopic)}
                    onChange={() => handleSubTopicToggle(subTopic)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-300">{subTopic}</span>
                </label>
              ))}
            </div>
          </div>
        )}

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
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1 text-center">
            1 = Need revision • 5 = Very confident
          </p>
        </div>

        <Button type="submit" disabled={!topicId || isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Complete Topic'}
        </Button>
      </form>
    </Card>
  );
}
