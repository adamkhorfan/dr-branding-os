import { cn } from "@/lib/utils";

interface BrandMarkProps {
  collapsed?: boolean;
  className?: string;
}

export function BrandMark({ collapsed, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-8 w-8 shrink-0 rounded-md border border-border-strong bg-bg-inset flex items-center justify-center">
        <span className="text-display text-accent text-sm tracking-tighter2 leading-none">
          DR
        </span>
        <div className="absolute inset-0 rounded-md ring-1 ring-accent/10 pointer-events-none" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-medium text-fg tracking-tightish">
            DR Branding
          </span>
          <span className="text-2xs uppercase tracking-[0.12em] text-fg-subtle mt-0.5">
            OS
          </span>
        </div>
      )}
    </div>
  );
}
