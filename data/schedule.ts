export interface ScheduledProblem {
  name: string;
  difficulty: 'E' | 'M' | 'H';
  leetcodeUrl?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  topic: string;
  phase: 'foundation' | 'intermediate' | 'revision';
  problemCount: number;
  problems: ScheduledProblem[];
  cs: {
    category: 'OS' | 'DBMS' | 'CN';
    topic: string;
    subtopics: string[];
  };
  ece: {
    category: 'Digital' | 'Analog' | 'Embedded';
    topic: string;
    subtopics: string[];
  };
}

export const START_DATE = '2026-06-26';

function getDateForDay(dayNumber: number): string {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + dayNumber - 1);
  return start.toISOString().split('T')[0];
}

export const SCHEDULE: DaySchedule[] = [
  {
    day: 1,
    date: getDateForDay(1),
    topic: 'Arrays & Hashing',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Two Sum', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
      { name: 'Contains Duplicate', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
      { name: 'Valid Anagram', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
      { name: 'Group Anagrams', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
      { name: 'Product of Array Except Self', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { name: 'Top K Frequent Elements', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
    ],
    cs: { category: 'OS', topic: 'Process Management', subtopics: ['Process vs Thread', 'PCB', 'Context Switching', 'IPC'] },
    ece: { category: 'Digital', topic: 'Boolean Algebra', subtopics: ['Laws', 'K-Maps', 'Minimization'] },
  },
  {
    day: 2,
    date: getDateForDay(2),
    topic: 'Arrays & Hashing (Advanced)',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { name: 'Single Number', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/single-number/' },
      { name: 'Subarray Sum Equals K', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { name: 'Longest Consecutive Sequence', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { name: 'Sort Colors', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/' },
      { name: 'Encode and Decode Strings', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/' },
    ],
    cs: { category: 'DBMS', topic: 'Relational Model', subtopics: ['Keys', 'Normalization', 'ER Diagrams'] },
    ece: { category: 'Analog', topic: 'Diodes', subtopics: ['PN Junction', 'Rectifiers', 'Zener'] },
  },
  {
    day: 3,
    date: getDateForDay(3),
    topic: 'Two Pointers',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Valid Palindrome', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
      { name: 'Merge Sorted Array', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/' },
      { name: 'Two Sum II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { name: '3Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { name: 'Container With Most Water', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { name: 'Remove Duplicates from Sorted Array II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/' },
    ],
    cs: { category: 'CN', topic: 'OSI & TCP/IP Models', subtopics: ['Layer Functions', 'Protocols'] },
    ece: { category: 'Embedded', topic: '8086 Architecture', subtopics: ['Registers', 'Instruction cycle'] },
  },
  {
    day: 4,
    date: getDateForDay(4),
    topic: 'Sliding Window',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Maximum Average Subarray I', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { name: 'Longest Repeating Character Replacement', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { name: 'Permutation in String', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/' },
      { name: 'Minimum Size Subarray Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
    ],
    cs: { category: 'OS', topic: 'CPU Scheduling', subtopics: ['FCFS', 'SJF', 'Round Robin', 'Priority'] },
    ece: { category: 'Digital', topic: 'Combinational Circuits', subtopics: ['Mux/Demux', 'Encoders', 'Adders'] },
  },
  {
    day: 5,
    date: getDateForDay(5),
    topic: 'Binary Search (Basics)',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Binary Search', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
      { name: 'Search Insert Position', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/search-insert-position/' },
      { name: 'Find First and Last Position', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { name: 'Search in Rotated Sorted Array', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { name: 'Find Minimum in Rotated Sorted Array', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { name: 'Search a 2D Matrix', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/' },
    ],
    cs: { category: 'DBMS', topic: 'SQL', subtopics: ['DDL/DML', 'Joins', 'Subqueries', 'Aggregation'] },
    ece: { category: 'Analog', topic: 'BJT', subtopics: ['Biasing', 'Amplifiers', 'Small Signal'] },
  },
  {
    day: 6,
    date: getDateForDay(6),
    topic: 'Binary Search (Advanced)',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Sqrt(x)', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/sqrtx/' },
      { name: 'Find Peak Element', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/find-peak-element/' },
      { name: 'Koko Eating Bananas', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { name: 'Capacity to Ship Packages', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' },
      { name: 'Search a 2D Matrix II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix-ii/' },
      { name: 'Time Based Key-Value Store', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/' },
    ],
    cs: { category: 'CN', topic: 'Data Link Layer', subtopics: ['Error Detection', 'Flow Control', 'MAC'] },
    ece: { category: 'Embedded', topic: 'Peripherals', subtopics: ['GPIO', 'Timers', 'ADC/DAC', 'PWM'] },
  },
  {
    day: 7,
    date: getDateForDay(7),
    topic: 'Linked Lists',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Reverse Linked List', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
      { name: 'Merge Two Sorted Lists', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { name: 'Linked List Cycle', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
      { name: 'Linked List Cycle II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { name: 'Remove Nth Node From End', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { name: 'Reorder List', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/' },
    ],
    cs: { category: 'OS', topic: 'Memory Management', subtopics: ['Paging', 'Segmentation', 'Virtual Memory'] },
    ece: { category: 'Digital', topic: 'Sequential Circuits', subtopics: ['Flip-Flops', 'Counters', 'FSM'] },
  },
  {
    day: 8,
    date: getDateForDay(8),
    topic: 'Stacks & Queues',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Valid Parentheses', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
      { name: 'Min Stack', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
      { name: 'Evaluate Reverse Polish Notation', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { name: 'Daily Temperatures', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/' },
      { name: 'Next Greater Element II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-ii/' },
      { name: 'Car Fleet', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/car-fleet/' },
    ],
    cs: { category: 'DBMS', topic: 'Transactions', subtopics: ['ACID', 'Isolation Levels', 'Locks'] },
    ece: { category: 'Analog', topic: 'MOSFET', subtopics: ['Operation', 'Biasing', 'CMOS'] },
  },
  {
    day: 9,
    date: getDateForDay(9),
    topic: 'Trees (Basics)',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Maximum Depth of Binary Tree', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { name: 'Same Tree', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
      { name: 'Invert Binary Tree', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
      { name: 'Binary Tree Level Order Traversal', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { name: 'Diameter of Binary Tree', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { name: 'Balanced Binary Tree', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/' },
    ],
    cs: { category: 'CN', topic: 'Network Layer', subtopics: ['IP Addressing', 'Subnetting', 'Routing'] },
    ece: { category: 'Embedded', topic: 'Communication', subtopics: ['UART', 'SPI', 'I2C'] },
  },
  {
    day: 10,
    date: getDateForDay(10),
    topic: 'Trees (Intermediate)',
    phase: 'foundation',
    problemCount: 6,
    problems: [
      { name: 'Subtree of Another Tree', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { name: 'Symmetric Tree', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/symmetric-tree/' },
      { name: 'Path Sum II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/path-sum-ii/' },
      { name: 'Lowest Common Ancestor of BST', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { name: 'Binary Tree Right Side View', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      { name: 'Validate Binary Search Tree', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    ],
    cs: { category: 'OS', topic: 'Deadlocks', subtopics: ['Conditions', 'Prevention', 'Avoidance'] },
    ece: { category: 'Digital', topic: 'Memory', subtopics: ['ROM', 'RAM', 'Cache'] },
  },
  {
    day: 11,
    date: getDateForDay(11),
    topic: 'Trees (Advanced)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Path Sum', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/path-sum/' },
      { name: 'Count Good Nodes', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
      { name: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { name: 'Kth Smallest Element in BST', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { name: 'Binary Tree Zigzag Level Order', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { name: 'Serialize and Deserialize Binary Tree', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      { name: 'Binary Tree Maximum Path Sum', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
    ],
    cs: { category: 'DBMS', topic: 'Indexing', subtopics: ['B+ Trees', 'Hashing', 'Query Optimization'] },
    ece: { category: 'Analog', topic: 'Op-Amps', subtopics: ['Configurations', 'Filters', 'Oscillators'] },
  },
  {
    day: 12,
    date: getDateForDay(12),
    topic: 'Heaps',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Last Stone Weight', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/' },
      { name: 'Kth Largest Element in a Stream', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { name: 'Kth Largest Element in an Array', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { name: 'Top K Frequent Elements (Heap)', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { name: 'Task Scheduler', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/' },
      { name: 'Design Twitter', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/design-twitter/' },
      { name: 'Find Median from Data Stream', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    ],
    cs: { category: 'CN', topic: 'Transport Layer', subtopics: ['TCP', 'UDP', 'Flow Control'] },
    ece: { category: 'Embedded', topic: 'RTOS', subtopics: ['Tasks', 'Scheduling', 'Semaphores'] },
  },
  {
    day: 13,
    date: getDateForDay(13),
    topic: 'Graphs (BFS/DFS)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Find if Path Exists', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/find-if-path-exists-in-graph/' },
      { name: 'Flood Fill', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/flood-fill/' },
      { name: 'Number of Islands', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
      { name: 'Max Area of Island', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/max-area-of-island/' },
      { name: 'Clone Graph', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
      { name: 'Rotting Oranges', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/' },
      { name: 'Surrounded Regions', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/surrounded-regions/' },
    ],
    cs: { category: 'OS', topic: 'Synchronization', subtopics: ['Mutex', 'Semaphores', 'Monitors'] },
    ece: { category: 'Digital', topic: 'Boolean Algebra Advanced', subtopics: ['QM Method'] },
  },
  {
    day: 14,
    date: getDateForDay(14),
    topic: 'Graphs (Intermediate)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Island Perimeter', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/island-perimeter/' },
      { name: 'Find the Town Judge', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/find-the-town-judge/' },
      { name: 'Pacific Atlantic Water Flow', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { name: 'Course Schedule', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
      { name: 'Course Schedule II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/' },
      { name: 'Graph Valid Tree', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/' },
      { name: 'Alien Dictionary', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/' },
    ],
    cs: { category: 'DBMS', topic: 'Recovery', subtopics: ['Log-based', 'Checkpointing'] },
    ece: { category: 'Analog', topic: 'Diodes Advanced', subtopics: ['LED', 'Photodiode', 'Schottky'] },
  },
  {
    day: 15,
    date: getDateForDay(15),
    topic: 'Graphs (Advanced)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Find Center of Star Graph', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/find-center-of-star-graph/' },
      { name: 'Keys and Rooms', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/keys-and-rooms/' },
      { name: 'Redundant Connection', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/' },
      { name: 'Number of Connected Components', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      { name: 'Cheapest Flights Within K Stops', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      { name: 'Network Delay Time', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/' },
      { name: 'Reconstruct Itinerary', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/reconstruct-itinerary/' },
    ],
    cs: { category: 'CN', topic: 'Application Layer', subtopics: ['HTTP', 'DNS', 'SMTP'] },
    ece: { category: 'Embedded', topic: 'ARM Architecture', subtopics: ['Registers', 'Modes', 'Pipeline'] },
  },
  {
    day: 16,
    date: getDateForDay(16),
    topic: 'Backtracking (Basics)',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Letter Case Permutation', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/letter-case-permutation/' },
      { name: 'Binary Watch', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/binary-watch/' },
      { name: 'Subsets', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
      { name: 'Subsets II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/' },
      { name: 'Permutations', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
      { name: 'Permutations II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/permutations-ii/' },
      { name: 'Combination Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
      { name: 'N-Queens', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
    ],
    cs: { category: 'OS', topic: 'File Systems', subtopics: ['Allocation', 'Directory', 'Disk Scheduling'] },
    ece: { category: 'Digital', topic: 'FSM', subtopics: ['Moore/Mealy', 'State Minimization'] },
  },
  {
    day: 17,
    date: getDateForDay(17),
    topic: 'Backtracking (Advanced)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Generate Parentheses', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/' },
      { name: 'Letter Combinations of Phone Number', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { name: 'Combination Sum II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/' },
      { name: 'Palindrome Partitioning', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { name: 'Word Search', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
      { name: 'Sudoku Solver', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/' },
      { name: 'N-Queens II', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/n-queens-ii/' },
    ],
    cs: { category: 'DBMS', topic: 'SQL Advanced', subtopics: ['Window Functions', 'CTEs'] },
    ece: { category: 'Analog', topic: 'BJT Advanced', subtopics: ['CE', 'CB', 'CC configs'] },
  },
  {
    day: 18,
    date: getDateForDay(18),
    topic: 'Tries',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Implement Trie', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { name: 'Design Add and Search Words', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { name: 'Word Search II', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/' },
      { name: 'Replace Words', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/replace-words/' },
      { name: 'Maximum XOR of Two Numbers', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
      { name: 'Longest Word in Dictionary', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-word-in-dictionary/' },
      { name: 'Palindrome Pairs', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/palindrome-pairs/' },
    ],
    cs: { category: 'CN', topic: 'Network Security', subtopics: ['Firewalls', 'VPN', 'SSL/TLS'] },
    ece: { category: 'Embedded', topic: 'Interrupt Handling', subtopics: ['Priority', 'Vectored', 'Nested'] },
  },
  {
    day: 19,
    date: getDateForDay(19),
    topic: 'Greedy',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Assign Cookies', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/assign-cookies/' },
      { name: 'Lemonade Change', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/lemonade-change/' },
      { name: 'Maximum Subarray', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
      { name: 'Jump Game', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
      { name: 'Jump Game II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' },
      { name: 'Gas Station', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/gas-station/' },
      { name: 'Partition Labels', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/partition-labels/' },
      { name: 'Merge Intervals', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
    ],
    cs: { category: 'OS', topic: 'Virtual Memory', subtopics: ['TLB', 'Page Tables', 'Thrashing'] },
    ece: { category: 'Digital', topic: 'Timing Analysis', subtopics: ['Setup', 'Hold', 'Delay'] },
  },
  {
    day: 20,
    date: getDateForDay(20),
    topic: 'Intervals',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Meeting Rooms', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/' },
      { name: 'Meeting Rooms II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { name: 'Non-overlapping Intervals', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { name: 'Insert Interval', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/' },
      { name: 'Minimum Arrows to Burst Balloons', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/' },
      { name: 'Interval List Intersections', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/interval-list-intersections/' },
      { name: 'Employee Free Time', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/employee-free-time/' },
    ],
    cs: { category: 'DBMS', topic: 'NoSQL', subtopics: ['Document', 'Key-Value', 'Graph DBs'] },
    ece: { category: 'Analog', topic: 'CMOS', subtopics: ['Inverter', 'NAND', 'NOR'] },
  },
  {
    day: 21,
    date: getDateForDay(21),
    topic: 'DP (1D Basics)',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Climbing Stairs', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
      { name: 'House Robber', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
      { name: 'House Robber II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/' },
      { name: 'Min Cost Climbing Stairs', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
      { name: 'Decode Ways', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/' },
      { name: 'Coin Change', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
      { name: 'Maximum Product Subarray', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { name: 'Word Break', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
    ],
    cs: { category: 'CN', topic: 'Subnetting Practice', subtopics: ['VLSM', 'CIDR'] },
    ece: { category: 'Embedded', topic: 'Memory Interfacing', subtopics: ['ROM', 'RAM'] },
  },
  {
    day: 22,
    date: getDateForDay(22),
    topic: 'DP (1D Advanced)',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Fibonacci Number', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/' },
      { name: 'Tribonacci Number', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/n-th-tribonacci-number/' },
      { name: 'Longest Increasing Subsequence', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { name: 'Partition Equal Subset Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      { name: 'Perfect Squares', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/perfect-squares/' },
      { name: 'Longest Palindromic Substring', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { name: 'Palindromic Substrings', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/' },
      { name: 'Longest Valid Parentheses', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/longest-valid-parentheses/' },
    ],
    cs: { category: 'OS', topic: 'Sync Problems', subtopics: ['Producer-Consumer', 'Dining Philosophers'] },
    ece: { category: 'Digital', topic: 'Counters', subtopics: ['Synchronous', 'Asynchronous', 'Johnson'] },
  },
  {
    day: 23,
    date: getDateForDay(23),
    topic: 'DP (2D Basics)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Unique Paths', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/' },
      { name: 'Unique Paths II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/unique-paths-ii/' },
      { name: 'Minimum Path Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/minimum-path-sum/' },
      { name: 'Triangle', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/triangle/' },
      { name: 'Maximal Square', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/maximal-square/' },
      { name: 'Interleaving String', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/' },
      { name: 'Edit Distance', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
    ],
    cs: { category: 'DBMS', topic: 'Query Optimization', subtopics: ['Execution Plans', 'Indexes'] },
    ece: { category: 'Analog', topic: 'Op-Amp Applications', subtopics: ['Integrator', 'Filters'] },
  },
  {
    day: 24,
    date: getDateForDay(24),
    topic: 'DP (2D Advanced)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: "Pascal's Triangle", difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/pascals-triangle/' },
      { name: "Pascal's Triangle II", difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/pascals-triangle-ii/' },
      { name: 'Longest Common Subsequence', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { name: 'Shortest Common Supersequence', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/shortest-common-supersequence/' },
      { name: 'Longest Palindromic Subsequence', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-subsequence/' },
      { name: 'Distinct Subsequences', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/' },
      { name: 'Regular Expression Matching', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/' },
    ],
    cs: { category: 'CN', topic: 'Routing Protocols', subtopics: ['RIP', 'OSPF', 'BGP'] },
    ece: { category: 'Embedded', topic: 'ADC/DAC', subtopics: ['Resolution', 'Sampling'] },
  },
  {
    day: 25,
    date: getDateForDay(25),
    topic: 'DP (Knapsack)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: '0/1 Knapsack', difficulty: 'M', leetcodeUrl: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
      { name: 'Target Sum', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/target-sum/' },
      { name: 'Coin Change 2', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/coin-change-ii/' },
      { name: 'Ones and Zeroes', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/ones-and-zeroes/' },
      { name: 'Last Stone Weight II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight-ii/' },
      { name: 'Profitable Schemes', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/profitable-schemes/' },
      { name: 'Minimum Cost to Cut a Stick', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/' },
    ],
    cs: { category: 'OS', topic: 'Disk Scheduling', subtopics: ['FCFS', 'SSTF', 'SCAN'] },
    ece: { category: 'Digital', topic: 'PLAs/PALs/FPGAs', subtopics: ['Architecture', 'Programming'] },
  },
  {
    day: 26,
    date: getDateForDay(26),
    topic: 'DP (Stocks)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Best Time to Buy and Sell Stock (DP)', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { name: 'Best Time to Buy and Sell Stock II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/' },
      { name: 'Best Time with Cooldown', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
      { name: 'Best Time with Transaction Fee', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/' },
      { name: 'Best Time to Buy and Sell Stock III', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/' },
      { name: 'Best Time to Buy and Sell Stock IV', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/' },
      { name: 'Burst Balloons', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/' },
    ],
    cs: { category: 'DBMS', topic: 'Distributed DBs', subtopics: ['Sharding', 'Replication', 'CAP'] },
    ece: { category: 'Analog', topic: 'Oscillators', subtopics: ['RC', 'LC', 'Crystal'] },
  },
  {
    day: 27,
    date: getDateForDay(27),
    topic: 'DP (Intervals)',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'Range Sum Query - Immutable', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-immutable/' },
      { name: 'Range Sum Query 2D', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-2d-immutable/' },
      { name: 'Matrix Chain Multiplication', difficulty: 'M', leetcodeUrl: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },
      { name: 'Palindrome Partitioning II', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      { name: 'Super Egg Drop', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/super-egg-drop/' },
      { name: 'Minimum Cost Tree From Leaf Values', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/' },
      { name: 'Stone Game', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/stone-game/' },
    ],
    cs: { category: 'CN', topic: 'TCP Deep Dive', subtopics: ['3-way handshake', 'Sliding window'] },
    ece: { category: 'Embedded', topic: 'Timers and PWM', subtopics: ['Applications', 'Modes'] },
  },
  {
    day: 28,
    date: getDateForDay(28),
    topic: 'Bit Manipulation',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Number of 1 Bits', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/' },
      { name: 'Counting Bits', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/' },
      { name: 'Reverse Bits', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/' },
      { name: 'Single Number II', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/single-number-ii/' },
      { name: 'Single Number III', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/single-number-iii/' },
      { name: 'Missing Number', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/missing-number/' },
      { name: 'Sum of Two Integers', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { name: 'Maximum XOR of Two Numbers', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
    ],
    cs: { category: 'OS', topic: 'Memory Allocation', subtopics: ['First Fit', 'Best Fit', 'Buddy'] },
    ece: { category: 'Digital', topic: 'Hazards', subtopics: ['Static', 'Dynamic'] },
  },
  {
    day: 29,
    date: getDateForDay(29),
    topic: 'Math & Geometry',
    phase: 'intermediate',
    problemCount: 8,
    problems: [
      { name: 'Happy Number', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/happy-number/' },
      { name: 'Plus One', difficulty: 'E', leetcodeUrl: 'https://leetcode.com/problems/plus-one/' },
      { name: 'Pow(x, n)', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/powx-n/' },
      { name: 'Multiply Strings', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/multiply-strings/' },
      { name: 'Rotate Image', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/' },
      { name: 'Spiral Matrix', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/' },
      { name: 'Set Matrix Zeroes', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
    ],
    cs: { category: 'DBMS', topic: 'Concurrency Control', subtopics: ['2PL', 'MVCC'] },
    ece: { category: 'Analog', topic: 'Power Amplifiers', subtopics: ['Class A', 'B', 'AB'] },
  },
  {
    day: 30,
    date: getDateForDay(30),
    topic: 'Advanced Mixed',
    phase: 'intermediate',
    problemCount: 7,
    problems: [
      { name: 'LRU Cache', difficulty: 'M', leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
      { name: 'LFU Cache', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/lfu-cache/' },
      { name: 'Median of Two Sorted Arrays', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { name: 'Trapping Rain Water', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
      { name: 'Sliding Window Maximum', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { name: 'Minimum Window Substring', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
      { name: 'Longest Substring with K Distinct', difficulty: 'H', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/' },
    ],
    cs: { category: 'CN', topic: 'Network Troubleshooting', subtopics: ['ping', 'traceroute', 'netstat'] },
    ece: { category: 'Embedded', topic: 'Real-time scheduling', subtopics: ['Rate Monotonic', 'EDF'] },
  },
  {
    day: 31,
    date: getDateForDay(31),
    topic: 'Revision: Arrays, Strings, Sliding Window',
    phase: 'revision',
    problemCount: 0,
    problems: [],
    cs: { category: 'OS', topic: 'Full Revision', subtopics: ['Process', 'Memory', 'Deadlocks', 'Sync'] },
    ece: { category: 'Digital', topic: 'Full Revision', subtopics: ['Boolean', 'Combinational', 'Sequential'] },
  },
  {
    day: 32,
    date: getDateForDay(32),
    topic: 'Revision: Binary Search, Linked Lists, Stacks',
    phase: 'revision',
    problemCount: 0,
    problems: [],
    cs: { category: 'DBMS', topic: 'Full Revision', subtopics: ['SQL', 'Transactions', 'Indexing'] },
    ece: { category: 'Analog', topic: 'Full Revision', subtopics: ['Diodes', 'BJT', 'MOSFET', 'Op-Amps'] },
  },
  {
    day: 33,
    date: getDateForDay(33),
    topic: 'Revision: Trees, Heaps, Graphs',
    phase: 'revision',
    problemCount: 0,
    problems: [],
    cs: { category: 'CN', topic: 'Full Revision', subtopics: ['OSI', 'TCP/IP', 'Routing'] },
    ece: { category: 'Embedded', topic: 'Full Revision', subtopics: ['Architecture', 'Peripherals', 'Protocols'] },
  },
  {
    day: 34,
    date: getDateForDay(34),
    topic: 'Revision: Backtracking, Greedy, DP',
    phase: 'revision',
    problemCount: 0,
    problems: [],
    cs: { category: 'OS', topic: 'Mixed Most-Asked', subtopics: ['Top interview topics'] },
    ece: { category: 'Digital', topic: 'Numericals Practice', subtopics: ['All topics'] },
  },
  {
    day: 35,
    date: getDateForDay(35),
    topic: 'Final: All Hard Problems',
    phase: 'revision',
    problemCount: 0,
    problems: [],
    cs: { category: 'DBMS', topic: 'System Design Basics', subtopics: ['Scalability', 'Architecture'] },
    ece: { category: 'Analog', topic: 'Formula Sheet Review', subtopics: ['All formulas'] },
  },
];

export function getTodaySchedule(): DaySchedule | null {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  return SCHEDULE.find(s => s.date === today) || null;
}

export function getCurrentDay(): number {
  const today = new Date();
  const [startYear, startMonth, startDay] = START_DATE.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);

  // Use local date components to avoid timezone issues
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  const diffTime = todayMidnight.getTime() - startMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(35, diffDays));
}

export function getScheduleByDay(day: number): DaySchedule | null {
  return SCHEDULE.find(s => s.day === day) || null;
}

export function getTotalProblems(): number {
  return SCHEDULE.reduce((sum, day) => sum + day.problems.length, 0);
}
