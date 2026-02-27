"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type SkillContextValue = {
  codingScore: number;
  aptitudeScore: number;
  communicationScore: number;
  setCodingScore: React.Dispatch<React.SetStateAction<number>>;
  setAptitudeScore: React.Dispatch<React.SetStateAction<number>>;
  setCommunicationScore: React.Dispatch<React.SetStateAction<number>>;
};

const SkillContext = createContext<SkillContextValue | null>(null);

export function SkillProvider({ children }: { children: React.ReactNode }) {
  const [codingScore, setCodingScore] = useState(0);
  const [aptitudeScore, setAptitudeScore] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);

  const value = useMemo<SkillContextValue>(
    () => ({
      codingScore,
      aptitudeScore,
      communicationScore,
      setCodingScore,
      setAptitudeScore,
      setCommunicationScore,
    }),
    [codingScore, aptitudeScore, communicationScore]
  );

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
}

export function useSkillContext() {
  const ctx = useContext(SkillContext);
  if (!ctx) {
    throw new Error("useSkillContext must be used within SkillProvider");
  }
  return ctx;
}

