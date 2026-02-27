"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import QuestionCard from "@/components/QuestionCard";
import CodeEditor from "@/components/CodeEditor";
import FeedbackPanel from "@/components/FeedbackPanel";
import { mockCodingQuestions, mockUser, mockOverallStats } from "@/lib/mockData";
import type { Language, CodeEvaluation } from "@/types";
import { useSkillContext } from "@/context/SkillContext";

const LANGUAGES: { label: string; value: Language }[] = [
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
];

export default function CodingPage() {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(mockCodingQuestions[0].starterCode["python"]);
  const [feedback, setFeedback] = useState<CodeEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCodingScore } = useSkillContext();

  const currentQuestion = mockCodingQuestions[selectedQuestionIndex];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(currentQuestion.starterCode[lang]);
    setFeedback(null);
    setError(null);
  };

  const handleQuestionChange = (index: number) => {
    setSelectedQuestionIndex(index);
    setLanguage("python");
    setCode(mockCodingQuestions[index].starterCode["python"]);
    setFeedback(null);
    setError(null);
  };

  // Calls the /api/evaluate-code route which uses OpenAI server-side.
  // To swap models or prompts, edit app/api/evaluate-code/route.ts only.
  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await fetch("/api/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${currentQuestion.title}: ${currentQuestion.description}`,
          language,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Evaluation failed. Please try again.");
        return;
      }

      const evaluation = data as CodeEvaluation;
      setFeedback(evaluation);
      setCodingScore(evaluation.score);
    } catch {
      setError("Network error — could not reach the AI service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Map the CodeEvaluation fields into the FeedbackPanel's generic items array.
  // score is out of 10 from the API; display as /10 for clarity.
  const feedbackItems = feedback
    ? [
        { label: "Score", value: feedback.score * 10 },
        { label: "Time Complexity", value: feedback.timeComplexity },
        { label: "Correctness", value: feedback.correctness },
        { label: "Code Quality", value: feedback.codeQuality },
      ]
    : [
        { label: "Score", value: "--" },
        { label: "Time Complexity", value: "--" },
        { label: "Correctness", value: "--" },
        { label: "Code Quality", value: "--" },
      ];

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Navbar user={mockUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar stats={mockOverallStats} />

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-4 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base font-semibold text-white">Coding Practice</h1>
                  <p className="text-xs text-gray-500">Powered by GPT-4o-mini</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      language === lang.value
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-0">
            {/* Question List Sidebar */}
            <div className="w-56 flex-shrink-0 border-r border-white/10 min-h-[calc(100vh-8rem)]">
              <div className="p-3">
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3 px-1">
                  Problems
                </p>
                {mockCodingQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionChange(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${
                      selectedQuestionIndex === idx
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600">#{idx + 1}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          q.difficulty === "easy"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : q.difficulty === "medium"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <span className="block leading-tight">{q.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-0 min-h-[calc(100vh-8rem)]">
              {/* Left: Question + Feedback */}
              <div className="border-r border-white/10 p-5 overflow-y-auto space-y-4">
                <QuestionCard
                  id={currentQuestion.id}
                  title={currentQuestion.title}
                  difficulty={currentQuestion.difficulty}
                  description={currentQuestion.description}
                  constraints={currentQuestion.constraints}
                  examples={currentQuestion.examples}
                  tags={currentQuestion.tags}
                />

                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <FeedbackPanel
                  title="AI Code Evaluation"
                  isLoading={isLoading}
                  isEmpty={!feedback && !isLoading && !error}
                  items={feedbackItems}
                  suggestions={feedback?.suggestions}
                />
              </div>

              {/* Right: Code Editor */}
              <div className="p-5 flex flex-col gap-4">
                <CodeEditor
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    if (error) setError(null);
                  }}
                  language={language}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l2 2" />
                    </svg>
                    Tab key inserts 4 spaces
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCode(currentQuestion.starterCode[language]);
                        setFeedback(null);
                        setError(null);
                      }}
                      className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !code.trim()}
                      className="flex items-center gap-2 px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Submit Solution
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
