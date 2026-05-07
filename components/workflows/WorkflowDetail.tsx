"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  XCircle,
  MinusCircle,
  Clock,
  Loader2,
  MoreHorizontal,
  Archive,
  RotateCcw,
  Trash2,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { useClientsStore } from "@/store/useClientsStore";
import { WORKFLOW_DEFINITIONS } from "@/lib/workflows/definitions";
import type { WorkflowInstance, WorkflowStepDefinition, StepStatus } from "@/types/workflow";
import type { Client } from "@/types/client";
import type { WorkflowDefinition } from "@/types/workflow";

// ─── Helper: effective step display status ───────────────────────────────────

type DisplayStatus = "active" | "completed" | "rejected" | "skipped" | "pending";

function getDisplayStatus(
  stepId: string,
  instance: WorkflowInstance,
): DisplayStatus {
  if (stepId === instance.currentStepId) return "active";
  const st = instance.stepStates[stepId]?.status as StepStatus | undefined;
  if (st === "completed") return "completed";
  if (st === "rejected") return "rejected";
  if (st === "skipped") return "skipped";
  return "pending";
}

// ─── Step list item ──────────────────────────────────────────────────────────

function StepListItem({
  step,
  index,
  status,
  onClick,
}: {
  step: WorkflowStepDefinition;
  index: number;
  status: DisplayStatus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 rounded-md text-left transition-colors",
        status === "active"
          ? "bg-bg-elevated border border-border"
          : "hover:bg-bg-elevated/50",
      )}
    >
      {/* Icon */}
      <span className="mt-0.5 shrink-0">
        {status === "completed" && (
          <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} />
        )}
        {status === "rejected" && (
          <XCircle className="h-4 w-4 text-danger" strokeWidth={1.75} />
        )}
        {status === "skipped" && (
          <MinusCircle className="h-4 w-4 text-fg-subtle" strokeWidth={1.75} />
        )}
        {status === "active" && (
          <span className="flex h-4 w-4 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
        {status === "pending" && (
          <Circle className="h-4 w-4 text-fg-subtle/40" strokeWidth={1.75} />
        )}
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-xs font-medium leading-snug",
            status === "active" ? "text-fg" : "text-fg-muted",
            status === "pending" && "text-fg-subtle",
          )}
        >
          <span className="text-2xs text-fg-subtle/70 tabular mr-1.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          {step.title}
        </div>
        {status === "active" && (
          <div className="text-2xs text-accent/80 mt-0.5 uppercase tracking-[0.08em]">
            Current
          </div>
        )}
        {status === "completed" && (
          <div className="text-2xs text-success/70 mt-0.5 uppercase tracking-[0.08em]">
            Done
          </div>
        )}
        {status === "rejected" && (
          <div className="text-2xs text-danger/70 mt-0.5 uppercase tracking-[0.08em]">
            Changes requested
          </div>
        )}
        {status === "skipped" && (
          <div className="text-2xs text-fg-subtle mt-0.5 uppercase tracking-[0.08em]">
            Skipped
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Step type badge ─────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  user: "Manual step",
  ai: "AI automated",
  approval: "Approval",
  export: "Export",
};

const TYPE_VARIANT: Record<
  string,
  "default" | "accent" | "info" | "warning" | "outline"
> = {
  user: "default",
  ai: "info",
  approval: "warning",
  export: "outline",
};

// ─── Step panel ───────────────────────────────────────────────────────────────

interface StepPanelProps {
  step: WorkflowStepDefinition;
  stepIndex: number;
  totalSteps: number;
  instance: WorkflowInstance;
  isActive: boolean;
  onAdvance: (notes: string, nextStepId: string | null) => Promise<void>;
  onReject: (notes: string, nextStepId: string | null) => Promise<void>;
  onSkip: (nextStepId: string | null) => Promise<void>;
}

function StepPanel({
  step,
  stepIndex,
  totalSteps,
  instance,
  isActive,
  onAdvance,
  onReject,
  onSkip,
}: StepPanelProps) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stepState = instance.stepStates[step.id];
  const displayStatus = getDisplayStatus(step.id, instance);

  const nextStepId = step.nextOnSuccess ?? null;
  const rejectNextStepId = step.nextOnReject ?? null;

  async function handleAdvance() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onAdvance(notes.trim() || "", nextStepId);
      setNotes("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onReject(notes.trim() || "", rejectNextStepId);
      setNotes("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSkip() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSkip(nextStepId);
    } finally {
      setSubmitting(false);
    }
  }

  // Read-only view for completed/skipped/rejected steps
  if (!isActive && displayStatus !== "pending") {
    return (
      <div className="space-y-6">
        <StepMeta step={step} stepIndex={stepIndex} totalSteps={totalSteps} />
        <div
          className={cn(
            "rounded-md border px-5 py-4 space-y-2",
            displayStatus === "completed" && "border-success/20 bg-success/5",
            displayStatus === "rejected" && "border-danger/20 bg-danger/5",
            displayStatus === "skipped" && "border-border bg-bg-inset",
          )}
        >
          <div
            className={cn(
              "text-2xs uppercase tracking-[0.08em] font-medium",
              displayStatus === "completed" && "text-success",
              displayStatus === "rejected" && "text-danger",
              displayStatus === "skipped" && "text-fg-subtle",
            )}
          >
            {displayStatus === "completed" && "Step completed"}
            {displayStatus === "rejected" && "Changes requested"}
            {displayStatus === "skipped" && "Step skipped"}
          </div>
          {stepState?.notes && (
            <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">
              {stepState.notes}
            </p>
          )}
          {!stepState?.notes && (
            <p className="text-sm text-fg-subtle italic">No notes recorded.</p>
          )}
          {stepState?.completedAt && (
            <div className="text-2xs text-fg-subtle tabular pt-1">
              {formatRelative(stepState.completedAt)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pending (not yet reached)
  if (!isActive) {
    return (
      <div className="space-y-6">
        <StepMeta step={step} stepIndex={stepIndex} totalSteps={totalSteps} />
        <div className="rounded-md border border-dashed border-border bg-bg-inset px-5 py-8 text-center">
          <p className="text-sm text-fg-subtle">
            This step will unlock when the workflow reaches it.
          </p>
        </div>
      </div>
    );
  }

  // ── Active step ──

  // AI / export steps: show coming-soon state
  if (step.type === "ai" || step.type === "export") {
    return (
      <div className="space-y-6">
        <StepMeta step={step} stepIndex={stepIndex} totalSteps={totalSteps} />
        <div className="rounded-md border border-info/20 bg-info/5 px-5 py-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-info" strokeWidth={1.75} />
            <span className="text-sm font-medium text-info">
              {step.type === "ai" ? "AI automation" : "Export step"} — arriving in M4
            </span>
          </div>
          <p className="text-sm text-fg-muted leading-relaxed">
            {step.type === "ai"
              ? "Strategy Lab and Content Studio will automate this step in Milestone 4. Until then, you can skip it or complete it manually with your own notes below."
              : "Export and delivery features arrive in M5. Skip this step to continue."}
          </p>
        </div>

        {step.type === "ai" && (
          <div className="space-y-2">
            <label className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
              Manual notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add your own output or notes for this step…"
            />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSkip}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Skip step"
            )}
          </Button>
          {step.type === "ai" && (
            <Button
              type="button"
              size="sm"
              onClick={handleAdvance}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Complete manually"
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // User step
  if (step.type === "user") {
    return (
      <div className="space-y-6">
        <StepMeta step={step} stepIndex={stepIndex} totalSteps={totalSteps} />

        <div className="space-y-2">
          <label className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
            Notes / output
            <span className="text-fg-subtle/60 ml-1">(optional)</span>
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Add notes, decisions, or output for this step…"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAdvance}
            disabled={submitting}
            className="gap-1.5"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                Mark complete
                <span className="text-accent-fg/60 text-2xs">
                  {nextStepId ? "→" : "· Finish"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Approval step
  return (
    <div className="space-y-6">
      <StepMeta step={step} stepIndex={stepIndex} totalSteps={totalSteps} />

      <div className="space-y-2">
        <label className="text-2xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
          Review notes
          <span className="text-fg-subtle/60 ml-1">(optional)</span>
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add approval notes, feedback, or reason for changes…"
          autoFocus
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleReject}
          disabled={submitting}
          className="text-danger border-danger/20 hover:border-danger/40 hover:bg-danger/5"
        >
          {submitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Request changes"
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleAdvance}
          disabled={submitting}
          className="gap-1.5"
        >
          {submitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              Approve
              <span className="text-accent-fg/60 text-2xs">
                {nextStepId ? "→" : "· Complete"}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Step meta header ─────────────────────────────────────────────────────────

function StepMeta({
  step,
  stepIndex,
  totalSteps,
}: {
  step: WorkflowStepDefinition;
  stepIndex: number;
  totalSteps: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xs text-fg-subtle tabular font-medium">
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <Badge variant={TYPE_VARIANT[step.type] ?? "default"}>
          {TYPE_LABEL[step.type] ?? step.type}
        </Badge>
      </div>
      <h2 className="text-display text-2xl tracking-tighter2 text-fg leading-tight">
        {step.title}
      </h2>
      <p className="text-sm text-fg-muted leading-relaxed max-w-prose">
        {step.description}
      </p>
      {step.expectedOutput && (
        <div className="flex items-center gap-2">
          <span className="text-2xs uppercase tracking-[0.08em] text-fg-subtle">
            Expected output:
          </span>
          <span className="text-2xs text-fg-muted">{step.expectedOutput}</span>
        </div>
      )}
    </div>
  );
}

// ─── Completion banner ────────────────────────────────────────────────────────

function CompletionBanner({
  instance,
  definition,
}: {
  instance: WorkflowInstance;
  definition: WorkflowDefinition;
}) {
  return (
    <div className="rounded-md border border-success/20 bg-success/5 px-6 py-6 space-y-3">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.75} />
        <h3 className="text-sm font-medium text-fg">Workflow complete</h3>
      </div>
      <p className="text-sm text-fg-muted leading-relaxed">
        {definition.name} finished{" "}
        {instance.completedAt ? formatRelative(instance.completedAt) : ""}.
      </p>
      {definition.outputs.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-2xs uppercase tracking-[0.08em] text-fg-subtle">
            Outputs produced
          </div>
          <ul className="space-y-1">
            {definition.outputs.map((o, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-fg-muted">
                <span className="h-1 w-1 rounded-full bg-success shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkflowDetailProps {
  instanceId: string;
}

export function WorkflowDetail({ instanceId }: WorkflowDetailProps) {
  const router = useRouter();
  const { instances, loaded, load, advanceStep, rejectStep, skipStep, setStatus, remove } =
    useWorkflowsStore();
  const { clients, loaded: clientsLoaded, load: loadClients } = useClientsStore();

  const [viewingStepId, setViewingStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
    if (!clientsLoaded) loadClients();
  }, [loaded, load, clientsLoaded, loadClients]);

  if (!loaded || !clientsLoaded) {
    return <div className="text-sm text-fg-subtle py-8">Loading…</div>;
  }

  const instance = instances.find((i) => i.id === instanceId);
  if (!instance) {
    return (
      <EmptyState
        icon={Share2}
        title="Workflow not found"
        description="This workflow may have been deleted or the link is incorrect."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/workflows">Back to workflows</Link>
          </Button>
        }
      />
    );
  }

  const definition = WORKFLOW_DEFINITIONS[instance.definitionKey];
  if (!definition) {
    return (
      <EmptyState
        icon={Share2}
        title="Unknown workflow type"
        description={`No definition found for "${instance.definitionKey}".`}
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/workflows">Back to workflows</Link>
          </Button>
        }
      />
    );
  }

  const client = clients.find((c) => c.id === instance.clientId);

  // The step to display in the panel (default: current step)
  const activePanelStepId = viewingStepId ?? instance.currentStepId;
  const activePanelStep =
    activePanelStepId
      ? definition.steps.find((s) => s.id === activePanelStepId)
      : null;
  const activePanelIndex = activePanelStep
    ? definition.steps.indexOf(activePanelStep)
    : 0;

  const isCurrentStep = activePanelStepId === instance.currentStepId;

  // Capture narrowed references for async closures
  const _instance = instance;
  const _definition = definition;

  async function handleAdvance(notes: string, nextStepId: string | null) {
    if (!_instance.currentStepId) return;
    await advanceStep(
      _instance.id,
      _instance.currentStepId,
      notes || undefined,
      notes || undefined,
      nextStepId,
    );
    setViewingStepId(null);
  }

  async function handleReject(notes: string, nextStepId: string | null) {
    if (!_instance.currentStepId) return;
    await rejectStep(_instance.id, _instance.currentStepId, notes || undefined, nextStepId);
    setViewingStepId(null);
  }

  async function handleSkip(nextStepId: string | null) {
    if (!_instance.currentStepId) return;
    await skipStep(_instance.id, _instance.currentStepId, nextStepId);
    setViewingStepId(null);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this workflow? This cannot be undone.")) return;
    await remove(_instance.id);
    router.push("/workflows");
  }

  const doneCount = _definition.steps.filter((s) => {
    const st = _instance.stepStates[s.id]?.status;
    return st === "completed" || st === "skipped";
  }).length;
  const progress =
    _definition.steps.length > 0
      ? Math.round((doneCount / _definition.steps.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
        <Link href="/workflows">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          All workflows
        </Link>
      </Button>

      {/* Header */}
      <div className="surface p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-display text-3xl tracking-tighter2 text-fg leading-none">
                {_definition.name}
              </h1>
              <StatusBadge status={_instance.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
              {client && <span>{client.name}</span>}
              {client && <span className="text-fg-subtle">·</span>}
              <span>
                {doneCount}/{_definition.steps.length} steps
              </span>
              <span className="text-fg-subtle">·</span>
              <span>{formatRelative(_instance.updatedAt)}</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-1.5 w-48 rounded-full bg-bg-elevated overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-2xs text-fg-subtle tabular">{progress}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {_instance.status !== "completed" && _instance.status !== "archived" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More actions">
                    <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => setStatus(_instance.id, "archived")}>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleDelete}
                    className="text-danger focus:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {_instance.status === "archived" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStatus(_instance.id, "in-progress")}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.75} />
                Restore
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion banner */}
      {_instance.status === "completed" && (
        <CompletionBanner instance={_instance} definition={_definition} />
      )}

      {/* Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        {/* Step list */}
        <div className="surface p-3 space-y-0.5 lg:sticky lg:top-6">
          <div className="px-3 pb-3 border-b border-border mb-2">
            <div className="text-2xs uppercase tracking-[0.12em] font-medium text-fg-subtle">
              Steps
            </div>
          </div>
          {_definition.steps.map((step, i) => (
            <StepListItem
              key={step.id}
              step={step}
              index={i}
              status={getDisplayStatus(step.id, _instance)}
              onClick={() =>
                setViewingStepId(
                  viewingStepId === step.id ? null : step.id,
                )
              }
            />
          ))}
        </div>

        {/* Step panel */}
        <div className="surface px-6 py-7">
          {activePanelStep ? (
            <StepPanel
              step={activePanelStep}
              stepIndex={activePanelIndex}
              totalSteps={_definition.steps.length}
              instance={_instance}
              isActive={isCurrentStep && _instance.status !== "completed" && _instance.status !== "archived"}
              onAdvance={handleAdvance}
              onReject={handleReject}
              onSkip={handleSkip}
            />
          ) : _instance.status === "completed" ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2
                className="h-8 w-8 text-success mx-auto"
                strokeWidth={1.5}
              />
              <p className="text-sm text-fg-muted">
                All steps complete. Select a step on the left to review it.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-fg-subtle">
                Select a step on the left to view or work on it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
