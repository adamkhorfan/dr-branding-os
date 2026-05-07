"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import type { Client } from "@/types/client";
import { BriefEditDialog } from "./BriefEditDialog";

interface BriefSectionProps {
  client: Client;
}

export function BriefSection({ client }: BriefSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const b = client.brief;
  const isEmpty = !b.positioning && b.offers.length === 0;

  return (
    <>
      <SectionCard
        title="Brief"
        description="Positioning statement and core offers"
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
        {isEmpty ? (
          <p className="text-sm text-fg-subtle italic py-2">
            No brief yet. The brief drives strategy, content tone, and every
            workflow downstream.
          </p>
        ) : (
          <dl className="space-y-5">
            <div className="space-y-1.5">
              <dt className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                Positioning
              </dt>
              <dd className="text-sm text-fg leading-relaxed">
                {b.positioning ?? (
                  <span className="text-fg-subtle italic">Not set</span>
                )}
              </dd>
            </div>

            <div className="space-y-1.5">
              <dt className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                Offers
              </dt>
              <dd>
                {b.offers.length === 0 ? (
                  <span className="text-sm text-fg-subtle italic">
                    Not set
                  </span>
                ) : (
                  <ul className="space-y-1.5 mt-1">
                    {b.offers.map((o, i) => (
                      <li
                        key={i}
                        className="text-sm text-fg leading-relaxed flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
        )}
      </SectionCard>

      <BriefEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}
