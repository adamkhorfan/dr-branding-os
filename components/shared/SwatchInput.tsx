"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BrandColor, BrandColorRole } from "@/types/client";

const ROLES: BrandColorRole[] = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "support",
];

interface SwatchInputProps {
  value: BrandColor[];
  onChange: (next: BrandColor[]) => void;
  className?: string;
}

const HEX_RE = /^#?[0-9a-fA-F]{3,8}$/;

function normalizeHex(input: string): string | null {
  const trimmed = input.trim();
  if (!HEX_RE.test(trimmed)) return null;
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

export function SwatchInput({ value, onChange, className }: SwatchInputProps) {
  const [hex, setHex] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<BrandColorRole>("primary");

  function add() {
    const norm = normalizeHex(hex);
    if (!norm) return;
    onChange([
      ...value,
      {
        hex: norm,
        name: name.trim() || undefined,
        role,
      },
    ]);
    setHex("");
    setName("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function updateRole(idx: number, nextRole: BrandColorRole) {
    onChange(value.map((c, i) => (i === idx ? { ...c, role: nextRole } : c)));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((c, i) => (
            <li
              key={`${c.hex}-${i}`}
              className="flex items-center gap-3 rounded-md border border-border bg-bg-inset px-3 py-2"
            >
              <span
                className="h-6 w-6 rounded-md border border-border-strong shrink-0"
                style={{ background: c.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-fg tabular truncate">
                  {c.hex.toUpperCase()}
                </div>
                {c.name && (
                  <div className="text-xs text-fg-subtle truncate">
                    {c.name}
                  </div>
                )}
              </div>
              <select
                value={c.role ?? "primary"}
                onChange={(e) =>
                  updateRole(i, e.target.value as BrandColorRole)
                }
                className="h-7 rounded-md border border-border bg-bg-base text-2xs uppercase tracking-[0.08em] text-fg-muted px-2 focus:outline-none focus:border-accent/50"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-fg-subtle hover:text-danger transition-colors p-1"
                aria-label="Remove color"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
        <Input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#0B0B0C"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={add}
          disabled={!normalizeHex(hex)}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}
