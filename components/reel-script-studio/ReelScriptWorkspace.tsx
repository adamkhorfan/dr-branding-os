"use client";

import { useState } from "react";
import { Film, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generateReelScript } from "@/lib/studio/generators";

const DURATIONS = [
  { value: 15, label: "15s", sub: "Quick hit" },
  { value: 30, label: "30s", sub: "Standard" },
  { value: 60, label: "60s", sub: "Story-driven" },
];

export function ReelScriptWorkspace() {
  const [clientId, setClientId] = useState("");
  const [concept, setConcept] = useState("");
  const [duration, setDuration] = useState(30);
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  function handleGenerate() {
    if (!client) return;
    setOutput(generateReelScript(client, concept, duration));
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: "reel",
      title: concept || `${duration}s Reel Script — ${client.name}`,
      body: output,
      platforms: ["instagram", "tiktok"],
      tags: ["reel", `${duration}s`],
    });
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      {/* Config */}
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
              Reel Concept
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. client transformation story…"
              className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={cn(
                    "py-2.5 rounded-md border text-center transition-colors",
                    duration === d.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  <div className="text-sm font-medium">{d.label}</div>
                  <div className="text-xs text-fg-subtle mt-0.5">{d.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={!clientId} className="w-full">
            <Film className="h-3.5 w-3.5 mr-2" />
            Generate Script
          </Button>
        </SectionCard>

        {client && (
          <SectionCard title="Brand Context" bodyClassName="space-y-2 text-xs">
            {client.brandKit.toneOfVoice && (
              <div>
                <span className="text-fg-subtle">Tone: </span>
                <span className="text-fg-muted">{client.brandKit.toneOfVoice}</span>
              </div>
            )}
            {client.goals.audience && (
              <div>
                <span className="text-fg-subtle">Audience: </span>
                <span className="text-fg-muted">{client.goals.audience}</span>
              </div>
            )}
            {client.brandKit.positioningStatement && (
              <div>
                <span className="text-fg-subtle">Positioning: </span>
                <span className="text-fg-muted line-clamp-3">
                  {client.brandKit.positioningStatement}
                </span>
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {/* Output + saved */}
      <div className="space-y-4">
        <SectionCard
          title="Script"
          action={
            output && client ? (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving…" : "Save Script"}
              </Button>
            ) : null
          }
        >
          {output ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full min-h-[420px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 font-mono leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Enter your reel concept and click Generate to build the script.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Scripts" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="reel" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
