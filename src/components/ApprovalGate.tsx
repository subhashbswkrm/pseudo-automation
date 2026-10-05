import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Mail, 
  Database, 
  CreditCard, 
  Sliders, 
  AlertTriangle, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Check, 
  X, 
  Send,
  Brain,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { ApprovalTask } from '../types';

interface ApprovalGateProps {
  tasks: ApprovalTask[];
  onApprove: (
    taskId: string,
    draftContent?: ApprovalTask['draftContent'],
  ) => Promise<ApprovalTask>;
  onReject: (taskId: string, feedback?: string) => Promise<void>;
}

export const ApprovalGate: React.FC<ApprovalGateProps> = ({ 
  tasks, 
  onApprove, 
  onReject 
}) => {
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(tasks[0] || null);
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [editedEmailBody, setEditedEmailBody] = useState<string>('');
  const [rejectFeedback, setRejectFeedback] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedTask?.draftContent?.body) {
      setEditedEmailBody(selectedTask.draftContent.body);
    }
  }, [selectedTask]);

  React.useEffect(() => {
    setSelectedTask(current => (
      tasks.find(task => task.id === current?.id) || tasks[0] || null
    ));
  }, [tasks]);

  const handleApproveAction = async (taskId: string) => {
    setActionErrorMessage(null);
    try {
      const draftContent = selectedTask?.draftContent?.body
        ? { ...selectedTask.draftContent, body: editedEmailBody }
        : selectedTask?.draftContent;
      const updatedTask = await onApprove(taskId, draftContent);
      setActionSuccessMessage(
        `Task ${taskId} approved. Execution state: ${updatedTask.executionStatus || 'awaiting dispatch'}.`,
      );
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (error) {
      setActionErrorMessage(error instanceof Error ? error.message : 'Approval request failed.');
    }
  };

  const handleRejectConfirm = async () => {
    if (selectedTask) {
      setActionErrorMessage(null);
      try {
        await onReject(selectedTask.id, rejectFeedback);
        setShowRejectModal(false);
        setRejectFeedback('');
        setActionSuccessMessage(`Task ${selectedTask.id} rejection was recorded.`);
        setTimeout(() => setActionSuccessMessage(null), 4000);
      } catch (error) {
        setActionErrorMessage(error instanceof Error ? error.message : 'Rejection request failed.');
      }
    }
  };

  const getRiskBadge = (risk: ApprovalTask['riskLevel']) => {
    switch (risk) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getCategoryIcon = (category: ApprovalTask['category']) => {
    switch (category) {
      case 'Email Outbound':
        return <Mail className="w-4 h-4 text-purple-400" />;
      case 'Database Mutation':
        return <Database className="w-4 h-4 text-cyan-400" />;
      case 'Financial Action':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sliders className="w-4 h-4 text-amber-400" />;
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const resolvedTasks = tasks.filter(t => t.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Alert banner for security */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/60 border border-rose-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Human-in-the-Loop (HITL) Execution Quarantine
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                ZERO UNINTENDED SIDE-EFFECTS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Autonomous agents are restricted from performing irreversible external actions (e.g. sending outbound sponsorship emails or executing database mutations) without explicit human confirmation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Pending Items</span>
            <span className="text-xl font-mono font-extrabold text-rose-400">{pendingTasks.length} Awaiting</span>
          </div>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}
      {actionErrorMessage && (
        <div role="alert" className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-mono">
          {actionErrorMessage}
        </div>
      )}

      {/* Main Grid: Task Selector List (Left) + Detailed Inspection Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Action Queue ({pendingTasks.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Sorted by Priority</span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-200">All High-Risk Tasks Cleared</h3>
              <p className="text-xs text-slate-400 mt-1">The system is running completely autonomously with zero quarantined gates.</p>
            </div>
          ) : (
            pendingTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsEditingDraft(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900/90 border-purple-500/80 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/40'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    task.riskLevel === 'critical' ? 'bg-rose-500' :
                    task.riskLevel === 'high' ? 'bg-amber-500' : 'bg-yellow-500'
                  }`} />

                  <div className="flex items-center justify-between gap-2 mb-2 pl-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(task.category)}
                      <span className="text-xs font-mono text-slate-300 font-medium">
                        {task.category}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getRiskBadge(task.riskLevel)}`}>
                      {task.riskLevel} Risk
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white pl-2 group-hover:text-purple-300 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 pl-2 line-clamp-2">
                    {task.aiReasoning}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 pl-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {task.confidenceScore}% Confidence
                    </span>
                    <span className="text-slate-400 text-[11px]">{task.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}

          {/* Resolved History Section */}
          {resolvedTasks.length > 0 && (
            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1 block mb-2">
                Recently Resolved ({resolvedTasks.length})
              </span>
              <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                {resolvedTasks.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-900/30 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-300 font-medium truncate max-w-[200px]">{t.title}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                      t.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Interactive Approval Gate Card */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getRiskBadge(selectedTask.riskLevel)}`}>
                      {selectedTask.riskLevel} RISK ACTION
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Dispatched by {selectedTask.agent}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedTask.title}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Target Entity</div>
                  <div className="text-xs font-mono text-purple-400 font-semibold">
                    {selectedTask.targetEntity}
                  </div>
                </div>
              </div>

              {/* AI Reasoning Section (HIGHLIGHTED) */}
              <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/30 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-300 uppercase tracking-wide">
                    <Brain className="w-4 h-4 text-purple-400" />
                    Autonomous Reasoning & Trace Analysis
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-400">Confidence Score:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {selectedTask.confidenceScore}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
                  <span className="text-purple-300 font-semibold font-mono">Reason: </span>
                  {selectedTask.aiReasoning}
                </p>

                {/* Progress bar visual for confidence */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${selectedTask.confidenceScore}%` }}
                  />
                </div>

                {/* Policy Checks checklist */}
                <div className="pt-2 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  {selectedTask.policyChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate">{check.rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Draft Preview (Email or Payload Diff) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Generated Action Payload / Content Preview
                  </span>

                  {selectedTask.draftContent?.body && (
                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingDraft ? 'Cancel Editing' : 'Edit Draft'}
                    </button>
                  )}
                </div>

                {/* Email Draft Box */}
                {selectedTask.draftContent?.body && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                    <div className="flex flex-col gap-1 text-xs border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono w-16">To:</span>
                        <span className="text-slate-200 font-mono">{selectedTask.draftContent.recipient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono w-16">Subject:</span>
                        <span className="text-slate-100 font-semibold">{selectedTask.draftContent.subject}</span>
                      </div>
                    </div>

                    {isEditingDraft ? (
                      <div>
                        <label className="text-[11px] font-mono text-purple-300 mb-1 block">
                          Modify Draft Body Before Executing:
                        </label>
                        <textarea
                          rows={6}
                          value={editedEmailBody}
                          onChange={(e) => setEditedEmailBody(e.target.value)}
                          className="w-full p-3 rounded-lg bg-slate-900 border border-purple-500/40 text-xs text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                        {editedEmailBody || selectedTask.draftContent.body}
                      </div>
                    )}
                  </div>
                )}

                {/* Payload Diff Box (if Database mutation) */}
                {selectedTask.draftContent?.payloadDiff && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <div className="text-xs font-mono text-slate-400 mb-2">Staged Database Schema Mutation:</div>
                    <div className="space-y-1.5 font-mono text-xs">
                      {selectedTask.draftContent.payloadDiff.map((diff, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-slate-900/80 border border-slate-800">
                          <span className="text-purple-400 w-24 font-bold">{diff.field}:</span>
                          <span className="text-rose-400 line-through bg-rose-950/40 px-1.5 py-0.5 rounded text-[11px]">{diff.oldVal}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded text-[11px]">{diff.newVal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CRITICAL ACTIONS: Two Prominent Buttons */}
              <div className="pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Approval is recorded; n8n dispatch requires a configured webhook</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Reject / Edit Button (Red) */}
                  <button
                    disabled={selectedTask.status !== 'pending'}
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/60 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-rose-950/30 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Reject / Edit</span>
                  </button>

                  {/* Approve & Execute Button (Green - Prominent) */}
                  <button
                    disabled={selectedTask.status !== 'pending'}
                    onClick={() => void handleApproveAction(selectedTask.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/25 border border-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Approve Action</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              Select a task from the queue to view AI reasoning and authorize execution.
            </div>
          )}
        </div>
      </div>

      {/* Reject & Provide Feedback Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-rose-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Reject & Send Feedback to Agent
              </div>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Why are you rejecting this proposed action? The Interpreter & Context Agents will refine their vector memory and re-generate the action.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Tone is too informal; increase sponsorship ask to $5,000; verify if sponsor already replied on LinkedIn..."
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleRejectConfirm()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
