import Link from "next/link";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  stats?: { label: string; value: string }[];
  color: "indigo" | "emerald" | "amber";
  badge?: string;
}

const colorConfig = {
  indigo: {
    bg: "from-indigo-500/10 to-violet-500/5",
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/15",
    iconText: "text-indigo-400",
    button: "bg-indigo-600 hover:bg-indigo-500",
    badge: "bg-indigo-500/20 text-indigo-400",
  },
  emerald: {
    bg: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  amber: {
    bg: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    button: "bg-amber-600 hover:bg-amber-500",
    badge: "bg-amber-500/20 text-amber-400",
  },
};

export default function ModuleCard({
  title,
  description,
  href,
  icon,
  stats,
  color,
  badge,
}: ModuleCardProps) {
  const cfg = colorConfig[color];

  return (
    <div
      className={`relative bg-gradient-to-br ${cfg.bg} border ${cfg.border} rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30`}
    >
      {badge && (
        <span className={`absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {badge}
        </span>
      )}

      <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} ${cfg.iconText} flex items-center justify-center mb-4`}>
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-5">{description}</p>

      {stats && (
        <div className="flex gap-4 mb-5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href={href}
        className={`inline-flex items-center gap-2 ${cfg.button} text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 group-hover:gap-3`}
      >
        Start Practice
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
