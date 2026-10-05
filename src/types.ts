export type TabType = 'dashboard' | 'integrations' | 'agent' | 'approvals' | 'settings' | 'workflows' | 'memory';

export type LoopStep = 'Collect' | 'Understand' | 'Decide' | 'Act' | 'Verify' | 'Remember';

export interface ActivityItem {
  id: string;
  timestamp: string;
  step: LoopStep;
  agent: string;
  agentRole: 'scout' | 'interpreter' | 'context' | 'decision' | 'action' | 'verifier' | 'memory';
  action: string;
  details: string;
  status: 'completed' | 'in_progress' | 'queued' | 'needs_approval';
  latencyMs: number;
}

export interface ApprovalTask {
  id: string;
  title: string;
  category: 'Email Outbound' | 'Database Mutation' | 'Financial Action' | 'System Config';
  riskLevel: 'critical' | 'high' | 'medium';
  targetEntity: string;
  confidenceScore: number;
  aiReasoning: string;
  timestamp: string;
  agent: string;
  draftContent: {
    subject?: string;
    recipient?: string;
    body?: string;
    payloadDiff?: {
      field: string;
      oldVal: string;
      newVal: string;
    }[];
  };
  policyChecks: {
    rule: string;
    passed: boolean;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  executionStatus?: string;
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: string;
  icon: string;
  connected: boolean;
  lastSynced: string;
  eventsProcessed: number;
  dataIngestionActive: boolean;
  description: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'trigger' | 'agent' | 'router' | 'action';
  status: 'active' | 'processing' | 'idle';
  meta: string;
  x: number;
  y: number;
}
