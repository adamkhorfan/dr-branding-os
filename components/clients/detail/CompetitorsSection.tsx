"use client";

import { useState } from "react";
import { Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import type { Client } from "@/types/client";
import { CompetitorsEditDialog } from "./CompetitorsEditDialog";

interface CompetitorsSectionProps {
  client: Client;
}

export function CompetitorsSection({ client }: CompetitorsSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const list = client.competitors;

  return (
    <>
      <SectionCard
        title="Competitors"
        description="Brands worth tracking and learning from"
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
        bodyClassName={list.length > 0 ? "p-0" : undefined}
      >
        {list.length === 0 ? (
          <p className="text-sm text-fg-subtle italic py-2">
            No competitors tracked yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {list.map((c) => (
              <li
                key={c.id}
                className="px-6 py-4 flex items-start gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg">
                      {c.name}
                    </span>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-subtle hover:text-accent transition-colors"
                        aria-label={`Open ${c.name}`}
                      >
                        <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                      </a>
                    )}
                  </div>
                  {c.url && (
                    <div className="text-xs text-fg-subtle font-mono truncate">
                      {c.url}
                    </div>
                  )}
                  {c.notes && (
                    <p className="text-sm text-fg-muted leading-relaxed pt-1 whitespace-pre-wrap">
                      {c.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <CompetitorsEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}
