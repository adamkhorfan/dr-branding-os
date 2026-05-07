"use client";

import { Moon, Sun, Rows3, Rows2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUiStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const density = useUiStore((s) => s.density);
  const setDensity = useUiStore((s) => s.setDensity);

  return (
    <div className="space-y-4">
      <SectionCard title="Profile" description="Your workspace identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Adam" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              defaultValue="adamkhirfan33@gmail.com"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="profile-role">Role</Label>
            <Input
              id="profile-role"
              defaultValue="Social Media Manager · Account Manager"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Appearance"
        description="Theme and density preferences are stored locally"
      >
        <div className="space-y-6">
          {/* Theme */}
          <div>
            <div className="text-sm font-medium text-fg mb-3">Theme</div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <ThemeOption
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                icon={<Moon className="h-3.5 w-3.5" strokeWidth={1.75} />}
                label="Dark"
                description="Recommended"
              />
              <ThemeOption
                active={theme === "light"}
                onClick={() => setTheme("light")}
                icon={<Sun className="h-3.5 w-3.5" strokeWidth={1.75} />}
                label="Light"
                description="Daytime mode"
              />
            </div>
          </div>

          {/* Density */}
          <div>
            <div className="text-sm font-medium text-fg mb-3">Density</div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <ThemeOption
                active={density === "comfortable"}
                onClick={() => setDensity("comfortable")}
                icon={<Rows3 className="h-3.5 w-3.5" strokeWidth={1.75} />}
                label="Comfortable"
                description="Default spacing"
              />
              <ThemeOption
                active={density === "compact"}
                onClick={() => setDensity("compact")}
                icon={<Rows2 className="h-3.5 w-3.5" strokeWidth={1.75} />}
                label="Compact"
                description="Denser tables"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Integrations"
        description="Add keys to .env.local to activate each integration"
      >
        <ul className="divide-y divide-border -mx-6">
          <IntegrationRow
            name="Anthropic Claude"
            detail="ANTHROPIC_API_KEY — powers all studio AI generation"
            status="ready"
            hint="Add to .env.local"
          />
          <IntegrationRow
            name="Supabase"
            detail="NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY — run supabase-migration.sql first"
            status="ready"
            hint="Auto-switches from localStorage"
          />
          <IntegrationRow
            name="n8n"
            detail="N8N_WEBHOOK_BASE_URL — enables direct webhook triggers from Campaign Builder"
            status="ready"
            hint="Add to .env.local"
          />
          <IntegrationRow name="Runway" detail="RUNWAY_API_KEY — AI video generation" status="planned" />
          <IntegrationRow name="Luma Dream Machine" detail="LUMA_API_KEY — AI video generation" status="planned" />
          <IntegrationRow name="Kling" detail="KLING_API_KEY — AI video generation" status="planned" />
        </ul>
      </SectionCard>

      <SectionCard
        title="Database"
        description="Current persistence layer"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-fg">localStorage</div>
              <div className="text-xs text-fg-subtle">Active — data stored in browser</div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between opacity-50">
            <div>
              <div className="text-sm font-medium text-fg">Supabase</div>
              <div className="text-xs text-fg-subtle">
                Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY to .env.local to activate
              </div>
            </div>
            <Badge variant="outline">Inactive</Badge>
          </div>
          <p className="text-xs text-fg-subtle pt-1 border-t border-border">
            Run <code className="bg-bg-inset px-1 rounded text-accent">lib/db/supabase-migration.sql</code> in your Supabase SQL editor, then add the two env vars. The app auto-switches on next restart — no code changes needed.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Notifications"
        description="Future — wired up alongside Messages module"
      >
        <NotifRow label="Approval received" defaultOn />
        <NotifRow label="Workflow completed" defaultOn />
        <NotifRow label="Daily digest" />
        <NotifRow label="Weekly report ready" defaultOn />
      </SectionCard>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
        active
          ? "border-accent/50 bg-accent/5"
          : "border-border bg-bg-inset hover:border-border-strong",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md border shrink-0 mt-0.5",
          active
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border bg-bg-base text-fg-muted",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-fg">{label}</div>
        <div className="text-xs text-fg-subtle mt-0.5">{description}</div>
      </div>
    </button>
  );
}

function IntegrationRow({
  name,
  detail,
  status,
  hint,
}: {
  name: string;
  detail: string;
  status: "connected" | "ready" | "planned";
  hint?: string;
}) {
  return (
    <li className="flex items-center justify-between px-6 py-3.5 gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-fg">{name}</div>
        <div className="text-xs text-fg-subtle">{detail}</div>
        {hint && <div className="text-2xs text-accent/80 mt-0.5">{hint}</div>}
      </div>
      <Badge
        variant={
          status === "connected" ? "success" : status === "ready" ? "info" : "outline"
        }
      >
        {status === "connected" ? "Connected" : status === "ready" ? "Ready" : "Planned"}
      </Badge>
    </li>
  );
}

function NotifRow({
  label,
  defaultOn,
}: {
  label: string;
  defaultOn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 border-b last:border-0 border-border">
      <span className="text-sm text-fg">{label}</span>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
