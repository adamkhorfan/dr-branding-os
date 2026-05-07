"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatRelative } from "@/lib/utils";
import type { Client, HistoryEntryKind } from "@/types/client";
import { NotesEditDialog } from "./NotesEditDialog";

interface NotesHistorySectionProps {
  client: Client;
}

const KIND_LABEL: Record<HistoryEntryKind, string> = {
  created: "Created",
  "profile-updated": "Profile",
  "brand-kit-updated": "Brand Kit",
  "brief-updated": "Brief",
  "goals-updated": "Goals",
  "competitors-updated": "Competitors",
  "notes-updated": "Notes",
  archived: "Archived",
  restored: "Restored",
};

export function NotesHistorySection({ client }: NotesHistorySectionProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Notes"
          description="Internal context for this client"
          className="lg:col-span-2"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              Edit
            </Button>
          }
        >
          {client.notes ? (
            <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">
              {client.notes}
            </p>
          ) : (
            <p className="text-sm text-fg-subtle italic">
              No notes yet. Use this for internal context, recurring requests,
              or anything you'd want to remember six months from now.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="History"
          description="Recent activity"
          bodyClassName="p-0"
        >
          {client.history.length === 0 ? (
            <p className="px-6 py-5 text-sm text-fg-subtle italic">
              Nothing here yet.
            </p>
          ) : (
            <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {client.history.map((h) => (
                <li
                  key={h.id}
                  className="px-6 py-3 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xs uppercase tracking-[0.08em] font-medium text-accent/90">
                      {KIND_LABEL[h.kind]}
                    </span>
                    <span className="text-2xs text-fg-subtle tabular shrink-0">
                      {formatRelative(h.at)}
                    </span>
                  </div>
                  <span className="text-xs text-fg-muted leading-snug">
                    {h.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <NotesEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}
