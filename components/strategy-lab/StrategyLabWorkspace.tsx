"use client";

import { useState } from "react";
import { Sparkles, Save, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import {
  generatePositioningStatement,
  generateUSPs,
  generateContentPillars,
  generateHookTemplates,
  generateCTABank,
} from "@/lib/studio/generators";

type FrameworkKey =
  | "positioning"
  | "usps"
  | "pillars"
  | "hooks"
  | "ctas";

const FRAMEWORKS: { key: FrameworkKey; label: string; description: string }[] = [
  { key: "positioning", label: "Positioning Statement", description: "Core brand positioning" },
  { key: "usps", label: "Unique Selling Points", description: "What sets the brand apart" },
  { key: "pillars", label: "Content Pillars", description: "6-pillar content strategy" },
  { key: "hooks", label: "Hook Templates", description: "8 fill-in-the-blank hooks" },
  { key: "ctas", label: "CTA Bank", description: "8 on-brand calls-to-action" },
];

export function StrategyLabWorkspace() {
  const [clientId, setClientId] = useState("");
  const [framework, setFramework] = useState<FrameworkKey>("positioning");
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  function handleGenerate() {
    if (!client) return;
    let result = "";
    if (framework === "positioning") result = generatePositioningStatement(client);
    else if (framework === "usps") result = generateUSPs(client);
    else if (framework === "pillars") result = generateContentPillars(client);
    else if (framework === "hooks") result = generateHookTemplates(client);
    else if (framework === "ctas") result = generateCTABank(client);
    setOutput(result);
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    const label = FRAMEWORKS.find((f) => f.key === framework)?.label ?? framework;
    await create({
      clientId: client.id,
      type: "post",
      title: `${label} — ${client.name}`,
      body: output,
      tags: ["strategy", framework],
    });
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      {/* Config panel */}
      <div className="space-y-4">
        <SectionCard title="Configuration" bodyClassName="space-y-4">
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Client
            </label>
            <ClientSelector value={clientId} onChange={setClientId} className="w-full" />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Framework
            </label>
            <div className="space-y-1.5">
              {FRAMEWORKS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFramework(f.key)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors",
                    framework === f.key
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted hover:text-fg",
                  )}
                >
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-fg-subtle mt-0.5">{f.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!clientId}
            className="w-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Generate Framework
          </Button>
        </SectionCard>
      </div>

      {/* Output + saved */}
      <div className="space-y-4">
        <SectionCard
          title="Output"
          action={
            output && client ? (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving…" : "Save Output"}
              </Button>
            ) : null
          }
        >
          {output ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full min-h-[320px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 font-mono leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Select a client and framework, then click Generate.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Strategy Outputs" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="post" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
