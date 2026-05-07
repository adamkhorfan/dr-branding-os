"use client";

import type { ContentVelocityPoint } from "@/types/analytics";

interface MiniBarChartProps {
  data: ContentVelocityPoint[];
  color?: string;
  height?: number;
}

export function MiniBarChart({ data, color = "#c9a96e", height = 80 }: MiniBarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {data.map((point, i) => {
          const barH = (point.count / max) * (height - 20);
          const x = i * barWidth + barWidth * 0.15;
          const w = barWidth * 0.7;
          const y = height - 20 - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                fill={color}
                opacity={0.85}
                rx={1}
              />
              <text
                x={x + w / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize={6}
                fill="rgba(255,255,255,0.4)"
              >
                {point.label}
              </text>
              {point.count > 0 && (
                <text
                  x={x + w / 2}
                  y={y - 2}
                  textAnchor="middle"
                  fontSize={6}
                  fill={color}
                >
                  {point.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
