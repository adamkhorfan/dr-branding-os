import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  hint?: string;
}

export function KpiCard({ label, value, unit, delta, hint }: KpiCardProps) {
  const trend =
    delta == null
      ? "flat"
      : delta > 0
        ? "up"
        : delta < 0
          ? "down"
          : "flat";

  return (
    <div className="surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-2xs uppercase tracking-[0.12em] font-medium text-fg-subtle">
          {label}
        </span>
        {delta != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-2xs font-medium tabular",
              trend === "up" && "text-success",
              trend === "down" && "text-danger",
              trend === "flat" && "text-fg-subtle",
            )}
          >
            {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
            {trend === "flat" && <Minus className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-display text-3xl tracking-tighter2 tabular text-fg leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-fg-subtle font-medium">{unit}</span>
        )}
      </div>
      {hint && <span className="text-xs text-fg-subtle">{hint}</span>}
    </div>
  );
}
