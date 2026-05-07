import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section className={cn("surface", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-medium text-fg tracking-tightish">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-fg-muted">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn("px-6 py-5", bodyClassName)}>{children}</div>
    </section>
  );
}
