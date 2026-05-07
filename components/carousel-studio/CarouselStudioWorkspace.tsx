"use client";

import { useState } from "react";
import { LayoutGrid, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generateCarousel } from "@/lib/studio/generators";

const SLIDE_OPTIONS = [3, 5, 7, 10];

export function CarouselStudioWorkspace() {
  const [clientId, setClientId] = useState("");
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState(5);
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  function handleGenerate() {
    if (!client) return;
    setOutput(generateCarousel(client, topic, slides));
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: "carousel",
      title: topic || `${slides}-Slide Carousel — ${client.name}`,
      body: output,
      platforms: ["instagram"],
      tags: ["carousel", `${slides}-slides`],
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
              Carousel Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 mistakes to avoid…"
              className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Number of Slides
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {SLIDE_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSlides(n)}
                  className={cn(
                    "py-2 rounded-md border text-sm font-medium transition-colors",
                    slides === n
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-fg-subtle mt-1">
              Includes cover + {slides - 2} content slides + CTA
            </p>
          </div>

          <Button onClick={handleGenerate} disabled={!clientId} className="w-full">
            <LayoutGrid className="h-3.5 w-3.5 mr-2" />
            Generate Carousel
          </Button>
        </SectionCard>
      </div>

      {/* Output + saved */}
      <div className="space-y-4">
        <SectionCard
          title="Slide Structure"
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
              className="w-full min-h-[420px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 font-mono leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Enter a topic and click Generate to build your carousel structure.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Carousels" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="carousel" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
