"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { EmptyState } from "@/components/shared/EmptyState";
import { useContentStore } from "@/store/useContentStore";
import type { ContentItem, ContentType } from "@/types/content";

const TYPE_COLOR: Record<ContentType, string> = {
  post: "bg-info/20 text-info border-info/30",
  caption: "bg-fg-subtle/10 text-fg-muted border-border",
  story: "bg-warning/20 text-warning border-warning/30",
  carousel: "bg-accent/20 text-accent border-accent/30",
  reel: "bg-success/20 text-success border-success/30",
  script: "bg-danger/20 text-danger border-danger/30",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [clientId, setClientId] = useState("");
  const [selected, setSelected] = useState<ContentItem | null>(null);

  const { items, loaded, load } = useContentStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const filtered = items.filter((i) => {
    if (clientId && i.clientId !== clientId) return false;
    return true;
  });

  // Group items by day-of-month for the current view
  const itemsByDay: Record<number, ContentItem[]> = {};
  for (const item of filtered) {
    const dateStr = item.scheduledFor || item.createdAt;
    if (!dateStr) continue;
    const d = isoToDate(dateStr);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!itemsByDay[day]) itemsByDay[day] = [];
      itemsByDay[day].push(item);
    }
  }

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build grid cells (blank + day cells)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const totalItems = Object.values(itemsByDay).flat().length;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-fg min-w-[160px] text-center">
            {monthLabel}
          </span>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <ClientSelector
          value={clientId}
          onChange={setClientId}
          className="min-w-[200px]"
        />
        {clientId && (
          <button
            onClick={() => setClientId("")}
            className="text-xs text-fg-muted hover:text-fg transition-colors"
          >
            All clients
          </button>
        )}

        <div className="flex-1" />
        <span className="text-xs text-fg-subtle tabular">
          {totalItems} item{totalItems !== 1 ? "s" : ""} this month
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {(Object.entries(TYPE_COLOR) as [ContentType, string][]).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn("inline-block h-2.5 w-2.5 rounded-sm border", cls)} />
            <span className="text-2xs text-fg-subtle capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {totalItems === 0 && !Object.keys(itemsByDay).length ? (
        <EmptyState
          icon={CalendarDays}
          title="No content scheduled"
          description="Generate content in the studios. Items with a scheduled date appear on the calendar."
        />
      ) : (
        <div className="surface rounded-lg border border-border overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="px-2 py-2.5 text-center text-2xs uppercase tracking-wider text-fg-subtle font-medium border-r border-border last:border-r-0"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const isToday =
                day !== null &&
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();
              const dayItems = day ? (itemsByDay[day] ?? []) : [];

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[96px] border-r border-b border-border last:border-r-0 p-2 transition-colors",
                    day ? "hover:bg-bg-elevated/30" : "bg-bg-inset/20",
                    (idx + 1) % 7 === 0 && "border-r-0",
                    Math.floor(idx / 7) === Math.floor((cells.length - 1) / 7) && "border-b-0",
                  )}
                >
                  {day && (
                    <>
                      <div
                        className={cn(
                          "text-xs font-medium mb-1.5 h-5 w-5 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-accent text-bg-base"
                            : "text-fg-muted",
                        )}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayItems.slice(0, 3).map((item) => (
                          <button
                            key={item.id}
                            onClick={() =>
                              setSelected(selected?.id === item.id ? null : item)
                            }
                            className={cn(
                              "w-full text-left text-2xs px-1.5 py-0.5 rounded border truncate leading-relaxed transition-opacity",
                              TYPE_COLOR[item.type],
                              selected?.id === item.id && "ring-1 ring-accent",
                            )}
                            title={item.title}
                          >
                            {item.title}
                          </button>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-2xs text-fg-subtle pl-1">
                            +{dayItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected item detail */}
      {selected && (
        <div className="surface rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-fg">{selected.title}</span>
            <Badge
              className={cn("text-2xs", TYPE_COLOR[selected.type])}
            >
              {selected.type}
            </Badge>
            <Badge
              variant={
                selected.status === "approved" || selected.status === "published"
                  ? "success"
                  : selected.status === "scheduled"
                    ? "accent"
                    : "outline"
              }
            >
              {selected.status}
            </Badge>
          </div>
          {selected.body && (
            <p className="text-xs text-fg-muted leading-relaxed line-clamp-4">{selected.body}</p>
          )}
          {selected.platforms && selected.platforms.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selected.platforms.map((p) => (
                <span key={p} className="text-2xs text-fg-subtle bg-bg-inset px-1.5 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
