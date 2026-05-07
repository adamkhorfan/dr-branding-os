"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChipsInput } from "@/components/shared/ChipsInput";
import { SwatchInput } from "@/components/shared/SwatchInput";
import { useClientsStore } from "@/store/useClientsStore";
import type { BrandKit, Client } from "@/types/client";

interface BrandKitEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client;
}

export function BrandKitEditDialog({
  open,
  onOpenChange,
  client,
}: BrandKitEditDialogProps) {
  const updateBrandKit = useClientsStore((s) => s.updateBrandKit);
  const [draft, setDraft] = useState<BrandKit>(client.brandKit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setDraft(client.brandKit);
  }, [open, client.brandKit]);

  function set<K extends keyof BrandKit>(key: K, value: BrandKit[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateBrandKit(client.id, draft);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit brand kit</DialogTitle>
          <DialogDescription>
            Colors, typography, voice, content rules — everything that defines
            the brand.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Colors */}
          <section className="space-y-2">
            <Label>Brand colors</Label>
            <SwatchInput
              value={draft.palette}
              onChange={(palette) => set("palette", palette)}
            />
          </section>

          {/* Typography */}
          <section className="space-y-3">
            <Label>Typography</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Primary typeface"
                value={draft.typographyPrimary ?? ""}
                onChange={(e) =>
                  set("typographyPrimary", e.target.value || undefined)
                }
              />
              <Input
                placeholder="Secondary typeface"
                value={draft.typographySecondary ?? ""}
                onChange={(e) =>
                  set("typographySecondary", e.target.value || undefined)
                }
              />
            </div>
            <Textarea
              placeholder="Typography notes — usage rules, hierarchy, weights…"
              value={draft.typographyNotes ?? ""}
              onChange={(e) =>
                set("typographyNotes", e.target.value || undefined)
              }
              rows={3}
            />
          </section>

          {/* Tone of voice */}
          <section className="space-y-2">
            <Label>Tone of voice</Label>
            <Textarea
              placeholder="How the brand speaks — confident, warm, minimal, technical…"
              value={draft.toneOfVoice ?? ""}
              onChange={(e) =>
                set("toneOfVoice", e.target.value || undefined)
              }
              rows={3}
            />
          </section>

          {/* Visual style */}
          <section className="space-y-2">
            <Label>Visual style</Label>
            <Textarea
              placeholder="Photography, layout, motion — the visual feel"
              value={draft.visualStyle ?? ""}
              onChange={(e) =>
                set("visualStyle", e.target.value || undefined)
              }
              rows={3}
            />
          </section>

          {/* Logo */}
          <section className="space-y-3">
            <Label>Logo</Label>
            <Input
              placeholder="Logo URL (optional)"
              value={draft.logoUrl ?? ""}
              onChange={(e) =>
                set("logoUrl", e.target.value || undefined)
              }
            />
            <Textarea
              placeholder="Logo usage notes — clear space, color rules, what not to do"
              value={draft.logoNotes ?? ""}
              onChange={(e) => set("logoNotes", e.target.value || undefined)}
              rows={2}
            />
          </section>

          {/* Content rules */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content do's</Label>
              <ChipsInput
                value={draft.contentDos}
                onChange={(v) => set("contentDos", v)}
                placeholder="Add and press Enter…"
              />
            </div>
            <div className="space-y-2">
              <Label>Content don'ts</Label>
              <ChipsInput
                value={draft.contentDonts}
                onChange={(v) => set("contentDonts", v)}
                placeholder="Add and press Enter…"
              />
            </div>
          </section>

          {/* Language */}
          <section className="space-y-2">
            <Label>Preferred language</Label>
            <Input
              placeholder="e.g. English, Arabic, French"
              value={draft.preferredLanguage ?? ""}
              onChange={(e) =>
                set("preferredLanguage", e.target.value || undefined)
              }
            />
          </section>

          {/* Positioning statement */}
          <section className="space-y-2">
            <Label>Positioning statement</Label>
            <Textarea
              placeholder="One or two sentences on how this brand is positioned — drives captions, scripts, and video context"
              value={draft.positioningStatement ?? ""}
              onChange={(e) =>
                set("positioningStatement", e.target.value || undefined)
              }
              rows={3}
            />
          </section>

          {/* Audience emotions */}
          <section className="space-y-2">
            <Label>Audience emotions</Label>
            <ChipsInput
              value={draft.audienceEmotions}
              onChange={(v) => set("audienceEmotions", v)}
              placeholder="e.g. aspiration, calm, trust, belonging"
              emptyHint="Add the emotions this brand should evoke in its audience."
            />
          </section>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save brand kit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
