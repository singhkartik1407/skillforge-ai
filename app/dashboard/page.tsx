"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ScoreCard from "@/components/ScoreCard";
import ModuleCard from "@/components/ModuleCard";
import RadarChartPlaceholder from "@/components/RadarChartPlaceholder";
import ProgressBar from "@/components/ProgressBar";
import {
  mockUser,
  mockOverallStats,
  mockActivityFeed,
  mockAIRecommendation,
  mockRadarData,
  mockAIInsight,
} from "@/lib/mockData";
import type { ModuleType } from "@/types";
import Link from "next/link";
import { useSkillContext } from "@/context/SkillContext";

const moduleIconMap: Record<ModuleType, React.ReactNode> = {
  coding: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  aptitude: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  communication: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const moduleColorMap: Record<ModuleType, string> = {
  coding: "text-indigo-400 bg-indigo-500/10",
  aptitude: "text-emerald-400 bg-emerald-500/10",
  communication: "text-amber-400 bg-amber-500/10",
};

export default function DashboardPage() {
  const user = mockUser;
  const stats = mockOverallStats;
  const { codingScore, aptitudeScore, communicationScore } = useSkillContext();

  const overall = useMemo(() => {
    return (codingScore + aptitudeScore + communicationScore) / 3;
  }, [codingScore, aptitudeScore, communicationScore]);

  const hasScores = codingScore > 0 || aptitudeScore > 0 || communicationScore > 0;
  const lastSavedRef = useRef<string | null>(null);

  type ScoreRow = {
    id: string;
    user_id: string | null;
    coding_score: number | null;
    aptitude_score: number | null;
    communication_score: number | null;
    overall_score: number | null;
    created_at: string;
  };

  const [history, setHistory] = useState<ScoreRow[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  type Insight = {
    strongest: string;
    weakest: string;
    careerSuggestion: string;
    recommendations: string[];
  };

  const [insight, setInsight] = useState<Insight | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasScores || overall <= 0) return;

    const payload = {
      coding: codingScore,
      aptitude: aptitudeScore,
      communication: communicationScore,
      overall,
    };

    const payloadKey = JSON.stringify(payload);
    if (lastSavedRef.current === payloadKey) return;
    lastSavedRef.current = payloadKey;

    (async () => {
      try {
        await fetch("/api/save-scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // best-effort persistence for hackathon demo
      }
    })();
  }, [codingScore, aptitudeScore, communicationScore, overall, hasScores]);

  useEffect(() => {
    (async function fetchScores() {
      setIsHistoryLoading(true);
      try {
        const res = await fetch("/api/get-scores");
        const data = (await res.json()) as ScoreRow[] | { success: false };
        if (Array.isArray(data)) setHistory(data);
      } catch {
        // ignore for demo stability
      } finally {
        setIsHistoryLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hasScores || overall <= 0) {
      setInsight(null);
      setInsightError(null);
      return;
    }

    const controller = new AbortController();

    (async () => {
      setIsInsightLoading(true);
      setInsightError(null);
      try {
        const res = await fetch("/api/generate-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coding: codingScore,
            aptitude: aptitudeScore,
            communication: communicationScore,
          }),
          signal: controller.signal,
        });

        const data = (await res.json()) as Insight & { error?: string };

        if (!res.ok) {
          setInsightError(data.error ?? "Could not generate insight. Please try again.");
          setInsight(null);
          return;
        }

        setInsight(data);
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setInsightError("Network error — could not generate insight.");
        setInsight(null);
      } finally {
        setIsInsightLoading(false);
      }
    })();

    return () => controller.abort();
  }, [codingScore, aptitudeScore, communicationScore, hasScores, overall]);

  const strongestTag = insight?.strongest
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
    : "bg-white/5 border-white/10 text-gray-400";
  const weakestTag = insight?.weakest
    ? "bg-red-500/10 border-red-500/30 text-red-300"
    : "bg-white/5 border-white/10 text-gray-400";

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar stats={stats} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Welcome Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Good morning, {user.name.split(" ")[0]} 👋
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  You&apos;re on a{" "}
                  <span className="text-indigo-400 font-medium">{stats.streak}-day streak</span>. Keep it up!
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-xl font-bold text-white">{stats.problemsSolved}</p>
                  <p className="text-xs text-gray-500">Problems Solved</p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-xl font-bold text-white">{stats.hoursSpent}h</p>
                  <p className="text-xs text-gray-500">Hours Practiced</p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-xl font-bold text-indigo-400">{overall.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Overall Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight of the Day */}
          <div className="bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-transparent border border-indigo-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 8v4l2 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400 mb-0.5">AI Insight of the Day</p>
              <p className="text-sm text-gray-300 leading-relaxed">{mockAIInsight}</p>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <ScoreCard
              module="coding"
              score={codingScore}
              maxScore={10}
              trend="up"
              trendValue="+5%"
            />
            <ScoreCard
              module="aptitude"
              score={aptitudeScore}
              maxScore={10}
              trend="up"
              trendValue="+3%"
            />
            <ScoreCard
              module="communication"
              score={communicationScore}
              maxScore={100}
              trend="stable"
              trendValue="0%"
            />
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 hover:border-opacity-50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-700/50 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                  </svg>
                  Avg
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">{overall.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">Overall (average)</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Insight readiness</span>
                  <span className="text-violet-300">{hasScores ? "Ready" : "Complete a module"}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${hasScores ? 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charts + AI Recommendation Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Radar Chart */}
            <div className="lg:col-span-1 bg-gray-900 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Skill Radar</h3>
              <RadarChartPlaceholder data={mockRadarData} size={200} />
            </div>

            {/* AI Recommendation + Overall Score */}
            <div className="lg:col-span-2 space-y-4">
              {/* Overall Score */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Overall Progress</h3>
                  <span className="text-2xl font-bold text-white">{overall.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <ProgressBar value={(codingScore / 10) * 100} label="Coding" color="indigo" size="md" />
                  <ProgressBar value={(aptitudeScore / 10) * 100} label="Aptitude" color="emerald" size="md" />
                  <ProgressBar value={communicationScore} label="Communication" color="amber" size="md" />
                </div>
              </div>

              {/* AI Performance Insight */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 8v4l2 2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">AI Performance Insight</h3>
                  {isInsightLoading && (
                    <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
                      Generating...
                    </div>
                  )}
                </div>

                {!hasScores ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
                    Complete modules to generate performance insights.
                  </div>
                ) : insightError ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
                    {insightError}
                  </div>
                ) : insight ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${strongestTag}`}>
                        Strongest: <span className="font-semibold">{insight.strongest || "—"}</span>
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${weakestTag}`}>
                        Weakest: <span className="font-semibold">{insight.weakest || "—"}</span>
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Career suggestion
                      </p>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {insight.careerSuggestion || "—"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Recommendations
                      </p>
                      <ul className="space-y-1.5">
                        {(insight.recommendations ?? []).slice(0, 6).map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400/80 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                        {(!insight.recommendations || insight.recommendations.length === 0) && (
                          <li className="text-sm text-gray-500">—</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
                    Generating insight…
                  </div>
                )}
              </div>

              {/* AI Recommendation */}
              <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 8v4l2 2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">AI Recommendation</h3>
                  <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    High Priority
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {mockAIRecommendation.message}
                </p>
                <Link
                  href={`/modules/${mockAIRecommendation.focusArea}`}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Practice Communication Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Module Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Practice Modules</h2>
              <span className="text-xs text-gray-500">3 modules available</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModuleCard
                title="Coding Practice"
                description="Solve DSA problems with AI feedback on complexity and code quality."
                href="/modules/coding"
                color="indigo"
                badge="Easy → Hard"
                stats={[
                  { label: "Problems", value: "42" },
                  { label: "Your Score", value: `${codingScore}` },
                ]}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                }
              />
              <ModuleCard
                title="Aptitude Training"
                description="Master quant, logical reasoning, and verbal with adaptive MCQs."
                href="/modules/aptitude"
                color="emerald"
                badge="Adaptive AI"
                stats={[
                  { label: "Questions", value: "15" },
                  { label: "Your Score", value: `${aptitudeScore}` },
                ]}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
              />
              <ModuleCard
                title="Communication"
                description="Improve writing clarity, grammar, and professional tone with AI scoring."
                href="/modules/communication"
                color="amber"
                badge="AI Graded"
                stats={[
                  { label: "Prompts", value: "8" },
                  { label: "Your Score", value: `${communicationScore}` },
                ]}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {mockActivityFeed.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${moduleColorMap[activity.module]}`}>
                    {moduleIconMap[activity.module]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.timestamp}</p>
                  </div>
                  {activity.score !== undefined && (
                    <span className={`text-sm font-semibold flex-shrink-0 ${activity.score >= 85 ? "text-emerald-400" : activity.score >= 70 ? "text-amber-400" : "text-red-400"}`}>
                      {activity.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Score History */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Score History</h2>
              <div className="text-xs text-gray-500">
                {isHistoryLoading ? "Loading…" : `${history.length} records`}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-sm text-gray-500">
                {isHistoryLoading ? "Fetching history…" : "No history yet. Complete a module to save scores."}
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 8).map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    <div className="text-xs text-gray-500">
                      {new Date(row.created_at).toLocaleString()}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Coding: <span className="font-semibold">{row.coding_score ?? "—"}</span>
                      </span>
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Aptitude: <span className="font-semibold">{row.aptitude_score ?? "—"}</span>
                      </span>
                      <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Comm: <span className="font-semibold">{row.communication_score ?? "—"}</span>
                      </span>
                      <span className="px-2 py-1 rounded-full bg-violet-500/10 text-violet-200 border border-violet-500/20">
                        Overall: <span className="font-semibold">{row.overall_score?.toFixed?.(2) ?? "—"}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
