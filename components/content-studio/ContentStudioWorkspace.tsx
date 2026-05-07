"use client";

import { useState } from "react";
import { PenSquare, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { SavedOutputsList } from "@/components/studio/SavedOutputsList";
import { SectionCard } from "@/components/shared/SectionCard";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { generatePost } from "@/lib/studio/generators";
import type { ContentType, Platform } from "@/types/content";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X (Twitter)" },
];

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "post", label: "Feed Post" },
  { value: "caption", label: "Caption Only" },
  { value: "story", label: "Story" },
];

export function ContentStudioWorkspace() {
  const [clientId, setClientId] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);

  const { clients } = useClientsStore();
  const { create } = useContentStore();

  const client = clients.find((c) => c.id === clientId);

  function handleGenerate() {
    if (!client) return;
    setOutput(generatePost(client, platform, contentType, topic));
  }

  async function handleSave() {
    if (!client || !output) return;
    setSaving(true);
    await create({
      clientId: client.id,
      type: contentType,
      title: topic || `${CONTENT_TYPES.find((t) => t.value === contentType)?.label} — ${client.name}`,
      body: output,
      platforms: [platform],
      tags: [platform, contentType],
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
              Platform
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={cn(
                    "px-3 py-2 rounded-md border text-xs font-medium transition-colors",
                    platform === p.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setContentType(t.value)}
                  className={cn(
                    "px-2 py-2 rounded-md border text-xs font-medium transition-colors",
                    contentType === t.value
                      ? "border-accent/50 bg-accent/8 text-fg"
                      : "border-border bg-bg-base hover:bg-bg-elevated text-fg-muted",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted mb-1.5 block">
              Topic / Brief
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. launching our new service…"
              className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <Button onClick={handleGenerate} disabled={!clientId} className="w-full">
            <PenSquare className="h-3.5 w-3.5 mr-2" />
            Generate Content
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
              className="w-full min-h-[340px] bg-bg-inset border border-border rounded-md text-sm text-fg p-3 leading-relaxed resize-y focus:outline-none focus:border-accent/50 transition-colors"
            />
          ) : (
            <div className="py-12 text-center text-sm text-fg-subtle">
              Configure your content above, then click Generate.
            </div>
          )}
        </SectionCard>

        {clientId && (
          <SectionCard title="Saved Content" bodyClassName="p-0">
            <SavedOutputsList clientId={clientId} filterType="post" />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
