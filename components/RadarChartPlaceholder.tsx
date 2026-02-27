"use client";

import { useEffect, useMemo, useState } from "react";
import type { RadarDataPoint } from "@/types";

interface RadarChartPlaceholderProps {
  data: RadarDataPoint[];
  size?: number;
}

export default function RadarChartPlaceholder({ data, size = 220 }: RadarChartPlaceholderProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.72;
  const levels = 4;
  const [animateIn, setAnimateIn] = useState(false);

  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index: number, value: number, maxValue: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius + 24;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = useMemo(() => data.map((d, i) => getPoint(i, d.score, d.fullMark)), [data, angleStep, center, radius]);
  const polygonPoints = useMemo(() => dataPoints.map((p) => `${p.x},${p.y}`).join(" "), [dataPoints]);

  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const fraction = (level + 1) / levels;
    const pts = data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = fraction * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return pts.join(" ");
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        <g
          style={{
            transformOrigin: `${center}px ${center}px`,
            transform: animateIn ? "scale(1)" : "scale(0.92)",
            opacity: animateIn ? 1 : 0,
            transition: "transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 900ms ease",
          }}
        >
          <polygon
            points={polygonPoints}
            fill="rgba(99,102,241,0.18)"
            stroke="rgba(99,102,241,0.85)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points={polygonPoints}
            fill="none"
            stroke="rgba(168,85,247,0.28)"
            strokeWidth="6"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {dataPoints.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#6366f1" stroke="rgba(99,102,241,0.45)" strokeWidth="2" />
          ))}
        </g>

        {data.map((d, i) => {
          const labelPt = getLabelPoint(i);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="rgba(156,163,175,1)"
              fontFamily="system-ui, sans-serif"
            >
              {d.subject}
            </text>
          );
        })}
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full px-4">
        {data.map((d) => (
          <div key={d.subject} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="text-xs text-gray-400">{d.subject}</span>
            <span className="text-xs font-semibold text-white ml-auto">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
