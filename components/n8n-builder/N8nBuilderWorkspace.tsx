"use client";

import { useEffect, useState } from "react";
import {
  Network,
  Plus,
  Trash2,
  Download,
  Save,
  ChevronDown,
  ChevronRight,
  Play,
  StopCircle,
  Zap,
  Globe,
  Clock,
  GitBranch,
  Mail,
  MessageSquare,
  Webhook,
  Timer,
  StickyNote,
  FileCode2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionCard } from "@/components/shared/SectionCard";
import { useN8nFlowsStore } from "@/store/useN8nFlowsStore";
import { exportToN8nJson } from "@/lib/n8n/exportToN8n";
import { FLOW_TEMPLATES } from "@/lib/n8n/flowTemplates";
import type { N8nFlow, N8nFlowNode, N8nNodeType } from "@/types/n8n";

// ─── Node type metadata ───────────────────────────────────────────────────────

const NODE_DEFS: {
  type: N8nNodeType;
  label: string;
  group: string;
  icon: React.ElementType;
  color: string;
  defaultName: string;
  configFields: { key: string; label: string; placeholder: string }[];
}[] = [
  {
    type: "trigger.manual",
    label: "Manual Trigger",
    group: "Triggers",
    icon: Play,
    color: "text-success border-success/40 bg-success/8",
    defaultName: "Manual Start",
    configFields: [],
  },
  {
    type: "trigger.webhook",
    label: "Webhook",
    group: "Triggers",
    icon: Webhook,
    color: "text-success border-success/40 bg-success/8",
    defaultName: "Webhook Trigger",
    configFields: [
      { key: "path", label: "Path", placeholder: "my-webhook" },
      { key: "method", label: "Method", placeholder: "POST" },
    ],
  },
  {
    type: "trigger.schedule",
    label: "Schedule",
    group: "Triggers",
    icon: Clock,
    color: "text-success border-success/40 bg-success/8",
    defaultName: "Schedule Trigger",
    configFields: [
      { key: "interval", label: "Every", placeholder: "1" },
      { key: "unit", label: "Unit", placeholder: "hours / days / weeks" },
    ],
  },
  {
    type: "trigger.workflow",
    label: "Workflow Event",
    group: "Triggers",
    icon: Zap,
    color: "text-success border-success/40 bg-success/8",
    defaultName: "Workflow Trigger",
    configFields: [
      { key: "event", label: "Event", placeholder: "workflow.completed" },
    ],
  },
  {
    type: "action.http",
    label: "HTTP Request",
    group: "Actions",
    icon: Globe,
    color: "text-info border-info/40 bg-info/8",
    defaultName: "HTTP Request",
    configFields: [
      { key: "url", label: "URL", placeholder: "https://api.example.com/endpoint" },
      { key: "method", label: "Method", placeholder: "POST" },
      { key: "body", label: "Body (JSON)", placeholder: '{"key": "value"}' },
    ],
  },
  {
    type: "action.email",
    label: "Send Email",
    group: "Actions",
    icon: Mail,
    color: "text-info border-info/40 bg-info/8",
    defaultName: "Send Email",
    configFields: [
      { key: "to", label: "To", placeholder: "client@example.com" },
      { key: "subject", label: "Subject", placeholder: "Your content is ready" },
      { key: "body", label: "Body", placeholder: "Message body…" },
    ],
  },
  {
    type: "action.slack",
    label: "Slack Message",
    group: "Actions",
    icon: MessageSquare,
    color: "text-info border-info/40 bg-info/8",
    defaultName: "Slack Message",
    configFields: [
      { key: "channel", label: "Channel", placeholder: "#general" },
      { key: "message", label: "Message", placeholder: "Your message…" },
    ],
  },
  {
    type: "action.content",
    label: "Create Content",
    group: "Actions",
    icon: FileCode2,
    color: "text-info border-info/40 bg-info/8",
    defaultName: "Create Content Item",
    configFields: [
      { key: "url", label: "DR OS API URL", placeholder: "https://your-os.com/api/content" },
      { key: "body", label: "Payload (JSON)", placeholder: '{"clientId":"…","type":"post","title":"…"}' },
    ],
  },
  {
    type: "condition.if",
    label: "If Condition",
    group: "Logic",
    icon: GitBranch,
    color: "text-warning border-warning/40 bg-warning/8",
    defaultName: "If Condition",
    configFields: [
      { key: "field", label: "Field", placeholder: "status" },
      { key: "operator", label: "Operator", placeholder: "equal / notEqual / largerEqual" },
      { key: "value", label: "Value", placeholder: "in-review" },
    ],
  },
  {
    type: "delay",
    label: "Wait / Delay",
    group: "Logic",
    icon: Timer,
    color: "text-warning border-warning/40 bg-warning/8",
    defaultName: "Wait",
    configFields: [
      { key: "amount", label: "Amount", placeholder: "1" },
      { key: "unit", label: "Unit", placeholder: "hours / days" },
    ],
  },
  {
    type: "note",
    label: "Sticky Note",
    group: "Logic",
    icon: StickyNote,
    color: "text-fg-subtle border-border bg-bg-inset",
    defaultName: "Note",
    configFields: [{ key: "text", label: "Note", placeholder: "Describe what this flow does…" }],
  },
];

