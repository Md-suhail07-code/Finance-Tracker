import { useEffect, useState, useCallback } from "react";
import { api } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import {
  setBudgets,
  addBudgets,
} from "@/redux/features/budget/budgetSlice";
import {
  setCategoryBudgets,
  addCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
} from "@/redux/features/categoryBudget/categoryBudgetSlice";

import {
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const Budgets = () => {
  const dispatch = useAppDispatch();

  const { budgets } = useAppSelector((state) => state.budgets);
  const { categories } = useAppSelector((state) => state.categories);
  const { categoryBudgets } = useAppSelector(
    (state) => state.categoryBudgets
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [monthlyAmount, setMonthlyAmount] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [categoryAmount, setCategoryAmount] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editAmount, setEditAmount] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState("");

  const [error, setError] = useState("");

  const monthlyBudget = budgets.find(
    (budget) => budget.month === selectedMonth
  );

  const parseAmount = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const [budgetRes, categoryBudgetRes] = await Promise.all([
      api.get("/budgets/"),
      api.get(`/category-budgets/month?month=${selectedMonth}`).catch(err => {
        if (err.response?.status === 404) return { data: { categoryBudgets: [] } };
        throw err;
      }),
    ]);

    dispatch(setBudgets(budgetRes.data.budgets || []));
    dispatch(setCategoryBudgets(categoryBudgetRes.data.categoryBudgets || []));
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to load budgets");
  } finally {
    setLoading(false);
  }
}, [dispatch, selectedMonth]);

useEffect(() => {
  fetchData();
}, [fetchData]);

useEffect(() => {
  setMonthlyAmount(monthlyBudget ? String(monthlyBudget.amount) : "");
}, [monthlyBudget, selectedMonth]);

