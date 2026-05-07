import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/billing";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  if (status === "draft") {
    return (
      <Badge variant="outline" className={className}>
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "sent") {
    return (
      <Badge variant="info" className={className}>
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "paid") {
    return (
      <Badge variant="success" className={className}>
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "overdue") {
    return (
      <Badge variant="danger" className={className}>
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  // cancelled
  return (
    <Badge variant="outline" className={cn("line-through", className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
