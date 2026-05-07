"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { useCampaignsStore } from "@/store/useCampaignsStore";

interface CampaignFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CampaignFormDialog({ open, onClose }: CampaignFormDialogProps) {
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);

  const { create } = useCampaignsStore();

  function reset() {
    setClientId("");
    setName("");
    setObjective("");
    setStartDate("");
    setEndDate("");
    setBudget("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !name) return;
    setSaving(true);
    await create({
      clientId,
      name,
      objective,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      budget: budget ? Number(budget) : undefined,
    });
    setSaving(false);
    reset();
    onClose();
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) { reset(); onClose(); }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg surface rounded-xl shadow-2xl p-6 focus:outline-none">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-fg">
              New Campaign
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1.5 text-fg-subtle hover:text-fg hover:bg-bg-elevated transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                Client *
              </label>
              <ClientSelector value={clientId} onChange={setClientId} className="w-full" />
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                Campaign Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Launch 2026"
                required
                className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                Objective
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Increase brand awareness by 40%"
                className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">
                Budget (USD)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Optional"
                min={0}
                className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => { reset(); onClose(); }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!clientId || !name || saving}>
                {saving ? "Creating…" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
