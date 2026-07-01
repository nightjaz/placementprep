'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DaySchedule, ScheduledProblem, getCurrentDay, getScheduleByDay } from '@/data/schedule';
import { getTodayLog, saveDailyLog, generateId } from '@/lib/storage';
import { calculateDSAXP, calculateFundamentalsXP, calculateElectronicsXP, awardXP, decayXP } from '@/lib/xp-calculator';
import { markTodayActive } from '@/lib/streak-manager';
import { adjustScheduleForBootcamp, getAvailableTopics } from '@/lib/bootcamp-sync';
import { DSAProblem, FundamentalsTopic, ElectronicsTopic, FundamentalsCategory, ElectronicsCategory } from '@/types';

interface TodayScheduleProps {
  onProblemComplete?: () => void;
}

const BOOTCAMP_STORAGE_KEY = 'pq_bootcamp_today';

interface BootcampData {
  date: string;
  topic: string;
  adjustedProblems: ScheduledProblem[];
}

function getStoredBootcamp(): BootcampData | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(BOOTCAMP_STORAGE_KEY);
  if (!stored) return null;
  const data = JSON.parse(stored) as BootcampData;
  const today = new Date().toISOString().split('T')[0];
  if (data.date !== today) return null;
  return data;
}

function saveBootcamp(data: BootcampData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOTCAMP_STORAGE_KEY, JSON.stringify(data));
}

