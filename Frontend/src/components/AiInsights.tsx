import React from "react";
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";

interface ActionableTip {
  title: string;
  description: string;
}

interface AiInsightsData {
  summary: string;
  criticalAlerts: string[];
  actionableTips: ActionableTip[];
}

interface AiInsightsProps {
  insights: AiInsightsData | null;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden group">
      {/* Background Subtle Gradient Flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            AI Financial Insights
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Automated predictive analysis generated via machine intelligence frameworks
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Block */}
        {insights.summary ? (
          <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 text-xs text-zinc-300 leading-relaxed">
            <span className="font-bold text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">Executive Summary</span>
            {insights.summary}
          </div>
        ) : (
          <div className="text-xs text-zinc-500 italic">No summary logs available.</div>
        )}

        {/* Critical Alerts Block */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Critical Alerts
          </h3>
          {insights.criticalAlerts && insights.criticalAlerts.length > 0 ? (
            <div className="space-y-2">
              {insights.criticalAlerts.map((alert, index) => (
                <div key={index} className="p-3 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl text-xs text-zinc-300 leading-relaxed">
                  {alert}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-black/20 border border-white/5 border-dashed rounded-xl text-xs text-zinc-500 italic">
              No critical alerts registered.
            </div>
          )}
        </div>

        {/* Actionable Tips Block */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Actionable Optimization Tips
          </h3>
          {insights.actionableTips && insights.actionableTips.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {insights.actionableTips.map((tip, index) => (
                <div key={index} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-1 hover:border-white/10 transition duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <h4 className="text-xs font-bold text-zinc-200">{tip.title}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pl-5">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-black/20 border border-white/5 border-dashed rounded-xl text-xs text-zinc-500 italic">
              No actionable tips generated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;