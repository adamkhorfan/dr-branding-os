"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Lightbulb,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useReportsStore } from "@/store/useReportsStore";
import { generateReport } from "@/lib/studio/reportGenerator";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import type { Report } from "@/types/report";

function monthOptions(): { value: string; label: string }[] {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
}

export function ReportsWorkspace() {
  const [clientId, setClientId] = useState("");
  const [month, setMonth] = useState(monthOptions()[0].value);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { clients, loaded: cLoaded, load: cLoad } = useClientsStore();
  const { items, loaded: iLoaded, load: iLoad } = useContentStore();
  const { instances, loaded: wLoaded, load: wLoad } = useWorkflowsStore();
  const { campaigns, loaded: caLoaded, load: caLoad } = useCampaignsStore();
  const { reports, loaded: rLoaded, load: rLoad, save, remove } = useReportsStore();

  useEffect(() => {
    if (!cLoaded) cLoad();
    if (!iLoaded) iLoad();
    if (!wLoaded) wLoad();
    if (!caLoaded) caLoad();
    if (!rLoaded) rLoad();
  }, [cLoaded, iLoaded, wLoaded, caLoaded, rLoaded, cLoad, iLoad, wLoad, caLoad, rLoad]);

  const client = clients.find((c) => c.id === clientId);

  async function handleGenerate() {
    if (!client) return;
    setGenerating(true);
    const data = generateReport(client, month, items, instances, campaigns);
    const report = await save(data);
    setExpandedId(report.id);
    setGenerating(false);
  }

  const clientReports = reports
    .filter((r) => !clientId || r.clientId === clientId)
    .sort((a, b) => b.month.localeCompare(a.month));

  const months = monthOptions();

  return (
    <div className="space-y-6">
      {/* Generator panel */}
      <SectionCard title="Generate Report" bodyClassName="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Client</label>
            <ClientSelector value={clientId} onChange={setClientId} className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-bg-base text-sm text-fg px-3 focus:outline-none focus:border-accent/50 transition-colors"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerate}
              disabled={!clientId || generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <BarChart3 className="h-3.5 w-3.5 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-fg-subtle">
          Reports are built from real data in the system — content created, workflows completed, and active campaigns.
        </p>
      </SectionCard>

      {/* Reports list */}
      {clientReports.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No reports yet"
          description="Select a client and month, then click Generate to produce your first report."
        />
      ) : (
        <div className="space-y-3">
          {clientReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              clientName={clients.find((c) => c.id === report.clientId)?.name ?? "—"}
              clientId={report.clientId}
              expanded={expandedId === report.id}
              onToggle={() => setExpandedId(expandedId === report.id ? null : report.id)}
              onRemove={() => remove(report.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReportCardProps {
  report: Report;
  clientName: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  clientId: string;
}

function ReportCard({ report, clientName, expanded, onToggle, onRemove, clientId }: ReportCardProps) {
  const monthLabel = new Date(report.month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated/40 transition-colors"
      >
        <BarChart3 className="h-4 w-4 text-fg-subtle shrink-0" strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-medium text-fg">{monthLabel} Report</span>
            <span className="text-xs text-fg-subtle">·</span>
            <span className="text-xs text-fg-muted">{clientName}</span>
          </div>
          <div className="text-xs text-fg-subtle mt-0.5">
            {report.kpis[0]?.value ?? 0} content items · Generated {new Date(report.generatedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <ReportExportButton reportId={report.id} clientId={clientId} />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded text-fg-subtle hover:text-danger hover:bg-bg-elevated transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-fg-subtle" />
          ) : (
            <ChevronDown className="h-4 w-4 text-fg-subtle" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-bg-inset/30 px-5 py-5 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {report.kpis.map((kpi) => (
              <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} />
            ))}
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-accent" strokeWidth={1.75} />
              <h3 className="text-xs font-semibold text-fg uppercase tracking-wider">Highlights</h3>
            </div>
            <ul className="space-y-2">
              {report.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-fg-muted leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" strokeWidth={1.75} />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Content summary */}
          {report.contentSummary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-info" strokeWidth={1.75} />
                <h3 className="text-xs font-semibold text-fg uppercase tracking-wider">Content Summary</h3>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed">{report.contentSummary}</p>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-warning" strokeWidth={1.75} />
              <h3 className="text-xs font-semibold text-fg uppercase tracking-wider">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {report.recommendations.map((r, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-2.5 text-sm leading-relaxed",
                    "text-fg-muted",
                  )}
                >
                  <span className="text-warning shrink-0 font-bold">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
