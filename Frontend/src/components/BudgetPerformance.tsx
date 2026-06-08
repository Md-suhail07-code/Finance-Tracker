import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface PerformanceItem {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  performance: number;
}

interface BudgetPerformanceProps {
  data: PerformanceItem[];
}

const BudgetPerformance: React.FC<BudgetPerformanceProps> = ({ data }) => {
  const validData = data && data.length > 0 ? data : [];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Budget Performance
        </h2>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Live spending threshold analysis across configured envelopes
        </p>
      </div>

      <div className="space-y-4">
        {validData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-xl bg-black/20 h-40">
            <p className="text-xs font-medium text-zinc-500">
              No budget tracking performance logs registered.
            </p>
          </div>
        ) : (
          validData.map((item) => {
            const percentage = Number(item.performance);
            const isOverBudget = item.spent >= item.budget;
            const isNearingBudget = !isOverBudget && percentage >= 85;

            let statusColor = "text-emerald-400";
            let progressBg = "bg-gradient-to-r from-emerald-600 to-emerald-400";
            let borderHighlight = "border-white/5";
            let StatusIcon = CheckCircle2;

            if (isNearingBudget) {
              statusColor = "text-amber-400";
              progressBg = "bg-gradient-to-r from-amber-500 to-orange-400";
              borderHighlight = "border-amber-500/20";
              StatusIcon = AlertTriangle;
            } else if (isOverBudget) {
              statusColor = "text-rose-500";
              progressBg = "bg-gradient-to-r from-rose-600 to-red-500";
              borderHighlight = "border-rose-500/30";
              StatusIcon = AlertTriangle;
            }

            return (
              <div
                key={item.category}
                className={`p-4 rounded-xl bg-black/30 border ${borderHighlight} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-all duration-200`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${statusColor}`} />
                    <h3 className="text-xs font-bold text-white tracking-wide truncate">
                      {item.category}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 justify-between sm:justify-end w-full sm:w-auto border-t border-white/[0.02] sm:border-t-0 pt-2 sm:pt-0">
                    <div>
                      <span className="text-zinc-500 text-[10px] block sm:inline mr-1">Spent:</span>
                      <span className="text-zinc-200 font-semibold">{formatCurrency(item.spent)}</span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/10 hidden sm:block"></div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block sm:inline mr-1">Limit:</span>
                      <span className="text-zinc-200 font-semibold">{formatCurrency(item.budget)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-black/60 p-[1px] border border-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressBg} transition-all duration-500 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                    <span className="text-zinc-500">
                      Remaining: {formatCurrency(item.remaining)}
                    </span>
                    <span className={statusColor}>
                      {item.performance}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetPerformance;