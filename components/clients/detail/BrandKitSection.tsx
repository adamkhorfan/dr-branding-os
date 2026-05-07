"use client";

import { useState } from "react";
import { Pencil, Palette, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types/client";
import { BrandKitEditDialog } from "./BrandKitEditDialog";

interface BrandKitSectionProps {
  client: Client;
}

export function BrandKitSection({ client }: BrandKitSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const bk = client.brandKit;

  const isEmpty =
    bk.palette.length === 0 &&
    !bk.toneOfVoice &&
    !bk.visualStyle &&
    !bk.typographyPrimary &&
    !bk.preferredLanguage &&
    bk.contentDos.length === 0 &&
    bk.contentDonts.length === 0 &&
    !bk.logoNotes &&
    !bk.positioningStatement &&
    bk.audienceEmotions.length === 0;

  return (
    <>
      <SectionCard
        title="Brand Kit"
        description="Colors, typography, voice, visual style, content rules, and brand positioning"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
            Edit
          </Button>
        }
        bodyClassName="p-0"
      >
        {isEmpty ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-elevated">
              <Palette
                className="h-4 w-4 text-fg-subtle"
                strokeWidth={1.75}
              />
            </div>
            <div className="text-sm text-fg-muted">No brand kit yet</div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditOpen(true)}
            >
              Build the brand kit
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Colors */}
            {bk.palette.length > 0 && (
              <Block label="Colors">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bk.palette.map((c, i) => (
                    <li
                      key={`${c.hex}-${i}`}
                      className="flex items-center gap-3 rounded-md border border-border bg-bg-inset px-3 py-2"
                    >
                      <span
                        className="h-7 w-7 rounded-md border border-border-strong shrink-0"
                        style={{ background: c.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-fg tabular">
                          {c.hex.toUpperCase()}
                        </div>
                        {c.name && (
                          <div className="text-xs text-fg-subtle truncate">
                            {c.name}
                          </div>
                        )}
                      </div>
                      {c.role && (
                        <Badge variant="outline" className="shrink-0">
                          {c.role}
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {/* Typography */}
            {(bk.typographyPrimary ||
              bk.typographySecondary ||
              bk.typographyNotes) && (
              <Block label="Typography">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <Field label="Primary" value={bk.typographyPrimary} />
                  <Field label="Secondary" value={bk.typographySecondary} />
                  {bk.typographyNotes && (
                    <div className="sm:col-span-2">
                      <Field label="Notes" value={bk.typographyNotes} multiline />
                    </div>
                  )}
                </dl>
              </Block>
            )}

            {/* Voice + style */}
            {(bk.toneOfVoice || bk.visualStyle) && (
              <Block label="Voice & Style">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <Field
                    label="Tone of voice"
                    value={bk.toneOfVoice}
                    multiline
                  />
                  <Field
                    label="Visual style"
                    value={bk.visualStyle}
                    multiline
                  />
                </dl>
              </Block>
            )}

            {/* Logo */}
            {(bk.logoUrl || bk.logoNotes) && (
              <Block label="Logo">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <Field label="Logo URL" value={bk.logoUrl} mono />
                  <Field label="Logo notes" value={bk.logoNotes} multiline />
                </dl>
              </Block>
            )}

            {/* Content rules */}
            {(bk.contentDos.length > 0 || bk.contentDonts.length > 0) && (
              <Block label="Content rules">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <RulesList
                    title="Do"
                    tone="success"
                    items={bk.contentDos}
                  />
                  <RulesList
                    title="Don't"
                    tone="danger"
                    items={bk.contentDonts}
                  />
                </div>
              </Block>
            )}

            {/* Language */}
            {bk.preferredLanguage && (
              <Block label="Language">
                <Field
                  label="Preferred language"
                  value={bk.preferredLanguage}
                />
              </Block>
            )}

            {/* Positioning statement */}
            {bk.positioningStatement && (
              <Block label="Positioning statement">
                <Field
                  label="How the brand is positioned in the market"
                  value={bk.positioningStatement}
                  multiline
                />
              </Block>
            )}

            {/* Audience emotions */}
            {bk.audienceEmotions.length > 0 && (
              <Block label="Audience emotions">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
                    <Heart className="h-3.5 w-3.5" strokeWidth={1.75} />
                    How the audience should feel
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {bk.audienceEmotions.map((e, i) => (
                      <Badge key={i} variant="accent">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Block>
            )}
          </div>
        )}
      </SectionCard>

      <BrandKitEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5">
      <div className="text-2xs uppercase tracking-[0.12em] font-medium text-fg-subtle mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  multiline,
  mono,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <dt className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
        {label}
      </dt>
      <dd
        className={`text-sm text-fg ${multiline ? "leading-relaxed whitespace-pre-wrap" : ""} ${
          mono ? "font-mono text-xs break-all" : ""
        }`}
      >
        {value ?? <span className="text-fg-subtle italic">Not set</span>}
      </dd>
    </div>
  );
}

function RulesList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "success" | "danger";
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div
        className={`text-2xs uppercase tracking-[0.08em] font-medium ${
          tone === "success" ? "text-success" : "text-danger"
        }`}
      >
        {title}
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-fg-subtle italic">Not set</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-fg leading-relaxed flex items-start gap-2"
            >
              <span
                className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${
                  tone === "success" ? "bg-success" : "bg-danger"
                }`}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
