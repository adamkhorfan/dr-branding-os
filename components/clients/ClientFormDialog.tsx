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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useClientsStore } from "@/store/useClientsStore";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /**
   * If true, navigate to the client detail page after creation so the user
   * can fill the brand kit, brief, and goals.
   */
  navigateAfterCreate?: boolean;
}

/**
 * Quick-create dialog for new clients. Captures the essentials only —
 * name, industry, positioning, audience, notes. Deeper fields (brand kit,
 * goals, competitors, etc.) are edited on the detail page.
 */
export function ClientFormDialog({
  open,
  onOpenChange,
  navigateAfterCreate = true,
}: ClientFormDialogProps) {
  const create = useClientsStore((s) => s.create);
  const router = useRouter();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [positioning, setPositioning] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setIndustry("");
      setPositioning("");
      setAudience("");
      setNotes("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const created = await create({
        name: name.trim(),
        industry: industry.trim() || undefined,
        positioning: positioning.trim() || undefined,
        audience: audience.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
      if (navigateAfterCreate) {
        router.push(`/clients/${created.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
          <DialogDescription>
            Capture the essentials. You'll fill in the brand kit, goals, and
            competitors on the client page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-name">Client name</Label>
              <Input
                id="new-name"
                placeholder="e.g. Atelier Noir"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-industry">Industry</Label>
              <Input
                id="new-industry"
                placeholder="e.g. Luxury fashion"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-positioning">Positioning</Label>
            <Input
              id="new-positioning"
              placeholder="One-line positioning statement"
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-audience">Target audience</Label>
            <Input
              id="new-audience"
              placeholder="Who are we talking to"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-notes">Notes</Label>
            <Textarea
              id="new-notes"
              placeholder="Internal notes, context, anything important"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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
            <Button type="submit" disabled={!name.trim() || submitting}>
              {submitting ? "Creating…" : "Create client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
