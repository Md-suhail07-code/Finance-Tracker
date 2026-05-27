import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form Fields
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  // Available pristine categories to choose from
  const availableCategories = [
    "Housing & Rent",
    "Food & Dining",
    "Entertainment",
    "Utilities & Node Power",
    "Insurance",
    "Investments",
    "Miscellaneous"
  ];

  /**
   * Mock API Call: Fetch Budgets
   */
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        // Simulating API network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Initial Mock Database Payload
        setBudgets([
          { id: "b-1", category: "Housing & Rent", amount: 1500, spent: 1500 },
          { id: "b-2", category: "Food & Dining", amount: 600, spent: 412.50 },
          { id: "b-3", category: "Entertainment", amount: 400, spent: 320.00 },
          { id: "b-4", category: "Utilities & Node Power", amount: 350, spent: 180.20 },
        ]);
      } catch (error) {
        console.error("Failed to pull schema from database framework.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  /**
   * Mock API Call: Create Budget
   */
  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setActionLoading("create");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Validate duplicate threshold rules
      if (budgets.some((b) => b.category === category)) {
        alert("This category framework already has an active budget node assigned.");
        return;
      }

      const newBudget: Budget = {
        id: `b-${Date.now()}`,
        category,
        amount: parseFloat(amount),
        spent: 0, // Freshly provisioned nodes start at baseline consumption zero
      };

      setBudgets([...budgets, newBudget]);
      setCategory("");
      setAmount("");
    } catch (error) {
      console.error("Failed to commit new structural target to API.", error);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Mock API Call: Update Budget Limit
   */
  const handleUpdateBudget = async (id: string) => {
    const parsedAmount = parseFloat(editAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setActionLoading(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      setBudgets(
        budgets.map((b) => (b.id === id ? { ...b, amount: parsedAmount } : b))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Failed to modify database collection values.", error);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Mock API Call: Delete Budget Node
   */
  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Are you sure you want to purge this structural parameter node?")) return;

    setActionLoading(`delete-${id}`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBudgets(budgets.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Purge failure execution route.", error);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (budget: Budget) => {
    setEditingId(budget.id);
    setEditAmount(budget.amount.toString());
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
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
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        {/* Upper Heading Contextual Bar */}
        <section className="pb-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Budgetary <span className="text-emerald-400 font-mono tracking-normal">Frameworks</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Configure asset limits and dynamic ceilings on resource consumption pipelines</p>
        </section>

        {/* Loading Spinner for Base Page Data Fetching */}
        {loading ? (
          <div className="h-60 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs font-mono text-zinc-500">Syncing with cloud budget array matrices...</p>
          </div>
        ) : (
          /* Responsive Dual Column Split Grid layout mapping */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT AREA: Create Budget Control Terminal (5 Columns) */}
            <section className="lg:col-span-5 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Provision Ceiling</h2>
              </div>

              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Category Mapping Target</label>
                  <select
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 font-medium appearance-none"
                  >
                    <option value="" disabled className="text-zinc-700">Select Classification target...</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Target Cap (USD Value)</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-10 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "create"}
                  className="w-full mt-2 py-4 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase disabled:opacity-50 transition-all duration-150 shadow-[0_4px_20px_0_rgba(5,255,155,0.15)] flex items-center justify-center gap-2"
                >
                  {actionLoading === "create" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3px]" /> Allocate Budget Envelope
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* RIGHT AREA: Active Framework Envelopes Stack (7 Columns) */}
            <section className="lg:col-span-7 space-y-4">
              {budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl bg-zinc-950/20 h-60">
                  <Wallet className="w-8 h-8 text-zinc-600 mb-2" />
                  <p className="text-xs font-medium text-zinc-500">No active budgetary constraints found in data streams.</p>
                </div>
              ) : (
                budgets.map((budget) => {
                  const currentConsumptionRatio = budget.spent / budget.amount;
                  const usagePercentage = Math.min(Math.round(currentConsumptionRatio * 100), 100);
                  const isBreached = currentConsumptionRatio >= 1.0;
                  const isNearingBreach = currentConsumptionRatio >= 0.8 && currentConsumptionRatio < 1.0;

                  // Define Dynamic Heat Grading Vectors
                  let trackingColor = "from-emerald-500 to-teal-500";
                  let borderHighlight = "border-white/5";
                  if (isNearingBreach) {
                    trackingColor = "from-amber-400 to-orange-500";
                    borderHighlight = "border-amber-500/20";
                  }
                  if (isBreached) {
                    trackingColor = "from-rose-500 to-red-600";
                    borderHighlight = "border-rose-500/30";
                  }

                  return (
                    <div
                      key={budget.id}
                      className={`p-5 rounded-2xl bg-zinc-950/40 backdrop-blur-3xl border ${borderHighlight} transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] relative group`}
                    >
                      {/* Critical Over-allocation Alert Badge */}
                      {isBreached && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[9px] text-rose-400 font-bold uppercase tracking-wider font-mono animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" /> Over Capacity
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xs font-bold text-white tracking-wide">{budget.category}</h3>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              Consumed {formatCurrency(budget.spent)} of standard ceiling value
                            </p>
                          </div>

                          {/* INLINE CEILING VALUE EDIT PANEL INTERACTIVE ROUTE */}
                          {editingId === budget.id ? (
                            <div className="flex items-center gap-1.5 animate-fadeIn">
                              <div className="relative w-24">
                                <span className="absolute inset-y-0 left-2.5 flex items-center text-emerald-500 text-[10px]">$</span>
                                <input
                                  type="number"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                  className="w-full pl-5 pr-2 py-1 bg-black border border-white/10 rounded-md text-white text-xs font-mono font-bold text-right focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <button
                                onClick={() => handleUpdateBudget(budget.id)}
                                disabled={actionLoading === budget.id}
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md transition"
                              >
                                {actionLoading === budget.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-md border border-white/5 transition"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            /* STATIC CEILING VALUE READ CONTAINER VIEW */
                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold text-white block">
                                {formatCurrency(budget.amount)}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-zinc-500 block mt-0.5">
                                Limit Parameter
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Visual Framework Consumption Percentage Bar */}
                        <div className="space-y-1.5">
                          <div className="w-full h-2 rounded-full bg-black/60 p-[1px] border border-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${trackingColor} transition-all duration-500 ease-out`}
                              style={{ width: `${usagePercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500">
                            <span>0%</span>
                            <span className={isBreached ? "text-rose-400" : isNearingBreach ? "text-amber-400" : "text-emerald-400"}>
                              {usagePercentage}% ALLOCATED
                            </span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Action Control Button Stack (Hidden dynamically until hover on desktops) */}
                        {editingId !== budget.id && (
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.03] sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => startEditing(budget)}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-lg text-[10px] font-bold border border-white/5 flex items-center gap-1.5 transition"
                            >
                              <Edit3 className="w-3 h-3" /> Update Limit
                            </button>
                            <button
                              onClick={() => handleDeleteBudget(budget.id)}
                              disabled={actionLoading === `delete-${budget.id}`}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-lg text-[10px] font-bold border border-white/5 flex items-center gap-1.5 transition"
                            >
                              {actionLoading === `delete-${budget.id}` ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3" /> Purge Node
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Budgets;