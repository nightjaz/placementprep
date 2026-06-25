import { LevelInfo, UserSettings } from '@/types';

export const XP_VALUES = {
  dsa: {
    easy: 50,
    medium: 100,
    hard: 200,
    firstOfDay: 25,
    hardStreak: 50,
    topicMaster: 100,
  },
  fundamentals: {
    topicComplete: 150,
    highConfidence: 50,
    allSubTopics: 75,
  },
  electronics: {
    topicComplete: 150,
    numerical: 20,
    numericalBonus: 50,
  },
  quests: {
    daily: 200,
    weekly: 500,
    challenge: 300,
    bossVictory: 1000,
  },
  streak: {
    day7: 500,
    day14: 1000,
    day21: 2000,
    day28: 3000,
    day35: 5000,
  },
  checkIn: {
    onTime: 25,
    late: 10,
    allFour: 100,
  },
};

export const XP_DECAY = {
  missedDSA: 30,
  missedFundamentals: 100,
  missedElectronics: 100,
  missedNumerical: 15,
  streakBroken: {
    days1_7: 200,
    days8_14: 500,
    days15_21: 1000,
    days22_plus: 2000,
  },
  debtInterestRate: 0.10,
  missedCheckIn: 50,
};

export const LEVEL_THRESHOLDS: LevelInfo[] = [
  { level: 1, xp: 0, title: "Placement Newbie" },
  { level: 2, xp: 500, title: "Code Initiate" },
  { level: 3, xp: 1200, title: "Problem Solver" },
  { level: 4, xp: 2100, title: "Algorithm Apprentice" },
  { level: 5, xp: 3300, title: "Data Structure Disciple" },
  { level: 6, xp: 4800, title: "Logic Master" },
  { level: 7, xp: 6600, title: "Recursion Ranger" },
  { level: 8, xp: 8800, title: "Graph Guardian" },
  { level: 9, xp: 11500, title: "DP Dominator" },
  { level: 10, xp: 14700, title: "System Sage" },
  { level: 11, xp: 18500, title: "Full Stack Fighter" },
  { level: 12, xp: 23000, title: "Interview Assassin" },
  { level: 13, xp: 28200, title: "Offer Magnet" },
  { level: 14, xp: 34200, title: "Placement Predator" },
  { level: 15, xp: 41000, title: "Placement Champion" },
];

export const DSA_TOPICS = [
  { id: 'arrays', name: 'Arrays & Hashing', difficulty: 'beginner' },
  { id: 'strings', name: 'Strings', difficulty: 'beginner' },
  { id: 'two-pointers', name: 'Two Pointers', difficulty: 'beginner' },
  { id: 'sliding-window', name: 'Sliding Window', difficulty: 'intermediate' },
  { id: 'binary-search', name: 'Binary Search', difficulty: 'intermediate' },
  { id: 'linked-lists', name: 'Linked Lists', difficulty: 'beginner' },
  { id: 'stacks-queues', name: 'Stacks & Queues', difficulty: 'beginner' },
  { id: 'trees', name: 'Trees', difficulty: 'intermediate' },
  { id: 'heap', name: 'Heap / Priority Queue', difficulty: 'intermediate' },
  { id: 'graphs', name: 'Graphs', difficulty: 'advanced' },
  { id: 'dp', name: 'Dynamic Programming', difficulty: 'advanced' },
  { id: 'greedy', name: 'Greedy', difficulty: 'intermediate' },
  { id: 'backtracking', name: 'Backtracking', difficulty: 'advanced' },
  { id: 'trie', name: 'Trie', difficulty: 'advanced' },
  { id: 'bit-manipulation', name: 'Bit Manipulation', difficulty: 'intermediate' },
  { id: 'math', name: 'Math & Geometry', difficulty: 'intermediate' },
  { id: 'sorting', name: 'Sorting', difficulty: 'beginner' },
  { id: 'recursion', name: 'Recursion', difficulty: 'beginner' },
  { id: 'segment-tree', name: 'Segment Tree', difficulty: 'advanced' },
  { id: 'other', name: 'Other', difficulty: 'intermediate' },
];

