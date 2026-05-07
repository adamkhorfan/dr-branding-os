export interface GlobalMetrics {
  totalClients: number;
  totalContent: number;
  totalCampaigns: number;
  totalWorkflows: number;
  totalMessages: number;
  contentThisMonth: number;
  activeCampaigns: number;
  completedWorkflows: number;
  pendingApprovals: number;
}

export interface ClientMetrics {
  clientId: string;
  clientName: string;
  contentCount: number;
  campaignCount: number;
  workflowCount: number;
  messageCount: number;
  lastActivity: string | null;
  contentByType: Record<string, number>;
}

export interface ContentVelocityPoint {
  label: string; // e.g. "Jan", "Feb"
  count: number;
}

export interface ActivityItem {
  id: string;
  type: "content" | "campaign" | "workflow" | "message" | "report";
  label: string;
  clientName?: string;
  timestamp: string;
}
