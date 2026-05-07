"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useClientsStore } from "@/store/useClientsStore";

interface ClientSelectorProps {
  value: string;
  onChange: (clientId: string) => void;
  className?: string;
}

export function ClientSelector({ value, onChange, className }: ClientSelectorProps) {
  const { clients, loaded, load } = useClientsStore();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const active = clients.filter((c) => c.status !== "archived");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 pr-8 focus:outline-none focus:border-accent/50 transition-colors",
        !value && "text-fg-muted",
        className,
      )}
    >
      <option value="" disabled>
        Select client…
      </option>
      {active.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
          {c.industry ? ` — ${c.industry}` : ""}
        </option>
      ))}
    </select>
  );
}
