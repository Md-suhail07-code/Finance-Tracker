import { api } from "@/config/api";
import type { RootState } from "@/redux/app/store";
import { setProfile } from "@/redux/features/profile/profileSlice";
import { toggleTheme } from "@/redux/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calculator,
  Layers,
  TrendingUp,
  Calendar,
  Wallet,
  Sun,
  Moon,
  Paintbrush
} from "lucide-react";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state: RootState) => state.profile);
  const themeMode = useAppSelector((state: RootState) => state.theme?.mode || "dark");

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      if (res.data.success) {
        dispatch(setProfile(res.data));
        toast.success("Profile fetched successfully");
      }
    } catch (error) {
      toast.error("Failed to fetch your profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

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

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        <div className="pb-2 border-b border-slate-200 dark:border-white/5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Manage your account credentials, preferences, and personal balance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/5">
                <User size={36} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                {profile?.user?.name || "User"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 flex items-center gap-1 justify-center">
                <Mail size={12} /> {profile?.user?.email || "No email linked"}
              </p>
              <div className="mt-4 w-full pt-4 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 text-xs flex justify-between items-center px-2">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">User ID:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300 truncate max-w-[120px]" title={profile?.user?.id}>
                  {profile?.user?.id || "N/A"}
                </span>
              </div>
            </div>

            {/* Theme Preference Settings Box */}
            <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Paintbrush size={14} className="text-emerald-600 dark:text-emerald-400" />
                Appearance Theme
              </h3>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {themeMode === "dark" ? (
                    <Moon className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block capitalize">
                      {themeMode} Mode
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                      Active Application Color Scheme
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Switch
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full block"></span>
                Account Metadata
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ArrowUpRight size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-500 block">Total Income</span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {formatCurrency(Number(profile?.totalIncome))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                    <ArrowDownLeft size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-500 block">Total Expense</span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {formatCurrency(Number(profile?.totalExpense))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-500 block">Total Saved</span>
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {formatCurrency(Number(profile?.totalSaved))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-500 block">Average Expense</span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {formatCurrency(Number(profile?.avgExpense))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-4 group hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-amber-700/5">
                    <Layers size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-500 block">
                      Total Transactions
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {profile?.totalTransactions || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-amber-500 dark:text-amber-400" />
                  Highest Category
                </h3>
                {profile?.maxCategory?.name ? (
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                      {profile.maxCategory.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-zinc-400 block mt-1">
                      {formatCurrency(Number(profile.maxCategory.amount))} spent
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-zinc-500">No data records available</p>
                )}
              </div>

              <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-600 dark:text-cyan-400" />
                  Peak Spend Month
                </h3>
                {profile?.maxSpendMonth?.month ? (
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {profile.maxSpendMonth.month}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-zinc-400 block mt-1">
                      {formatCurrency(Number(profile.maxSpendMonth.amount))} total
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-zinc-500">No data records available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;