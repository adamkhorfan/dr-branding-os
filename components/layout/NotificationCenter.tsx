"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Clock,
  Layers,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { useContentStore } from "@/store/useContentStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import type { NotificationType, AppNotification } from "@/types/notification";
import { cn } from "@/lib/utils";

// ---------- helpers ----------

function typeIcon(type: NotificationType) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case "approval":
      return <Clock className={cn(cls, "text-warning")} strokeWidth={1.75} />;
    case "workflow":
      return <Layers className={cn(cls, "text-accent")} strokeWidth={1.75} />;
    case "campaign":
      return <Megaphone className={cn(cls, "text-success")} strokeWidth={1.75} />;
    case "message":
      return <MessageSquare className={cn(cls, "text-fg-muted")} strokeWidth={1.75} />;
    case "system":
    default:
      return <Bell className={cn(cls, "text-fg-subtle")} strokeWidth={1.75} />;
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------- single row ----------

function NotifRow({ notif }: { notif: AppNotification }) {
  const router = useRouter();
  const markRead = useNotificationsStore((s) => s.markRead);

  function handleClick() {
    markRead(notif.id);
    if (notif.href) router.push(notif.href);
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-bg-inset",
        !notif.read && "bg-bg-elevated",
      )}
    >
      <span className="mt-0.5">{typeIcon(notif.type)}</span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold text-fg leading-tight">{notif.title}</span>
        <span className="text-xs text-fg-muted leading-snug">{notif.body}</span>
        <span className="text-[10px] text-fg-subtle mt-0.5">{relativeTime(notif.createdAt)}</span>
      </span>
      {!notif.read && (
        <span className="ml-auto mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
      )}
    </button>
  );
}

// ---------- main component ----------

export function NotificationCenter() {
  const { notifications, unreadCount, markAllRead, clearAll, seedFromStores } =
    useNotificationsStore();

  const contentItems = useContentStore((s) => s.items);
  const contentLoaded = useContentStore((s) => s.loaded);
  const loadContent = useContentStore((s) => s.load);

  const campaigns = useCampaignsStore((s) => s.campaigns);
  const campaignsLoaded = useCampaignsStore((s) => s.loaded);
  const loadCampaigns = useCampaignsStore((s) => s.load);

  const instances = useWorkflowsStore((s) => s.instances);
  const workflowsLoaded = useWorkflowsStore((s) => s.loaded);
  const loadWorkflows = useWorkflowsStore((s) => s.load);

  // Load stores if needed
  React.useEffect(() => {
    if (!contentLoaded) loadContent();
    if (!campaignsLoaded) loadCampaigns();
    if (!workflowsLoaded) loadWorkflows();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Seed once all stores are loaded
  React.useEffect(() => {
    if (!contentLoaded || !campaignsLoaded || !workflowsLoaded) return;

    const pending = contentItems.filter((i) => i.status === "in-review").length;
    const activeWorkflows = instances.filter(
      (i) => i.status === "in-progress" || i.status === "pending-approval",
    ).length;
    const activeCampaigns = campaigns.filter(
      (c) => c.status === "live" || c.status === "in-production",
    ).length;

    seedFromStores(pending, activeWorkflows, activeCampaigns);
  }, [contentLoaded, campaignsLoaded, workflowsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = notifications.slice(0, 8);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-inset hover:text-fg"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-[10px] text-white flex items-center justify-center font-medium leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold text-fg">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-fg-muted hover:text-fg"
              onClick={(e) => {
                e.preventDefault();
                markAllRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* List */}
        <div className="flex flex-col gap-0.5 p-1.5">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 py-8 text-center">
              <Bell className="h-6 w-6 text-fg-subtle" strokeWidth={1.5} />
              <span className="text-sm text-fg-muted">All caught up</span>
              <span className="text-xs text-fg-subtle">No notifications right now</span>
            </div>
          ) : (
            visible.map((n) => <NotifRow key={n.id} notif={n} />)
          )}
        </div>

        {/* Footer */}
        {visible.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-fg-subtle hover:text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  clearAll();
                }}
              >
                Clear all
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
