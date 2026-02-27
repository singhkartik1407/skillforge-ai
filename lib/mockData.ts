// SkillForge AI - Mock Data
// Replace these with real API calls when integrating AI backend

import type {
  User,
  OverallStats,
  CodingQuestion,
  AptitudeQuestion,
  CommunicationPrompt,
  ActivityItem,
  AIRecommendation,
  RadarDataPoint,
  ScoreData,
} from "@/types";

export const mockUser: User = {
  id: "usr_001",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: undefined,
  joinedAt: "2024-01-15",
};

export const mockOverallStats: OverallStats = {
  codingScore: 78,
  aptitudeScore: 85,
  communicationScore: 72,
  overallScore: 78,
  streak: 7,
  problemsSolved: 42,
  hoursSpent: 36,
};

export const mockScoreHistory: ScoreData[] = [
  { module: "coding", score: 78, maxScore: 100, completedAt: "2024-02-20", trend: "up" },
  { module: "aptitude", score: 85, maxScore: 100, completedAt: "2024-02-19", trend: "up" },
  { module: "communication", score: 72, maxScore: 100, completedAt: "2024-02-18", trend: "stable" },
];

export const mockRadarData: RadarDataPoint[] = [
  { subject: "Problem Solving", score: 78, fullMark: 100 },
  { subject: "Aptitude", score: 85, fullMark: 100 },
  { subject: "Communication", score: 72, fullMark: 100 },
  { subject: "Speed", score: 65, fullMark: 100 },
  { subject: "Accuracy", score: 82, fullMark: 100 },
];

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act_001",
    module: "coding",
    action: 'Solved "Two Sum" problem',
    score: 92,
    timestamp: "2 hours ago",
  },
  {
    id: "act_002",
    module: "aptitude",
    action: "Completed Quantitative Reasoning quiz",
    score: 80,
    timestamp: "5 hours ago",
  },
  {
    id: "act_003",
    module: "communication",
    action: "Evaluated professional email response",
    score: 74,
    timestamp: "Yesterday",
  },
  {
    id: "act_004",
    module: "coding",
    action: 'Solved "Binary Search" problem',
    score: 88,
    timestamp: "2 days ago",
  },
  {
    id: "act_005",
    module: "aptitude",
    action: "Completed Logical Reasoning quiz",
    score: 95,
    timestamp: "3 days ago",
  },
];

export const mockAIRecommendation: AIRecommendation = {
  message:
    "Your communication skills need the most attention. Focus on clarity and structure in your responses. Try practicing STAR-method answers for behavioral questions. Your aptitude scores are strong — keep the momentum!",
  focusArea: "communication",
  priority: "high",
};

export const mockAIInsight =
  "\"Consistency beats intensity. Solving one problem daily is more effective than a weekend marathon.\" — Today's AI Insight";

// Coding questions mock data
export const mockCodingQuestions: CodingQuestion[] = [
  {
    id: "code_001",
    title: "Two Sum",
    difficulty: "easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    tags: ["Array", "Hash Table"],
    starterCode: {
      python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Your solution here\n    pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n}",
      cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your solution here\n        return {};\n    }\n};",
      c: "#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your solution here\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    return result;\n}",
    },
  },
  {
    id: "code_002",
    title: "Reverse String",
    difficulty: "easy",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ASCII character."],
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    tags: ["Two Pointers", "String"],
    starterCode: {
      python: "def reverseString(s: list[str]) -> None:\n    # Modify s in-place\n    pass",
      java: "class Solution {\n    public void reverseString(char[] s) {\n        // Modify s in-place\n    }\n}",
      cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Modify s in-place\n    }\n};",
      c: "void reverseString(char* s, int sSize) {\n    // Modify s in-place\n}",
    },
  },
  {
    id: "code_003",
    title: "Maximum Subarray",
    difficulty: "medium",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum and return its sum.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6." },
      { input: "nums = [1]", output: "1" },
    ],
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    starterCode: {
      python: "def maxSubArray(nums: list[int]) -> int:\n    # Your solution here\n    pass",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your solution here\n        return 0;\n    }\n}",
      cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your solution here\n        return 0;\n    }\n};",
      c: "int maxSubArray(int* nums, int numsSize) {\n    // Your solution here\n    return 0;\n}",
    },
  },
];

