"use client";

import Link from "next/link";
import { CheckCircle2, Circle, XCircle, MinusCircle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatRelative, initials } from "@/lib/utils";
import type { WorkflowInstance, StepStatus } from "@/types/workflow";
import type { Client } from "@/types/client";
import type { WorkflowDefinition } from "@/types/workflow";

interface WorkflowCardProps {
  instance: WorkflowInstance;
  client?: Client;
  definition?: WorkflowDefinition;
}

function stepIcon(status: StepStatus | "pending") {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={1.75} />;
    case "rejected":
      return <XCircle className="h-3.5 w-3.5 text-danger" strokeWidth={1.75} />;
    case "skipped":
      return <MinusCircle className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.75} />;
    case "awaiting-approval":
      return <Clock className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />;
    default:
      return <Circle className="h-3.5 w-3.5 text-fg-subtle/50" strokeWidth={1.75} />;
  }
}

export function WorkflowCard({ instance, client, definition }: WorkflowCardProps) {
  const href = `/workflows/${instance.id}`;

  const currentStep = definition?.steps.find((s) => s.id === instance.currentStepId);

  const doneCount =
    definition?.steps.filter((s) => {
      const st = instance.stepStates[s.id]?.status;
      return st === "completed" || st === "skipped";
    }).length ?? 0;

  const totalSteps = definition?.steps.length ?? 0;
  const progress = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  return (
    <Link
      href={href}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-bg-elevated/40 transition-colors"
    >
      {/* Avatar */}
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-inset text-xs font-medium text-fg-muted shrink-0">
        {client ? initials(client.name) : "—"}
      </div>

      {/* Center */}
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-fg">
            {definition?.name ?? instance.definitionKey}
          </span>
          {client && (
            <span className="text-xs text-fg-subtle truncate">
              · {client.name}
            </span>
          )}
        </div>

        <div className="text-xs text-fg-subtle truncate">
          {instance.status === "completed"
            ? "All steps complete"
            : currentStep
            ? `Current: ${currentStep.title}`
            : "Not started"}
        </div>

        {totalSteps > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-[3px] w-28 rounded-full bg-bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-accent/80 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-2xs text-fg-subtle tabular">
              {doneCount}/{totalSteps} steps
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusBadge status={instance.status} />
        <span className="text-2xs text-fg-subtle tabular">
          {formatRelative(instance.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
