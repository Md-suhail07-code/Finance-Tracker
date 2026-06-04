import React from "react";
import type { LucideIcon } from "lucide-react";

type SummaryBoxProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

const SummaryBox: React.FC<SummaryBoxProps> = ({ title, value, icon: IconComponent }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-white/10 transition-all duration-300">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl group-hover:bg-emerald-500/[0.05] transition-all duration-500"></div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
        {formatCurrency(value)}
      </h3>
    </div>
  );
};

export default SummaryBox;