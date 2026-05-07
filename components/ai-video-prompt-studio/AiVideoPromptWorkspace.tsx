"use client";

import { useState } from "react";
import { Wand2, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generateVideoPrompt, buildAiPrompt } from "@/lib/studio/generators";
import { aiGenerate } from "@/lib/studio/aiClient";

type Provider = "runway" | "luma" | "kling" | "sora";
type ShotType = "cinematic" | "product" | "testimonial" | "brand-story";

const PROVIDERS: { value: Provider; label: string; badge: string }[] = [
  { value: "runway", label: "Runway", badge: "Gen-3" },
  { value: "luma", label: "Luma", badge: "Dream Machine" },
  { value: "kling", label: "Kling", badge: "1.5" },
  { value: "sora", label: "Sora", badge: "OpenAI" },
];

const SHOT_TYPES: { value: ShotType; label: string }[] = [
  { value: "cinematic", label: "Cinematic" },
  { value: "product", label: "Product" },
  { value: "testimonial", label: "Testimonial" },
  { value: "brand-story", label: "Brand Story" },
];

export function AiVideoPromptWorkspace() {
  const [clientId, setClientId] = useState("");
  const [provider, setProvider] = useState<Provider>("runway");
  const [shotType, setShotType] = useState<ShotType>("cinematic");
  const [concept, setConcept] = useState("");
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  async function handleGenerate() {
    if (!client) return;
    setGenerating(true);

    const aiPrompt = buildAiPrompt("reel", client, { concept, provider, shotType });
    const ai = await aiGenerate(
      `Generate a detailed AI video prompt for ${provider.toUpperCase()} based on: ${aiPrompt}`,
      { system: "You are an expert AI video director. Write precise, provider-specific video generation prompts." },
    );

    setOutput(ai ?? generateVideoPrompt(client, concept, provider, shotType));
    setGenerating(false);
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: "script",
      title: `${provider.toUpperCase()} Prompt — ${concept || client.name}`,
      body: output,
      tags: ["ai-video-prompt", provider, shotType],
    });
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <SectionCard title="Configuration" bodyClassName="space-y-4">
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Client</label>
            <ClientSelector value={clientId} onChange={setClientId} className="w-full" />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Provider</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProvider(p.value)}
                  className={cn(
                    "px-3 py-2 rounded-md border text-left transition-colors",
                    provider === p.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  <div className="text-xs font-medium">{p.label}</div>
                  <div className="text-2xs text-fg-subtle mt-0.5">{p.badge}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Shot Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SHOT_TYPES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setShotType(s.value)}
                  className={cn(
                    "px-3 py-2 rounded-md border text-xs font-medium transition-colors",
                    shotType === s.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Visual Concept
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. product reveal at golden hour…"
              className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!clientId || generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-2 animate-pulse" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>
        </SectionCard>

        {client && (
          <SectionCard title="Brand Visual Style" bodyClassName="space-y-2 text-xs">
            {client.brandKit.visualStyle && (
              <div>
                <span className="text-fg-subtle">Style: </span>
                <span className="text-fg-muted">{client.brandKit.visualStyle}</span>
              </div>
            )}
            {client.brandKit.palette.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-fg-subtle">Palette:</span>
                {client.brandKit.palette.slice(0, 5).map((p, i) => (
                  <span
                    key={i}
                    className="inline-block h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: p.hex }}
                    title={p.name || p.hex}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Generated Prompt"
          action={
            output && client ? (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving…" : "Save Prompt"}
              </Button>
            ) : null
          }
        >
          {output ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full min-h-[400px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 font-mono leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Select a client and provider, then click Generate.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Prompts" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="script" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