export const CS_FUNDAMENTALS = {
  os: {
    name: 'Operating Systems',
    topics: [
      { id: 'process', name: 'Process Management', subTopics: ['Process vs Thread', 'PCB', 'Context Switching', 'IPC'] },
      { id: 'scheduling', name: 'CPU Scheduling', subTopics: ['FCFS', 'SJF', 'Round Robin', 'Priority', 'MLFQ'] },
      { id: 'memory', name: 'Memory Management', subTopics: ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement'] },
      { id: 'deadlock', name: 'Deadlocks', subTopics: ['Conditions', 'Prevention', 'Avoidance', 'Detection'] },
      { id: 'sync', name: 'Synchronization', subTopics: ['Mutex', 'Semaphores', 'Monitors', 'Classic Problems'] },
      { id: 'file', name: 'File Systems', subTopics: ['File Allocation', 'Directory Structure', 'Disk Scheduling'] },
    ],
  },
  dbms: {
    name: 'Database Management',
    topics: [
      { id: 'relational', name: 'Relational Model', subTopics: ['Keys', 'Normalization', 'ER Diagrams', 'Relational Algebra'] },
      { id: 'sql', name: 'SQL', subTopics: ['DDL/DML', 'Joins', 'Subqueries', 'Aggregation', 'Views'] },
      { id: 'transactions', name: 'Transactions', subTopics: ['ACID', 'Isolation Levels', 'Concurrency Control', 'Locks'] },
      { id: 'indexing', name: 'Indexing', subTopics: ['B+ Trees', 'Hashing', 'Query Optimization'] },
      { id: 'recovery', name: 'Recovery', subTopics: ['Log-based', 'Checkpointing', 'ARIES'] },
    ],
  },
  cn: {
    name: 'Computer Networks',
    topics: [
      { id: 'osi', name: 'OSI & TCP/IP Models', subTopics: ['Layer Functions', 'Protocols at Each Layer', 'Encapsulation'] },
      { id: 'physical', name: 'Physical Layer', subTopics: ['Transmission Media', 'Encoding', 'Multiplexing'] },
      { id: 'datalink', name: 'Data Link Layer', subTopics: ['Error Detection', 'Flow Control', 'MAC', 'Ethernet'] },
      { id: 'network', name: 'Network Layer', subTopics: ['IP Addressing', 'Subnetting', 'Routing', 'NAT', 'ICMP'] },
      { id: 'transport', name: 'Transport Layer', subTopics: ['TCP', 'UDP', 'Flow Control', 'Congestion Control'] },
      { id: 'application', name: 'Application Layer', subTopics: ['HTTP/HTTPS', 'DNS', 'SMTP', 'FTP', 'DHCP'] },
    ],
  },
  'system-design': {
    name: 'System Design',
    topics: [
      { id: 'basics', name: 'Fundamentals', subTopics: ['Scalability', 'Load Balancing', 'Caching', 'CDN'] },
      { id: 'database-design', name: 'Database Design', subTopics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'CAP Theorem'] },
      { id: 'messaging', name: 'Messaging', subTopics: ['Message Queues', 'Pub/Sub', 'Kafka', 'Event Sourcing'] },
      { id: 'patterns', name: 'Design Patterns', subTopics: ['Microservices', 'API Gateway', 'CQRS', 'Rate Limiting'] },
    ],
  },
};

