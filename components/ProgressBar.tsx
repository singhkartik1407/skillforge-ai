interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "indigo" | "emerald" | "amber" | "violet" | "rose";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const colorMap = {
  indigo: "from-indigo-500 to-violet-500",
  emerald: "from-emerald-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  violet: "from-violet-500 to-purple-600",
  rose: "from-rose-500 to-pink-600",
};

const textColorMap = {
  indigo: "text-indigo-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
};

const heightMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = "indigo",
  size = "md",
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <span className={`text-sm font-medium ${textColorMap[color]}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${heightMap[size]} bg-gradient-to-r ${colorMap[color]} rounded-full ${animated ? "transition-all duration-1000 ease-out" : ""}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
