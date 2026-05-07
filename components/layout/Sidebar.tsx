"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { BrandMark } from "./BrandMark";
import { NAV_GROUPS } from "./nav-config";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 border-r border-border bg-bg-base/80 backdrop-blur-sm transition-all duration-300 ease-premium",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <BrandMark collapsed={collapsed} />
          <button
            onClick={toggleSidebar}
            className={cn(
              "rounded-md p-1.5 text-fg-subtle hover:text-fg hover:bg-bg-elevated transition-colors",
              collapsed && "absolute right-3 top-5",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              {!collapsed && (
                <div className="px-2.5 mb-2 text-2xs uppercase tracking-[0.12em] font-medium text-fg-subtle">
                  {group.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-md px-2.5 h-9 text-sm transition-colors",
                          active
                            ? "bg-bg-elevated text-fg"
                            : "text-fg-muted hover:text-fg hover:bg-bg-elevated/60",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-accent" />
                        )}
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-accent" : "text-fg-subtle group-hover:text-fg-muted",
                          )}
                          strokeWidth={1.75}
                        />
                        {!collapsed && (
                          <span className="truncate flex-1 tracking-tightish">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-border">
            <div className="text-2xs uppercase tracking-[0.12em] text-fg-subtle">
              v0.9 · M9
            </div>
            <div className="text-xs text-fg-muted mt-1">
              Analytics & Intelligence
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
