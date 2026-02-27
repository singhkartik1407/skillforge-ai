import type { ModuleType } from "@/types";

interface ScoreCardProps {
  module: ModuleType;
  score: number;
  maxScore?: number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  label?: string;
  icon?: React.ReactNode;
}

const moduleConfig = {
  coding: {
    label: "Coding Score",
    color: "from-indigo-500 to-violet-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    textColor: "text-indigo-400",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  aptitude: {
    label: "Aptitude Score",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-400",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  communication: {
    label: "Communication Score",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-400",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
};

export default function ScoreCard({
  module,
  score,
  maxScore = 100,
  trend = "stable",
  trendValue = "+0%",
  label,
}: ScoreCardProps) {
  const config = moduleConfig[module];
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className={`bg-gray-900 border ${config.borderColor} rounded-2xl p-5 hover:border-opacity-50 transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.textColor}`}>
          {config.icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          trend === "up"
            ? "bg-emerald-500/10 text-emerald-400"
            : trend === "down"
            ? "bg-red-500/10 text-red-400"
            : "bg-gray-700/50 text-gray-400"
        }`}>
          {trend === "up" ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6" />
            </svg>
          ) : trend === "down" ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
            </svg>
          )}
          {trendValue}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-gray-500 text-sm mb-1">/ {maxScore}</span>
        </div>
        <p className="text-sm text-gray-400 mt-0.5">{label ?? config.label}</p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span className={config.textColor}>{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
