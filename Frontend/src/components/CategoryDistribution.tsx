import React, { useState } from "react";

interface CategoryDataPoint {
  category: string;
  amount: number;
}

interface CategoryDistributionProps {
  data: CategoryDataPoint[];
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const validData = data && data.length > 0 ? data : [];
  const totalAmount = validData.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const colors = ["#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899"];

  const size = 200;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative group">
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Category Distribution
        </h2>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Breakdown of outbound allocations across asset frameworks
        </p>
      </div>

      {activeIndex !== null && validData[activeIndex] && (
        <div
          className="absolute z-30 bg-zinc-950 border border-white/10 p-2.5 rounded-xl shadow-2xl pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 65}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center gap-2 text-xs text-white font-medium">
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: colors[activeIndex % colors.length] }}
            />
            <span className="text-zinc-400">{validData[activeIndex].category}:</span>
            <span className="font-mono font-bold text-white">
              {formatCurrency(validData[activeIndex].amount)}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ({((validData[activeIndex].amount / totalAmount) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 min-h-[220px]">
        
        <div className="relative w-[200px] h-[200px] shrink-0 flex items-center justify-center">
          {totalAmount === 0 ? (
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth={strokeWidth}
              />
            </svg>
          ) : (
            <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
              {validData.map((item, idx) => {
                const percentage = item.amount / totalAmount;
                
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const strokeDashoffsetValue = -accumulatedPercentage * circumference;
                
                accumulatedPercentage += percentage;

                const isSelected = activeIndex === idx;
                const color = colors[idx % colors.length];

                return (
                  <circle
                    key={item.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffsetValue}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                      setActiveIndex(idx);
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                );
              })}
            </svg>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Volume</span>
            <span className="text-lg font-bold font-mono tracking-tight text-white mt-0.5">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {validData.map((item, idx) => {
            const color = colors[idx % colors.length];
            const isSelected = activeIndex === idx;
            const pct = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : "0.0";

            return (
              <div
                key={item.category}
                className="flex items-center justify-between p-2 rounded-xl border border-transparent transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? "rgba(255, 255, 255, 0.02)" : "transparent",
                  borderColor: isSelected ? "rgba(255, 255, 255, 0.05)" : "transparent",
                }}
                onMouseEnter={() => {
                  setTooltipPos({ x: 100, y: 100 });
                  setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: color,
                      transform: isSelected ? "scale(1.2)" : "scale(1)",
                      boxShadow: isSelected ? `0 0 12px ${color}` : "none",
                    }}
                  />
                  <span className={`text-xs font-medium truncate transition-colors ${isSelected ? "text-white" : "text-zinc-400"}`}>
                    {item.category}
                  </span>
                </div>
                <div className="text-right pl-2 font-mono shrink-0">
                  <span className="text-xs font-bold text-zinc-200 block">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[9px] font-medium text-zinc-500 block">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default CategoryDistribution;