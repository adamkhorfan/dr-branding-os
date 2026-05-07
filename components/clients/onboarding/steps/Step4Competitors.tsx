"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { WizardData } from "../wizardTypes";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function Step4Competitors({ data, onChange }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function add() {
    if (!name.trim()) return;
    onChange({
      competitors: [...data.competitors, { name: name.trim(), url: url.trim() }],
    });
    setName("");
    setUrl("");
  }

  function remove(i: number) {
    onChange({ competitors: data.competitors.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg">Competitors</h2>
        <p className="text-sm text-fg-muted mt-1">
          Who are they competing with? This informs positioning and content differentiation.
          <span className="text-fg-subtle"> (optional — you can skip)</span>
        </p>
      </div>

      {/* Add form */}
      <div className="flex gap-2 items-end">
        <div className="space-y-1.5 flex-1">
          <Label>Competitor name</Label>
          <Input
            placeholder="e.g. The Modist"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div className="space-y-1.5 flex-1">
          <Label>Website (optional)</Label>
          <Input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={add}
          disabled={!name.trim()}
          className="gap-1.5 mb-0"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add
        </Button>
      </div>

      {/* List */}
      {data.competitors.length > 0 ? (
        <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {data.competitors.map((c, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 bg-bg-inset">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-fg">{c.name}</div>
                {c.url && (
                  <div className="text-xs text-fg-subtle truncate">{c.url}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-fg-subtle hover:text-danger transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-dashed border-border rounded-lg px-6 py-8 text-center text-sm text-fg-subtle">
          No competitors added yet. You can skip this step.
        </div>
      )}
    </div>
  );
}
