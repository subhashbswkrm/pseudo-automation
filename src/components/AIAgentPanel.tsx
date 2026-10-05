import React, { useMemo, useState } from 'react';
import {
  AudioLines,
  Bot,
  CheckCircle2,
  ChevronRight,
  MessageSquareText,
  Mic,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react';

export const AIAgentPanel: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'voice' | 'manual'>('text');
  const [prompt, setPrompt] = useState('Get all candidate CVs from Gmail and Google Drive, analyze them, and put shortlisted candidates into our recruitment database.');

  const toneOptions = useMemo(() => [
    'Get candidate CVs from Gmail and Google Drive',
    'Send completed reports to Slack',
    'Only process emails with CV attachments',
    'Change where the candidate data comes from',
  ], []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              <h2 className="text-base font-bold tracking-tight text-white">AI Agent Control Center</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Natural language orchestration for workflow and data source changes.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
            {[
              { id: 'text', label: 'Text', icon: MessageSquareText },
              { id: 'voice', label: 'Voice', icon: Mic },
              { id: 'manual', label: 'Manual', icon: SlidersHorizontal },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id as 'text' | 'voice' | 'manual')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  mode === id
                    ? 'bg-purple-500/15 text-purple-200 ring-1 ring-purple-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Live Command
            </div>
            {mode === 'voice' && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono font-bold uppercase text-emerald-300">
                <AudioLines className="h-3 w-3" />
                Listening
              </div>
            )}
          </div>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={6}
            className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-purple-500/60 focus:outline-none"
            placeholder="Tell the AI agent what you want it to change..."
          />

          <div className="flex flex-wrap gap-2">
            {toneOptions.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => setPrompt(text)}
                className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-purple-500/60 hover:text-white"
              >
                {text}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Wand2 className="h-4 w-4 text-purple-400" />
              AI will review the request and translate it into workflow changes.
            </div>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:opacity-95"
            >
              Apply Configuration
            </button>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Configuration Preview</h3>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-300">
              Safe Preview
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Input Sources</div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Gmail
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Google Drive
              </div>
            </div>

            <div>
              <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Processing</div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> CV extraction
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Candidate matching
              </div>
            </div>

            <div>
              <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Output</div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Recruitment Database
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Parameters</div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {['Experience ≥ 3 years', 'Skills: React, JavaScript', 'Match score ≥ 75%', 'Location: India'].map((label) => (
                <span key={label} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-purple-200">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15">
              Apply Configuration
            </button>
            <button type="button" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600">
              Edit
            </button>
            <button type="button" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent AI Activity</h3>
          <button type="button" className="text-[11px] font-mono text-purple-400 hover:text-purple-300">
            View conversation <ChevronRight className="ml-1 inline h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            {
              user: 'User',
              text: 'Get the CVs from Gmail instead of Google Drive.',
              ai: 'AI Agent',
              reply: 'Updated the pipeline to prioritize Gmail ingestion for all new CV payloads.',
            },
            {
              user: 'User',
              text: 'Only process emails with CV attachments.',
              ai: 'AI Agent',
              reply: 'Added a filter to only process documents with .pdf, .docx, and .doc attachment types.',
            },
          ].map((message) => (
            <div key={message.text} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                <span>{message.user}</span>
                <span>{message.ai}</span>
              </div>
              <p className="text-sm text-slate-200">{message.text}</p>
              <p className="mt-2 text-xs text-slate-400">→ {message.reply}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
