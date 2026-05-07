/**
 * Generates a Report from real data already in the system.
 * No AI — pure aggregation of contentStore + workflowsStore + campaignsStore.
 */

import type { Client } from "@/types/client";
import type { ContentItem } from "@/types/content";
import type { WorkflowInstance } from "@/types/workflow";
import type { Campaign } from "@/types/campaign";
import type { Report, ReportKpi } from "@/types/report";

function inMonth(isoDate: string, month: string): boolean {
  return isoDate.startsWith(month);
}

export function generateReport(
  client: Client,
  month: string, // YYYY-MM
  allContent: ContentItem[],
  allWorkflows: WorkflowInstance[],
  allCampaigns: Campaign[],
): Omit<Report, "id" | "createdAt" | "updatedAt" | "generatedAt"> {
  const content = allContent.filter(
    (i) => i.clientId === client.id && inMonth(i.createdAt, month),
  );
  const workflows = allWorkflows.filter(
    (w) => w.clientId === client.id && inMonth(w.createdAt, month),
  );
  const campaigns = allCampaigns.filter((c) => c.clientId === client.id);

  // ─── KPIs ──────────────────────────────────────────────────────────────────
  const totalContent = content.length;
  const approved = content.filter((i) => i.status === "approved" || i.status === "published").length;
  const drafts = content.filter((i) => i.status === "draft").length;
  const workflowsCompleted = workflows.filter((w) => w.status === "completed").length;
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "in-production" || c.status === "live",
  ).length;

  const kpis: ReportKpi[] = [
    { label: "Content Created", value: totalContent },
    { label: "Approved / Published", value: approved },
    { label: "Drafts Remaining", value: drafts },
    { label: "Workflows Completed", value: workflowsCompleted },
    { label: "Active Campaigns", value: activeCampaigns },
  ];

  // ─── Content breakdown ─────────────────────────────────────────────────────
  const byType: Record<string, number> = {};
  for (const item of content) {
    byType[item.type] = (byType[item.type] ?? 0) + 1;
  }
  const typeBreakdown = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${n} ${t}${n !== 1 ? "s" : ""}`)
    .join(", ");

  // ─── Highlights ────────────────────────────────────────────────────────────
  const highlights: string[] = [];

  if (totalContent > 0) {
    highlights.push(
      `${totalContent} content item${totalContent !== 1 ? "s" : ""} created this month${typeBreakdown ? ` (${typeBreakdown})` : ""}.`,
    );
  } else {
    highlights.push("No content was created this month — consider scheduling a content sprint.");
  }

  if (approved > 0) {
    const pct = Math.round((approved / Math.max(totalContent, 1)) * 100);
    highlights.push(`${approved} item${approved !== 1 ? "s" : ""} approved or published (${pct}% approval rate).`);
  }

  if (workflowsCompleted > 0) {
    highlights.push(
      `${workflowsCompleted} workflow${workflowsCompleted !== 1 ? "s" : ""} completed — production pipeline is running.`,
    );
  }

  if (activeCampaigns > 0) {
    highlights.push(`${activeCampaigns} active campaign${activeCampaigns !== 1 ? "s" : ""} in progress.`);
  }

  const platforms = new Set<string>();
  for (const item of content) {
    for (const p of item.platforms ?? []) platforms.add(p);
  }
  if (platforms.size > 0) {
    highlights.push(`Platforms covered: ${[...platforms].join(", ")}.`);
  }

  if (client.brandKit.toneOfVoice) {
    highlights.push(`All content aligned with "${client.brandKit.toneOfVoice}" tone of voice.`);
  }

  // ─── Content summary ───────────────────────────────────────────────────────
  const contentSummary =
    totalContent === 0
      ? `No content was produced for ${client.name} in ${month}. The studio pipelines are ready — schedule a content batch for next month.`
      : `This month, ${client.name}'s content library grew by ${totalContent} item${totalContent !== 1 ? "s" : ""}. ` +
        (typeBreakdown ? `The mix included ${typeBreakdown}. ` : "") +
        (approved > 0
          ? `${approved} item${approved !== 1 ? "s" : ""} reached approved or published status. `
          : "Content is still in draft — move items through review to maximize impact. ") +
        (platforms.size > 0 ? `Distribution covered ${[...platforms].join(", ")}.` : "");

  // ─── Recommendations ───────────────────────────────────────────────────────
  const recommendations: string[] = [];

  if (drafts > 0) {
    recommendations.push(
      `Review and approve ${drafts} draft item${drafts !== 1 ? "s" : ""} still in the pipeline.`,
    );
  }

  if (totalContent === 0) {
    recommendations.push("Schedule a content sprint — use the Content Studio or Carousel Studio to batch-produce assets.");
  } else if (totalContent < 4) {
    recommendations.push("Increase output frequency — aim for at least 4–6 content pieces per month per client.");
  }

  if (!platforms.has("instagram") && !platforms.has("tiktok")) {
    recommendations.push("Consider adding short-form video content (Reels/TikTok) to the content mix for broader reach.");
  }

  if (workflowsCompleted === 0 && workflows.length > 0) {
    recommendations.push("Complete any open workflows to keep the production cycle moving.");
  }

  if (client.brief.offers.length === 0) {
    recommendations.push("Fill in the client's offers in their Brief section to improve content targeting.");
  }

  if (activeCampaigns === 0 && campaigns.length === 0) {
    recommendations.push("Create a campaign in the Campaign Builder to structure next month's content around a clear objective.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Production is on track. Maintain the current cadence and explore new content formats.");
  }

  return {
    clientId: client.id,
    month,
    kpis,
    highlights,
    contentSummary,
    recommendations,
  };
}