export const ELECTRONICS_TOPICS = {
  analog: {
    name: 'Analog Electronics',
    topics: [
      { id: 'diodes', name: 'Diodes', subTopics: ['PN Junction', 'Rectifiers', 'Zener', 'Clipper/Clamper'] },
      { id: 'bjt', name: 'BJT', subTopics: ['Biasing', 'Amplifiers', 'Small Signal', 'Frequency Response'] },
      { id: 'mosfet', name: 'MOSFET', subTopics: ['Operation', 'Biasing', 'Amplifiers', 'CMOS'] },
      { id: 'opamp', name: 'Op-Amps', subTopics: ['Ideal vs Real', 'Configurations', 'Filters', 'Oscillators'] },
    ],
  },
  digital: {
    name: 'Digital Electronics',
    topics: [
      { id: 'boolean', name: 'Boolean Algebra', subTopics: ['Laws', 'K-Maps', 'Minimization', 'QM Method'] },
      { id: 'combinational', name: 'Combinational Circuits', subTopics: ['Mux/Demux', 'Encoders/Decoders', 'Adders', 'Comparators'] },
      { id: 'sequential', name: 'Sequential Circuits', subTopics: ['Flip-Flops', 'Counters', 'Registers', 'FSM'] },
      { id: 'memory', name: 'Memory', subTopics: ['ROM', 'RAM', 'Cache', 'Virtual Memory'] },
    ],
  },
  signals: {
    name: 'Signals & Systems',
    topics: [
      { id: 'continuous', name: 'Continuous Signals', subTopics: ['Classification', 'Operations', 'Fourier Series', 'Fourier Transform'] },
      { id: 'discrete', name: 'Discrete Signals', subTopics: ['Z-Transform', 'DTFT', 'DFT', 'FFT'] },
      { id: 'lti', name: 'LTI Systems', subTopics: ['Convolution', 'Transfer Function', 'Stability', 'Frequency Response'] },
      { id: 'filters', name: 'Filter Design', subTopics: ['FIR', 'IIR', 'Butterworth', 'Chebyshev'] },
    ],
  },
  embedded: {
    name: 'Embedded Systems',
    topics: [
      { id: 'architecture', name: 'Microcontroller Architecture', subTopics: ['8051', 'AVR', 'ARM', 'Memory Map'] },
      { id: 'peripherals', name: 'Peripherals', subTopics: ['GPIO', 'Timers', 'ADC/DAC', 'PWM'] },
      { id: 'communication', name: 'Communication', subTopics: ['UART', 'SPI', 'I2C', 'CAN'] },
      { id: 'rtos', name: 'RTOS Concepts', subTopics: ['Tasks', 'Scheduling', 'Semaphores', 'Interrupts'] },
    ],
  },
  communication: {
    name: 'Communication Systems',
    topics: [
      { id: 'analog-mod', name: 'Analog Modulation', subTopics: ['AM', 'FM', 'PM', 'Superheterodyne'] },
      { id: 'digital-mod', name: 'Digital Modulation', subTopics: ['ASK', 'FSK', 'PSK', 'QAM'] },
      { id: 'coding', name: 'Source & Channel Coding', subTopics: ['Huffman', 'Hamming', 'Convolutional', 'Turbo'] },
      { id: 'wireless', name: 'Wireless', subTopics: ['Propagation', 'Fading', 'OFDM', 'MIMO'] },
    ],
  },
  control: {
    name: 'Control Systems',
    topics: [
      { id: 'modeling', name: 'System Modeling', subTopics: ['Transfer Function', 'Block Diagrams', 'Signal Flow'] },
      { id: 'time-domain', name: 'Time Domain', subTopics: ['Transient Response', 'Steady State', 'Stability'] },
      { id: 'frequency', name: 'Frequency Domain', subTopics: ['Bode Plot', 'Nyquist', 'Gain/Phase Margin'] },
      { id: 'controllers', name: 'Controllers', subTopics: ['PID', 'Lead/Lag', 'State Space', 'Root Locus'] },
    ],
  },
};

export const DEFAULT_SETTINGS: UserSettings = {
  dailyDSAGoal: 8,
  dailyFundamentalsGoal: 1,
  dailyElectronicsGoal: 1,
  dailyNumericalGoal: 5,
  bootcampProblemsCount: 6,
  checkInTimes: ['10:00', '15:00', '19:00', '23:00'],
  harshMode: true,
};

export const STORAGE_KEYS = {
  USER_PROFILE: 'pq_user_profile',
  DAILY_LOGS: 'pq_daily_logs',
  QUESTS: 'pq_quests',
  TOPIC_PROGRESS: 'pq_topic_progress',
  WEEKLY_STATS: 'pq_weekly_stats',
  SHAME_WALL: 'pq_shame_wall',
};
