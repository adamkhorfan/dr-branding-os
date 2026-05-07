"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { useContentStore } from "@/store/useContentStore";

interface SavedOutputsSectionProps {
  clientId: string;
}

export function SavedOutputsSection({ clientId }: SavedOutputsSectionProps) {
  const { items, loaded, load } = useContentStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const clientItems = items.filter((i) => i.clientId === clientId);

  return (
    <SectionCard
      title="Saved Outputs"
      description="Approved content, scripts, prompts, and renders"
      bodyClassName="p-0"
      action={
        clientItems.length > 0 ? (
          <Link
            href="/content-studio"
            className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
          >
            Open Studio
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : undefined
      }
    >
      {clientItems.length === 0 ? (
        <div className="px-6 py-12 flex flex-col items-center text-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-elevated">
            <Layers className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} />
          </div>
          <div className="text-sm text-fg-muted max-w-md leading-relaxed">
            Use the Strategy Lab, Content Studio, Carousel Studio, or Reel Script Studio
            to generate and save content for this client.
          </div>
        </div>
      ) : (
        <SavedOutputsList clientId={clientId} />
      )}
    </SectionCard>
  );
}
