"use client";

import { useState } from "react";
import { Type, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generateTextAnimation } from "@/lib/studio/generators";
import { aiGenerate } from "@/lib/studio/aiClient";

type AnimStyle = "stagger" | "kinetic" | "mask" | "glitch" | "fade";
type BgStyle = "gradient" | "brand-color" | "video-plate" | "dark";

const ANIM_STYLES: { value: AnimStyle; label: string; desc: string }[] = [
  { value: "stagger", label: "Stagger", desc: "Letter by letter" },
  { value: "kinetic", label: "Kinetic", desc: "Word bounce" },
  { value: "mask", label: "Mask", desc: "Sliding reveal" },
  { value: "glitch", label: "Glitch", desc: "Digital effect" },
  { value: "fade", label: "Fade", desc: "Premium drift" },
];

const BG_STYLES: { value: BgStyle; label: string }[] = [
  { value: "gradient", label: "Brand Gradient" },
  { value: "brand-color", label: "Solid Brand Color" },
  { value: "video-plate", label: "Video Plate" },
  { value: "dark", label: "Dark Background" },
];

const DURATION_OPTIONS = [5, 8, 10, 15];

export function TextAnimationWorkspace() {
  const [clientId, setClientId] = useState("");
  const [text, setText] = useState("");
  const [animStyle, setAnimStyle] = useState<AnimStyle>("fade");
  const [bgStyle, setBgStyle] = useState<BgStyle>("brand-color");
  const [duration, setDuration] = useState(8);
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  async function handleGenerate() {
    if (!client) return;
    setGenerating(true);

    let inputText = text;
    if (!inputText && client) {
      const ai = await aiGenerate(
        `Write a powerful, short (max 8 words) brand statement or quote for ${client.name} — a ${client.industry || "brand"} brand. Tone: ${client.brandKit.toneOfVoice || "premium and confident"}. Output only the statement, nothing else.`,
      );
      if (ai) inputText = ai.replace(/^["']|["']$/g, "");
    }

    setOutput(generateTextAnimation(client, inputText, animStyle, bgStyle, duration));
    setGenerating(false);
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: "script",
      title: `Text Animation — ${text.slice(0, 40) || client.name}`,
      body: output,
      tags: ["text-animation", animStyle, bgStyle],
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
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Text / Quote
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Leave blank to auto-generate from brand data…"
              rows={3}
              className="w-full rounded-md border border-border bg-bg-base text-sm text-fg px-3 py-2 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Animation Style
            </label>
            <div className="grid grid-cols-1 gap-1">
              {ANIM_STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setAnimStyle(s.value)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md border text-xs transition-colors",
                    animStyle === s.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-fg-subtle">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Background</label>
            <div className="grid grid-cols-2 gap-1.5">
              {BG_STYLES.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBgStyle(b.value)}
                  className={cn(
                    "px-2 py-2 rounded-md border text-xs font-medium transition-colors",
                    bgStyle === b.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">Duration</label>
            <div className="grid grid-cols-4 gap-1.5">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "py-2 rounded-md border text-xs font-medium transition-colors",
                    duration === d
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
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
                <Type className="h-3.5 w-3.5 mr-2" />
                Generate Plan
              </>
            )}
          </Button>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Animation Plan"
          action={
            output && client ? (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving…" : "Save Plan"}
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
              Configure above and click Generate. Leave text blank to auto-generate from brand data.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Plans" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="script" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
