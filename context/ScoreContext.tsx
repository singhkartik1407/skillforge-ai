"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ScoreType = {
  coding: number;
  aptitude: number;
  communication: number;
};

type ScoreContextType = {
  scores: ScoreType;
  overall: number;
  updateScore: (type: keyof ScoreType, value: number) => void;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<ScoreType>({
    coding: 0,
    aptitude: 0,
    communication: 0,
  });

  const overall = (scores.coding + scores.aptitude + scores.communication) / 3;

  // Load from database on mount
  useEffect(() => {
    async function loadScores() {
      try {
        const res = await fetch("/api/get-scores");
        const data = (await res.json()) as any;

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          setScores({
            coding: Number(latest?.coding_score ?? 0) || 0,
            aptitude: Number(latest?.aptitude_score ?? 0) || 0,
            communication: Number(latest?.communication_score ?? 0) || 0,
          });
        }
      } catch {
        // best-effort restore for hackathon demo
      }
    }

    loadScores();
  }, []);

  const updateScore = async (type: keyof ScoreType, value: number) => {
    setScores((prev) => {
      const updatedScores = {
        ...prev,
        [type]: Math.max(0, Math.min(100, value)),
      };

      // Save to database (fire-and-forget)
      void fetch("/api/save-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coding: updatedScores.coding,
          aptitude: updatedScores.aptitude,
          communication: updatedScores.communication,
          overall:
            (updatedScores.coding +
              updatedScores.aptitude +
              updatedScores.communication) /
            3,
        }),
      }).catch(() => {});

      return updatedScores;
    });
  };

  return (
    <ScoreContext.Provider value={{ scores, overall, updateScore }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScores() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScores must be used inside ScoreProvider");
  }
  return context;
}

