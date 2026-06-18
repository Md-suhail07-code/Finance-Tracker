import { api } from "@/config/api";
import type { RootState } from "@/redux/app/store";
import { setProfile } from "@/redux/features/profile/profileSlice";
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
  Wallet
} from "lucide-react";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state: RootState) => state.profile);

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

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        <div className="pb-2 border-b border-white/5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User Profile
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your account credentials and personal balance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/5">
              <User size={36} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {profile?.user?.name || "User"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1 justify-center">
              <Mail size={12} /> {profile?.user?.email || "No email linked"}
            </p>
            <div className="mt-4 w-full pt-4 border-t border-white/5 text-zinc-400 text-xs flex justify-between items-center px-2">
              <span className="text-zinc-500 font-medium">User ID:</span>
              <span className="font-mono text-zinc-300 truncate max-w-[120px]" title={profile?.user?.id}>
                {profile?.user?.id || "N/A"}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-emerald-400 rounded-full block"></span>
                Account Metadata
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ArrowUpRight size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Total Income</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">
                      {formatCurrency(Number(profile?.totalIncome))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <ArrowDownLeft size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Total Expense</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">
                      {formatCurrency(Number(profile?.totalExpense))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Total Saved</span>
                    <span className="text-base font-bold font-mono text-emerald-400 block mt-0.5">
                      {formatCurrency(Number(profile?.totalSaved))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Average Expense</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">
                      {formatCurrency(Number(profile?.avgExpense))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-all duration-300">
  <div className="w-9 h-9 rounded-xl bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-amber-700/5">
    <Layers size={18} />
  </div>
  <div className="min-w-0 flex-1">
    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
      Total Transactions
    </span>
    <span className="text-base font-bold font-mono text-white block mt-0.5">
      {profile?.totalTransactions || 0}
    </span>
  </div>
</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-amber-400" />
                  Highest Category
                </h3>
                {profile?.maxCategory?.name ? (
                  <div>
                    <span className="text-sm font-bold text-white block truncate">
                      {profile.maxCategory.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-zinc-400 block mt-1">
                      {formatCurrency(Number(profile.maxCategory.amount))} spent
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No data records available</p>
                )}
              </div>

              <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-400" />
                  Peak Spend Month
                </h3>
                {profile?.maxSpendMonth?.month ? (
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {profile.maxSpendMonth.month}
                    </span>
                    <span className="text-xs font-mono font-semibold text-zinc-400 block mt-1">
                      {formatCurrency(Number(profile.maxSpendMonth.amount))} total
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No data records available</p>
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