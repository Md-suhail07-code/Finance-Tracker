import React, { useState } from "react";

interface MonthlyDataPoint {
  income: number;
  expense: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyDataPoint[];
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ data }) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    month: string;
    income: number;
    expense: number;
    x: number;
    y: number;
  } | null>(null);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formattedData = monthNames.map((month, index) => {
    const apiPoint = data?.[index] ?? { income: 0, expense: 0 };
    return {
      month,
      Income: apiPoint.income,
      Expense: apiPoint.expense,
    };
  });

  const maxVal = Math.max(
    ...formattedData.map((d) => Math.max(d.Income, d.Expense)),
    1000 // Prevent division by zero if empty
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative">
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Monthly Overview
        </h2>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Comparison matrix of income versus expense flow
        </p>
      </div>

      <div className="relative w-full pt-4">
        {/* Absolute Floating Tooltip Card Container */}
        {activeTooltip && (
          <div
            className="absolute z-30 bg-zinc-950 border border-white/10 p-3 rounded-xl shadow-2xl pointer-events-none transition-all duration-100 ease-out animate-fadeIn"
            style={{
              left: `${activeTooltip.x}px`,
              top: `${activeTooltip.y - 85}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-white font-semibold text-xs mb-1.5 border-b border-white/5 pb-1">
              {activeTooltip.month} Overview
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-4 text-xs justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Income:
                </span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(activeTooltip.income)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Expense:
                </span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(activeTooltip.expense)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart Main Layout Wrapper Grid Column Stack */}
        <div className="flex h-64 sm:h-80 w-full items-end gap-2 sm:gap-4 pb-6 border-b border-white/5 relative z-10">
          
          {/* Horizontal Background Grid Reference Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none z-0">
            <div className="w-full border-t border-white/[0.03]" />
            <div className="w-full border-t border-white/[0.03]" />
            <div className="w-full border-t border-white/[0.03]" />
            <div className="w-full border-t border-white/[0.03]" />
          </div>

          {/* Dynamic Graph Pillars Data Mapping Element Loop */}
          {formattedData.map((d, index) => {
            const incomeHeight = `${(d.Income / maxVal) * 100}%`;
            const expenseHeight = `${(d.Expense / maxVal) * 100}%`;

            return (
              <div
                key={d.month}
                className="flex-1 h-full flex items-end justify-center gap-[2px] sm:gap-1 relative group/pillar"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const containerRect = e.currentTarget.parentElement?.getBoundingClientRect();
                  if (containerRect) {
                    setActiveTooltip({
                      month: d.month,
                      income: d.Income,
                      expense: d.Expense,
                      x: rect.left - containerRect.left + rect.width / 2,
                      y: rect.top - containerRect.top,
                    });
                  }
                }}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Income Bar Pillar */}
                <div
                  style={{ height: incomeHeight }}
                  className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[3px] sm:rounded-t-md transition-all duration-500 relative group-hover/pillar:brightness-110 min-h-[2px]"
                />

                {/* Expense Bar Pillar */}
                <div
                  style={{ height: expenseHeight }}
                  className="w-1/2 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-[3px] sm:rounded-t-md transition-all duration-500 relative group-hover/pillar:brightness-110 min-h-[2px]"
                />

                {/* Bottom X-Axis Absolute Label Placements */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-medium text-zinc-500 group-hover/pillar:text-zinc-200 transition duration-150">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Global Component Bottom Horizontal Legend Markers */}
        <div className="flex items-center justify-center gap-6 mt-8 pt-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
            <span>Income Stream</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
            <span>Expense Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;