export function TodaySchedule({ onProblemComplete }: TodayScheduleProps) {
  const [schedule, setSchedule] = useState<DaySchedule | null>(null);
  const [displayProblems, setDisplayProblems] = useState<ScheduledProblem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [struggledProblems, setStruggledProblems] = useState<Set<string>>(new Set());
  const [csCompleted, setCsCompleted] = useState(false);
  const [eceCompleted, setEceCompleted] = useState(false);
  const [csConfidence, setCsConfidence] = useState<number | null>(null);
  const [eceConfidence, setEceConfidence] = useState<number | null>(null);
  const [showCsConfidence, setShowCsConfidence] = useState(false);
  const [showEceConfidence, setShowEceConfidence] = useState(false);
  const [completedEceSubtopics, setCompletedEceSubtopics] = useState<Set<string>>(new Set());
  const [bootcampTopic, setBootcampTopic] = useState<string | null>(null);
  const [showBootcampInput, setShowBootcampInput] = useState(false);
  const [bootcampInput, setBootcampInput] = useState('');
  const [isAdjusted, setIsAdjusted] = useState(false);

  useEffect(() => {
    const currentDay = getCurrentDay();
    const daySchedule = getScheduleByDay(currentDay);
    setSchedule(daySchedule);

    if (daySchedule) {
      const storedBootcamp = getStoredBootcamp();
      if (storedBootcamp) {
        setBootcampTopic(storedBootcamp.topic);
        setDisplayProblems(storedBootcamp.adjustedProblems);
        setIsAdjusted(true);
      } else {
        setDisplayProblems(daySchedule.problems);
      }
    }

    const log = getTodayLog();
    const completed = new Set(log.dsaProblems.map(p => p.name));
    setCompletedProblems(completed);
    const struggled = new Set(log.dsaProblems.filter(p => p.struggled).map(p => p.name));
    setStruggledProblems(struggled);
    setCsCompleted(log.fundamentalsTopic !== null);
    setEceCompleted(log.electronicsTopic !== null);
    if (log.fundamentalsTopic) setCsConfidence(log.fundamentalsTopic.confidence);
    if (log.electronicsTopic) {
      setEceConfidence(log.electronicsTopic.confidence);
      setCompletedEceSubtopics(new Set(log.electronicsTopic.subTopicsCompleted || []));
    }
  }, []);

  const handleBootcampSync = () => {
    if (!bootcampInput.trim() || !schedule) return;

    const adjusted = adjustScheduleForBootcamp(schedule, bootcampInput.trim());
    const today = new Date().toISOString().split('T')[0];

    saveBootcamp({
      date: today,
      topic: bootcampInput.trim(),
      adjustedProblems: adjusted,
    });

    setBootcampTopic(bootcampInput.trim());
    setDisplayProblems(adjusted);
    setIsAdjusted(true);
    setShowBootcampInput(false);
    setBootcampInput('');
  };

  const handleResetToOriginal = () => {
    if (!schedule) return;
    localStorage.removeItem(BOOTCAMP_STORAGE_KEY);
    setBootcampTopic(null);
    setDisplayProblems(schedule.problems);
    setIsAdjusted(false);
  };

  const handleProblemToggle = (problem: ScheduledProblem) => {
    const log = getTodayLog();
    const isCompleted = completedProblems.has(problem.name);

    if (isCompleted) {
      const existingProblem = log.dsaProblems.find(p => p.name === problem.name);
      if (existingProblem?.xpAwarded) {
        decayXP(existingProblem.xpAwarded);
      }
      log.dsaProblems = log.dsaProblems.filter(p => p.name !== problem.name);
      const newCompleted = new Set(completedProblems);
      newCompleted.delete(problem.name);
      setCompletedProblems(newCompleted);
    } else {
      const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
        'E': 'easy',
        'M': 'medium',
        'H': 'hard'
      };

      const isFirstOfDay = log.dsaProblems.length === 0;
      const difficulty = difficultyMap[problem.difficulty];
      const baseXP = calculateDSAXP({ difficulty } as DSAProblem, isFirstOfDay);

      const newProblem: DSAProblem = {
        id: generateId(),
        name: problem.name,
        platform: 'leetcode',
        difficulty,
        topic: 'other',
        struggled: struggledProblems.has(problem.name),
        isBootcamp: bootcampTopic !== null,
        timestamp: new Date().toISOString(),
        xpAwarded: baseXP,
      };

      log.dsaProblems.push(newProblem);
      const finalXP = awardXP(baseXP);
      newProblem.xpAwarded = finalXP;

      const newCompleted = new Set(completedProblems);
      newCompleted.add(problem.name);
      setCompletedProblems(newCompleted);

      markTodayActive();
    }

    saveDailyLog(log);
    onProblemComplete?.();
  };

  const handleStruggledToggle = (problemName: string) => {
    const log = getTodayLog();
    const newStruggled = new Set(struggledProblems);

    if (newStruggled.has(problemName)) {
      newStruggled.delete(problemName);
    } else {
      newStruggled.add(problemName);
    }
    setStruggledProblems(newStruggled);

    const problem = log.dsaProblems.find(p => p.name === problemName);
    if (problem) {
      problem.struggled = newStruggled.has(problemName);
      saveDailyLog(log);
    }
  };

  const handleCsToggle = () => {
    if (csCompleted) {
      const log = getTodayLog();
      if (log.fundamentalsTopic?.xpAwarded) {
        decayXP(log.fundamentalsTopic.xpAwarded);
      }
      log.fundamentalsTopic = null;
      saveDailyLog(log);
      setCsCompleted(false);
      setCsConfidence(null);
    } else {
      setShowCsConfidence(true);
    }
  };

  const handleCsConfirm = (confidence: number, schedule: DaySchedule) => {
    const log = getTodayLog();
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
      confidence: confidence as 1 | 2 | 3 | 4 | 5,
      resourcesUsed: [],
      timestamp: new Date().toISOString(),
      xpAwarded: 0,
    };

    const baseXP = calculateFundamentalsXP(topic);
    const finalXP = awardXP(baseXP);
    topic.xpAwarded = finalXP;

    log.fundamentalsTopic = topic;
    saveDailyLog(log);
    setCsCompleted(true);
    setCsConfidence(confidence);
    setShowCsConfidence(false);

    markTodayActive();
    onProblemComplete?.();
  };

  const handleEceToggle = () => {
    if (eceCompleted) {
      const log = getTodayLog();
      if (log.electronicsTopic?.xpAwarded) {
        decayXP(log.electronicsTopic.xpAwarded);
      }
      log.electronicsTopic = null;
      saveDailyLog(log);
      setEceCompleted(false);
      setEceConfidence(null);
    } else {
      setShowEceConfidence(true);
    }
  };

  const handleEceSubtopicToggle = (subtopic: string, schedule: DaySchedule) => {
    const log = getTodayLog();
    const newCompleted = new Set(completedEceSubtopics);

    if (newCompleted.has(subtopic)) {
      newCompleted.delete(subtopic);
    } else {
      newCompleted.add(subtopic);
    }
    setCompletedEceSubtopics(newCompleted);

    const allSubtopics = schedule.ece.subtopics;
    const allCompleted = allSubtopics.every(s => newCompleted.has(s));

    if (log.electronicsTopic) {
      log.electronicsTopic.subTopicsCompleted = Array.from(newCompleted);
      saveDailyLog(log);
    } else if (newCompleted.size > 0) {
      const categoryMap: Record<string, ElectronicsCategory> = {
        'Digital': 'digital',
        'Analog': 'analog',
        'Embedded': 'embedded',
      };

      const topic: ElectronicsTopic = {
        id: generateId(),
        category: categoryMap[schedule.ece.category] || 'embedded',
        topicName: schedule.ece.topic,
        formulasPracticed: [],
        subTopicsCompleted: Array.from(newCompleted),
        numericalCount: 0,
        confidence: 3,
        timestamp: new Date().toISOString(),
        xpAwarded: 0,
      };

      const xpPerSubtopic = 25;
      const baseXP = xpPerSubtopic;
      const finalXP = awardXP(baseXP);
      topic.xpAwarded = finalXP;

      log.electronicsTopic = topic;
      saveDailyLog(log);

      if (allCompleted) {
        setEceCompleted(true);
        markTodayActive();
      }
    }

    onProblemComplete?.();
  };

  const handleEceConfirm = (confidence: number, schedule: DaySchedule) => {
    const log = getTodayLog();
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
      confidence: confidence as 1 | 2 | 3 | 4 | 5,
      timestamp: new Date().toISOString(),
      xpAwarded: 0,
    };

    const baseXP = calculateElectronicsXP(topic, 0);
    const finalXP = awardXP(baseXP);
    topic.xpAwarded = finalXP;

    log.electronicsTopic = topic;
    log.numericalsSolved = 0;
    saveDailyLog(log);
    setEceCompleted(true);
    setEceConfidence(confidence);
    setShowEceConfidence(false);

    markTodayActive();
    onProblemComplete?.();
  };

  if (!schedule) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </Card>
    );
  }

  if (schedule.phase === 'revision') {
    return (
      <Card>
        <CardHeader
          title={`Day ${schedule.day}`}
          subtitle={schedule.topic}
        />
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-zinc-300 font-medium">Revision Day</p>
            <p className="text-zinc-500 text-sm mt-1">
              Re-solve problems you marked as struggled
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TopicCard
              label={schedule.cs.category}
              topic={schedule.cs.topic}
              subtopics={schedule.cs.subtopics}
              completed={csCompleted}
              confidence={csConfidence}
              onToggle={handleCsToggle}
              showConfidencePicker={showCsConfidence}
              onConfidenceSelect={(c) => handleCsConfirm(c, schedule)}
              onCancel={() => setShowCsConfidence(false)}
            />
            <TopicCard
              label={schedule.ece.category}
              topic={schedule.ece.topic}
              subtopics={schedule.ece.subtopics}
              completed={eceCompleted}
              confidence={eceConfidence}
              onToggle={handleEceToggle}
              showConfidencePicker={showEceConfidence}
              onConfidenceSelect={(c) => handleEceConfirm(c, schedule)}
              onCancel={() => setShowEceConfidence(false)}
            />
          </div>
        </div>
      </Card>
    );
  }

  const completedCount = Array.from(completedProblems).filter(name =>
    displayProblems.some(p => p.name === name)
  ).length;
  const totalProblems = displayProblems.length;

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-zinc-100">
            {isAdjusted ? bootcampTopic : schedule.topic}
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5">
            {isAdjusted ? `Synced from bootcamp` : `Day ${schedule.day}`}
          </p>
        </div>
        {isAdjusted && (
          <button
            onClick={handleResetToOriginal}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {!isAdjusted && !showBootcampInput && (
          <button
            onClick={() => setShowBootcampInput(true)}
            className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
          >
            <p className="text-zinc-400 text-sm">Different topic in bootcamp?</p>
            <p className="text-zinc-600 text-xs mt-0.5">Click to sync and adjust problems</p>
          </button>
        )}

        {showBootcampInput && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-400 text-sm">What did bootcamp cover?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={bootcampInput}
                onChange={(e) => setBootcampInput(e.target.value)}
                placeholder="e.g., DP, Graphs, Trees..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                list="topics"
              />
              <datalist id="topics">
                {getAvailableTopics().map(topic => (
                  <option key={topic} value={topic} />
                ))}
              </datalist>
              <Button onClick={handleBootcampSync} size="sm" disabled={!bootcampInput.trim()}>
                Apply
              </Button>
              <Button onClick={() => setShowBootcampInput(false)} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getAvailableTopics().slice(0, 8).map(topic => (
                <button
                  key={topic}
                  onClick={() => setBootcampInput(topic)}
                  className="text-xs bg-zinc-800 text-zinc-500 px-2 py-1 rounded hover:bg-zinc-700 hover:text-zinc-300 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Progress</span>
            <span className={`text-sm font-medium ${completedCount >= totalProblems ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {completedCount}/{totalProblems}
            </span>
          </div>
          <ProgressBar
            current={completedCount}
            max={totalProblems}
            color={completedCount >= totalProblems ? 'bg-emerald-500' : 'bg-zinc-600'}
            showLabel={false}
            size="sm"
          />
        </div>

        <div className="space-y-1">
          {displayProblems.map((problem, index) => (
            <ProblemRow
              key={problem.name}
              index={index + 1}
              problem={problem}
              completed={completedProblems.has(problem.name)}
              struggled={struggledProblems.has(problem.name)}
              onToggle={() => handleProblemToggle(problem)}
              onStruggledToggle={() => handleStruggledToggle(problem.name)}
            />
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <TopicCard
            label={schedule.cs.category}
            topic={schedule.cs.topic}
            subtopics={schedule.cs.subtopics}
            completed={csCompleted}
            confidence={csConfidence}
            onToggle={handleCsToggle}
            showConfidencePicker={showCsConfidence}
            onConfidenceSelect={(c) => handleCsConfirm(c, schedule)}
            onCancel={() => setShowCsConfidence(false)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{schedule.ece.category}</span>
                <p className="text-sm font-medium text-zinc-300">{schedule.ece.topic}</p>
              </div>
              <span className={`text-sm font-medium ${completedEceSubtopics.size === schedule.ece.subtopics.length ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {completedEceSubtopics.size}/{schedule.ece.subtopics.length}
              </span>
            </div>
            <div className="space-y-1">
              {schedule.ece.subtopics.map((subtopic, index) => (
                <SubtopicRow
                  key={subtopic}
                  index={index + 1}
                  name={subtopic}
                  completed={completedEceSubtopics.has(subtopic)}
                  onToggle={() => handleEceSubtopicToggle(subtopic, schedule)}
                />
              ))}
            </div>
            {completedEceSubtopics.size === schedule.ece.subtopics.length && !eceConfidence && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-2">
                <p className="text-xs text-zinc-500 mb-2">How confident are you overall?</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleEceConfirm(level, schedule)}
                      className="flex-1 py-1.5 rounded border bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition-colors text-sm"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {eceConfidence && (
              <p className="text-xs text-emerald-400">Confidence: {eceConfidence}/5</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProblemRow({
  index,
  problem,
  completed,
  struggled,
  onToggle,
  onStruggledToggle,
}: {
  index: number;
  problem: ScheduledProblem;
  completed: boolean;
  struggled: boolean;
  onToggle: () => void;
  onStruggledToggle: () => void;
}) {
  const difficultyColors = {
    'E': 'text-emerald-500',
    'M': 'text-amber-500',
    'H': 'text-red-500',
  };

  return (
    <div className={`
      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
      ${completed ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/50'}
    `}>
      <button
        onClick={onToggle}
        className={`
          w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0
          ${completed
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'border-zinc-700 hover:border-zinc-500'}
        `}
      >
        {completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span className="text-zinc-600 text-xs w-5 flex-shrink-0">{index}</span>

      <div className="flex-1 min-w-0">
        {problem.leetcodeUrl ? (
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm hover:underline truncate block ${completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}
          >
            {problem.name}
          </a>
        ) : (
          <span className={`text-sm truncate block ${completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
            {problem.name}
          </span>
        )}
      </div>

      <span className={`text-xs font-medium flex-shrink-0 ${difficultyColors[problem.difficulty]}`}>
        {problem.difficulty}
      </span>

      {completed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStruggledToggle();
          }}
          className={`
            text-xs px-2 py-0.5 rounded transition-colors flex-shrink-0
            ${struggled
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100'}
          `}
        >
          {struggled ? 'struggled' : 'mark'}
        </button>
      )}
    </div>
  );
}

function SubtopicRow({
  index,
  name,
  completed,
  onToggle,
}: {
  index: number;
  name: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`
      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      ${completed ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/50'}
    `}>
      <button
        onClick={onToggle}
        className={`
          w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0
          ${completed
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'border-zinc-700 hover:border-zinc-500'}
        `}
      >
        {completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span className="text-zinc-600 text-xs w-5 flex-shrink-0">{index}</span>

      <span className={`text-sm flex-1 ${completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
        {name}
      </span>
    </div>
  );
}

function TopicCard({
  label,
  topic,
  subtopics,
  completed,
  confidence,
  onToggle,
  showConfidencePicker,
  onConfidenceSelect,
  onCancel,
}: {
  label: string;
  topic: string;
  subtopics: string[];
  completed: boolean;
  confidence?: number | null;
  onToggle: () => void;
  showConfidencePicker?: boolean;
  onConfidenceSelect?: (confidence: number) => void;
  onCancel?: () => void;
}) {
  if (showConfidencePicker) {
    return (
      <div className="w-full p-3 rounded-lg border bg-zinc-900 border-zinc-700">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-sm font-medium text-zinc-300 mb-3">{topic}</p>
        <p className="text-xs text-zinc-500 mb-2">How confident are you?</p>
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onConfidenceSelect?.(level)}
              className="flex-1 py-1.5 rounded border bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition-colors text-sm"
            >
              {level}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300 py-1"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`
        w-full text-left p-3 rounded-lg border transition-all
        ${completed
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}
      `}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
        <div className={`w-4 h-4 rounded border flex items-center justify-center
          ${completed
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'border-zinc-700'}
        `}>
          {completed && (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <p className={`text-sm font-medium ${completed ? 'text-emerald-400' : 'text-zinc-300'}`}>
        {topic}
      </p>
      <p className="text-xs text-zinc-600 mt-1 truncate">
        {completed && confidence ? `Confidence: ${confidence}/5 · ` : ''}{subtopics.slice(0, 2).join(', ')}
      </p>
    </button>
  );
}
