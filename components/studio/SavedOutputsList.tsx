"use client";

import { useEffect } from "react";
import { Trash2, FileText, LayoutGrid, Film, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/store/useContentStore";
import type { ContentItem, ContentType } from "@/types/content";

const TYPE_ICON: Record<ContentType, React.ElementType> = {
  post: FileText,
  caption: FileText,
  story: FileText,
  carousel: LayoutGrid,
  reel: Film,
  script: BookOpen,
};

const TYPE_LABEL: Record<ContentType, string> = {
  post: "Post",
  caption: "Caption",
  story: "Story",
  carousel: "Carousel",
  reel: "Reel",
  script: "Script",
};

const STATUS_VARIANT: Record<
  ContentItem["status"],
  "default" | "accent" | "success" | "warning" | "danger" | "info" | "outline"
> = {
  draft: "outline",
  "in-review": "info",
  approved: "success",
  scheduled: "accent",
  published: "success",
  archived: "default",
};

interface SavedOutputsListProps {
  clientId: string;
  filterType?: ContentType;
  className?: string;
}

export function SavedOutputsList({
  clientId,
  filterType,
  className,
}: SavedOutputsListProps) {
  const { items, loaded, load, remove } = useContentStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const filtered = items.filter(
    (i) =>
      i.clientId === clientId &&
      (!filterType || i.type === filterType),
  );

  if (filtered.length === 0) {
    return (
      <div className={cn("py-8 text-center text-sm text-fg-subtle", className)}>
        No saved outputs yet.
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-border", className)}>
      {filtered.map((item) => {
        const Icon = TYPE_ICON[item.type];
        return (
          <li
            key={item.id}
            className="group flex items-start gap-3 px-4 py-3 hover:bg-bg-elevated/50 transition-colors"
          >
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-bg-elevated">
              <Icon className="h-3 w-3 text-fg-subtle" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-fg truncate">
                  {item.title}
                </span>
                <Badge variant={STATUS_VARIANT[item.status]}>
                  {item.status}
                </Badge>
                <span className="text-2xs text-fg-subtle uppercase tracking-wider">
                  {TYPE_LABEL[item.type]}
                </span>
              </div>
              {item.body && (
                <p className="mt-0.5 text-xs text-fg-muted line-clamp-2 leading-relaxed">
                  {item.body}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-2xs text-fg-subtle bg-bg-inset px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => remove(item.id)}
              className="opacity-0 group-hover:opacity-100 mt-0.5 rounded p-1 text-fg-subtle hover:text-danger transition-all"
              aria-label="Delete output"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
