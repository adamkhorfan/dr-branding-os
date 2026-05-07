"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WizardData } from "../wizardTypes";
import { GOAL_OPTIONS, PLATFORM_OPTIONS } from "../wizardTypes";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

function MultiChip({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt],
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            selected.includes(opt)
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-bg-inset text-fg-muted hover:border-border/80 hover:text-fg",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Step3Strategy({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg">Strategy & goals</h2>
        <p className="text-sm text-fg-muted mt-1">Define what success looks like and where content will live.</p>
      </div>

      <div className="space-y-2">
        <Label>Business goals <span className="text-fg-subtle text-xs">(select all that apply)</span></Label>
        <MultiChip
          options={GOAL_OPTIONS}
          selected={data.goals}
          onChange={(v) => onChange({ goals: v })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wz-audience">Target audience</Label>
        <Input
          id="wz-audience"
          placeholder="e.g. Women 25-40, fashion-forward, high income, based in GCC"
          value={data.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Active platforms <span className="text-fg-subtle text-xs">(select all)</span></Label>
        <MultiChip
          options={PLATFORM_OPTIONS}
          selected={data.platforms}
          onChange={(v) => onChange({ platforms: v })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wz-offers">Products / services offered</Label>
        <Input
          id="wz-offers"
          placeholder="e.g. Luxury abayas, ready-to-wear, custom tailoring"
          value={data.offers}
          onChange={(e) => onChange({ offers: e.target.value })}
        />
      </div>
    </div>
  );
}