const handleSaveMonthlyBudget = async (e: React.FormEvent) => {
  e.preventDefault();
  const amount = parseAmount(monthlyAmount);
  if (amount == null) {
    setError("Please enter a valid monthly budget amount");
    return;
  }

  try {
    setActionLoading("monthly");
    setError("");

    if (monthlyBudget) {
      const res = await api.put(`/budgets/${monthlyBudget.id}`, {
        amount,
      });
      dispatch(setBudgets(
        budgets.map((b) => b.id === monthlyBudget.id? res.data.budget : b)
      ));
    } else {
      const res = await api.post("/budgets/", {
        amount,
        month: selectedMonth,
      });
      dispatch(addBudgets(res.data.budget));
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to save budget");
  } finally {
    setActionLoading("");
  }
};

const handleDeleteMonthlyBudget = async () => {
  if (!monthlyBudget) return;
  try {
    setActionLoading("deleteMonthly");
    setError("");
    await api.delete(`/budgets/${monthlyBudget.id}`);
    dispatch(setBudgets(budgets.filter(b => b.id!== monthlyBudget.id)));
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to delete budget");
  } finally {
    setActionLoading("");
  }
};

  const handleCreateCategoryBudget = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    const amount = parseAmount(categoryAmount);
    if (amount == null) {
      setError("Please enter a valid category amount");
      return;
    }
    if (!selectedCategoryId) {
      setError("Please select a category");
      return;
    }

    try {
      setActionLoading("createCategory");
      setError("");

      const res = await api.post("/category-budgets/", {
        categoryId: selectedCategoryId,
        amount,
        month: selectedMonth,
      });

      dispatch(addCategoryBudget(res.data.categoryBudget));

      setSelectedCategoryId("");
      setCategoryAmount("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category budget");
    } finally {
      setActionLoading("");
    }
  };

  const handleUpdateCategory = async (id: string) => {
    const amount = parseAmount(editAmount);
    if (amount == null) {
      setError("Please enter a valid category budget amount");
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const res = await api.put(
        `/category-budgets/${id}`,
        {
          amount,
        }
      );

      dispatch(updateCategoryBudget(res.data.categoryBudget));

      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category budget");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setActionLoading(`delete-${id}`);
      setError("");

      await api.delete(`/category-budgets/${id}`);

      dispatch(deleteCategoryBudget(id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category budget");
    } finally {
      setActionLoading("");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-emerald-400 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased pb-12 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Set your <span className="text-emerald-400 font-mono tracking-normal">Budgets</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure your monthly and category budgets for the current month</p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-xl p-1.5 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-white focus:outline-none focus:ring-0 cursor-pointer px-2 w-full sm:w-auto"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-emerald-400 rounded-full block"></span>
              Monthly Budget
            </h2>

            {monthlyBudget && (
              <div className="p-5 mb-4 rounded-xl bg-black/40 border border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Global Cap Status</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-400 mt-0.5">
                    {formatCurrency(Number(monthlyBudget.amount))}
                  </div>
                </div>

                <button
                  onClick={handleDeleteMonthlyBudget}
                  disabled={actionLoading === "deleteMonthly"}
                  className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs font-bold rounded-lg border border-white/5 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {actionLoading === "deleteMonthly" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Delete Budget"
                  )}
                </button>
              </div>
            )}

            <form
              onSubmit={handleSaveMonthlyBudget}
              className="space-y-4"
            >
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
                  <span className="text-xs font-semibold">₹</span>
                </div>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="Enter macro allocation amount"
                  required
                  className="block w-full pl-9 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === "monthly"}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase disabled:opacity-30 transition-all duration-150 shadow-[0_4px_20px_0_rgba(5,255,155,0.15)] flex items-center justify-center gap-2"
              >
                {actionLoading === "monthly" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                ) : monthlyBudget ? (
                  "Update Budget"
                ) : (
                  "Save Budget"
                )}
              </button>
            </form>
          </div>

          <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-cyan-400 rounded-full block"></span>
              Category Budget
            </h2>

            <form
              onSubmit={handleCreateCategoryBudget}
              className="space-y-4"
            >
              <div className="relative">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  className="block w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 font-medium appearance-none"
                >
                  <option value="" className="text-zinc-700">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-zinc-950 text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
                  <span className="text-xs font-semibold">$</span>
                </div>
                <input
                  type="number"
                  value={categoryAmount}
                  onChange={(e) => setCategoryAmount(e.target.value)}
                  placeholder="Amount"
                  required
                  className="block w-full pl-9 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === "createCategory"}
                className="w-full py-4 px-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase disabled:opacity-30 transition-all duration-150 shadow-[0_4px_20px_0_rgba(0,195,255,0.15)] flex items-center justify-center gap-2"
              >
                {actionLoading === "createCategory" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                ) : (
                  "Add Category Budget"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1 pt-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Active Category Budgets</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Category budgets for the current month</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/5 px-2 py-1 rounded border border-white/5 text-zinc-400">
              {categoryBudgets.length} Categories
            </span>
          </div>

          {categoryBudgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl bg-zinc-950/20 h-40">
              <p className="text-xs font-medium text-zinc-500">No category budgets assigned to this month.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="p-5 rounded-2xl bg-zinc-950/40 backdrop-blur-3xl border border-white/5 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] relative group flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white tracking-wide truncate">
                        {budget.category?.name}
                      </h3>
                      {editingId !== budget.id && (
                        <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
                          {formatCurrency(Number(budget.amount))}
                        </p>
                      )}
                    </div>

                    {editingId === budget.id ? (
                      <div className="flex items-center gap-1.5 w-full sm:w-auto animate-fadeIn">
                        <div className="relative flex-1 sm:flex-initial w-full sm:w-28">
                          <span className="absolute inset-y-0 left-2.5 flex items-center text-emerald-500 text-[10px] font-bold">$</span>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full pl-5 pr-2 py-1.5 bg-black border border-white/10 rounded-md text-white text-xs font-mono font-bold text-right focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          onClick={() => handleUpdateCategory(budget.id)}
                          disabled={actionLoading === budget.id}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition shrink-0"
                        >
                          {actionLoading === budget.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg border border-white/5 transition shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900/80 p-1 rounded-lg border border-white/5">
                        <button
                          onClick={() => {
                            setEditingId(budget.id);
                            setEditAmount(String(budget.amount));
                          }}
                          className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-emerald-400 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(budget.id)}
                          disabled={actionLoading === `delete-${budget.id}`}
                          className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-rose-400 transition"
                        >
                          {actionLoading === `delete-${budget.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Budgets;