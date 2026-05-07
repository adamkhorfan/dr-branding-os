"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Basics" },
  { label: "Brand" },
  { label: "Strategy" },
  { label: "Competitors" },
  { label: "AI Brief" },
  { label: "Review" },
];

interface WizardProgressProps {
  current: number; // 0-indexed
}

export function WizardProgress({ current }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  done
                    ? "bg-accent text-bg-base"
                    : active
                      ? "bg-accent/15 border-2 border-accent text-accent"
                      : "bg-bg-inset border border-border text-fg-subtle",
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.08em] hidden sm:block",
                  active ? "text-fg font-medium" : done ? "text-fg-muted" : "text-fg-subtle",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-[2px] w-8 sm:w-12 mx-1 mb-4 rounded transition-all",
                  i < current ? "bg-accent" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
