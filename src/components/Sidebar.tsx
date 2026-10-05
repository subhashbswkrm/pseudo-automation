import React from 'react';
import { 
  LayoutDashboard, 
  Workflow, 
  ShieldAlert, 
  Blocks, 
  Database, 
  Cpu, 
  Sparkles,
  ChevronRight,
  Radio,
  ExternalLink
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  pendingApprovalsCount 
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'integrations', label: 'Integration Hub', icon: Blocks },
    { id: 'agent', label: 'AI Agent', icon: Cpu },
    { 
      id: 'approvals', 
      label: 'Approval Gateway', 
      icon: ShieldAlert, 
      badge: pendingApprovalsCount,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
    },
    { id: 'settings', label: 'Settings', icon: Database },
  ];

  return (
    <aside className="w-68 min-h-screen bg-[#090d16]/95 border-r border-slate-800/80 flex flex-col justify-between p-4 sticky top-0 z-30 select-none">
      <div>
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/60">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">PSEUDO</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider">n8n ORCHESTRATION</p>
          </div>
        </div>

        {/* Live Swarm Status */}
        <div className="mb-6 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Engine Loop
            </span>
            <span className="text-emerald-400 font-mono font-medium text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
              ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Swarm: 6 Agents</span>
            <span className="text-purple-400">18ms ping</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-semibold">
            System Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-transparent text-white border-l-2 border-purple-500 shadow-sm shadow-purple-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400 animate-in fade-in" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/30 via-slate-900/50 to-emerald-950/20 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-slate-200">Autopilot v2.4</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            6-step recursive loop with Pinecone vector memory & n8n human approval gates.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            n8n Webhook: Ready
          </span>
          <a 
            href="#docs" 
            onClick={(e) => { e.preventDefault(); setActiveTab('workflows'); }}
            className="hover:text-slate-300 flex items-center gap-1 text-[11px]"
          >
            Flows <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
