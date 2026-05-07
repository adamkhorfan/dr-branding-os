"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { FloatingAiButton } from "./FloatingAiButton";
import { useUiStore } from "@/store/useUiStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const theme = useUiStore((s) => s.theme);
  const density = useUiStore((s) => s.density);

  // Apply theme + density classes to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("light", theme === "light");
    html.classList.toggle("density-compact", density === "compact");
    html.classList.toggle("density-comfortable", density === "comfortable");
  }, [theme, density]);

  return (
    <div className="min-h-screen flex bg-bg-base text-fg">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <CommandPalette />
      <FloatingAiButton />
    </div>
  );
}
