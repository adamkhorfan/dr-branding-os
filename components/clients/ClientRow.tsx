"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Archive,
  ExternalLink,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { initials, formatRelative } from "@/lib/utils";
import type { Client } from "@/types/client";

interface ClientRowProps {
  client: Client;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ClientRow({
  client,
  onArchive,
  onRestore,
  onDelete,
}: ClientRowProps) {
  const router = useRouter();
  const href = `/clients/${client.id}`;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-bg-elevated/40 transition-colors">
      <Link
        href={href}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-inset text-xs font-medium text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
      >
        {initials(client.name)}
      </Link>

      <Link href={href} className="min-w-0 group">
        <div className="text-sm font-medium text-fg truncate group-hover:text-accent transition-colors">
          {client.name}
        </div>
        <div className="text-xs text-fg-subtle truncate">
          {client.industry || "—"}
          {client.brief.positioning && (
            <span className="text-fg-subtle/70">
              {" "}
              · {client.brief.positioning}
            </span>
          )}
        </div>
      </Link>

      <StatusBadge status={client.status} />

      <span className="text-xs text-fg-subtle tabular hidden sm:inline-block w-24 text-right">
        {formatRelative(client.updatedAt)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Client actions">
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => router.push(href)}>
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </DropdownMenuItem>
          {client.status === "archived" ? (
            <DropdownMenuItem onSelect={() => onRestore(client.id)}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => onArchive(client.id)}>
              <Archive className="h-3.5 w-3.5" /> Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => onDelete(client.id)}
            className="text-danger focus:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
