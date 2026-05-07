"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { WizardData } from "../wizardTypes";
import { TONE_OPTIONS, VISUAL_OPTIONS } from "../wizardTypes";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

interface ColorSwatchProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-md border border-border cursor-pointer shrink-0 overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 flex-1 rounded-md border border-border bg-bg-inset px-3 text-sm text-fg placeholder:text-fg-subtle outline-none focus:border-accent/50 font-mono"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  single,
  onChange,
}: {
  options: string[];
  selected: string;
  single: true;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            selected === opt
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

export function Step2Brand({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg">Brand identity</h2>
        <p className="text-sm text-fg-muted mt-1">Set the color palette and brand voice that defines this client.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ColorSwatch
          label="Primary color"
          value={data.primaryColor}
          onChange={(v) => onChange({ primaryColor: v })}
        />
        <ColorSwatch
          label="Secondary color"
          value={data.secondaryColor}
          onChange={(v) => onChange({ secondaryColor: v })}
        />
        <ColorSwatch
          label="Accent color"
          value={data.accentColor}
          onChange={(v) => onChange({ accentColor: v })}
        />
      </div>

      <div className="space-y-2">
        <Label>Tone of voice</Label>
        <ChipGroup
          options={TONE_OPTIONS}
          selected={data.toneOfVoice}
          single
          onChange={(v) => onChange({ toneOfVoice: v })}
        />
      </div>

      <div className="space-y-2">
        <Label>Visual style</Label>
        <ChipGroup
          options={VISUAL_OPTIONS}
          selected={data.visualStyle}
          single
          onChange={(v) => onChange({ visualStyle: v })}
        />
      </div>
    </div>
  );
}
