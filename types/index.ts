// SkillForge AI - Type Definitions
// All types used across the application

export type Difficulty = "easy" | "medium" | "hard";
export type Language = "python" | "java" | "cpp" | "c";
export type ModuleType = "coding" | "aptitude" | "communication";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface ScoreData {
  module: ModuleType;
  score: number;
  maxScore: number;
  completedAt: string;
  trend: "up" | "down" | "stable";
}

export interface OverallStats {
  codingScore: number;
  aptitudeScore: number;
  communicationScore: number;
  overallScore: number;
  streak: number;
  problemsSolved: number;
  hoursSpent: number;
}

// Coding module types

/**
 * Structured response returned by /api/evaluate-code (OpenAI-backed).
 * score is 0-10; all other fields are plain strings / string arrays.
 */
export interface CodeEvaluation {
  score: number;
  correctness: string;
  timeComplexity: string;
  codeQuality: string;
  suggestions: string[];
}

export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  tags: string[];
  starterCode: Record<Language, string>;
}

export interface CodeFeedback {
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string[];
  improvements: string[];
  isCorrect: boolean;
}

// Aptitude module types
export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: Difficulty;
}

export interface AptitudeFeedback {
  isCorrect: boolean;
  selectedIndex: number;
  correctIndex: number;
  explanation: string;
  score: number;
}

// Communication module types
export interface CommunicationPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  minWords: number;
  maxWords: number;
}

export interface CommunicationFeedback {
  grammarScore: number;
  clarityScore: number;
  confidenceScore: number;
  overallScore: number;
  suggestions: string[];
  strengths: string[];
  wordCount: number;
}

// Dashboard types
export interface ActivityItem {
  id: string;
  module: ModuleType;
  action: string;
  score?: number;
  timestamp: string;
}

export interface AIRecommendation {
  message: string;
  focusArea: ModuleType;
  priority: "high" | "medium" | "low";
}

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}
