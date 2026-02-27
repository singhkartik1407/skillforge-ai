"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OverallStats } from "@/types";
import { useScores } from "@/context/ScoreContext";

interface SidebarProps {
  stats?: OverallStats;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
];

const moduleItems = [
  {
    label: "Coding Practice",
    href: "/modules/coding",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    badge: "42",
  },
  {
    label: "Aptitude Training",
    href: "/modules/aptitude",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    badge: "15",
  },
  {
    label: "Communication",
    href: "/modules/communication",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    badge: "8",
  },
];

export default function Sidebar({ stats }: SidebarProps) {
  const pathname = usePathname();
  const { scores } = useScores();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 h-full border-r border-white/10 bg-gray-950 flex flex-col">
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                isActive(item.href)
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive(item.href) ? "text-indigo-400" : "text-gray-500"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mb-2">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Modules
          </p>
          {moduleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 group ${
                isActive(item.href)
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive(item.href) ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-white/10 text-gray-500 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="px-3 mb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Your Progress
          </p>
          <div className="px-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Coding</span>
                  <span className="text-indigo-400 font-medium">{Math.round(scores.coding)}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                    style={{ width: `${scores.coding}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Aptitude</span>
                  <span className="text-emerald-400 font-medium">{Math.round(scores.aptitude)}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                    style={{ width: `${scores.aptitude}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Communication</span>
                  <span className="text-amber-400 font-medium">{Math.round(scores.communication)}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 ease-out"
                    style={{ width: `${scores.communication}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-300 mb-1">AI Powered</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your AI coach is analyzing your performance patterns.
          </p>
        </div>
      </div>
    </aside>
  );
}
