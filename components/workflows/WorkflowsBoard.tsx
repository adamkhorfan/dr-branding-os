"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/shared/KpiCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { useClientsStore } from "@/store/useClientsStore";
import { WORKFLOW_DEFINITIONS } from "@/lib/workflows/definitions";
import { WorkflowCard } from "./WorkflowCard";
import { LaunchDialog } from "./LaunchDialog";

type Filter = "all" | "in-progress" | "pending-approval" | "completed" | "archived";

export function WorkflowsBoard() {
  const { instances, loaded, load } = useWorkflowsStore();
  const { clients, loaded: clientsLoaded, load: loadClients } = useClientsStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [launchOpen, setLaunchOpen] = useState(false);

  useEffect(() => {
    if (!loaded) load();
    if (!clientsLoaded) loadClients();
  }, [loaded, load, clientsLoaded, loadClients]);

  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients],
  );

  const filtered = useMemo(() => {
    let list = instances;
    if (filter !== "all") list = list.filter((i) => i.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => {
        const client = clientMap.get(i.clientId);
        const def = WORKFLOW_DEFINITIONS[i.definitionKey];
        return (
          client?.name.toLowerCase().includes(q) ||
          def?.name.toLowerCase().includes(q) ||
          i.definitionKey.includes(q)
        );
      });
    }
    return list;
  }, [instances, filter, query, clientMap]);

  const counts = useMemo(
    () => ({
      all: instances.length,
      "in-progress": instances.filter((i) => i.status === "in-progress").length,
      "pending-approval": instances.filter((i) => i.status === "pending-approval").length,
      completed: instances.filter((i) => i.status === "completed").length,
      archived: instances.filter((i) => i.status === "archived").length,
    }),
    [instances],
  );

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "in-progress", label: "Running" },
    { key: "pending-approval", label: "Approval" },
    { key: "completed", label: "Done" },
    { key: "archived", label: "Archived" },
  ];

  const isLoading = !loaded || !clientsLoaded;

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total workflows" value={counts.all} />
        <KpiCard label="Running" value={counts["in-progress"]} />
        <KpiCard label="Awaiting approval" value={counts["pending-approval"]} />
        <KpiCard label="Completed" value={counts.completed} />
      </div>

      {/* Board */}
      <div className="surface">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border px-6 py-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle"
              strokeWidth={1.75}
            />
            <Input
              placeholder="Search by client or workflow type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1 rounded-md border border-border bg-bg-inset p-1 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-2.5 h-7 rounded text-xs font-medium whitespace-nowrap transition-colors tabular shrink-0",
                  filter === f.key
                    ? "bg-bg-surface text-fg shadow-soft"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {f.label}{" "}
                <span className="text-fg-subtle">({counts[f.key]})</span>
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setLaunchOpen(true)}
            className="gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Launch workflow
          </Button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Workflow}
            title={
              instances.length === 0
                ? "No workflows yet"
                : "No workflows match this view"
            }
            description={
              instances.length === 0
                ? "Launch your first workflow to start tracking repeatable production runs across clients."
                : "Try a different filter or clear the search."
            }
            action={
              instances.length === 0 && (
                <Button
                  size="sm"
                  onClick={() => setLaunchOpen(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  Launch first workflow
                </Button>
              )
            }
            className="border-0"
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((inst) => (
              <WorkflowCard
                key={inst.id}
                instance={inst}
                client={clientMap.get(inst.clientId)}
                definition={WORKFLOW_DEFINITIONS[inst.definitionKey]}
              />
            ))}
          </div>
        )}
      </div>

      <LaunchDialog open={launchOpen} onOpenChange={setLaunchOpen} />
    </>
  );
}
