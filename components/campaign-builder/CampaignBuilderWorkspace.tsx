"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Megaphone,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useClientsStore } from "@/store/useClientsStore";
import { CampaignFormDialog } from "./CampaignFormDialog";
import type { Campaign, CampaignStatus } from "@/types/campaign";

const STATUS_VARIANT: Record<
  CampaignStatus,
  "default" | "accent" | "success" | "warning" | "danger" | "info" | "outline"
> = {
  planning: "outline",
  "in-production": "info",
  live: "accent",
  completed: "success",
  archived: "default",
};

const STATUS_LABEL: Record<CampaignStatus, string> = {
  planning: "Planning",
  "in-production": "In Production",
  live: "Live",
  completed: "Completed",
  archived: "Archived",
};

const STATUS_ORDER: CampaignStatus[] = [
  "planning",
  "in-production",
  "live",
  "completed",
  "archived",
];

function dateStr(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CampaignBuilderWorkspace() {
  const { campaigns, loaded, load, remove, toggleMilestone, setStatus } = useCampaignsStore();
  const { clients } = useClientsStore();
  const [filterClient, setFilterClient] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const filtered = filterClient
    ? campaigns.filter((c) => c.clientId === filterClient)
    : campaigns;

  const total = campaigns.length;
  const active = campaigns.filter((c) => c.status === "in-production" || c.status === "live").length;
  const planning = campaigns.filter((c) => c.status === "planning").length;
  const completed = campaigns.filter((c) => c.status === "completed").length;

  function clientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.name ?? "—";
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Campaigns" value={total} />
        <KpiCard label="Active" value={active} />
        <KpiCard label="Planning" value={planning} />
        <KpiCard label="Completed" value={completed} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <ClientSelector
          value={filterClient}
          onChange={setFilterClient}
          className="min-w-[200px]"
        />
        {filterClient && (
          <button
            onClick={() => setFilterClient("")}
            className="text-xs text-fg-muted hover:text-fg transition-colors"
          >
            Clear filter
          </button>
        )}
        <div className="flex-1" />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Campaign
        </Button>
      </div>

      {/* Campaign list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start planning multi-asset launches."
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Campaign
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              clientName={clientName(campaign.clientId)}
              expanded={expanded === campaign.id}
              onExpand={() => setExpanded(expanded === campaign.id ? null : campaign.id)}
              onRemove={() => remove(campaign.id)}
              onToggleMilestone={(msId) => toggleMilestone(campaign.id, msId)}
              onStatusChange={(s) => setStatus(campaign.id, s)}
            />
          ))}
        </div>
      )}

      <CampaignFormDialog open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  clientName: string;
  expanded: boolean;
  onExpand: () => void;
  onRemove: () => void;
  onToggleMilestone: (id: string) => void;
  onStatusChange: (s: CampaignStatus) => void;
}

function CampaignCard({
  campaign,
  clientName,
  expanded,
  onExpand,
  onRemove,
  onToggleMilestone,
  onStatusChange,
}: CampaignCardProps) {
  const doneMs = campaign.milestones.filter((m) => m.done).length;
  const totalMs = campaign.milestones.length;

  return (
    <div className="surface rounded-lg border border-border overflow-hidden">
      {/* Header row */}
      <button
        onClick={onExpand}
        className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated/40 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-medium text-fg">{campaign.name}</span>
            <Badge variant={STATUS_VARIANT[campaign.status]}>
              {STATUS_LABEL[campaign.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-fg-subtle flex-wrap">
            <span>{clientName}</span>
            {campaign.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateStr(campaign.startDate)}
                {campaign.endDate ? ` → ${dateStr(campaign.endDate)}` : ""}
              </span>
            )}
            {campaign.budget && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {campaign.budget.toLocaleString()}
              </span>
            )}
            {totalMs > 0 && (
              <span>
                {doneMs}/{totalMs} milestones
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded text-fg-subtle hover:text-danger hover:bg-bg-elevated transition-colors shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4 bg-bg-inset/40">
          {campaign.objective && (
            <p className="text-sm text-fg-muted">{campaign.objective}</p>
          )}

          {/* Status changer */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-fg-subtle">Status:</span>
            {STATUS_ORDER.filter((s) => s !== "archived").map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className={cn(
                  "text-2xs uppercase tracking-wider px-2 py-1 rounded border transition-colors",
                  campaign.status === s
                    ? "border-accent/50 bg-accent/8 text-accent"
                    : "border-border text-fg-subtle hover:text-fg hover:bg-bg-elevated",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          {/* Milestones */}
          {campaign.milestones.length > 0 && (
            <div>
              <div className="text-xs font-medium text-fg-muted mb-2">Milestones</div>
              <ul className="space-y-1.5">
                {campaign.milestones.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => onToggleMilestone(m.id)}
                  >
                    {m.done ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-fg-subtle shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        m.done ? "line-through text-fg-subtle" : "text-fg-muted group-hover:text-fg",
                      )}
                    >
                      {m.title}
                    </span>
                    {m.dueDate && (
                      <span className="ml-auto text-xs text-fg-subtle tabular">
                        {dateStr(m.dueDate)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {campaign.milestones.length === 0 && (
            <p className="text-xs text-fg-subtle italic">
              No milestones added yet. Use the Campaign API to add milestones, or expand this UI in a future build.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
