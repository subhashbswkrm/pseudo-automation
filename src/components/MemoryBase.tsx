import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Search, 
  Sparkles, 
  Brain, 
  Layers, 
  Tag, 
  Cpu, 
  BookOpen, 
  Terminal,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ApiError, searchMemory } from '../api';

export const MemoryBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [memoryRecords, setMemoryRecords] = useState([
    {
      id: 'mem-9401',
      type: 'Semantic Vector',
      cluster: 'Sponsorship Negotiations',
      snippet: 'Hackathon Tier 1 ($10,000) packages include keynote slots, custom workshop tracks, and direct resume book access.',
      similarity: 0.94,
      updated: '10 mins ago',
      agent: 'Context Agent'
    },
    {
      id: 'mem-9402',
      type: 'Behavioral Rule',
      cluster: 'Tone & Policy Guardrail',
      snippet: 'Never auto-send emails with financial figures above $1,000 without triggering the Human-in-the-Loop Quarantine Gate.',
      similarity: 0.98,
      updated: '1 hour ago',
      agent: 'Verifier Agent'
    },
    {
      id: 'mem-9403',
      type: 'Episodic Memory',
      cluster: 'Previous Hackathon Feedback',
      snippet: 'Previous AWS representative requested 48-hour advance notice for mentor table allocations.',
      similarity: 0.88,
      updated: 'Yesterday',
      agent: 'Memory Base'
    },
    {
      id: 'mem-9404',
      type: 'Semantic Vector',
      cluster: 'Participant Support QA',
      snippet: 'Hardware lab distribution starts at 9:00 AM on Saturday at Booth B4. Arduino & ESP32 kits require student ID deposit.',
      similarity: 0.92,
      updated: '3 hours ago',
      agent: 'Interpreter Agent'
    }
  ]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      searchMemory(searchQuery)
        .then(records => {
          if (active) {
            setMemoryRecords(records);
            setApiError(null);
          }
        })
        .catch((error: unknown) => {
          if (active) setApiError(error instanceof ApiError ? error.message : 'Could not search memory.');
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Episodic & Vector Memory Base
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              QDRANT COLLECTION: #pseudo-memory-v2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Durable agent memory store with optional OpenAI embeddings and lexical-search fallback.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            Dimensions: <strong className="text-purple-400">1,536 (text-embedding-3-small)</strong>
          </div>
        </div>
      </div>

      {/* Memory Search & Records */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vector embeddings or semantic concepts (e.g., 'sponsorship tiers', 'safety rules')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {apiError && (
          <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-xs text-rose-200">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {memoryRecords.map((record) => (
            <div 
              key={record.id} 
              className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-purple-500/40 transition-colors group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {record.type}
                </span>
                {searchQuery && <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {(record.similarity * 100).toFixed(0)}% Match
                </span>}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white mb-1">{record.cluster}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                  "{record.snippet}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>By {record.agent}</span>
                <span>{record.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
