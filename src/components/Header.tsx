import React from 'react';
import { 
  Bell, 
  Search, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onSimulateEvent: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onSimulateEvent, 
  isSimulating 
}) => {
  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Autonomous Orchestration Control',
          subtitle: 'Live 6-Step Cognitive Pipeline & Swarm Telemetry'
        };
      case 'approvals':
        return {
          title: 'Human-in-the-Loop (HITL) Gate',
          subtitle: 'Review & authorize sensitive autonomous agent interventions'
        };
      case 'workflows':
        return {
          title: 'Workflow Execution Graph',
          subtitle: 'Visual data flow: Ingestion -> Cognitive Pipeline -> Output Actions'
        };
      case 'integrations':
        return {
          title: 'Integration Hub',
          subtitle: 'Where data comes from and where processed output is routed'
        };
      case 'agent':
        return {
          title: 'AI Agent',
          subtitle: 'Natural-language orchestration for workflow and data-source changes'
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Profile, account control, and database administration'
        };
      case 'memory':
        return {
          title: 'Episodic & Vector Memory Base',
          subtitle: 'Pinecone embeddings, semantic cache & learned behavioral rules'
        };
      default:
        return { title: 'Dashboard', subtitle: 'System Overview' };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="h-20 bg-[#090d16]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            {title}
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE SYNC
            </span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents, workflows, traces (⌘K)..."
            className="w-64 pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
        </div>

        {/* Simulate Event Button */}
        <button
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-300' : 'text-yellow-300'}`} />
          <span>{isSimulating ? 'Simulating Pipeline...' : 'Trigger Test Ingestion'}</span>
        </button>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>99.98% SLA</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>HITL Enforced</span>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
