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
import type { Client, ClientBrief } from "@/types/client";

interface BriefEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client;
}

export function BriefEditDialog({
  open,
  onOpenChange,
  client,
}: BriefEditDialogProps) {
  const updateBrief = useClientsStore((s) => s.updateBrief);
  const [draft, setDraft] = useState<ClientBrief>(client.brief);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setDraft(client.brief);
  }, [open, client.brief]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateBrief(client.id, draft);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit brief</DialogTitle>
          <DialogDescription>
            The strategic core: positioning and offers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="brief-positioning">Positioning</Label>
            <Textarea
              id="brief-positioning"
              placeholder="One- or two-sentence positioning statement"
              value={draft.positioning ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  positioning: e.target.value || undefined,
                }))
              }
              rows={3}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Offers</Label>
            <ChipsInput
              value={draft.offers}
              onChange={(offers) => setDraft((d) => ({ ...d, offers }))}
              placeholder="Add an offer and press Enter…"
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
              {submitting ? "Saving…" : "Save brief"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
