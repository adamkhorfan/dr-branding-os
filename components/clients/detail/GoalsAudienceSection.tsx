"use client";

import { useState } from "react";
import { Pencil, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types/client";
import { GoalsAudienceEditDialog } from "./GoalsAudienceEditDialog";

interface GoalsAudienceSectionProps {
  client: Client;
}

export function GoalsAudienceSection({ client }: GoalsAudienceSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const g = client.goals;
  const isEmpty =
    g.goals.length === 0 && !g.audience && g.audienceEmotions.length === 0;

  return (
    <>
      <SectionCard
        title="Goals & Audience"
        description="What success looks like and who we are talking to"
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
            No goals or audience defined yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                <Target className="h-3.5 w-3.5" strokeWidth={1.75} />
                Goals
              </div>
              {g.goals.length === 0 ? (
                <span className="text-sm text-fg-subtle italic">Not set</span>
              ) : (
                <ul className="space-y-1.5">
                  {g.goals.map((goal, i) => (
                    <li
                      key={i}
                      className="text-sm text-fg leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-accent text-2xs font-mono pt-1 tabular">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                  Target audience
                </div>
                <div className="text-sm text-fg leading-relaxed">
                  {g.audience ?? (
                    <span className="text-fg-subtle italic">Not set</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                  <Heart className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Audience emotions
                </div>
                {g.audienceEmotions.length === 0 ? (
                  <span className="text-sm text-fg-subtle italic">
                    Not set
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {g.audienceEmotions.map((e, i) => (
                      <Badge key={i} variant="accent">
                        {e}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <GoalsAudienceEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}
