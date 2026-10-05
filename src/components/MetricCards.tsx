import React from 'react';
import { 
  Bot, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  ArrowUpRight, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';

interface MetricCardsProps {
  pendingCount: number;
  completedCount: number;
  eventCount: number;
  onNavigateToApprovals: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ 
  pendingCount, 
  completedCount,
  eventCount,
  onNavigateToApprovals 
}) => {
  const metrics = [
    {
      title: 'Pending',
      value: String(pendingCount),
      change: 'Needs attention',
      trendLabel: 'Awaiting queue',
      icon: Clock,
      accentColor: 'amber',
      glow: 'shadow-amber-500/10 border-amber-500/30',
      tag: 'Queued',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      description: 'Work in progress across outbound tasks'
    },
    {
      title: 'Review',
      value: String(pendingCount),
      change: 'Human decision',
      trendLabel: 'Awaiting signoff',
      icon: ShieldAlert,
      accentColor: 'rose',
      glow: 'shadow-rose-500/15 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/60 to-slate-900/40',
      tag: 'Approval gate',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse',
      description: 'High-risk actions waiting for approval',
      actionable: true,
      onClick: onNavigateToApprovals
    },
    {
      title: 'Completed events',
      value: String(completedCount),
      change: 'Successfully done',
      trendLabel: 'Automation wins',
      icon: CheckCircle2,
      accentColor: 'emerald',
      glow: 'shadow-emerald-500/10 border-emerald-500/30',
      tag: 'Resolved',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      description: 'Completed workflow events in the audit log'
    },
    {
      title: 'Activity Events',
      value: String(eventCount),
      change: 'Persisted',
      trendLabel: 'audit trail',
      icon: Zap,
      accentColor: 'purple',
      glow: 'shadow-purple-500/10 border-purple-500/30',
      tag: 'Autonomous',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      description: 'Workflow and decision events stored'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            onClick={item.onClick}
            className={`relative overflow-hidden rounded-2xl bg-slate-900/60 border p-5 backdrop-blur-xl transition-all duration-300 group ${
              item.glow
            } ${item.actionable ? 'cursor-pointer hover:border-rose-400/60 hover:scale-[1.02]' : 'hover:border-slate-700 hover:-translate-y-0.5'}`}
          >
            {/* Top decorative gradient line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
              item.accentColor === 'emerald' ? 'from-emerald-500 via-teal-400 to-transparent' :
              item.accentColor === 'purple' ? 'from-purple-500 via-indigo-400 to-transparent' :
              item.accentColor === 'cyan' ? 'from-cyan-500 via-blue-400 to-transparent' :
              'from-rose-500 via-amber-400 to-transparent animate-pulse'
            }`} />

            {/* Header row inside card */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 font-mono tracking-wide uppercase">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
                {item.value}
              </span>
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded font-mono ${
                item.accentColor === 'rose'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {item.change}
              </span>
            </div>

            {/* Subtitle / Context */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
              <span className="truncate">{item.description}</span>
              {item.actionable ? (
                <span className="text-rose-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                  Review <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="font-mono text-[11px] text-slate-400 shrink-0">{item.trendLabel}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
