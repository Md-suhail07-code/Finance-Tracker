import React from "react";
import { ArrowUpRight, ArrowDownLeft, Percent, PiggyBank, Activity } from "lucide-react";

interface HealthData {
  score: number;
  status: string;
  savingsRate: number;
  budgetUsage: number;
  income: number;
  expense: number;
}

interface FinancialHealthProps {
  data: HealthData;
}

const FinancialHealth: React.FC<FinancialHealthProps> = ({ data }) => {
  const health = data || {
    score: 0,
    status: "Unknown",
    savingsRate: 0,
    budgetUsage: 0,
    income: 0,
    expense: 0
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(health.score, 100) / 100) * circumference;

  const getScoreConfiguration = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-500", stroke: "#22c55e" };
    if (score >= 80) return { grade: "A", color: "text-green-400", stroke: "#4ade80" };
    if (score >= 70) return { grade: "B", color: "text-emerald-400", stroke: "#34d399" };
    if (score >= 60) return { grade: "C", color: "text-amber-400", stroke: "#fbbf24" };
    if (score >= 40) return { grade: "D", color: "text-orange-500", stroke: "#f97316" };
    return { grade: "F", color: "text-rose-500", stroke: "#f43f5e" };
  };

  const config = getScoreConfiguration(health.score);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Financial Health
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Automated metric parameter synthesis index
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Activity className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 items-center">
        
        <div className="md:col-span-5 flex flex-col items-center justify-center relative pt-4">
          <div className="relative w-44 h-24 flex items-center justify-center overflow-visible">
            <svg width="180" height="100" className="overflow-visible">
              <path
                d="M 10 90 A 80 80 0 0 1 170 90"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              
              <path
                d="M 10 90 A 80 80 0 0 1 170 90"
                fill="none"
                stroke={config.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-mono tracking-tighter text-white">
                {health.score}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest ${config.color} mt-0.5`}>
                {health.status} ({config.grade})
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 gap-3 w-full">
          
          <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Income Flow</span>
              <span className="text-xs font-bold font-mono text-zinc-200 truncate block mt-0.5">
                {formatCurrency(health.income)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Outflow Total</span>
              <span className="text-xs font-bold font-mono text-zinc-200 truncate block mt-0.5">
                {formatCurrency(health.expense)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Savings Velocity</span>
              <span className="text-xs font-bold font-mono text-emerald-400 block mt-0.5">
                {health.savingsRate.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Budget Burn</span>
              <span className="text-xs font-bold font-mono text-zinc-200 block mt-0.5">
                {health.budgetUsage.toFixed(1)}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;