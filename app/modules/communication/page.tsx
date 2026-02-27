"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FeedbackPanel from "@/components/FeedbackPanel";
import { mockCommunicationPrompts, mockUser, mockOverallStats } from "@/lib/mockData";
import type { CommunicationFeedback } from "@/types";
import { useScores } from "@/context/ScoreContext";

interface HFCommResult {
  grammar: number;
  clarity: number;
  confidence: number;
  vocabulary: number;
  overall: number;
  suggestions: string[];
  error?: string;
}

/** Map the Hugging Face response shape to the app's CommunicationFeedback type. */
function mapToFeedback(data: HFCommResult, wordCount: number): CommunicationFeedback {
  return {
    grammarScore: data.grammar,
    clarityScore: data.clarity,
    confidenceScore: data.confidence,
    overallScore: data.overall,
    wordCount,
    suggestions: data.suggestions,
    strengths: [
      data.grammar >= 80 ? "Strong grammar and punctuation usage." : null,
      data.clarity >= 80 ? "Clear and well-structured response." : null,
      data.confidence >= 80 ? "Confident and professional tone." : null,
      data.vocabulary >= 80 ? "Excellent vocabulary and word choice." : null,
    ].filter(Boolean) as string[],
  };
}

export default function CommunicationPage() {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<CommunicationFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateScore } = useScores();

  const currentPrompt = mockCommunicationPrompts[selectedPromptIndex];
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
  const isUnderMin = wordCount < currentPrompt.minWords;
  const isOverMax = wordCount > currentPrompt.maxWords;
  const wordCountColor = isOverMax
    ? "text-red-400"
    : isUnderMin && wordCount > 0
    ? "text-amber-400"
    : wordCount > 0
    ? "text-emerald-400"
    : "text-gray-600";

  // Calls /api/evaluate-communication — backed by Hugging Face Mistral-7B.
  // To swap models or tune the prompt, edit app/api/evaluate-communication/route.ts only.
  const handleEvaluate = async () => {
    if (!answer.trim() || wordCount < 10) return;

    setIsLoading(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await fetch("/api/evaluate-communication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: answer }),
      });

      const data: HFCommResult = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Evaluation failed. Please try again.");
        return;
      }

      updateScore("communication", data.overall);
      setFeedback(mapToFeedback(data, wordCount));
    } catch {
      setError("Network error — could not reach the AI service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (index: number) => {
    setSelectedPromptIndex(index);
    setAnswer("");
    setFeedback(null);
    setError(null);
  };

  const categoryColors: Record<string, string> = {
    "Professional Writing": "bg-indigo-500/20 text-indigo-400",
    "Interview Preparation": "bg-emerald-500/20 text-emerald-400",
    "Behavioral": "bg-amber-500/20 text-amber-400",
    "Business Communication": "bg-violet-500/20 text-violet-400",
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
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Communication Evaluation</h1>
                <p className="text-xs text-gray-500">Powered by Mistral-7B via Hugging Face</p>
              </div>
            </div>

            {feedback && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{feedback.overallScore}</p>
                  <p className="text-xs text-gray-500">Overall Score</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {mockCommunicationPrompts.map((prompt, idx) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptChange(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                  selectedPromptIndex === idx
                    ? "bg-amber-600/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <span>{prompt.title}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[prompt.category] ?? "bg-gray-700 text-gray-400"}`}>
                  {prompt.category.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Prompt + Answer */}
            <div className="space-y-4">
              {/* Prompt Card */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[currentPrompt.category] ?? "bg-gray-700 text-gray-400"}`}>
                      {currentPrompt.category}
                    </span>
                    <h2 className="text-lg font-semibold text-white mt-2">{currentPrompt.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-amber-500/40 pl-3">
                  {currentPrompt.prompt}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                  <span>Min: {currentPrompt.minWords} words</span>
                  <span>Max: {currentPrompt.maxWords} words</span>
                </div>
              </div>

              {/* Answer Textarea */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-gray-900/50">
                  <span className="text-xs text-gray-500">Your Response</span>
                  <span className={`text-xs font-medium ${wordCountColor}`}>
                    {wordCount} / {currentPrompt.maxWords} words
                    {isUnderMin && wordCount > 0 && ` (${currentPrompt.minWords - wordCount} more needed)`}
                    {isOverMax && " (too long)"}
                  </span>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (feedback) setFeedback(null);
                    if (error) setError(null);
                  }}
                  placeholder="Write your response here. Focus on clarity, structure, and professionalism..."
                  className="w-full bg-transparent text-gray-200 px-5 py-4 resize-none outline-none placeholder:text-gray-700 text-sm leading-relaxed min-h-[220px]"
                />

                {/* Word count progress bar */}
                <div className="px-4 pb-3">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverMax ? "bg-red-500" : isUnderMin ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((wordCount / currentPrompt.maxWords) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Writing Tips</p>
                <ul className="space-y-1.5">
                  {[
                    "Use clear topic sentences for each paragraph.",
                    "Avoid filler words like 'very', 'really', 'basically'.",
                    "End with a clear call to action or conclusion.",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-amber-500/60 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

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

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAnswer("");
                    setFeedback(null);
                    setError(null);
                  }}
                  className="px-4 py-2.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleEvaluate}
                  disabled={isLoading || wordCount < 10}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      AI is evaluating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10" />
                        <path d="M12 8v4l2 2" />
                      </svg>
                      Evaluate Response
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Feedback */}
            <div className="space-y-4">
              {/* Score breakdown */}
              {feedback && (
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Score Breakdown</h3>
                    <span className="ml-auto text-2xl font-bold text-white">
                      {feedback.overallScore}
                      <span className="text-sm text-gray-500 font-normal">/100</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Grammar & Spelling", value: feedback.grammarScore, color: "indigo" as const },
                      { label: "Clarity & Structure", value: feedback.clarityScore, color: "emerald" as const },
                      { label: "Confidence & Tone", value: feedback.confidenceScore, color: "amber" as const },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className={`font-medium ${item.value >= 80 ? "text-emerald-400" : item.value >= 65 ? "text-amber-400" : "text-red-400"}`}>
                            {item.value}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              item.color === "indigo"
                                ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                                : item.color === "emerald"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : "bg-gradient-to-r from-amber-500 to-orange-500"
                            }`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    <span>Word count</span>
                    <span className="text-gray-300 font-medium">{feedback.wordCount} words</span>
                  </div>
                </div>
              )}

              <FeedbackPanel
                title="AI Writing Feedback"
                isLoading={isLoading}
                isEmpty={!feedback && !isLoading && !error}
                items={[
                  { label: "Grammar Score", value: feedback?.grammarScore ?? "--" },
                  { label: "Clarity Score", value: feedback?.clarityScore ?? "--" },
                  { label: "Confidence Score", value: feedback?.confidenceScore ?? "--" },
                  { label: "Overall Score", value: feedback?.overallScore ?? "--" },
                ]}
                suggestions={feedback?.suggestions}
                strengths={feedback?.strengths}
              />

              {/* Empty state */}
              {!feedback && !isLoading && !error && (
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">AI Evaluation</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    Write at least 10 words and click &ldquo;Evaluate Response&rdquo; to receive a detailed AI analysis of your communication.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
