import React, { useState } from 'react';
import { 
  ActivityItem, 
  LoopStep 
} from '../types';
import { 
  Search, 
  BrainCircuit, 
  Compass, 
  GitBranch, 
  Play, 
  CheckCircle, 
  Database, 
  ArrowRight, 
  Clock, 
  Radio, 
  Filter, 
  Pause, 
  RotateCw,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  currentActiveStep?: LoopStep;
  onSelectStepFilter?: (step: LoopStep | 'ALL') => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities,
  currentActiveStep = 'Decide'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  const loopSteps: { name: LoopStep; label: string; agent: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { name: 'Collect', label: '1. Collect', agent: 'Scout Agent', icon: Compass, color: 'from-blue-500 to-cyan-500' },
    { name: 'Understand', label: '2. Understand', agent: 'Interpreter Agent', icon: BrainCircuit, color: 'from-cyan-500 to-teal-500' },
    { name: 'Decide', label: '3. Decide', agent: 'Decision Engine', icon: GitBranch, color: 'from-purple-500 to-indigo-500' },
    { name: 'Act', label: '4. Act', agent: 'Action Agent', icon: Zap, color: 'from-amber-500 to-emerald-500' },
    { name: 'Verify', label: '5. Verify', agent: 'Verifier Agent', icon: ShieldCheck, color: 'from-emerald-500 to-green-500' },
    { name: 'Remember', label: '6. Remember', agent: 'Memory Base', icon: Database, color: 'from-indigo-500 to-purple-500' },
  ];

  const filteredActivities = activities.filter(item => {
    if (selectedFilter === 'ALL') return true;
    return item.step === selectedFilter;
  });

  const getStepBadge = (step: LoopStep) => {
    switch (step) {
      case 'Collect':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Understand':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Decide':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Act':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Verify':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Remember':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">SUCCESS</span>;
      case 'in_progress':
        return <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 animate-pulse">PROCESSING</span>;
      case 'needs_approval':
        return <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse font-bold">HITL GATE</span>;
      case 'queued':
        return <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">QUEUED</span>;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* 6-Step Loop Visual Header */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 font-mono">
                The 6-Step Cognitive Loop
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                AUTONOMOUS ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous task synthesis from sensory ingestion to durable vector memory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {isLiveStreaming ? (
                <>
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Streaming Live</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              avg. 412ms / loop
            </span>
          </div>
        </div>

        {/* 6-Step Interactive Nodes Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {loopSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = currentActiveStep === step.name;
            const isFilter = selectedFilter === step.name;

            return (
              <button
                key={step.name}
                onClick={() => setSelectedFilter(selectedFilter === step.name ? 'ALL' : step.name)}
                className={`relative p-3 rounded-xl border text-left transition-all duration-300 group cursor-pointer ${
                  isFilter
                    ? 'bg-purple-900/30 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500/50'
                    : isCurrent
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Step Connector Arrow on Desktop */}
                {idx < loopSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-600">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${step.color} text-slate-950 font-bold`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                </div>

                <div className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors">
                  {step.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  {step.agent}
                </div>

                {isCurrent && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    ACTIVE INGEST
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Log Header & Filters */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Live Event Stream
          </span>
          <span className="text-xs text-slate-400">({filteredActivities.length} items logged)</span>
        </div>

        {/* Step Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-purple-600 text-white font-medium shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Steps
          </button>
          {loopSteps.map(step => (
            <button
              key={step.name}
              onClick={() => setSelectedFilter(step.name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedFilter === step.name
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>

      {/* List of Activity items */}
      <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No activity events found for step: {selectedFilter}</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div 
              key={act.id} 
              className="p-4 sm:px-6 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Step badge */}
                <div className="shrink-0 mt-0.5">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase border ${getStepBadge(act.step)}`}>
                    {act.step}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {act.agent}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-300 font-medium truncate">
                      {act.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed break-words">
                    {act.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {act.latencyMs}ms
                </span>
                {getStatusBadge(act.status)}
                <span className="text-[11px] font-mono text-slate-400">
                  {act.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info bar */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between px-6">
        <span className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Persisted backend activity · n8n dispatch is optional
        </span>
        <span className="font-mono text-[11px] text-purple-400">
          Sync Buffer: 0 drops
        </span>
      </div>
    </div>
  );
};
