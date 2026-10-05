import { ActivityItem, ApprovalTask, IntegrationApp } from './types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export interface DashboardMetrics {
  pendingApprovals: number;
  inMotion: number;
  completedEvents: number;
  totalEvents: number;
  activePipelines: number;
}

export interface BackendHealth {
  status: 'ok' | 'degraded';
  dependencies: Record<string, string>;
  vectorSearch: boolean;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('The backend API is unavailable. Start the API service and try again.');
  }

  if (!response.ok) {
    let message = `Backend request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body.detail === 'string') message = body.detail;
    } catch {
      // Keep the status-based error when the server did not return JSON.
    }
    throw new ApiError(message);
  }

  return response.json() as Promise<T>;
}

function localizeTimestamp<T extends { timestamp: string }>(item: T): T {
  const parsed = new Date(item.timestamp);
  return {
    ...item,
    timestamp: Number.isNaN(parsed.valueOf()) ? item.timestamp : parsed.toLocaleString(),
  };
}

export async function getApprovals(): Promise<ApprovalTask[]> {
  const tasks = await request<ApprovalTask[]>('/approvals');
  return tasks.map(localizeTimestamp);
}

export async function getActivities(): Promise<ActivityItem[]> {
  const activities = await request<ActivityItem[]>('/activities');
  return activities.map(localizeTimestamp);
}

export function getDashboardMetrics(): Promise<DashboardMetrics> {
  return request<DashboardMetrics>('/dashboard');
}

export function getBackendHealth(): Promise<BackendHealth> {
  return request<BackendHealth>('/health');
}

export async function decideApproval(
  taskId: string,
  decision: 'approve' | 'reject',
  feedback?: string,
  draftContent?: ApprovalTask['draftContent'],
): Promise<ApprovalTask> {
  const task = await request<ApprovalTask>(
    `/approvals/${encodeURIComponent(taskId)}/decision`,
    {
      method: 'POST',
      body: JSON.stringify({ decision, feedback, draft_content: draftContent }),
    },
  );
  return localizeTimestamp(task);
}

export async function simulateWorkflow(): Promise<ActivityItem[]> {
  const activities = await request<ActivityItem[]>('/workflows/simulate', {
    method: 'POST',
  });
  return activities.map(localizeTimestamp);
}

export function getIntegrations(): Promise<IntegrationApp[]> {
  return request<IntegrationApp[]>('/integrations');
}

export function updateIntegration(
  id: string,
  dataIngestionActive: boolean,
): Promise<IntegrationApp> {
  return request<IntegrationApp>(`/integrations/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ data_ingestion_active: dataIngestionActive }),
  });
}

export function searchMemory(query: string): Promise<Array<{
  id: string;
  type: string;
  cluster: string;
  snippet: string;
  similarity: number;
  updated: string;
  agent: string;
}>> {
  return request<Array<{
    id: string;
    type: string;
    cluster: string;
    snippet: string;
    similarity: number;
    updated: string;
    agent: string;
  }>>(`/memory?q=${encodeURIComponent(query)}`).then(records => records.map(record => {
    const parsed = new Date(record.updated);
    return {
      ...record,
      updated: Number.isNaN(parsed.valueOf()) ? record.updated : parsed.toLocaleString(),
    };
  }));
}
