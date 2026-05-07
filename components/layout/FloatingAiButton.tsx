"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingAiButton() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/ai-command-center");

  if (isActive) return null;

  return (
    <Link
      href="/ai-command-center"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-200 hover:scale-105 active:scale-95",
        "bg-accent border-accent/30 text-bg-base hover:bg-accent/90 shadow-accent/25",
      )}
      aria-label="Open AI Command Center"
      title="AI Command Center"
    >
      <Zap className="h-4.5 w-4.5" strokeWidth={2} />
    </Link>
  );
}
