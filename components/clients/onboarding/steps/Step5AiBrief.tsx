"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WizardData } from "../wizardTypes";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

function buildBriefPrompt(data: WizardData): string {
  return `You are a senior brand strategist at a marketing agency. Generate a comprehensive brand brief for a new client.

CLIENT INFORMATION:
- Name: ${data.name}
- Industry: ${data.industry || "Not specified"}
- Website: ${data.website || "Not specified"}
- Products/Services: ${data.offers || "Not specified"}
- Target Audience: ${data.audience || "Not specified"}
- Business Goals: ${data.goals.join(", ") || "Not specified"}
- Active Platforms: ${data.platforms.join(", ") || "Not specified"}
- Tone of Voice: ${data.toneOfVoice || "Not specified"}
- Visual Style: ${data.visualStyle || "Not specified"}
- Competitors: ${data.competitors.map((c) => c.name).join(", ") || "None listed"}

Generate the following in a clean, professional format:

**POSITIONING STATEMENT** (2-3 sentences max — what makes this brand unique):

**CONTENT PILLARS** (4 core themes for all content, each with a 1-line description):
1.
2.
3.
4.

**AUDIENCE INSIGHT** (1 paragraph — deep behavioral and emotional description of who they're speaking to):

**FIRST MONTH CONTENT IDEAS** (5 specific content ideas with format and hook):
1.
2.
3.
4.
5.

Keep it strategic, sharp, and agency-grade. No fluff.`;
}

export function Step5AiBrief({ data, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: buildBriefPrompt(data),
          maxTokens: 1200,
          system:
            "You are a senior brand strategist at a top marketing agency. Be sharp, strategic, and direct. Output clean structured text.",
        }),
      });
      const json = await res.json();
      const text: string = json.text ?? json.error ?? "Could not generate brief.";
      onChange({ aiBrief: text });
      setGenerated(true);
    } catch {
      onChange({ aiBrief: "AI generation failed. Please write the brief manually or try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-fg">AI strategy brief</h2>
        <p className="text-sm text-fg-muted mt-1">
          Generate a positioning statement, content pillars, and first-month content ideas based on everything you've entered.
        </p>
      </div>

      {!generated && !data.aiBrief ? (
        <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
            <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-medium text-fg">Ready to generate</div>
            <div className="text-xs text-fg-muted mt-1 max-w-sm">
              Click below to have AI create a full brand brief — positioning, content pillars, audience insight, and first month of ideas.
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            )}
            {loading ? "Generating brief…" : "Generate AI brief"}
          </Button>
          <div className="text-xs text-fg-subtle">
            Or skip this step and write the brief manually on the client page.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Brand brief</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generate}
              disabled={loading}
              className="gap-1.5 text-xs text-fg-muted"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" strokeWidth={1.75} />
              )}
              Regenerate
            </Button>
          </div>
          <Textarea
            value={data.aiBrief}
            onChange={(e) => onChange({ aiBrief: e.target.value })}
            rows={14}
            className="text-sm font-mono resize-none"
            placeholder="Brief will appear here after generation…"
          />
          <p className="text-xs text-fg-subtle">
            You can edit this directly. It will be saved as the client's positioning brief.
          </p>
        </div>
      )}
    </div>
  );
}
