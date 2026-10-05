import React, { useState } from 'react';
import { 
  Mail, 
  Webhook, 
  Bot, 
  BrainCircuit, 
  Database, 
  Send, 
  CheckCircle, 
  Zap, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  Maximize2,
  Share2,
  Sliders,
  Calendar,
  MessageSquare
} from 'lucide-react';

export const WorkflowVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('agent-context');

  const nodes = [
    // Column 1: Input Sources
    {
      id: 'input-gmail',
      title: 'Gmail Trigger',
      category: 'Input Source',
      col: 1,
      icon: Mail,
      accent: 'border-red-500/40 text-red-400 bg-red-950/20',
      status: 'active',
      throughput: '142 msgs/hr',
      description: 'Listens for label:sponsor OR subject:"Hackathon Partnership"'
    },
    {
      id: 'input-webhook',
      title: 'Custom Webhook',
      category: 'Input Source',
      col: 1,
      icon: Webhook,
      accent: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      status: 'active',
      throughput: '38 req/min',
      description: 'Incoming payloads from Devpost & Discord bot events'
    },

    // Column 2: AI Pipeline (Scout & Interpreter)
    {
      id: 'agent-scout',
      title: 'Scout Agent',
      category: 'AI Pipeline (Ingestion)',
      col: 2,
      icon: Bot,
      accent: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      status: 'processing',
      throughput: 'Avg. 110ms',
      description: 'Sanitizes raw HTML, strips PII, and generates initial token embeddings'
    },
    {
      id: 'agent-interpreter',
      title: 'Interpreter Agent',
      category: 'AI Pipeline (Intent)',
      col: 2,
      icon: BrainCircuit,
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20',
      status: 'active',
      throughput: 'Claude 3.5 Sonnet',
      description: 'Extracts entities, evaluates intent, and assigns policy risk rating'
    },

    // Column 3: AI Pipeline (Context Vector Store & Decision)
    {
      id: 'agent-context',
      title: 'Context Agent (RAG)',
      category: 'AI Pipeline (Memory)',
      col: 3,
      icon: Database,
      accent: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20 shadow-lg shadow-purple-900/20',
      status: 'active',
      throughput: 'Pinecone Vector Store',
      description: 'Performs cosine similarity search against previous email templates & organizer rules'
    },
    {
      id: 'agent-decide',
      title: 'HITL Decision Gate',
      category: 'Safety & Routing',
      col: 3,
      icon: ShieldCheck,
      accent: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
      status: 'active',
      throughput: 'Threshold: 80% conf',
      description: 'High-risk route diverts to Human-in-the-Loop review queue'
    },

    // Column 4: Outputs & Actions
    {
      id: 'action-email',
      title: 'Drafted Outbound Email',
      category: 'Output Action',
      col: 4,
      icon: Send,
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20',
      status: 'active',
      throughput: 'Gmail API Dispatch',
      description: 'Approved messages dispatched with dynamic DKIM / SPF verification'
    },
    {
      id: 'action-sync',
      title: 'Slack & Cal Sync',
      category: 'Output Action',
      col: 4,
      icon: MessageSquare,
      accent: 'border-teal-500/40 text-teal-400 bg-teal-950/20',
      status: 'active',
      throughput: '#hackathon-ops',
      description: 'Instant notification dispatched to team channel with audit trail'
    }
  ];

  const currentNodeDetails = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6">
      {/* Visual Canvas Card */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                n8n Autonomous Node Graph
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE WORKFLOW #04
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live data pipeline: Input Sources → AI Agents → Human-in-the-Loop Gate → Outbound Dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Execution Stream Active
            </span>
          </div>
        </div>

        {/* Node Graph Mockup Canvas */}
        <div className="my-6 p-6 rounded-2xl bg-[#070b14] border border-slate-800 relative overflow-x-auto min-w-[700px] cyber-grid">
          {/* Animated SVG Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <defs>
              <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path d="M 180 90 C 260 90, 260 140, 340 140" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" className="animate-flow-pulse" />
            <path d="M 180 230 C 260 230, 260 140, 340 140" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
            <path d="M 490 140 C 570 140, 570 140, 650 140" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" className="animate-flow-pulse" />
            <path d="M 490 230 C 570 230, 570 230, 650 230" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
            <path d="M 800 140 C 880 140, 880 90, 960 90" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
            <path d="M 800 230 C 880 230, 880 230, 960 230" stroke="url(#cyberLineGrad)" strokeWidth="2" fill="none" strokeDasharray="6 4" className="animate-flow-pulse" />
          </svg>

          {/* 4 Pipeline Columns */}
          <div className="grid grid-cols-4 gap-6 relative z-10">
            {/* Column 1: Input Sources */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
                1. Ingestion Sources
              </div>
              {nodes.filter(n => n.col === 1).map(node => {
                const Icon = node.icon;
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 ring-2 ring-purple-500/40 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg border ${node.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{node.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                      <span>{node.throughput}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Ingestion & Intent */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-1">
                2. Scout & Intent
              </div>
              {nodes.filter(n => n.col === 2).map(node => {
                const Icon = node.icon;
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 ring-2 ring-purple-500/40 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg border ${node.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{node.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-purple-400 flex items-center justify-between">
                      <span>{node.throughput}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 3: Memory & Gate */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-bold px-1">
                3. Memory & HITL Gate
              </div>
              {nodes.filter(n => n.col === 3).map(node => {
                const Icon = node.icon;
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 ring-2 ring-purple-500/40 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg border ${node.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{node.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400 flex items-center justify-between">
                      <span>{node.throughput}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 4: Outputs */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-1">
                4. Action Execution
              </div>
              {nodes.filter(n => n.col === 4).map(node => {
                const Icon = node.icon;
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 ring-2 ring-purple-500/40 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg border ${node.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{node.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                      <span>{node.throughput}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${currentNodeDetails.accent}`}>
              <currentNodeDetails.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{currentNodeDetails.title}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                  {currentNodeDetails.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">{currentNodeDetails.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Latency: <strong className="text-emerald-400">12ms</strong>
            </span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Errors: <strong className="text-slate-200">0.00%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
