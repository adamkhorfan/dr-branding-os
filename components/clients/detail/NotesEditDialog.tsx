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
import { useClientsStore } from "@/store/useClientsStore";
import type { Client } from "@/types/client";

interface NotesEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client;
}

export function NotesEditDialog({
  open,
  onOpenChange,
  client,
}: NotesEditDialogProps) {
  const updateNotes = useClientsStore((s) => s.updateNotes);
  const [notes, setNotes] = useState(client.notes ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setNotes(client.notes ?? "");
  }, [open, client.notes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateNotes(client.id, notes);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit notes</DialogTitle>
          <DialogDescription>
            Internal context for this client. Updates are tracked in History.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="notes-body">Notes</Label>
            <Textarea
              id="notes-body"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Recurring requests, gotchas, key contacts, anything you'd want to remember…"
              autoFocus
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
              {submitting ? "Saving…" : "Save notes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
