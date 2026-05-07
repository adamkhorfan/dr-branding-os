"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChipsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  emptyHint?: string;
}

/**
 * ChipsInput — manage a list of short string values as removable chips.
 * Press Enter or comma to add. Click × on a chip to remove.
 */
export function ChipsInput({
  value,
  onChange,
  placeholder = "Add and press Enter…",
  className,
  emptyHint,
}: ChipsInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const v = draft.trim().replace(/,+$/, "");
    if (!v) return;
    if (value.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2 h-7 text-xs text-fg"
            >
              <span className="leading-none">{v}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-fg-subtle hover:text-fg transition-colors"
                aria-label={`Remove ${v}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={placeholder}
      />
      {emptyHint && value.length === 0 && (
        <div className="text-2xs text-fg-subtle">{emptyHint}</div>
      )}
    </div>
  );
}
