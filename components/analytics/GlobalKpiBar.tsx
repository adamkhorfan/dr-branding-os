"use client";

import type { GlobalMetrics } from "@/types/analytics";
import {
  Users,
  FileText,
  Megaphone,
  GitBranch,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface KpiTileProps {
  icon: React.ElementType;
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
}

function KpiTile({ icon: Icon, label, value, sub, accent }: KpiTileProps) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${accent ? "text-[#c9a96e]" : "text-white/40"}`} />
        <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">
          {label}
        </span>
      </div>
      <div className={`text-3xl font-bold ${accent ? "text-[#c9a96e]" : "text-white"}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-white/30">{sub}</div>}
    </div>
  );
}

export function GlobalKpiBar({ metrics }: { metrics: GlobalMetrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <KpiTile icon={Users} label="Clients" value={metrics.totalClients} />
      <KpiTile icon={FileText} label="Content" value={metrics.totalContent} sub={`${metrics.contentThisMonth} this month`} accent />
      <KpiTile icon={Megaphone} label="Campaigns" value={metrics.totalCampaigns} sub={`${metrics.activeCampaigns} active`} />
      <KpiTile icon={GitBranch} label="Workflows" value={metrics.totalWorkflows} sub={`${metrics.completedWorkflows} done`} />
      <KpiTile icon={MessageSquare} label="Messages" value={metrics.totalMessages} />
      <KpiTile icon={Clock} label="This Month" value={metrics.contentThisMonth} accent />
      <KpiTile icon={CheckCircle2} label="Completed" value={metrics.completedWorkflows} />
      <KpiTile icon={AlertCircle} label="Pending" value={metrics.pendingApprovals} sub="awaiting review" />
    </div>
  );
}
