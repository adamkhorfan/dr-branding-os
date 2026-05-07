"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { useClientsStore } from "@/store/useClientsStore";
import { ClientRow } from "./ClientRow";
import { OnboardingWizard } from "./onboarding/OnboardingWizard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "paused" | "archived";

export function ClientsBoard() {
  const { clients, loaded, load, archive, restore, remove } = useClientsStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const filtered = useMemo(() => {
    let list = clients;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.brief.positioning?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [clients, filter, query]);

  function handleDelete(id: string) {
    if (typeof window !== "undefined") {
      if (!window.confirm("Delete this client? This cannot be undone.")) return;
    }
    remove(id);
  }

  const counts = useMemo(
    () => ({
      all: clients.length,
      active: clients.filter((c) => c.status === "active").length,
      paused: clients.filter((c) => c.status === "paused").length,
      archived: clients.filter((c) => c.status === "archived").length,
    }),
    [clients],
  );

  return (
    <>
      <div className="surface">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border px-6 py-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle"
              strokeWidth={1.75}
            />
            <Input
              placeholder="Search by name, industry, positioning…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-bg-inset p-1">
            {(["all", "active", "paused", "archived"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 h-7 rounded text-xs font-medium capitalize transition-colors tabular",
                  filter === f
                    ? "bg-bg-surface text-fg shadow-soft"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {f} <span className="text-fg-subtle">({counts[f]})</span>
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New client
          </Button>
        </div>

        {/* List */}
        {!loaded ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              clients.length === 0
                ? "No clients yet"
                : "No clients match this view"
            }
            description={
              clients.length === 0
                ? "Add your first client to start producing work. Clients hold the brief, brand kit, content, and workflows."
                : "Try a different filter or clear the search."
            }
            action={
              clients.length === 0 && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  Add first client
                </Button>
              )
            }
            className="border-0"
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <ClientRow
                key={c.id}
                client={c}
                onArchive={archive}
                onRestore={restore}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <OnboardingWizard open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
