"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useClientsStore } from "@/store/useClientsStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { DEFINED_WORKFLOWS } from "@/lib/workflows/definitions";
import type { WorkflowKey } from "@/types/workflow";

interface LaunchDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function LaunchDialog({ open, onOpenChange }: LaunchDialogProps) {
  const router = useRouter();
  const { clients, loaded: clientsLoaded, load: loadClients } = useClientsStore();
  const launch = useWorkflowsStore((s) => s.launch);

  const [clientId, setClientId] = useState("");
  const [workflowKey, setWorkflowKey] = useState<WorkflowKey | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!clientsLoaded) loadClients();
  }, [clientsLoaded, loadClients]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setClientId("");
      setWorkflowKey("");
    }
  }, [open]);

  const activeClients = clients.filter((c) => c.status !== "archived");
  const canSubmit = clientId && workflowKey && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const inst = await launch(workflowKey as WorkflowKey, clientId);
      onOpenChange(false);
      router.push(`/workflows/${inst.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Launch workflow</DialogTitle>
          <DialogDescription>
            Choose a client and a workflow template to start a new run.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="launch-client">Client</Label>
            {activeClients.length === 0 ? (
              <p className="text-sm text-fg-subtle italic">
                No active clients. Create a client first.
              </p>
            ) : (
              <select
                id="launch-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 focus:outline-none focus:border-accent/50 transition-colors"
              >
                <option value="" disabled>
                  Select a client…
                </option>
                {activeClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.industry ? ` — ${c.industry}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Workflow type */}
          <div className="space-y-3">
            <Label>Workflow</Label>
            <div className="grid grid-cols-1 gap-2">
              {DEFINED_WORKFLOWS.map((def) => {
                const selected = workflowKey === def.key;
                return (
                  <button
                    key={def.key}
                    type="button"
                    onClick={() => setWorkflowKey(def.key)}
                    className={cn(
                      "rounded-md border px-4 py-3.5 text-left transition-all",
                      selected
                        ? "border-accent/60 bg-accent/5 ring-1 ring-accent/30"
                        : "border-border bg-bg-inset hover:border-border-strong hover:bg-bg-elevated",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-accent bg-accent"
                            : "border-border-strong",
                        )}
                      >
                        {selected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-fg" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium",
                            selected ? "text-fg" : "text-fg-muted",
                          )}
                        >
                          {def.name}
                        </div>
                        <div className="text-xs text-fg-subtle mt-0.5 leading-relaxed">
                          {def.steps.length} steps · {def.goal}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? "Launching…" : "Launch workflow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
