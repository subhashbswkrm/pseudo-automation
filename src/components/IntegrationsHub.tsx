import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  HardDrive, 
  Calendar, 
  MessageSquare, 
  Database, 
  Code2, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Lock, 
  Zap, 
  ArrowUpRight 
} from 'lucide-react';
import { IntegrationApp } from '../types';
import { ApiError, getIntegrations, updateIntegration } from '../api';

export const IntegrationsHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationApp[]>([
    {
      id: 'gmail',
      name: 'Gmail Suite',
      category: 'Sensory Email Ingestion',
      icon: 'mail',
      connected: true,
      lastSynced: '2 mins ago',
      eventsProcessed: 1420,
      dataIngestionActive: true,
      description: 'Autonomous scanning for sponsorship inquiries, vendor invoices, and participant support tickets.'
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      category: 'Document Knowledge Base',
      icon: 'drive',
      connected: true,
      lastSynced: '14 mins ago',
      eventsProcessed: 890,
      dataIngestionActive: true,
      description: 'Embeds pitch decks, sponsorship tier PDFs, and organizer guideline docs into vector memory.'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      category: 'Schedule & Reminders',
      icon: 'calendar',
      connected: true,
      lastSynced: 'Just now',
      eventsProcessed: 320,
      dataIngestionActive: true,
      description: 'Autonomous scheduling, meeting room booking, and organizer conflict resolution.'
    },
    {
      id: 'slack',
      name: 'Slack Workspace',
      category: 'Internal Team Hub',
      icon: 'slack',
      connected: true,
      lastSynced: '1 min ago',
      eventsProcessed: 4310,
      dataIngestionActive: true,
      description: 'Real-time alert relay, #hitl-approvals bot channel, and natural language command parsing.'
    },
    {
      id: 'postgres',
      name: 'PostgreSQL DB',
      category: 'Primary State Store',
      icon: 'database',
      connected: true,
      lastSynced: 'Live stream',
      eventsProcessed: 12840,
      dataIngestionActive: true,
      description: 'Transactional state tracking, participant registration records, and audit trace logs.'
    },
    {
      id: 'github',
      name: 'GitHub Repos',
      category: 'Code & Dev Tasks',
      icon: 'github',
      connected: false,
      lastSynced: 'Disconnected',
      eventsProcessed: 0,
      dataIngestionActive: false,
      description: 'Automated PR triage, issue label synchronization, and release notes compilation.'
    }
  ]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getIntegrations()
      .then(items => {
        if (active) {
          setIntegrations(items);
          setApiError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) setApiError(error instanceof ApiError ? error.message : 'Could not load integrations.');
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleIngestion = async (app: IntegrationApp) => {
    setApiError(null);
    try {
      const updated = await updateIntegration(app.id, !app.dataIngestionActive);
      setIntegrations(previous => previous.map(item => item.id === updated.id ? updated : item));
      setApiError(null);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Could not update ingestion settings.');
    }
  };

  const getAppIcon = (icon: string) => {
    switch (icon) {
      case 'mail':
        return <Mail className="w-5 h-5 text-red-400" />;
      case 'drive':
        return <HardDrive className="w-5 h-5 text-yellow-400" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-cyan-400" />;
      case 'github':
        return <Code2 className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Connected Ingestion Hub
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {integrations.filter(app => app.dataIngestionActive).length} ACTIVE PIPELINES
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle active real-time data ingestion for autonomous Scout Agents and n8n webhook listeners.
          </p>
        </div>

        <button
          disabled
          title="Configure external connector credentials before syncing."
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 self-start sm:self-auto cursor-not-allowed opacity-60"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync All Connectors</span>
        </button>
      </div>

      {apiError && (
        <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-xs text-rose-200">
          {apiError}
        </div>
      )}

      {/* Grid of connected apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((app) => (
          <div
            key={app.id}
            className={`rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              app.dataIngestionActive
                ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 shadow-lg shadow-emerald-950/10'
                : 'bg-slate-900/40 border-slate-800/60 opacity-70'
            }`}
          >
            <div>
              {/* Header with App Icon and Toggle Switch */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {getAppIcon(app.icon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{app.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{app.category}</span>
                  </div>
                </div>

                {/* Cyber Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {app.dataIngestionActive ? (
                      <span className="text-emerald-400">LIVE</span>
                    ) : (
                      <span className="text-slate-500">PAUSED</span>
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label={`${app.dataIngestionActive ? 'Pause' : 'Enable'} ingestion for ${app.name}`}
                    disabled={!app.connected}
                    onClick={() => void toggleIngestion(app)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      app.dataIngestionActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 justify-end shadow-md shadow-emerald-500/30' 
                        : 'bg-slate-800 justify-start'
                    } ${app.connected ? '' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                {app.description}
              </p>
            </div>

            {/* App Footer Metrics */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-purple-400" />
                {app.eventsProcessed.toLocaleString()} events
              </span>
              <span className="text-slate-400 text-[11px]">{app.lastSynced}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
