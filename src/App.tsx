import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { ActivityFeed } from './components/ActivityFeed';
import { ApprovalGate } from './components/ApprovalGate';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { IntegrationsHub } from './components/IntegrationsHub';
import { MemoryBase } from './components/MemoryBase';
import { AIAgentPanel } from './components/AIAgentPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { 
  TabType, 
  ActivityItem, 
  ApprovalTask, 
  LoopStep 
} from './types';
import {
  ApiError,
  decideApproval,
  getActivities,
  getApprovals,
  getBackendHealth,
  getDashboardMetrics,
  simulateWorkflow,
  DashboardMetrics,
} from './api';
import { ShieldAlert, Zap, Layers, Sparkles, Database, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<LoopStep>('Decide');
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'ok' | 'degraded' | 'unavailable'>('connecting');

  // Approval tasks state
  const [tasks, setTasks] = useState<ApprovalTask[]>([
    {
      id: 'TASK-9081',
      title: 'Drafted Email to Hackathon Sponsor',
      category: 'Email Outbound',
      riskLevel: 'high',
      targetEntity: 'sponsorship@cloudscale-ai.io',
      confidenceScore: 85,
      aiReasoning: 'Matches previous sponsorship templates with 85% vector similarity. Involves commitment of Platinum Keynote slots ($7,500), exceeding auto-dispatch limits.',
      timestamp: 'Just now',
      agent: 'Action Agent (n8n node #12)',
      draftContent: {
        recipient: 'sponsorship@cloudscale-ai.io',
        subject: 'Partnership Proposal: DevHacks 2026 Title Sponsorship',
        body: `Hi Alex,

Thank you for reaching out regarding partnership opportunities for DevHacks 2026. 

Based on CloudScale's developer tooling focus, we have reserved a Tier-1 Platinum Sponsorship slot for your team. This includes:
• 30-minute Mainstage Keynote session
• Dedicated Mentor Booth at Hall 4
• Direct resume access to 1,200+ verified AI developers
• Customized CloudScale API challenge with $3,000 track prize

You can view our formal sponsorship deck and execute agreement through our portal. Looking forward to partnering!

Best regards,
The DevHacks Organizing Team`
      },
      policyChecks: [
        { rule: 'Anti-Hallucination Vector Check', passed: true },
        { rule: 'Budget Allocation Guardrail (<$10k)', passed: true },
        { rule: 'Tone & Sentiment (Professional)', passed: true },
        { rule: 'Outbound Cold Email Quarantine', passed: false } // triggers HITL
      ],
      status: 'pending'
    },
    {
      id: 'TASK-9082',
      title: 'Elevate Participant to Track Mentor (DB Mutation)',
      category: 'Database Mutation',
      riskLevel: 'critical',
      targetEntity: 'PostgreSQL: users.role (uid: 8492)',
      confidenceScore: 79,
      aiReasoning: 'Scout Agent detected ticket #4092 requesting mentor privileges. Since this grants access to private judging scoreboards, manual confirmation is enforced.',
      timestamp: '12 mins ago',
      agent: 'Decision Engine (n8n node #07)',
      draftContent: {
        payloadDiff: [
          { field: 'role', oldVal: '"attendee"', newVal: '"track_mentor"' },
          { field: 'permissions', oldVal: '["submit_project"]', newVal: '["submit_project", "judge_eval", "private_chat"]' },
          { field: 'verified_by_organizer', oldVal: 'false', newVal: 'true' }
        ]
      },
      policyChecks: [
        { rule: 'Zero Trust Access Rule', passed: false },
        { rule: 'Identity Verification Match', passed: true },
        { rule: 'Discord Handle Match', passed: true }
      ],
      status: 'pending'
    },
    {
      id: 'TASK-9083',
      title: 'Stripe Refund Trigger: Duplicate Registration Ticket',
      category: 'Financial Action',
      riskLevel: 'high',
      targetEntity: 'Stripe API: ch_3N8xYkL90',
      confidenceScore: 92,
      aiReasoning: 'Participant accidentally purchased two hacker badges within 4 minutes. Matches automated refund heuristic, but payment gateway trigger requires operator signoff.',
      timestamp: '28 mins ago',
      agent: 'Action Agent',
      draftContent: {
        recipient: 'finance@devhacks.com',
        subject: 'Authorize Refund: Charge #ch_3N8xYkL90 ($45.00 USD)',
        body: 'Charge ID: ch_3N8xYkL90\nAmount: $45.00 USD\nReason: Duplicate checkout within 4m\nUser: priya.patel@cs.university.edu'
      },
      policyChecks: [
        { rule: 'Duplicate Checkout Window (<10m)', passed: true },
        { rule: 'Cardholder Match', passed: true },
        { rule: 'Financial Dissemination Gate', passed: false }
      ],
      status: 'pending'
    }
  ]);

  // Live activities state
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'ACT-101',
      timestamp: '18:54:12',
      step: 'Collect',
      agent: 'Scout Agent',
      agentRole: 'scout',
      action: 'Processing Gmail payload #8492',
      details: 'Scraped raw MIME email from sponsorship@cloudscale-ai.io. Extracted 4 token fragments.',
      status: 'completed',
      latencyMs: 98
    },
    {
      id: 'ACT-102',
      timestamp: '18:54:13',
      step: 'Understand',
      agent: 'Interpreter Agent',
      agentRole: 'interpreter',
      action: 'Intent Classification: Partnership Ingestion',
      details: 'Identified entity: "CloudScale AI", category: "Tier 1 Platinum Request", sentiment: 0.94 positive.',
      status: 'completed',
      latencyMs: 184
    },
    {
      id: 'ACT-103',
      timestamp: '18:54:14',
      step: 'Decide',
      agent: 'Context Agent',
      agentRole: 'context',
      action: 'Matching Vectors in Qdrant',
      details: 'Retrieved 3 previous sponsorship email templates (85% cosine similarity). Risk score evaluated: HIGH.',
      status: 'needs_approval',
      latencyMs: 142
    },
    {
      id: 'ACT-104',
      timestamp: '18:53:50',
      step: 'Act',
      agent: 'Action Agent',
      agentRole: 'action',
      action: 'Dispatched Discord Notification',
      details: 'Sent webhook message to #organizers channel: "New sponsor inquiry registered".',
      status: 'completed',
      latencyMs: 65
    },
    {
      id: 'ACT-105',
      timestamp: '18:53:51',
      step: 'Verify',
      agent: 'Verifier Agent',
      agentRole: 'verifier',
      action: 'Pre-flight Policy & Schema Check',
      details: 'Evaluated SPF/DKIM headers & guardrail limits. Passed 3/4 rules.',
      status: 'completed',
      latencyMs: 44
    },
    {
      id: 'ACT-106',
      timestamp: '18:53:52',
      step: 'Remember',
      agent: 'Memory Base',
      agentRole: 'memory',
      action: 'Persisted to Episodic Cluster',
      details: 'Saved interaction state to memory collection #pseudo-memory-v2.',
      status: 'completed',
      latencyMs: 112
    }
  ]);

  const [apiError, setApiError] = useState<string | null>(null);

  const refreshBackendState = async () => {
    const [serverTasks, serverActivities, serverMetrics, health] = await Promise.all([
      getApprovals(),
      getActivities(),
      getDashboardMetrics(),
      getBackendHealth(),
    ]);
    setTasks(serverTasks);
    setActivities(serverActivities);
    setDashboardMetrics(serverMetrics);
    setBackendStatus(health.status);
    if (serverActivities[0]) setCurrentStep(serverActivities[0].step);
  };

  useEffect(() => {
    void refreshBackendState().catch((error: unknown) => {
      setBackendStatus('unavailable');
      setApiError(error instanceof ApiError ? error.message : 'Could not load backend data.');
    });
  }, []);

  // Handle Approvals
  const handleApprove = async (
    taskId: string,
    draftContent?: ApprovalTask['draftContent'],
  ): Promise<ApprovalTask> => {
    setApiError(null);
    let result: ApprovalTask | null = null;
    let operationError: unknown;
    try {
      result = await decideApproval(taskId, 'approve', undefined, draftContent);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Could not approve this action.');
      operationError = error;
    } finally {
      try {
        await refreshBackendState();
      } catch (error) {
        setApiError(error instanceof ApiError ? error.message : 'Could not refresh backend data.');
        operationError ??= error;
      }
    }
    if (operationError) throw operationError;
    if (!result) throw new Error('The backend did not return the updated approval.');
    return result;
  };

  const handleReject = async (taskId: string, feedback?: string): Promise<void> => {
    setApiError(null);
    let operationError: unknown;
    try {
      await decideApproval(taskId, 'reject', feedback);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Could not reject this action.');
      operationError = error;
    } finally {
      try {
        await refreshBackendState();
      } catch (error) {
        setApiError(error instanceof ApiError ? error.message : 'Could not refresh backend data.');
        operationError ??= error;
      }
    }
    if (operationError) throw operationError;
  };

  const triggerSimulatedPipeline = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setApiError(null);
    try {
      const result = await simulateWorkflow();
      for (const activity of result) {
        setCurrentStep(activity.step);
        setActivities(previous => [activity, ...previous]);
        await new Promise(resolve => window.setTimeout(resolve, 900));
      }
      await refreshBackendState();
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Could not run the workflow simulation.');
      try {
        await refreshBackendState();
      } catch (refreshError) {
        setApiError(refreshError instanceof ApiError ? refreshError.message : 'Could not refresh backend data.');
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const pendingApprovalsCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Cyber Background Glow Elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Responsive Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTab={activeTab} 
          onSimulateEvent={triggerSimulatedPipeline}
          isSimulating={isSimulating}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {apiError && (
            <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-sm text-rose-200">
              Backend connection issue: {apiError}
            </div>
          )}
          {/* Main Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-purple-950/20 p-5 shadow-2xl shadow-purple-950/15">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Operations snapshot</p>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">What the automation is doing right now</h2>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-mono font-semibold uppercase ${
                      backendStatus === 'ok'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                        : backendStatus === 'degraded'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        backendStatus === 'ok' ? 'bg-emerald-400 animate-pulse' :
                        backendStatus === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      {backendStatus === 'ok' ? 'API healthy' :
                        backendStatus === 'degraded' ? 'API degraded' :
                          backendStatus === 'connecting' ? 'Connecting' : 'API unavailable'}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: 'Needs attention',
                        value: `${pendingApprovalsCount}`,
                        tone: 'amber',
                        description: 'Waiting for human review',
                      },
                      {
                        label: 'In motion',
                        value: `${dashboardMetrics?.inMotion ?? 0}`,
                        tone: 'cyan',
                        description: 'Autonomous actions running',
                      },
                      {
                        label: 'Completed events',
                        value: `${dashboardMetrics?.completedEvents ?? 0}`,
                        tone: 'emerald',
                        description: 'Successfully processed',
                      },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${
                            item.tone === 'amber' ? 'bg-amber-400' : item.tone === 'cyan' ? 'bg-cyan-400' : 'bg-emerald-400'
                          }`} />
                        </div>
                        <div className="mt-3 text-3xl font-black tracking-tight text-white font-mono">{item.value}</div>
                        <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Next best action</p>
                  <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <div className="flex items-center gap-2 text-rose-300">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">Requires approval</span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-white">Sponsor email draft is queued for review.</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      AI matched the sponsorship template and found a high-risk outbound email that requires a human decision before sending.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:opacity-95"
                  >
                    Review queued actions
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Today’s execution timeline</p>
                      <h3 className="mt-1 text-lg font-bold text-white">What happened, what is happening, and what is next</h3>
                    </div>
                    <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[10px] font-mono uppercase text-slate-300">Live audit</span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {[
                      { label: '10:32 AM', title: 'CVs collected', detail: 'Google Drive → Recruitment Workflow', status: 'done' },
                      { label: '10:35 AM', title: 'CVs analyzed', detail: '248 documents processed • 42 candidates matched', status: 'done' },
                      { label: '10:41 AM', title: '42 candidates shortlisted', detail: 'Waiting for review', status: 'pending' },
                      { label: '10:45 AM', title: 'Sponsor email drafted', detail: 'Waiting for approval', status: 'review' },
                    ].map((event) => (
                      <div key={event.label} className="relative flex gap-4 pl-2">
                        <div className="flex flex-col items-center">
                          <span className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                            event.status === 'done' ? 'bg-emerald-400' : event.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                          {event.label !== '10:45 AM' && <span className="mt-2 h-full w-px bg-slate-800" />}
                        </div>
                        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-mono text-slate-400">{event.label}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${
                              event.status === 'done' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : event.status === 'pending' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            }`}>
                              {event.status === 'done' ? 'Completed' : event.status === 'pending' ? 'Pending' : 'Review'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white">{event.title}</p>
                          <p className="mt-1 text-xs text-slate-400">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Context summary</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { title: 'What happened', body: 'Candidate CVs were collected and processed with the recruitment workflow.', accent: 'emerald' },
                      { title: 'What needs attention', body: 'Human approval is required before outbound email and elevated permissions actions.', accent: 'amber' },
                      { title: 'What happens next', body: 'Approved actions will dispatch to Gmail, Slack, and the recruitment database.', accent: 'purple' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5">
                        <div className={`mb-2 inline-flex h-2 w-12 rounded-full ${
                          item.accent === 'emerald' ? 'bg-emerald-400' : item.accent === 'amber' ? 'bg-amber-400' : 'bg-purple-400'
                        }`} />
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Metric Cards */}
              <MetricCards 
                pendingCount={pendingApprovalsCount}
                completedCount={dashboardMetrics?.completedEvents ?? 0}
                eventCount={dashboardMetrics?.totalEvents ?? 0}
                onNavigateToApprovals={() => setActiveTab('approvals')}
              />

              {/* Live Activity Feed with 6-step loop in action */}
              <ActivityFeed 
                activities={activities}
                currentActiveStep={currentStep}
              />

              {/* Quick Preview of the Human-in-the-Loop Quarantine */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Quarantined Action Gate (Human-in-the-Loop Preview)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All Queued Actions ({pendingApprovalsCount}) →
                  </button>
                </div>
                <ApprovalGate 
                  tasks={tasks}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            </div>
          )}

          {/* Full Approvals Tab */}
          {activeTab === 'approvals' && (
            <div className="animate-in fade-in duration-300">
              <ApprovalGate 
                tasks={tasks}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          )}

          {/* Workflows Tab */}
          {activeTab === 'workflows' && (
            <div className="animate-in fade-in duration-300">
              <WorkflowVisualizer />
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="animate-in fade-in duration-300">
              <IntegrationsHub />
            </div>
          )}

          {/* AI Agent Tab */}
          {activeTab === 'agent' && (
            <div className="animate-in fade-in duration-300">
              <AIAgentPanel />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-300">
              <SettingsPanel />
            </div>
          )}

          {/* Memory Base Tab */}
          {activeTab === 'memory' && (
            <div className="animate-in fade-in duration-300">
              <MemoryBase />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
