"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClientsStore } from "@/store/useClientsStore";
import { uid } from "@/lib/utils";
import type { Client, Competitor } from "@/types/client";

interface CompetitorsEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client;
}

export function CompetitorsEditDialog({
  open,
  onOpenChange,
  client,
}: CompetitorsEditDialogProps) {
  const updateCompetitors = useClientsStore((s) => s.updateCompetitors);
  const [list, setList] = useState<Competitor[]>(client.competitors);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setList(client.competitors);
  }, [open, client.competitors]);

  function addEmpty() {
    setList((l) => [...l, { id: uid("comp"), name: "" }]);
  }

  function update(id: string, patch: Partial<Competitor>) {
    setList((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function remove(id: string) {
    setList((l) => l.filter((c) => c.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Drop entries with no name
      const cleaned = list.filter((c) => c.name.trim().length > 0);
      await updateCompetitors(client.id, cleaned);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit competitors</DialogTitle>
          <DialogDescription>
            Track the brands worth watching for this client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {list.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-bg-inset px-6 py-10 text-center">
              <p className="text-sm text-fg-subtle">
                No competitors yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((c) => (
                <li
                  key={c.id}
                  className="rounded-md border border-border bg-bg-inset p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`name-${c.id}`}>Name</Label>
                        <Input
                          id={`name-${c.id}`}
                          value={c.name}
                          onChange={(e) =>
                            update(c.id, { name: e.target.value })
                          }
                          placeholder="Competitor name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`url-${c.id}`}>URL</Label>
                        <Input
                          id={`url-${c.id}`}
                          value={c.url ?? ""}
                          onChange={(e) =>
                            update(c.id, {
                              url: e.target.value || undefined,
                            })
                          }
                          placeholder="https://"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(c.id)}
                      className="text-fg-subtle hover:text-danger mt-6"
                      aria-label="Remove competitor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`notes-${c.id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${c.id}`}
                      rows={2}
                      placeholder="What stands out about them — positioning, content, tone, weaknesses"
                      value={c.notes ?? ""}
                      onChange={(e) =>
                        update(c.id, {
                          notes: e.target.value || undefined,
                        })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addEmpty}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add competitor
          </Button>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save competitors"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
