import type { Client } from "@/types/client";
import type { ContentItem } from "@/types/content";
import type { Campaign } from "@/types/campaign";
import type { WorkflowInstance } from "@/types/workflow";
import type { Report } from "@/types/report";

interface ContextData {
  clients: Client[];
  items: ContentItem[];
  campaigns: Campaign[];
  instances: WorkflowInstance[];
  reports: Report[];
}

export function buildOsContext(data: ContextData): string {
  const { clients, items, campaigns, instances, reports } = data;

  const activeClients = clients.filter((c) => c.status === "active");
  const pending = items.filter((i) => i.status === "in-review");
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "live" || c.status === "in-production",
  );
  const activeWorkflows = instances.filter(
    (w) => w.status === "in-progress" || w.status === "pending-approval",
  );
  const thisMonth = new Date().toISOString().slice(0, 7);
  const publishedThisMonth = items.filter(
    (i) => i.status === "published" && i.createdAt.startsWith(thisMonth),
  );

  const lines: string[] = [
    `### Agency Overview`,
    `- Total clients: ${clients.length} (${activeClients.length} active, ${clients.filter((c) => c.status === "archived").length} archived)`,
    `- Total content items: ${items.length}`,
    `- Pending approvals: ${pending.length}`,
    `- Published this month: ${publishedThisMonth.length}`,
    `- Active campaigns: ${activeCampaigns.length}`,
    `- Active workflow runs: ${activeWorkflows.length}`,
    ``,
    `### Clients`,
  ];

  for (const client of clients) {
    const clientContent = items.filter((i) => i.clientId === client.id);
    const clientCampaigns = campaigns.filter((c) => c.clientId === client.id);
    const clientPending = clientContent.filter((i) => i.status === "in-review");
    lines.push(
      `- **${client.name}** [${client.status}] · Industry: ${client.industry || "—"} · Content: ${clientContent.length} · Pending: ${clientPending.length} · Campaigns: ${clientCampaigns.length}`,
    );
    if (client.brief?.positioning) {
      lines.push(`  Positioning: ${client.brief.positioning.slice(0, 120)}`);
    }
  }

  if (activeCampaigns.length > 0) {
    lines.push(``, `### Active Campaigns`);
    for (const c of activeCampaigns) {
      const clientName = clients.find((cl) => cl.id === c.clientId)?.name ?? c.clientId;
      lines.push(`- **${c.name}** (${clientName}) · Status: ${c.status} · Objective: ${c.objective || "—"}`);
    }
  }

  if (activeWorkflows.length > 0) {
    lines.push(``, `### Active Workflow Runs`);
    for (const w of activeWorkflows) {
      lines.push(`- ${w.definitionKey} · Status: ${w.status} · Step: ${w.currentStepId ?? "—"}`);
    }
  }

  if (pending.length > 0) {
    lines.push(``, `### Pending Approvals`);
    for (const item of pending.slice(0, 10)) {
      const clientName = clients.find((c) => c.id === item.clientId)?.name ?? item.clientId;
      lines.push(`- "${item.title ?? item.type}" (${clientName}) · Type: ${item.type}`);
    }
  }

  if (reports.length > 0) {
    lines.push(``, `### Recent Reports (last 5)`);
    for (const r of reports.slice(-5)) {
      const clientName = clients.find((c) => c.id === r.clientId)?.name ?? r.clientId;
      lines.push(`- ${clientName} · ${r.month}`);
    }
  }

  return lines.join("\n");
}
