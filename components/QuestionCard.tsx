import type { Difficulty } from "@/types";

interface QuestionCardProps {
  id: string;
  title?: string;
  question?: string;
  difficulty?: Difficulty;
  tags?: string[];
  description?: string;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
  category?: string;
}

const difficultyConfig = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function QuestionCard({
  title,
  question,
  difficulty,
  tags,
  description,
  constraints,
  examples,
  category,
}: QuestionCardProps) {
  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {category && (
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {category}
            </span>
          )}
          <h2 className="text-xl font-semibold text-white mt-1">
            {title ?? question}
          </h2>
        </div>
        {difficulty && (
          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${difficultyConfig[difficulty]} capitalize`}>
            {difficulty}
          </span>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      )}

      {description && (
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{description}</p>
      )}

      {examples && examples.length > 0 && (
        <div className="space-y-3 mb-4">
          {examples.map((example, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
              <p className="text-xs font-semibold text-gray-500 mb-2">Example {index + 1}</p>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500 w-14 flex-shrink-0">Input:</span>
                  <code className="text-xs text-emerald-400 font-mono">{example.input}</code>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500 w-14 flex-shrink-0">Output:</span>
                  <code className="text-xs text-indigo-400 font-mono">{example.output}</code>
                </div>
                {example.explanation && (
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500 w-14 flex-shrink-0">Note:</span>
                    <span className="text-xs text-gray-400">{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {constraints && constraints.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-white/5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Constraints</p>
          <ul className="space-y-1">
            {constraints.map((c, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <code className="font-mono">{c}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
