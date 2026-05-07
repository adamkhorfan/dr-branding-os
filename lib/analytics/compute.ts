import type { Client } from "@/types/client";
import type { ContentItem } from "@/types/content";
import type { Campaign } from "@/types/campaign";
import type { WorkflowInstance } from "@/types/workflow";
import type { MessageThread } from "@/types/message";
import type {
  GlobalMetrics,
  ClientMetrics,
  ContentVelocityPoint,
  ActivityItem,
} from "@/types/analytics";

export function computeGlobalMetrics(
  clients: Client[],
  content: ContentItem[],
  campaigns: Campaign[],
  workflows: WorkflowInstance[],
  threads: MessageThread[],
): GlobalMetrics {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return {
    totalClients: clients.length,
    totalContent: content.length,
    totalCampaigns: campaigns.length,
    totalWorkflows: workflows.length,
    totalMessages: threads.reduce((sum, t) => sum + t.messages.length, 0),
    contentThisMonth: content.filter((c) => c.createdAt.startsWith(thisMonth)).length,
    activeCampaigns: campaigns.filter((c) => c.status === "live" || c.status === "in-production").length,
    completedWorkflows: workflows.filter((w) => w.status === "completed").length,
    pendingApprovals: content.filter((c) => c.status === "in-review").length,
  };
}

export function computeClientMetrics(
  clients: Client[],
  content: ContentItem[],
  campaigns: Campaign[],
  workflows: WorkflowInstance[],
  threads: MessageThread[],
): ClientMetrics[] {
  return clients.map((client) => {
    const clientContent = content.filter((c) => c.clientId === client.id);
    const clientCampaigns = campaigns.filter((c) => c.clientId === client.id);
    const clientWorkflows = workflows.filter((w) => w.clientId === client.id);
    const clientThreads = threads.filter((t) => t.clientId === client.id);

    const contentByType: Record<string, number> = {};
    clientContent.forEach((c) => {
      contentByType[c.type] = (contentByType[c.type] ?? 0) + 1;
    });

    const allTimestamps = [
      ...clientContent.map((c) => c.createdAt),
      ...clientCampaigns.map((c) => c.createdAt),
      ...clientWorkflows.map((w) => w.createdAt),
      ...clientThreads.map((t) => t.lastMessageAt),
    ].filter(Boolean).sort().reverse();

    return {
      clientId: client.id,
      clientName: client.name,
      contentCount: clientContent.length,
      campaignCount: clientCampaigns.length,
      workflowCount: clientWorkflows.length,
      messageCount: clientThreads.reduce((sum, t) => sum + t.messages.length, 0),
      lastActivity: allTimestamps[0] ?? null,
      contentByType,
    };
  });
}

export function computeContentVelocity(content: ContentItem[]): ContentVelocityPoint[] {
  const monthMap: Record<string, number> = {};
  const now = new Date();

  // Build last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short" });
    monthMap[key] = 0;
    void label;
  }

  content.forEach((c) => {
    const key = c.createdAt.slice(0, 7);
    if (key in monthMap) monthMap[key]++;
  });

  return Object.entries(monthMap).map(([key, count]) => {
    const [year, month] = key.split("-");
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleString("default", {
      month: "short",
    });
    return { label, count };
  });
}

export function computeActivityFeed(
  clients: Client[],
  content: ContentItem[],
  campaigns: Campaign[],
  workflows: WorkflowInstance[],
  threads: MessageThread[],
): ActivityItem[] {
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const items: ActivityItem[] = [
    ...content.slice(-20).map((c) => ({
      id: c.id,
      type: "content" as const,
      label: `Content created: ${c.title ?? c.type}`,
      clientName: clientMap[c.clientId],
      timestamp: c.createdAt,
    })),
    ...campaigns.slice(-10).map((c) => ({
      id: c.id,
      type: "campaign" as const,
      label: `Campaign: ${c.name}`,
      clientName: clientMap[c.clientId],
      timestamp: c.createdAt,
    })),
    ...workflows.slice(-10).map((w) => ({
      id: w.id,
      type: "workflow" as const,
      label: `Workflow: ${w.definitionKey}`,
      clientName: clientMap[w.clientId],
      timestamp: w.createdAt,
    })),
    ...threads.slice(-10).map((t) => ({
      id: t.id,
      type: "message" as const,
      label: `Thread: ${t.subject}`,
      clientName: clientMap[t.clientId],
      timestamp: t.lastMessageAt,
    })),
  ];

  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 30);
}
