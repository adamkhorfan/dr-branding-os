import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center justify-center text-center gap-4 py-16 px-6",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-elevated">
          <Icon
            className="h-4 w-4 text-fg-subtle"
            strokeWidth={1.75}
          />
        </div>
      )}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-sm font-medium text-fg tracking-tightish">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-fg-muted leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
