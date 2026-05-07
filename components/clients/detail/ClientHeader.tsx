"use client";

import { useState } from "react";
import {
  Pencil,
  Archive,
  RotateCcw,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { initials, formatRelative } from "@/lib/utils";
import type { Client } from "@/types/client";
import { useClientsStore } from "@/store/useClientsStore";
import { useRouter } from "next/navigation";
import { ProfileEditDialog } from "./ProfileEditDialog";

interface ClientHeaderProps {
  client: Client;
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const archive = useClientsStore((s) => s.archive);
  const restore = useClientsStore((s) => s.restore);
  const remove = useClientsStore((s) => s.remove);
  const router = useRouter();

  function handleDelete() {
    if (typeof window === "undefined") return;
    if (
      !window.confirm(
        `Delete ${client.name}? This cannot be undone.`,
      )
    )
      return;
    remove(client.id).then(() => router.push("/clients"));
  }

  return (
    <>
      <div className="surface p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-5 min-w-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-bg-inset shrink-0">
              <span className="text-display text-lg text-fg tracking-tighter2">
                {initials(client.name)}
              </span>
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-display text-3xl tracking-tighter2 text-fg leading-none truncate">
                  {client.name}
                </h1>
                <StatusBadge status={client.status} />
              </div>
              <div className="text-sm text-fg-muted">
                {client.industry || "Industry not set"}
              </div>
              {client.brief.positioning && (
                <div className="text-sm text-fg leading-relaxed max-w-2xl pt-1">
                  {client.brief.positioning}
                </div>
              )}
              <div className="text-2xs uppercase tracking-[0.08em] text-fg-subtle pt-2">
                Updated {formatRelative(client.updatedAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              Edit profile
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {client.status === "archived" ? (
                  <DropdownMenuItem onSelect={() => restore(client.id)}>
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onSelect={() => archive(client.id)}>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleDelete}
                  className="text-danger focus:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ProfileEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}
