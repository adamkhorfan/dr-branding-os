import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  Users,
  Workflow as WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard · DR Branding OS" };

const KPIS = [
  { label: "Active Clients", value: 8, delta: 12, hint: "vs last month" },
  { label: "Workflows Running", value: 14, delta: 4, hint: "across all clients" },
  { label: "Pending Approvals", value: 3, delta: -25, hint: "down from 4" },
  { label: "Content Published", value: 47, unit: "/mo", delta: 18, hint: "MTD" },
];

const ACTIVE_WORKFLOWS = [
  {
    client: "Atelier Noir",
    workflow: "Weekly Content Production",
    stage: "AI Drafting",
    progress: "Step 3 of 6",
    status: "in-progress" as const,
  },
  {
    client: "Maison Élan",
    workflow: "Reel Production",
    stage: "Awaiting Approval",
    progress: "Step 5 of 7",
    status: "pending-approval" as const,
  },
  {
    client: "Verde & Co.",
    workflow: "Monthly Report",
    stage: "Generating insights",
    progress: "Step 2 of 4",
    status: "in-progress" as const,
  },
  {
    client: "Lumen Studio",
    workflow: "New Client Onboarding",
    stage: "Brand intake",
    progress: "Step 1 of 8",
    status: "draft" as const,
  },
];

const TODAY = [
  { time: "09:30", title: "Atelier Noir — Reel review call", type: "meeting" },
  { time: "11:00", title: "Maison Élan — content batch due", type: "deadline" },
  { time: "14:00", title: "Verde & Co. — monthly report send", type: "deliverable" },
  { time: "16:30", title: "Lumen Studio — strategy kickoff", type: "meeting" },
];

const PENDING_APPROVALS = [
  { client: "Maison Élan", item: "Reel — Spring drop teaser", waited: "4h" },
  { client: "Atelier Noir", item: "Carousel — Fall lookbook", waited: "1d" },
  { client: "Verde & Co.", item: "Caption — Product launch", waited: "2d" },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Wednesday, May 6"
        title="Good morning, Adam."
        description="Eight clients in motion. Three approvals waiting. Here's what matters today."
        actions={
          <>
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
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Active workflows + Today */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Active Workflows"
          description="Live runs across your clients"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/workflows" className="gap-1 text-fg-muted">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {ACTIVE_WORKFLOWS.map((w, i) => (
              <li
                key={i}
                className="flex items-center gap-4 px-6 py-4 hover:bg-bg-elevated/40 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-inset shrink-0">
                  <Layers
                    className="h-4 w-4 text-fg-subtle"
                    strokeWidth={1.75}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg truncate">
                      {w.workflow}
                    </span>
                    <span className="text-2xs text-fg-subtle">·</span>
                    <span className="text-xs text-fg-muted truncate">
                      {w.client}
                    </span>
                  </div>
                  <div className="text-xs text-fg-subtle mt-0.5 tabular">
                    {w.stage} · {w.progress}
                  </div>
                </div>
                <Badge
                  variant={
                    w.status === "in-progress"
                      ? "info"
                      : w.status === "pending-approval"
                        ? "warning"
                        : "outline"
                  }
                >
                  {w.status === "in-progress"
                    ? "Running"
                    : w.status === "pending-approval"
                      ? "Approval"
                      : "Draft"}
                </Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Today"
          description="Wed, May 6"
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {TODAY.map((t, i) => (
              <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                <div className="flex flex-col items-center pt-0.5 w-12 shrink-0">
                  <span className="text-xs font-medium text-fg tabular">
                    {t.time}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-fg leading-snug">{t.title}</div>
                  <div className="text-2xs uppercase tracking-[0.08em] text-fg-subtle mt-1">
                    {t.type}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Pending approvals + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Pending Approvals"
          description="Waiting on the client"
          className="lg:col-span-2"
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {PENDING_APPROVALS.map((p, i) => (
              <li
                key={i}
                className="flex items-center gap-4 px-6 py-3.5"
              >
                <Clock className="h-4 w-4 text-warning shrink-0" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-fg truncate">{p.item}</div>
                  <div className="text-xs text-fg-subtle">{p.client}</div>
                </div>
                <span className="text-xs text-fg-muted tabular">
                  waiting {p.waited}
                </span>
                <Button variant="ghost" size="sm">
                  Nudge
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="This Week" description="Snapshot">
          <div className="space-y-4">
            <Stat
              icon={CheckCircle2}
              label="Approved"
              value="12"
              tone="success"
            />
            <Stat
              icon={CalendarClock}
              label="Scheduled"
              value="9"
              tone="info"
            />
            <Stat icon={TrendingUp} label="Engagement" value="+23%" tone="accent" />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  tone: "success" | "info" | "accent";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "info"
        ? "text-info"
        : "text-accent";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 ${toneClass}`} strokeWidth={1.75} />
        <span className="text-sm text-fg-muted">{label}</span>
      </div>
      <span className="text-sm font-medium text-fg tabular">{value}</span>
    </div>
  );
}
