import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

interface TrendItem {
  month: string;
  spent: number;
}

interface MonthlyTrendChartProps {
  data: TrendItem[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    spent: number;
    x: number;
    y: number;
  } | null>(null);

  const validData = data && data.length > 0 ? data : [];

  const maxSpent = Math.max(...validData.map((d) => d.spent), 1000);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  // SVG dimensions for mapping line path coordinates
  const width = 600;
  const height = 240;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Build point coordinates map
  const points = validData.map((d, i) => {
    const x = paddingLeft + (i / (validData.length - 1 || 1)) * chartWidth;
    const y = height - paddingBottom - (d.spent / maxSpent) * chartHeight;
    return { x, y, ...d };
  });

  // Construct the SVG path string (Linear or smooth polyline string generation)
  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  // Construct the filled background gradient area under the trend line
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
      : "";

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Monthly Spending Trend
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Analysis of monthly expense flow
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="relative w-full overflow-visible">
        {/* White-Text Tooltip Card Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-30 bg-zinc-950 border border-white/10 p-2.5 rounded-xl shadow-2xl pointer-events-none transition-all duration-150 ease-out"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${hoveredPoint.y - 50}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="text-zinc-400 font-semibold">{hoveredPoint.month}:</span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(hoveredPoint.spent)}
              </span>
            </div>
          </div>
        )}

        {/* Master Chart Vector Viewbox Layer */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible z-10 relative"
        >
          <defs>
            <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Background Reference Axis Grid Rails */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={width - paddingRight}
            y2={paddingTop}
            stroke="rgba(255, 255, 255, 0.02)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {points.length > 0 && (
            <>
              {/* Shaded Area Under Line */}
              <path d={areaD} fill="url(#trendAreaGradient)" />

              {/* Core Sharp Trend Line Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Vector Pointer Nodes */}
              {points.map((p) => {
                const isHovered = hoveredPoint?.month === p.month;
                return (
                  <g key={p.month} className="cursor-pointer">
                    {/* Multi-layered vector hitboxes to facilitate hover captures on smartphones */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={14}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint({ month: p.month, spent: p.spent, x: p.x, y: p.y })}
                      onMouseMove={() => setHoveredPoint({ month: p.month, spent: p.spent, x: p.x, y: p.y })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? "#10b981" : "#09090b"}
                      stroke="#10b981"
                      strokeWidth={isHovered ? 2.5 : 2}
                      className="transition-all duration-150 pointer-events-none"
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* X-Axis Horizontal Label Nodes Grid Container */}
        <div className="flex justify-between items-center px-1 mt-2">
          {validData.map((d) => (
            <span
              key={d.month}
              className={`text-[10px] font-medium tracking-tight transition-colors duration-150 ${
                hoveredPoint?.month === d.month ? "text-emerald-400 font-bold" : "text-zinc-500"
              }`}
            >
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;