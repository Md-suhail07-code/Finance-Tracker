import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, Calendar, ArrowRight } from "lucide-react";

interface TransactionItem {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  createdAt: string;
  userId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string;
    userId: string;
  };
}

interface RecentTransactionsProps {
  data: TransactionItem[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const validData = data && data.length > 0 ? data.slice(0, 5) : [];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Transactions
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Your latest transactional records
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-3 divide-y divide-white/5 flex-1">
        {validData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 h-40">
            <p className="text-xs font-medium text-zinc-500">
              No recent transactions found.
            </p>
          </div>
        ) : (
          validData.map((tx, idx) => {
            const isIncome = tx.type === "INCOME";
            return (
              <div
                key={tx.id}
                className={`flex items-center justify-between ${
                  idx !== 0 ? "pt-3" : ""
                } group transition-all`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-zinc-900 border-white/5 text-rose-400"
                    }`}
                  >
                    {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition">
                      {tx.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500 mt-0.5">
                      <span className="text-zinc-400 font-medium">
                        {tx.category?.name || "Unassigned"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-sm font-mono font-bold shrink-0 ml-3 ${
                    isIncome ? "text-emerald-400" : "text-zinc-300"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(Number(tx.amount))}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;