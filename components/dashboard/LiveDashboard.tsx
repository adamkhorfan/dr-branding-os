"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight, CheckCircle2, Clock, Layers,
  TrendingUp, Users, Workflow as WorkflowIcon, CalendarClock,
} from "lucide-react";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function LiveDashboard() {
  const { clients, loaded: cL, load: lC } = useClientsStore();
  const { items, loaded: iL, load: lI } = useContentStore();
  const { campaigns, loaded: caL, load: lCa } = useCampaignsStore();
  const { instances, loaded: wL, load: lW } = useWorkflowsStore();

  useEffect(() => {
    if (!cL) lC();
    if (!iL) lI();
    if (!caL) lCa();
    if (!wL) lW();
  }, [cL, iL, caL, wL, lC, lI, lCa, lW]);

  const pending = useMemo(() => items.filter((i) => i.status === "in-review"), [items]);
  const activeWorkflows = useMemo(
    () => instances.filter((w) => w.status === "in-progress" || w.status === "pending-approval").slice(0, 4),
    [instances],
  );
  const activeCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "live" || c.status === "in-production"),
    [campaigns],
  );
  const publishedThisMonth = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return items.filter((i) => i.status === "published" && i.createdAt.startsWith(thisMonth)).length;
  }, [items]);

  const kpis = [
    { label: "Active Clients", value: clients.filter((c) => c.status === "active").length },
    { label: "Workflows Running", value: activeWorkflows.length, hint: "in-progress" },
    { label: "Pending Approvals", value: pending.length, hint: "awaiting review" },
    { label: "Published This Month", value: publishedThisMonth, unit: "" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-sm text-fg-muted">{todayLabel()}</div>
          <h1 className="text-display text-3xl tracking-tighter2 text-fg mt-1">
            {greeting()}, Adam.
          </h1>
          <p className="text-sm text-fg-muted mt-1">
            {clients.length} clients · {pending.length} approvals waiting · {activeCampaigns.length} campaigns live.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/workflows" className="gap-1.5">
              <WorkflowIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              Workflows
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/clients" className="gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={2} />
              Clients
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Active workflows + Pending approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Active Workflows"
          description="Live runs across your clients"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/workflows" className="gap-1 text-fg-muted">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          }
        >
          {activeWorkflows.length === 0 ? (
            <div className="px-6 py-8 text-sm text-fg-subtle text-center">
              No active workflows — <Link href="/workflows" className="text-accent hover:underline">launch one</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {activeWorkflows.map((w) => (
                <li key={w.id} className="flex items-center gap-4 px-6 py-4 hover:bg-bg-elevated/40 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-inset shrink-0">
                    <Layers className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-fg truncate">{w.definitionKey}</div>
                    <div className="text-xs text-fg-subtle mt-0.5">{w.currentStepId ?? "—"}</div>
                  </div>
                  <Badge variant={w.status === "pending-approval" ? "warning" : "info"}>
                    {w.status === "pending-approval" ? "Approval" : "Running"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Pending Approvals"
          description="Waiting on review"
          bodyClassName="p-0"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/content-studio" className="gap-1 text-fg-muted">
                View <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          }
        >
          {pending.length === 0 ? (
            <div className="px-6 py-8 text-sm text-fg-subtle text-center">All clear.</div>
          ) : (
            <ul className="divide-y divide-border">
              {pending.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-6 py-3.5">
                  <Clock className="h-4 w-4 text-warning shrink-0" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg truncate">{item.title ?? item.type}</div>
                    <div className="text-xs text-fg-subtle">{item.platforms?.[0] ?? item.type}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Stats snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Active Campaigns" description={`${activeCampaigns.length} running`} bodyClassName="p-0">
          {activeCampaigns.length === 0 ? (
            <div className="px-6 py-8 text-sm text-fg-subtle text-center">
              No active campaigns — <Link href="/campaign-builder" className="text-accent hover:underline">create one</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {activeCampaigns.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg truncate">{c.name}</div>
                    <div className="text-xs text-fg-subtle">{c.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="This Month" description="Snapshot" className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: CheckCircle2, label: "Published", value: publishedThisMonth, tone: "success" as const },
              { icon: CalendarClock, label: "Scheduled", value: items.filter((i) => i.status === "scheduled").length, tone: "info" as const },
              { icon: TrendingUp, label: "In Review", value: pending.length, tone: "accent" as const },
            ].map(({ icon: Icon, label, value, tone }) => {
              const cls = tone === "success" ? "text-success" : tone === "info" ? "text-info" : "text-accent";
              return (
                <div key={label} className="flex flex-col items-center gap-2 p-4 bg-bg-inset rounded-lg">
                  <Icon className={`h-5 w-5 ${cls}`} strokeWidth={1.75} />
                  <div className={`text-2xl font-bold ${cls}`}>{value}</div>
                  <div className="text-xs text-fg-subtle">{label}</div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
