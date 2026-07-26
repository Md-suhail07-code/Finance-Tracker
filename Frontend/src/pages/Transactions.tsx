import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import type { Transaction } from "@/redux/features/transaction/transactionType";
import {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/redux/features/transaction/transactionSlice";
import {
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { transactions } = useAppSelector((state) => state.transactions);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const parseAmount = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/transactions/");
      dispatch(setTransactions(response.data.transactions || []));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load transactions");
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseAmount(amount);

    if (parsedAmount == null) {
      setError("Please enter a valid amount");
      return;
    }
    if (!selectedCategoryId) {
      setError("Please select a category");
      return;
    }

    try {
      setActionLoading("create");
      setError("");

      const res = await api.post("/transactions/", {
        title: title,
        amount: parsedAmount,
        type,
        categoryId: selectedCategoryId,
        date,
        description: description || undefined,
      });
      dispatch(addTransaction(res.data.transaction));
      setTitle("");
      setAmount("");
      setSelectedCategoryId("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      toast.success("Transaction added");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create transaction");
      toast.error("Failed to create transaction");
    } finally {
      setActionLoading("");
    }
  };

  const handleUpdateTransaction = async (id: string) => {
    const parsedAmount = parseAmount(editAmount);

    if (parsedAmount == null) {
      setError("Please enter a valid amount");
      return;
    }
    if (!editCategoryId) {
      setError("Please select a category");
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const res = await api.put(`/transactions/${id}`, {
        amount: parsedAmount,
        type: editType,
        categoryId: editCategoryId,
        date: editDate,
        description: editDescription || undefined,
      });

      dispatch(updateTransaction(res.data.transaction));
      setEditingId(null);
      toast.success("Transaction updated");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update transaction");
      toast.error("Failed to update transaction");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      setActionLoading(`delete-${id}`);
      setError("");

      await api.delete(`/transactions/${id}`);
      dispatch(deleteTransaction(id));
      toast.success("Transaction deleted");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete transaction");
      toast.error("Failed to delete transaction");
    } finally {
      setActionLoading("");
    }
  };

  const startEditing = (transaction: Transaction) => {
    setError("");
    setEditingId(transaction.id);
    setEditAmount(String(transaction.amount));
    setEditType(transaction.type);
    setEditCategoryId(transaction.category?.id);
    setEditDate(transaction.date.slice(0, 10));
    setEditDescription(transaction.description ?? "");
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-gray-100 font-sans antialiased pb-12 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden transition-colors duration-200">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200 dark:border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Add and manage your income and expenses
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full block"></span>
              Add Transaction
            </h2>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    type === "EXPENSE"
                      ? "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-white/5 shadow-sm"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    type === "INCOME"
                      ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-white/5 shadow-sm"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <span className="text-xs font-semibold">₹</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  required
                  className="block w-full pl-9 pr-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 font-medium appearance-none"
                >
                  <option value="" className="text-slate-400 dark:text-zinc-700">
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 text-xs">
                  ▼
                </div>
              </div>

              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 font-medium"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === "create"}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase disabled:opacity-30 transition-all duration-150 shadow-[0_4px_20px_0_rgba(5,255,155,0.15)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading === "create" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                ) : (
                  <>
                    <Plus size={16} /> Add Transaction
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Transaction History
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">
                  Recent records from your account
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-400">
                {transactions.length} Total
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-zinc-950/20 h-40">
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">
                  No transactions recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 transition-all duration-200 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] relative group"
                  >
                    {editingId === transaction.id ? (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setEditType("EXPENSE")}
                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              editType === "EXPENSE"
                                ? "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400"
                                : "text-slate-600 dark:text-zinc-400"
                            }`}
                          >
                            Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditType("INCOME")}
                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              editType === "INCOME"
                                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400"
                                : "text-slate-600 dark:text-zinc-400"
                            }`}
                          >
                            Income
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                            placeholder="Amount"
                          />
                          <select
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                            placeholder="Description"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-lg border border-slate-200 dark:border-white/5 transition cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateTransaction(transaction.id)
                            }
                            disabled={actionLoading === transaction.id}
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg transition cursor-pointer"
                          >
                            {actionLoading === transaction.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              transaction.type === "INCOME"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 dark:bg-zinc-900 border-rose-500/20 dark:border-white/5 text-rose-500 dark:text-rose-400"
                            }`}
                          >
                            {transaction.type === "INCOME" ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowDownLeft size={16} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {transaction.title ||
                                transaction.description ||
                                "No description"}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">
                              <span className="text-slate-600 dark:text-zinc-400 font-medium">
                                {transaction.category?.name || "Unassigned"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(transaction.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-200 dark:border-white/[0.02] sm:border-t-0 pt-2 sm:pt-0">
                          <span
                            className={`text-sm font-mono font-bold ${
                              transaction.type === "INCOME"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            {transaction.type === "INCOME" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>

                          <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-100 dark:bg-zinc-900/80 p-1 rounded-lg border border-slate-200 dark:border-white/5">
                            <button
                              onClick={() => startEditing(transaction)}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/5 rounded text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                            >
                              <Edit3 size={14} />
                            </button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/5 rounded text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer">
                                  <Trash2 size={14} />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-sm bg-white dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 text-slate-900 dark:text-gray-100 rounded-2xl shadow-xl">
                                <DialogHeader>
                                  <DialogTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Delete Transaction
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-500 dark:text-zinc-400 text-xs mt-1">
                                    Are you sure you want to delete this
                                    transaction? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/5 transition duration-150 h-9"
                                    >
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    onClick={() =>
                                      handleDeleteTransaction(transaction.id)
                                    }
                                    disabled={
                                      actionLoading ===
                                      `delete-${transaction.id}`
                                    }
                                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-bold text-xs tracking-wide uppercase shadow-md shadow-rose-500/10 active:scale-[0.98] transition-all duration-150 h-9 flex items-center justify-center min-w-[80px]"
                                  >
                                    {actionLoading ===
                                    `delete-${transaction.id}` ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
