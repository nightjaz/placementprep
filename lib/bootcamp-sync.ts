import { SCHEDULE, ScheduledProblem, DaySchedule } from '@/data/schedule';

export interface BootcampAdjustment {
  date: string;
  originalTopic: string;
  bootcampTopic: string;
  adjustedProblems: ScheduledProblem[];
}

export const DSA_TOPIC_KEYWORDS: Record<string, string[]> = {
  'Arrays & Hashing': ['array', 'hash', 'two sum', 'anagram', 'duplicate', 'subarray', 'frequency'],
  'Two Pointers': ['two pointer', 'pointer', '3sum', 'container', 'palindrome'],
  'Sliding Window': ['sliding window', 'window', 'substring', 'subarray sum'],
  'Binary Search': ['binary search', 'search', 'rotated', 'sorted array', 'koko', 'capacity'],
  'Linked Lists': ['linked list', 'list', 'reverse', 'cycle', 'node'],
  'Stacks & Queues': ['stack', 'queue', 'parentheses', 'polish', 'temperature', 'greater element'],
  'Trees': ['tree', 'binary tree', 'bst', 'depth', 'traversal', 'lca', 'path sum', 'serialize'],
  'Heaps': ['heap', 'priority queue', 'kth largest', 'median', 'top k', 'scheduler'],
  'Graphs': ['graph', 'island', 'dfs', 'bfs', 'course schedule', 'topological', 'dijkstra', 'clone'],
  'Backtracking': ['backtrack', 'permutation', 'subset', 'combination', 'n-queen', 'sudoku'],
  'Tries': ['trie', 'prefix', 'word search'],
  'Greedy': ['greedy', 'jump game', 'gas station', 'interval', 'assign cookie'],
  'Intervals': ['interval', 'meeting', 'merge interval', 'overlap'],
  'DP': ['dp', 'dynamic programming', 'climbing stairs', 'house robber', 'coin change', 'knapsack', 'lis', 'lcs', 'edit distance', 'stock'],
  'Bit Manipulation': ['bit', 'xor', 'binary', 'single number'],
  'Math': ['math', 'pow', 'multiply', 'matrix', 'spiral', 'rotate'],
};

export function findTopicFromKeyword(keyword: string): string | null {
  const lowerKeyword = keyword.toLowerCase();

  for (const [topic, keywords] of Object.entries(DSA_TOPIC_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerKeyword.includes(kw) || kw.includes(lowerKeyword)) {
        return topic;
      }
    }
  }

  return null;
}

export function getProblemsForTopic(topic: string): ScheduledProblem[] {
  const problems: ScheduledProblem[] = [];
  const topicLower = topic.toLowerCase();

  for (const day of SCHEDULE) {
    if (day.phase === 'revision') continue;

    const dayTopicLower = day.topic.toLowerCase();

    if (dayTopicLower.includes(topicLower) ||
        topicLower.includes(dayTopicLower.split(' ')[0]) ||
        DSA_TOPIC_KEYWORDS[topic]?.some(kw => dayTopicLower.includes(kw))) {
      problems.push(...day.problems);
    }
  }

  for (const [scheduleTopic, keywords] of Object.entries(DSA_TOPIC_KEYWORDS)) {
    if (keywords.some(kw => topicLower.includes(kw))) {
      for (const day of SCHEDULE) {
        if (day.topic.includes(scheduleTopic) && day.phase !== 'revision') {
          const newProblems = day.problems.filter(p => !problems.some(existing => existing.name === p.name));
          problems.push(...newProblems);
        }
      }
    }
  }

  return problems;
}

export function adjustScheduleForBootcamp(
  currentDay: DaySchedule,
  bootcampTopic: string
): ScheduledProblem[] {
  const matchedTopic = findTopicFromKeyword(bootcampTopic);

  if (!matchedTopic) {
    return currentDay.problems;
  }

  const topicProblems = getProblemsForTopic(matchedTopic);

  if (topicProblems.length === 0) {
    return currentDay.problems;
  }

  const todayProblemNames = new Set(currentDay.problems.map(p => p.name));
  const additionalProblems = topicProblems.filter(p => !todayProblemNames.has(p.name));

  const targetCount = currentDay.problemCount;
  const easyCount = currentDay.phase === 'foundation' ? 2 : 2;
  const hardCount = currentDay.phase === 'foundation' ? 0 : Math.min(2, Math.floor(targetCount / 4));
  const mediumCount = targetCount - easyCount - hardCount;

  const adjustedProblems: ScheduledProblem[] = [];

  const easyProblems = additionalProblems.filter(p => p.difficulty === 'E');
  const mediumProblems = additionalProblems.filter(p => p.difficulty === 'M');
  const hardProblems = additionalProblems.filter(p => p.difficulty === 'H');

  adjustedProblems.push(...easyProblems.slice(0, easyCount));
  adjustedProblems.push(...mediumProblems.slice(0, mediumCount));
  if (currentDay.phase !== 'foundation') {
    adjustedProblems.push(...hardProblems.slice(0, hardCount));
  }

  while (adjustedProblems.length < targetCount && additionalProblems.length > adjustedProblems.length) {
    const remaining = additionalProblems.filter(p => !adjustedProblems.some(ap => ap.name === p.name));
    if (remaining.length > 0) {
      adjustedProblems.push(remaining[0]);
    } else {
      break;
    }
  }

  while (adjustedProblems.length < targetCount) {
    const originalRemaining = currentDay.problems.filter(p => !adjustedProblems.some(ap => ap.name === p.name));
    if (originalRemaining.length > 0) {
      adjustedProblems.push(originalRemaining[0]);
    } else {
      break;
    }
  }

  return adjustedProblems.slice(0, targetCount);
}

export function getAvailableTopics(): string[] {
  return Object.keys(DSA_TOPIC_KEYWORDS);
}
