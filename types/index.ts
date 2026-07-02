export type DSATopic =
  | 'arrays' | 'strings' | 'linked-lists' | 'stacks-queues'
  | 'trees' | 'graphs' | 'dp' | 'greedy' | 'backtracking'
  | 'binary-search' | 'two-pointers' | 'sliding-window'
  | 'heap' | 'trie' | 'segment-tree' | 'bit-manipulation'
  | 'math' | 'sorting' | 'recursion' | 'other';

export type FundamentalsCategory = 'os' | 'dbms' | 'cn' | 'system-design';
export type ElectronicsCategory = 'analog' | 'digital' | 'signals' | 'control' | 'embedded' | 'communication';

export interface UserProfile {
  id: string;
  createdAt: string;
  placementDate: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  debt: DebtRecord;
  settings: UserSettings;
}

export interface UserSettings {
  dailyDSAGoal: number;
  dailyFundamentalsGoal: number;
  dailyElectronicsGoal: number;
  dailyNumericalGoal: number;
  bootcampProblemsCount: number;
  checkInTimes: string[];
  leetcodeUsername?: string;
  harshMode: boolean;
  enabledEceCategories?: ElectronicsCategory[];
}

export interface DailyLog {
  date: string;
  dsaProblems: DSAProblem[];
  fundamentalsTopic: FundamentalsTopic | null;
  electronicsTopic: ElectronicsTopic | null;
  numericalsSolved: number;
  checkIns: CheckIn[];
  xpEarned: number;
  xpDecayed: number;
  questsCompleted: string[];
  debtPaid: DebtPayment[];
  notes: string;
}

export interface DSAProblem {
  id: string;
  name: string;
  platform: 'leetcode' | 'bootcamp' | 'gfg' | 'other';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: DSATopic;
  timeMinutes?: number;
  struggled: boolean;
  isBootcamp: boolean;
  timestamp: string;
  xpAwarded: number;
}

export interface FundamentalsTopic {
  id: string;
  category: FundamentalsCategory;
  topicName: string;
  subTopics: string[];
  confidence: 1 | 2 | 3 | 4 | 5;
  resourcesUsed: string[];
  timestamp: string;
  xpAwarded: number;
}

export interface ElectronicsTopic {
  id: string;
  category: ElectronicsCategory;
  topicName: string;
  formulasPracticed: string[];
  subTopicsCompleted?: string[];
  numericalCount: number;
  confidence: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  xpAwarded: number;
}

export interface CheckIn {
  id: string;
  scheduledTime: string;
  actualTime: string;
  wasOnTime: boolean;
  activitiesLogged: ActivitySummary;
  mood: 'motivated' | 'neutral' | 'struggling';
  dismissed: boolean;
}

export interface ActivitySummary {
  dsaCount: number;
  fundamentalsDone: boolean;
  electronicsDone: boolean;
  numericalCount: number;
}

export interface DebtRecord {
  dsaProblems: number;
  fundamentalsTopics: number;
  electronicsTopics: number;
  numericals: number;
  totalDebtXP: number;
  lastUpdated: string;
  history: DebtEvent[];
}

export interface DebtEvent {
  date: string;
  type: 'incurred' | 'paid' | 'interest';
  category: 'dsa' | 'fundamentals' | 'electronics' | 'numerical';
  amount: number;
  xpImpact: number;
}

export interface DebtPayment {
  category: 'dsa' | 'fundamentals' | 'electronics' | 'numerical';
  amount: number;
  xpRecovered: number;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'streak' | 'challenge' | 'boss';
  title: string;
  description: string;
  requirement: QuestRequirement;
  xpReward: number;
  bonusXP?: number;
  deadline: string;
  completed: boolean;
  completedAt?: string;
}

export interface QuestRequirement {
  type: 'dsa_count' | 'dsa_topic' | 'dsa_difficulty' | 'fundamentals' | 'electronics' | 'numerical' | 'streak' | 'boss_battle';
  target: number | string;
  current: number;
}

export interface TopicProgress {
  topic: string;
  category: string;
  totalSubTopics: number;
  completedSubTopics: number;
  lastPracticed: string;
  confidenceLevel: number;
  problemsSolved: number;
  isWeak: boolean;
}

export interface WeeklyStats {
  weekNumber: number;
  startDate: string;
  endDate: string;
  dsaSolved: number;
  fundamentalsCompleted: number;
  electronicsCompleted: number;
  numericalsSolved: number;
  xpEarned: number;
  xpDecayed: number;
  streakMaintained: boolean;
  bossDefeated: boolean;
  debtAtWeekEnd: number;
}

export interface ShameEntry {
  date: string;
  missedGoals: string[];
  xpLost: number;
  debtIncurred: number;
  excuseGiven?: string;
}

export interface LevelInfo {
  level: number;
  xp: number;
  title: string;
}
