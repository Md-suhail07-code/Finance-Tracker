import React, { useState, useEffect } from "react";
import SummaryBox from "@/components/SummaryBox.tsx";
import MonthlyComparisonChart from "@/components/MonthlyComparisonChart.tsx";
import { api } from "@/config/api";
import { toast } from "sonner";
import {
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart2,
  Loader2,
  Sparkles,
} from "lucide-react";
import CategoryDistribution from "@/components/CategoryDistribution";
import BudgetPerformance from "@/components/BudgetPerformance";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import RecentTransactions from "@/components/RecentTransactions";
import FinancialHealth from "@/components/FinancialHealth";
import AiInsights from "@/components/AiInsights";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    remainingBudget: null,
    totalTransactions: 0,
    categoryBreakdown: {},
    recentTransactions: [],
  });
  const [monthlyComparison, setMonthlyComparison] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [budgetPerformance, setBudgetPerformance] = useState([]);
  const [spendingTrend, setSpendingTrend] = useState([]);
  const [financialHealth, setFinancialHealth] = useState({
    score: 0,
    status: "Excellent",
    savingsRate: 0,
    budgetUsage: 0,
    income: 0,
    expense: 0,
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/analytics/overview");
      if (res.status === 200) {
        setAnalytics(res.data.analytics);
      }
    } catch (error) {
      toast.error("Failed to fetch analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyComparison = async () => {
    try {
      const res = await api.get("/analytics/monthly-comparison");
      if (res.status === 200) {
        setMonthlyComparison(res.data.monthlyData || []);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch monthly comparison data. Please try again later.",
      );
    }
  };

  const fetchCategoryDistribution = async () => {
    try {
      const res = await api.get("/analytics/category-distribution");
      if (res.status === 200) {
        setCategoryDistribution(res.data.categoryDistribution || []);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch category distribution data. Please try again later.",
      );
    }
  };

  const fetchBudgetPerformance = async () => {
    try {
      const res = await api.get("analytics/budget-performance");
      if (res.status === 200) {
        setBudgetPerformance(res.data.budgetPerformance);
      }
    } catch (error) {
      toast.error("Failed to fetch Budget Performance");
    }
  };

  const fetchSpendingTrend = async () => {
    try {
      const res = await api.get("/analytics/spending-trend");
      if (res.status === 200) {
        setSpendingTrend(res.data.monthlyTrend);
      }
    } catch (error) {
      toast.error("Failed to fetch Spending Trend");
    }
  };

  const fetchFinancialHealth = async () => {
    try {
      const res = await api.get("/analytics/financial-score");
      if (res.data.success) {
        setFinancialHealth(res.data.financialHealth);
      }
    } catch (error) {
      toast.error("Failed to fetch Financial Health");
    }
  };

  const triggerAiInsights = async () => {
    try {
      setAiLoading(true);
      const res = await api.get("/ai/");
      if (res.data.success) {
        setAiInsights(res.data.data);
        toast.success("AI balance matrix insights computed successfully!");
      }
    } catch (error) {
      toast.error("Failed to synthesize automated machine learning insights.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchMonthlyComparison();
    fetchCategoryDistribution();
    fetchBudgetPerformance();
    fetchSpendingTrend();
    fetchFinancialHealth();
  }, []);

  const summaryData = [
    { title: "Total Income", value: analytics.totalIncome, icon: DollarSign },
    { title: "Total Expense", value: analytics.totalExpense, icon: CreditCard },
    { title: "Savings", value: analytics.savings, icon: PiggyBank },
    {
      title: "Remaining Budget",
      value: analytics.remainingBudget ?? 0,
      icon: BarChart2,
    },
  ];

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-black">
      <Loader2 className="animate-spin text-emerald-500" size={48} />
    </div>
  ) : (
    <div className="p-4 sm:p-6 lg:px-12 space-y-6 bg-black min-h-screen font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Finance Analytics{" "}
              <span className="text-emerald-400 font-mono">Dashboard</span>
            </h1>
          </div>
          <button
            onClick={triggerAiInsights}
            disabled={aiLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-500 text-zinc-950 text-xs font-bold rounded-xl tracking-wide shadow-md shadow-emerald-500/5 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 h-10 shrink-0"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate AI Insights
              </>
            )}
          </button>
        </div>
        {aiInsights && (
          <div className="w-full animate-fadeIn">
            <AiInsights insights={aiInsights} />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {summaryData.map((item) => (
            <SummaryBox
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MonthlyComparisonChart data={monthlyComparison} />
          <CategoryDistribution data={categoryDistribution} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BudgetPerformance data={budgetPerformance} />
          <MonthlyTrendChart data={spendingTrend} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentTransactions data={analytics.recentTransactions} />
          <FinancialHealth data={financialHealth} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
