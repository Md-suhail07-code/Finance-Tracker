import React from "react";
import SummaryBox from "@/components/SummaryBox.tsx";
import MonthlyComparisonChart from "@/components/MonthlyComparisonChart.tsx";
import { useState, useEffect } from "react";
import { api } from "@/config/api";
import { toast } from "sonner";
import {
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart2,
  Loader2,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
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

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/analytics/overview");
      if (res.status === 200) {
        setAnalytics(res.data.analytics);
        toast.success("Analytics data fetched successfully!");
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
        toast.success("Monthly comparison data fetched successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch monthly comparison data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchMonthlyComparison();
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
    <div className="p-6 lg:pl-12 lg:pr-12 space-y-6 bg-black min-h-screen font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Finance Analytics <span className="text-emerald-400 font-mono">Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((item) => (
            <SummaryBox
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="w-full">
          <MonthlyComparisonChart data={monthlyComparison} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;