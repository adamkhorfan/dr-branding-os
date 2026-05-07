import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6",
        className,
      )}
    >
      <div className="space-y-2 min-w-0">
        {eyebrow && (
          <div className="text-2xs uppercase tracking-[0.12em] font-medium text-accent/90">
            {eyebrow}
          </div>
        )}
        <h1 className="text-display text-3xl md:text-[34px] tracking-tighter2 text-fg leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-fg-muted max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
