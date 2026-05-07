"use client";

import { CheckCircle2 } from "lucide-react";
import type { WizardData } from "../wizardTypes";

interface Props {
  data: WizardData;
}

function ReviewRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2.5 border-b border-border last:border-0">
      <div className="text-xs text-fg-subtle w-32 shrink-0 pt-0.5">{label}</div>
      <div className="text-sm text-fg flex-1">{value}</div>
    </div>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-5 rounded border border-border shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs text-fg-muted font-mono">{color}</span>
      <span className="text-xs text-fg-subtle">{label}</span>
    </div>
  );
}

export function Step6Review({ data }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg">Review & launch</h2>
        <p className="text-sm text-fg-muted mt-1">
          Everything looks good? Hit "Create client" to launch their profile.
        </p>
      </div>

      {/* Summary */}
      <div className="surface rounded-xl overflow-hidden divide-y divide-border">
        <ReviewRow label="Client name" value={data.name} />
        <ReviewRow label="Industry" value={data.industry} />
        <ReviewRow label="Website" value={data.website} />
        <ReviewRow label="Contact" value={[data.contactName, data.contactEmail].filter(Boolean).join(" · ")} />
        <ReviewRow label="Tone" value={data.toneOfVoice} />
        <ReviewRow label="Visual style" value={data.visualStyle} />
        <ReviewRow label="Audience" value={data.audience} />
        <ReviewRow label="Goals" value={data.goals.join(", ")} />
        <ReviewRow label="Platforms" value={data.platforms.join(", ")} />
        <ReviewRow label="Offers" value={data.offers} />
        <ReviewRow label="Competitors" value={data.competitors.map((c) => c.name).join(", ") || undefined} />
      </div>

      {/* Colors */}
      {(data.primaryColor || data.secondaryColor || data.accentColor) && (
        <div className="space-y-2">
          <div className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Brand colors</div>
          <div className="flex flex-col gap-2">
            <Swatch color={data.primaryColor} label="Primary" />
            <Swatch color={data.secondaryColor} label="Secondary" />
            <Swatch color={data.accentColor} label="Accent" />
          </div>
        </div>
      )}

      {/* AI brief preview */}
      {data.aiBrief && (
        <div className="space-y-2">
          <div className="text-xs text-fg-subtle uppercase tracking-[0.08em]">AI brief (preview)</div>
          <div className="bg-bg-inset border border-border rounded-lg p-4 text-xs text-fg-muted leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
            {data.aiBrief.slice(0, 400)}{data.aiBrief.length > 400 ? "…" : ""}
          </div>
        </div>
      )}

      {/* Ready callout */}
      <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" strokeWidth={1.75} />
        <div className="text-sm text-fg">
          Ready to create <strong>{data.name}</strong>. The full client profile will open so you can continue setting up.
        </div>
      </div>
    </div>
  );
}