// Aptitude questions mock data
export const mockAptitudeQuestions: AptitudeQuestion[] = [
  {
    id: "apt_001",
    question: "A train travels 360 km in 4 hours. What is its average speed in km/h?",
    options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"],
    correctIndex: 1,
    explanation:
      "Average speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h. This is a straightforward application of the speed formula.",
    category: "Quantitative Aptitude",
    difficulty: "easy",
  },
  {
    id: "apt_002",
    question:
      "If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
    options: ["True", "False", "Cannot be determined", "Only sometimes"],
    correctIndex: 0,
    explanation:
      "This is a syllogism. If A⊂B and B⊂C, then A⊂C. Since all Bloops are Razzies (A⊂B) and all Razzies are Lazzies (B⊂C), it follows that all Bloops are Lazzies (A⊂C). The answer is True.",
    category: "Logical Reasoning",
    difficulty: "easy",
  },
  {
    id: "apt_003",
    question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correctIndex: 2,
    explanation:
      "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42. Each term is a product of two consecutive integers.",
    category: "Number Series",
    difficulty: "medium",
  },
  {
    id: "apt_004",
    question:
      "A shopkeeper sells an article at 20% profit. If the cost price is ₹500, what is the selling price?",
    options: ["₹550", "₹580", "₹600", "₹620"],
    correctIndex: 2,
    explanation:
      "Selling Price = Cost Price × (1 + Profit%) = 500 × 1.20 = ₹600. A 20% profit on ₹500 is ₹100, so SP = 500 + 100 = ₹600.",
    category: "Quantitative Aptitude",
    difficulty: "easy",
  },
  {
    id: "apt_005",
    question:
      "In a class of 40 students, 25 play cricket, 20 play football, and 10 play both. How many play neither?",
    options: ["3", "5", "7", "10"],
    correctIndex: 1,
    explanation:
      "Using set theory: |A∪B| = |A| + |B| - |A∩B| = 25 + 20 - 10 = 35. Students playing neither = 40 - 35 = 5.",
    category: "Set Theory",
    difficulty: "medium",
  },
];

// Communication prompts mock data
export const mockCommunicationPrompts: CommunicationPrompt[] = [
  {
    id: "comm_001",
    title: "Professional Email",
    prompt:
      "You are a team lead. Write a professional email to your manager explaining why a project deadline needs to be extended by one week. Be clear, concise, and solution-oriented.",
    category: "Professional Writing",
    minWords: 80,
    maxWords: 200,
  },
  {
    id: "comm_002",
    title: "Interview Answer: Tell Me About Yourself",
    prompt:
      "Answer the classic interview question: \"Tell me about yourself.\" Focus on your professional background, key achievements, and why you're interested in this role. Structure your answer clearly.",
    category: "Interview Preparation",
    minWords: 100,
    maxWords: 250,
  },
  {
    id: "comm_003",
    title: "Conflict Resolution",
    prompt:
      "Describe a situation where you had a disagreement with a colleague at work. How did you handle it, and what was the outcome? Use the STAR method (Situation, Task, Action, Result).",
    category: "Behavioral",
    minWords: 120,
    maxWords: 300,
  },
  {
    id: "comm_004",
    title: "Product Pitch",
    prompt:
      "You have 30 seconds to pitch a new productivity app to a potential investor. Write your elevator pitch covering the problem it solves, your solution, and the target market.",
    category: "Business Communication",
    minWords: 60,
    maxWords: 150,
  },
];
