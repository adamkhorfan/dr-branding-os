"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientsStore } from "@/store/useClientsStore";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  ClientHeader,
  BrandKitSection,
  BriefSection,
  GoalsAudienceSection,
  CompetitorsSection,
  NotesHistorySection,
  SavedOutputsSection,
} from "./detail";

interface ClientDetailViewProps {
  clientId: string;
}

export function ClientDetailView({ clientId }: ClientDetailViewProps) {
  const { clients, loaded, load } = useClientsStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  if (!loaded) {
    return (
      <div className="text-sm text-fg-subtle py-8">Loading client…</div>
    );
  }

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <EmptyState
        icon={Layers}
        title="Client not found"
        description="This client may have been deleted or the link is incorrect."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/clients">Back to clients</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
        <Link href="/clients">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          All clients
        </Link>
      </Button>

      <ClientHeader client={client} />
      <BrandKitSection client={client} />
      <BriefSection client={client} />
      <GoalsAudienceSection client={client} />
      <CompetitorsSection client={client} />
      <NotesHistorySection client={client} />
      <SavedOutputsSection clientId={client.id} />
    </div>
  );
}
