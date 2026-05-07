"use client";

import { useState } from "react";
import { Clapperboard, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generateMotionStoryboard, buildAiPrompt } from "@/lib/studio/generators";
import { aiGenerate } from "@/lib/studio/aiClient";

const SCENE_OPTIONS = [3, 4, 5, 6, 7, 8];
const DURATION_OPTIONS = [15, 30, 45, 60, 90];

export function MotionVideoWorkspace() {
  const [clientId, setClientId] = useState("");
  const [concept, setConcept] = useState("");
  const [sceneCount, setSceneCount] = useState(5);
  const [duration, setDuration] = useState(30);
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  async function handleGenerate() {
    if (!client) return;
    setGenerating(true);

    const aiPrompt = buildAiPrompt("reel", client, { concept, duration: String(duration) });
    const ai = await aiGenerate(
      `Create a motion video storyboard (${sceneCount} scenes, ${duration}s) for: ${aiPrompt}. Format each scene with: scene number, type, visual description, motion direction, copy, and timing.`,
      { system: "You are a motion designer and video director. Create detailed, production-ready storyboards." },
    );

    setOutput(ai ?? generateMotionStoryboard(client, concept, sceneCount, duration));
    setGenerating(false);
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: "script",
      title: `Motion Storyboard — ${concept || client.name} (${duration}s)`,
      body: output,
      tags: ["motion", "storyboard", `${duration}s`],
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
              Video Concept
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. brand launch announcement…"
              className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Number of Scenes
            </label>
            <div className="grid grid-cols-6 gap-1">
              {SCENE_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSceneCount(n)}
                  className={cn(
                    "py-1.5 rounded-md border text-xs font-medium transition-colors",
                    sceneCount === n
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Total Duration
            </label>
            <div className="grid grid-cols-5 gap-1">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "py-1.5 rounded-md border text-xs font-medium transition-colors",
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
                <Clapperboard className="h-3.5 w-3.5 mr-2" />
                Generate Storyboard
              </>
            )}
          </Button>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Storyboard"
          action={
            output && client ? (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving…" : "Save Storyboard"}
              </Button>
            ) : null
          }
        >
          {output ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full min-h-[460px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 font-mono leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Configure your video concept and click Generate Storyboard.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Storyboards" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="script" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
