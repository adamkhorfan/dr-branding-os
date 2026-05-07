import { Badge } from "@/components/ui/badge";
import type { Status } from "@/types/common";
import type { WorkflowStage } from "@/types/workflow";

const STATUS_VARIANT: Record<
  Status | WorkflowStage,
  "default" | "accent" | "success" | "warning" | "danger" | "info" | "outline"
> = {
  active: "success",
  paused: "warning",
  archived: "outline",
  draft: "outline",
  "in-progress": "info",
  "pending-approval": "warning",
  completed: "success",
};

const STATUS_LABEL: Record<Status | WorkflowStage, string> = {
  active: "Active",
  paused: "Paused",
  archived: "Archived",
  draft: "Draft",
  "in-progress": "In progress",
  "pending-approval": "Pending approval",
  completed: "Completed",
};

interface StatusBadgeProps {
  status: Status | WorkflowStage;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
  );
}
