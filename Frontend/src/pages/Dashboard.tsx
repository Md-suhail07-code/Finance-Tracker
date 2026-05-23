import React from "react";
import { 
  Wallet, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const Dashboard: React.FC = () => {
  // Mock Data metrics matching the premium dark ecosystem
  const financialSummary = {
    totalBudget: 4250.00,
    currentSpent: 1840.20,
    savings: 2409.80,
    savingsRate: 56.7,
    monthlyInflow: 6200.00,
    monthlyOutflow: 1840.20
  };

  const budgets: BudgetCategory[] = [
    { name: "Housing & Rent", allocated: 1500, spent: 1500, color: "from-emerald-500 to-teal-500" },
    { name: "Food & Dining", allocated: 600, spent: 412.50, color: "from-teal-400 to-cyan-500" },
    { name: "Entertainment", allocated: 400, spent: 320.00, color: "from-cyan-500 to-blue-600" },
    { name: "Utilities & Node Power", allocated: 350, spent: 180.20, color: "from-emerald-400 to-emerald-600" },
  ];

  const recentTransactions: Transaction[] = [
    { id: "tx-1", description: "Hedge Fund Inflow Dividend", category: "Salary", amount: 4800.00, type: "income", date: "May 20, 2026" },
    { id: "tx-2", description: "Silicon Quarter Penthouse", category: "Housing & Rent", amount: 1500.00, type: "expense", date: "May 18, 2026" },
    { id: "tx-3", description: "Quantum Power Grid Node Overhaul", category: "Utilities & Node Power", amount: 180.20, type: "expense", date: "May 15, 2026" },
    { id: "tx-4", description: "Spatial Computing Subscription", category: "Entertainment", amount: 120.00, type: "expense", date: "May 12, 2026" },
    { id: "tx-5", description: "Organic Core Nutrients Restock", category: "Food & Dining", amount: 95.30, type: "income", date: "May 10, 2026" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased pb-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Interactive Data Grid Layer */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Decorative Ambient Orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        
        {/* Upper Heading Contextual Bar */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ecosystem <span className="text-emerald-400 font-mono tracking-normal">Telemetry</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Real-time status analysis of your absolute asset parameters</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/80 border border-white/5 backdrop-blur-md rounded-xl text-xs font-medium text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Frame: May 2026</span>
          </div>
        </section>

        {/* 1. Core Financial Status Metrics Matrix Array */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Budget Card */}
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl group-hover:bg-emerald-500/[0.05] transition-all duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Operational Budget</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {formatCurrency(financialSummary.totalBudget)}
            </h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              Spent <span className="text-zinc-300 font-medium">{formatCurrency(financialSummary.currentSpent)}</span> of established ceiling
            </p>
          </div>

          {/* Liquid Savings Assets Card */}
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/[0.02] rounded-full blur-xl group-hover:bg-cyan-500/[0.05] transition-all duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Liquid Free Net Savings</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 mb-1">
              {formatCurrency(financialSummary.savings)}
            </h3>
            <p className="text-[11px] text-zinc-500">
              Preservation velocity index standing at <span className="text-cyan-400 font-semibold">{financialSummary.savingsRate}%</span>
            </p>
          </div>

          {/* Active Balance Inflow/Outflow Delta Card */}
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Delta Stream Margins</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2.5 pt-0.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Inbound Cashflow
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{formatCurrency(financialSummary.monthlyInflow)}</span>
              </div>
              <div className="h-[1px] bg-white/5 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <ArrowDownLeft className="w-3 h-3 text-rose-500" /> Outbound Allocation
                </span>
                <span className="text-xs font-mono font-bold text-zinc-300">{formatCurrency(financialSummary.monthlyOutflow)}</span>
              </div>
            </div>
          </div>

        </section>

        {/* 2. Main Dashboard Split Information Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT AREA: Threshold Progress Engine & Visual Chart Matrix Distribution (7 Modules) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">Active Budgetary Vectors</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Real-time category threshold tracking parameters</p>
                </div>
                <button className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
                  Adjust Configuration <PlusCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Engine Dynamic Bar Maps */}
              <div className="space-y-5">
                {budgets.map((budget) => {
                  const currentRatio = budget.spent / budget.allocated;
                  const percentage = Math.min(Math.round(currentRatio * 100), 100);
                  
                  // Heat Index Color Allocations matching standard engine alerts
                  let trackingStatusColor = "text-emerald-400";
                  if (currentRatio >= 0.75 && currentRatio < 1.0) trackingStatusColor = "text-amber-400";
                  if (currentRatio >= 1.0) trackingStatusColor = "text-rose-500";

                  return (
                    <div key={budget.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-200">{budget.name}</h4>
                          <span className="text-[10px] text-zinc-500">
                            Consumed {formatCurrency(budget.spent)} of {formatCurrency(budget.allocated)} limits
                          </span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${trackingStatusColor}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 p-[1px] border border-white/5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${budget.color} transition-all duration-500 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro Quick Analysis Status Panel */}
            <div className="bg-gradient-to-r from-zinc-950/60 to-zinc-900/40 backdrop-blur-3xl border border-emerald-500/10 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-emerald-400 uppercase tracking-wide text-[10px]">Automated System Core Advice</h4>
                <p className="text-zinc-300 mt-1 leading-relaxed">
                  Financial preservation thresholds remain highly optimal. Capital runway metrics project an excess reserve asset capacity of <span className="text-white font-semibold">{formatCurrency(560)}</span> by sequence end if current momentum holds.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT AREA: Immutable Event Ledger Stream Logs (5 Modules) */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex flex-col h-full">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">Immutable Ledger Log</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Chronological sequencing stream</p>
                </div>
                <a href="/transactions" className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition">
                  View Full <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* Transactions Log Element Stack list */}
              <div className="space-y-3 divide-y divide-white/5">
                {recentTransactions.map((tx, idx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <div 
                      key={tx.id} 
                      className={`flex items-center justify-between ${idx !== 0 ? "pt-3" : ""} group transition-all`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          isIncome 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-zinc-900 border-white/5 text-zinc-400 group-hover:text-white"
                        } transition-colors`}>
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition">
                            {tx.description}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                            <span className="text-zinc-400 font-medium">{tx.category}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-bold shrink-0 ml-3 ${
                        isIncome ? "text-emerald-400" : "text-zinc-300"
                      }`}>
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;