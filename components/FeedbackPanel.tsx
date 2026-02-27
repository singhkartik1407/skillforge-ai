interface FeedbackItem {
  label: string;
  value: string | number;
  type?: "score" | "text" | "list";
}

interface FeedbackPanelProps {
  title?: string;
  items: FeedbackItem[];
  suggestions?: string[];
  improvements?: string[];
  strengths?: string[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

function ScoreCircle({ value }: { value: number }) {
  const color =
    value >= 80 ? "text-emerald-400" : value >= 60 ? "text-amber-400" : "text-red-400";
  const ring =
    value >= 80 ? "border-emerald-500/50" : value >= 60 ? "border-amber-500/50" : "border-red-500/50";

  return (
    <div className={`w-12 h-12 rounded-full border-2 ${ring} flex items-center justify-center`}>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

export default function FeedbackPanel({
  title = "AI Feedback",
  items,
  suggestions,
  improvements,
  strengths,
  isLoading = false,
  isEmpty = false,
}: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400">AI is analyzing your submission...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-800 rounded-full animate-pulse" style={{ width: `${70 + i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">Submit your answer to receive AI-powered feedback.</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-lg font-semibold text-gray-600">--</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 8v4l2 2" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
          AI Generated
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {items.map((item) => (
          <div key={item.label} className="bg-gray-800/50 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-gray-500 mb-1.5">{item.label}</p>
            {typeof item.value === "number" ? (
              <ScoreCircle value={item.value} />
            ) : (
              <p className="text-sm font-semibold text-white">{item.value}</p>
            )}
          </div>
        ))}
      </div>

      {strengths && strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Strengths
          </p>
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            Suggestions
          </p>
          <ul className="space-y-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <svg className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {improvements && improvements.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            Improvements
          </p>
          <ul className="space-y-1.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <svg className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
