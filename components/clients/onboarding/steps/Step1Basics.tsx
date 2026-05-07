"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WizardData } from "../wizardTypes";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function Step1Basics({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-fg">Client basics</h2>
        <p className="text-sm text-fg-muted mt-1">Start with the essentials — name, industry, and primary contact.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="wz-name">Client name <span className="text-danger">*</span></Label>
          <Input
            id="wz-name"
            placeholder="e.g. Atelier Noir"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wz-industry">Industry</Label>
          <Input
            id="wz-industry"
            placeholder="e.g. Luxury fashion"
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wz-website">Website</Label>
          <Input
            id="wz-website"
            placeholder="https://..."
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wz-contact-name">Contact name</Label>
          <Input
            id="wz-contact-name"
            placeholder="Primary point of contact"
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wz-contact-email">Contact email</Label>
          <Input
            id="wz-contact-email"
            type="email"
            placeholder="contact@client.com"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
