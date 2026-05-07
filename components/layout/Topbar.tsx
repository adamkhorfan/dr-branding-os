"use client";

import { Search, Plus } from "lucide-react";
import { NotificationCenter } from "@/components/layout/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/useUiStore";
import { initials } from "@/lib/utils";

const USER = { name: "Adam", email: "adamkhirfan33@gmail.com" };

export function Topbar() {
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-bg-base/85 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-8">
        {/* Search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="group flex items-center gap-2.5 h-9 w-[420px] max-w-full rounded-md border border-border bg-bg-inset px-3 text-sm text-fg-subtle hover:text-fg-muted hover:border-border-strong transition-colors"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="flex-1 text-left">Search clients, workflows, content…</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-bg-base px-1.5 py-0.5 text-2xs font-mono text-fg-subtle">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            <span>New</span>
          </Button>

          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Profile menu"
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg-inset text-xs font-medium text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
              >
                {initials(USER.name)}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5 normal-case tracking-normal">
                  <span className="text-sm font-medium text-fg">{USER.name}</span>
                  <span className="text-xs text-fg-subtle">{USER.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Keyboard shortcuts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
