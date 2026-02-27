"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import QuestionCard from "@/components/QuestionCard";
import { mockAptitudeQuestions, mockUser, mockOverallStats } from "@/lib/mockData";
import type { AptitudeFeedback } from "@/types";
import { useScores } from "@/context/ScoreContext";

type AptitudeApiResult = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  error?: string;
};

function inferCorrectIndex(
  correctAnswer: string,
  options: string[],
  optionLabels: string[]
): number | null {
  const trimmed = (correctAnswer ?? "").trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  const labelMatch = upper.match(/^\s*([ABCD])\b/);
  if (labelMatch) {
    const idx = optionLabels.indexOf(labelMatch[1]);
    return idx >= 0 ? idx : null;
  }

  const exactIdx = options.findIndex((o) => o.trim() === trimmed);
  if (exactIdx >= 0) return exactIdx;

  return null;
}

async function evaluateAptitudeViaApi(params: {
  question: string;
  options: string[];
  selectedAnswer: string;
}): Promise<AptitudeApiResult> {
  const res = await fetch("/api/evaluate-aptitude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = (await res.json()) as AptitudeApiResult;
  if (!res.ok) {
    return {
      isCorrect: false,
      correctAnswer: "",
      explanation: data?.error ?? "Evaluation failed. Please try again.",
      difficulty: "Unknown",
      error: data?.error ?? "Evaluation failed",
    };
  }
  return data;
}

export default function AptitudePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AptitudeFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(Array(mockAptitudeQuestions.length).fill(false));
  const { scores, updateScore } = useScores();

  const currentQuestion = mockAptitudeQuestions[currentIndex];
  const totalAnswered = answered.filter(Boolean).length;

  // AI integration point: submitAnswer calls evaluateAptitude which will call AI API
  const handleSubmit = async () => {
    if (selectedOption === null || answered[currentIndex]) return;
    setIsLoading(true);
    try {
      const optionLabels = ["A", "B", "C", "D"];
      const labeledOptions = currentQuestion.options.map(
        (opt, idx) => `${optionLabels[idx]}. ${opt}`
      );
      const selectedAnswer = `${optionLabels[selectedOption]}. ${currentQuestion.options[selectedOption]}`;

      let apiResult: AptitudeApiResult | null = null;
      try {
        apiResult = await evaluateAptitudeViaApi({
          question: currentQuestion.question,
          options: labeledOptions,
          selectedAnswer,
        });
      } catch {
        apiResult = null;
      }

      const inferredCorrectIndex =
        apiResult
          ? inferCorrectIndex(
              apiResult.correctAnswer,
              currentQuestion.options,
              optionLabels
            )
          : null;

      const isCorrect = apiResult
        ? Boolean(apiResult.isCorrect)
        : selectedOption === currentQuestion.correctIndex;

      const result: AptitudeFeedback = {
        isCorrect,
        selectedIndex: selectedOption,
        correctIndex:
          inferredCorrectIndex ?? currentQuestion.correctIndex,
        explanation:
          apiResult?.explanation ??
          currentQuestion.explanation,
        score: isCorrect ? 100 : 0,
      };

      setFeedback(result);
      if (isCorrect) {
        updateScore("aptitude", scores.aptitude + 2);
      } else {
        updateScore("aptitude", scores.aptitude - 1);
      }
      if (isCorrect) setScore((s) => s + 1);
      const newAnswered = [...answered];
      newAnswered[currentIndex] = true;
      setAnswered(newAnswered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockAptitudeQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setFeedback(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedOption(null);
      setFeedback(null);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  const getOptionStyle = (idx: number) => {
    if (!feedback) {
      return selectedOption === idx
        ? "bg-indigo-600/20 border-indigo-500/60 text-white"
        : "bg-gray-800/50 border-white/10 text-gray-300 hover:border-indigo-500/30 hover:bg-gray-800";
    }
    if (idx === feedback.correctIndex) return "bg-emerald-500/15 border-emerald-500/60 text-emerald-300";
    if (idx === feedback.selectedIndex && !feedback.isCorrect) return "bg-red-500/15 border-red-500/60 text-red-300";
    return "bg-gray-800/30 border-white/5 text-gray-500";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Navbar user={mockUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar stats={mockOverallStats} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Aptitude Training</h1>
                <p className="text-xs text-gray-500">AI-powered adaptive MCQ practice</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{score}/{totalAnswered || "—"}</p>
                <p className="text-xs text-gray-500">Score so far</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">{totalAnswered}/{mockAptitudeQuestions.length}</p>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2">
              {mockAptitudeQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSelectedOption(null);
                    setFeedback(null);
                  }}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-emerald-500"
                      : answered[idx]
                      ? "bg-emerald-700/60"
                      : "bg-gray-800"
                  }`}
                  title={`Question ${idx + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600 text-right">
              Question {currentIndex + 1} of {mockAptitudeQuestions.length}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Panel */}
            <div className="space-y-4">
              <QuestionCard
                id={currentQuestion.id}
                question={currentQuestion.question}
                difficulty={currentQuestion.difficulty}
                category={currentQuestion.category}
              />

              {/* Options */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Select your answer
                </p>
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!answered[currentIndex]) setSelectedOption(idx);
                      }}
                      disabled={answered[currentIndex]}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${getOptionStyle(idx)}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        feedback && idx === feedback.correctIndex
                          ? "bg-emerald-500 text-white"
                          : feedback && idx === feedback.selectedIndex && !feedback.isCorrect
                          ? "bg-red-500 text-white"
                          : selectedOption === idx
                          ? "bg-indigo-600 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}>
                        {feedback && idx === feedback.correctIndex ? "✓" :
                         feedback && idx === feedback.selectedIndex && !feedback.isCorrect ? "✗" :
                         optionLabels[idx]}
                      </span>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null || answered[currentIndex] || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Checking...
                      </>
                    ) : answered[currentIndex] ? (
                      "Answered"
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 text-sm rounded-xl transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === mockAptitudeQuestions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 text-sm rounded-xl transition-all"
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Explanation Panel */}
            <div className="space-y-4">
              {feedback ? (
                <div className="space-y-4">
                  {/* Result Banner */}
                  <div className={`rounded-2xl p-5 border ${
                    feedback.isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        feedback.isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}>
                        {feedback.isCorrect ? "🎉" : "💡"}
                      </div>
                      <div>
                        <p className={`font-bold text-lg ${feedback.isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                          {feedback.isCorrect ? "Correct!" : "Not Quite Right"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {feedback.isCorrect
                            ? "Great job! You selected the right answer."
                            : `The correct answer was option ${optionLabels[feedback.correctIndex]}.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Explanation</h3>
                      <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">AI Generated</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{feedback.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[280px]">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 8v4l2 2" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">AI Explanation</h3>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    Select an answer and submit to see the AI-generated explanation with full reasoning.
                  </p>
                </div>
              )}

              {/* Question Stats */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Stats</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{score}</p>
                    <p className="text-xs text-gray-500">Correct</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-red-400">{totalAnswered - score}</p>
                    <p className="text-xs text-gray-500">Wrong</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-gray-300">{mockAptitudeQuestions.length - totalAnswered}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
                {totalAnswered > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Accuracy</span>
                      <span className="text-emerald-400 font-medium">{Math.round((score / totalAnswered) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${(score / totalAnswered) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
