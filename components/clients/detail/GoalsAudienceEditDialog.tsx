"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ChipsInput } from "@/components/shared/ChipsInput";
import { useClientsStore } from "@/store/useClientsStore";
import type { Client, ClientGoals } from "@/types/client";

interface GoalsAudienceEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client;
}

export function GoalsAudienceEditDialog({
  open,
  onOpenChange,
  client,
}: GoalsAudienceEditDialogProps) {
  const updateGoals = useClientsStore((s) => s.updateGoals);
  const [draft, setDraft] = useState<ClientGoals>(client.goals);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setDraft(client.goals);
  }, [open, client.goals]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateGoals(client.id, draft);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit goals & audience</DialogTitle>
          <DialogDescription>
            What success looks like and who we are talking to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>Goals</Label>
            <ChipsInput
              value={draft.goals}
              onChange={(goals) => setDraft((d) => ({ ...d, goals }))}
              placeholder="e.g. Launch new product line by Q3"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goals-audience">Target audience</Label>
            <Textarea
              id="goals-audience"
              placeholder="Demographics, psychographics, where they hang out online…"
              value={draft.audience ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  audience: e.target.value || undefined,
                }))
              }
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Audience emotions</Label>
            <ChipsInput
              value={draft.audienceEmotions}
              onChange={(audienceEmotions) =>
                setDraft((d) => ({ ...d, audienceEmotions }))
              }
              placeholder="e.g. aspiration, calm, status, belonging"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