const GROUPS = ["Triggers", "Actions", "Logic"];

function defFor(type: N8nNodeType) {
  return NODE_DEFS.find((d) => d.type === type)!;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function N8nBuilderWorkspace() {
  const { flows, loaded, load, create, update, addNode, updateNode, removeNode, remove } =
    useN8nFlowsStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowDesc, setFlowDesc] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(GROUPS));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const active = flows.find((f) => f.id === activeId) ?? null;

  useEffect(() => {
    if (active) {
      setFlowName(active.name);
      setFlowDesc(active.description ?? "");
    }
  }, [active?.id]);

  async function handleCreate() {
    const flow = await create({ name: "Untitled Flow" });
    setActiveId(flow.id);
    setFlowName(flow.name);
    setFlowDesc("");
  }

  async function handleSave() {
    if (!active) return;
    setSaving(true);
    await update(active.id, { name: flowName || "Untitled Flow", description: flowDesc });
    setSaving(false);
  }

  function handleExport() {
    if (!active) return;
    const json = exportToN8nJson({ ...active, name: flowName, description: flowDesc });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(flowName || "flow").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleAddNode(type: N8nNodeType) {
    if (!active) return;
    const def = defFor(type);
    await addNode(active.id, {
      type,
      name: `${def.defaultName} ${active.nodes.filter((n) => n.type === type).length + 1}`,
      config: {},
    });
  }

  async function handleLoadTemplate(templateKey: string) {
    const tpl = FLOW_TEMPLATES.find((t) => t.key === templateKey);
    if (!tpl) return;
    const flow = await create({ name: tpl.name, description: tpl.description, nodes: tpl.nodes });
    setActiveId(flow.id);
    setFlowName(flow.name);
    setFlowDesc(flow.description ?? "");
  }

  function toggleGroup(g: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  }

  return (
    <div className="flex gap-0 rounded-xl border border-border overflow-hidden min-h-[680px] surface">
      {/* Left sidebar */}
      <div className="w-[260px] shrink-0 border-r border-border flex flex-col bg-bg-inset/30">
        {/* Flows list */}
        <div className="border-b border-border px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-fg-muted">Flows</span>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-2xs" onClick={handleCreate}>
              <Plus className="h-3 w-3 mr-1" /> New
            </Button>
          </div>
          {flows.length === 0 ? (
            <div className="text-2xs text-fg-subtle px-1">No flows yet.</div>
          ) : (
            <ul className="space-y-0.5">
              {flows.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setActiveId(f.id)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-md text-xs truncate transition-colors",
                      activeId === f.id
                        ? "bg-bg-elevated text-fg"
                        : "text-fg-muted hover:text-fg hover:bg-bg-elevated/60",
                    )}
                  >
                    <div className="truncate font-medium">{f.name}</div>
                    <div className="text-2xs text-fg-subtle">{f.nodes.length} nodes</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Node palette */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 pb-1">
            <span className="text-2xs uppercase tracking-wider text-fg-subtle font-medium">
              Add Node
            </span>
          </div>
          {GROUPS.map((group) => (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg transition-colors"
              >
                {expandedGroups.has(group) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                {group}
              </button>
              {expandedGroups.has(group) && (
                <ul className="px-2 pb-1 space-y-0.5">
                  {NODE_DEFS.filter((d) => d.group === group).map((def) => {
                    const Icon = def.icon;
                    return (
                      <li key={def.type}>
                        <button
                          onClick={() => handleAddNode(def.type)}
                          disabled={!active}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors",
                            active
                              ? "text-fg-muted hover:text-fg hover:bg-bg-elevated/60"
                              : "opacity-40 cursor-not-allowed text-fg-subtle",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-fg-subtle" strokeWidth={1.75} />
                          {def.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className="border-t border-border px-3 py-3">
          <div className="text-2xs uppercase tracking-wider text-fg-subtle font-medium mb-2">
            Templates
          </div>
          <ul className="space-y-1">
            {FLOW_TEMPLATES.map((tpl) => (
              <li key={tpl.key}>
                <button
                  onClick={() => handleLoadTemplate(tpl.key)}
                  className="w-full text-left px-2.5 py-2 rounded-md text-xs text-fg-muted hover:text-fg hover:bg-bg-elevated/60 transition-colors"
                >
                  <div className="font-medium truncate">{tpl.name}</div>
                  <div className="text-2xs text-fg-subtle mt-0.5">{tpl.nodes?.length ?? 0} nodes</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Flow editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={Network}
              title="No flow selected"
              description="Create a new flow or load a template from the left panel."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Flow
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Flow header */}
            <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
              <div className="flex-1 min-w-0 space-y-1.5">
                <input
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full text-sm font-medium text-fg bg-transparent border-b border-transparent hover:border-border focus:border-accent/50 focus:outline-none transition-colors py-0.5"
                  placeholder="Flow name…"
                />
                <input
                  value={flowDesc}
                  onChange={(e) => setFlowDesc(e.target.value)}
                  className="w-full text-xs text-fg-muted bg-transparent border-b border-transparent hover:border-border focus:border-accent/50 focus:outline-none transition-colors py-0.5"
                  placeholder="Description (optional)…"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => update(active.id, { active: !active.active })}
                  className={cn(
                    "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors",
                    active.active
                      ? "border-success/40 bg-success/8 text-success"
                      : "border-border text-fg-subtle hover:text-fg",
                  )}
                >
                  {active.active ? (
                    <><StopCircle className="h-3 w-3" /> Active</>
                  ) : (
                    <><Play className="h-3 w-3" /> Inactive</>
                  )}
                </button>
                <Button size="sm" variant="secondary" onClick={handleSave} disabled={saving}>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button size="sm" onClick={handleExport} disabled={active.nodes.length === 0}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Export JSON
                </Button>
                <button
                  onClick={() => { remove(active.id); setActiveId(null); }}
                  className="p-1.5 rounded text-fg-subtle hover:text-danger hover:bg-bg-elevated transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Node canvas */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {active.nodes.length === 0 ? (
                <div className="text-center py-16 text-sm text-fg-subtle">
                  Click a node type in the left panel to add it to this flow.
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-0">
                  {active.nodes.map((node, idx) => (
                    <FlowNodeCard
                      key={node.id}
                      node={node}
                      index={idx}
                      isLast={idx === active.nodes.length - 1}
                      selected={selectedNodeId === node.id}
                      onSelect={() =>
                        setSelectedNodeId(selectedNodeId === node.id ? null : node.id)
                      }
                      onConfigChange={(key, val) =>
                        updateNode(active.id, node.id, {
                          config: { ...node.config, [key]: val },
                        })
                      }
                      onNameChange={(name) => updateNode(active.id, node.id, { name })}
                      onRemove={() => removeNode(active.id, node.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* n8n export hint */}
            {active.nodes.length > 0 && (
              <div className="border-t border-border px-5 py-3 flex items-center gap-3">
                <FileCode2 className="h-3.5 w-3.5 text-fg-subtle shrink-0" />
                <p className="text-xs text-fg-subtle">
                  Export JSON → n8n → Settings → Workflows → Import from file. All node configs are mapped to native n8n node types.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Flow Node Card ───────────────────────────────────────────────────────────

interface FlowNodeCardProps {
  node: N8nFlowNode;
  index: number;
  isLast: boolean;
  selected: boolean;
  onSelect: () => void;
  onConfigChange: (key: string, val: string) => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

function FlowNodeCard({
  node,
  index,
  isLast,
  selected,
  onSelect,
  onConfigChange,
  onNameChange,
  onRemove,
}: FlowNodeCardProps) {
  const def = defFor(node.type);
  const Icon = def.icon;

  return (
    <div className="relative">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-3 left-5 w-px h-3 bg-border" />
      )}

      <div
        className={cn(
          "border rounded-lg transition-all",
          selected ? "border-accent/50 shadow-sm" : "border-border hover:border-border-strong",
        )}
      >
        {/* Node header */}
        <button
          onClick={onSelect}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          <div
            className={cn(
              "h-7 w-7 rounded-md border flex items-center justify-center shrink-0",
              def.color,
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-subtle tabular">{index + 1}.</span>
              <input
                value={node.name}
                onChange={(e) => onNameChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-fg bg-transparent focus:outline-none truncate flex-1"
              />
            </div>
            <div className="text-2xs text-fg-subtle mt-0.5">{def.label}</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className="text-2xs">
              {def.group}
            </Badge>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1 rounded text-fg-subtle hover:text-danger transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            {selected ? (
              <ChevronDown className="h-3.5 w-3.5 text-fg-subtle" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-fg-subtle" />
            )}
          </div>
        </button>

        {/* Config fields */}
        {selected && def.configFields.length > 0 && (
          <div className="border-t border-border px-4 py-3 grid grid-cols-1 gap-3 bg-bg-inset/30">
            {def.configFields.map((field) => (
              <div key={field.key}>
                <label className="text-2xs font-medium text-fg-subtle uppercase tracking-wider mb-1 block">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={node.config[field.key] ?? ""}
                  onChange={(e) => onConfigChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-8 rounded-md border border-border bg-bg-base text-xs text-fg px-2.5 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            ))}
          </div>
        )}

        {selected && def.configFields.length === 0 && (
          <div className="border-t border-border px-4 py-2.5 bg-bg-inset/30">
            <p className="text-xs text-fg-subtle">No configuration required for this node.</p>
          </div>
        )}
      </div>

      {/* Connector line to next */}
      {!isLast && (
        <div className="absolute -bottom-3 left-5 w-px h-3 bg-border" />
      )}
    </div>
  );
}
