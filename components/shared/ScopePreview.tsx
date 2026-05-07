import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScopePreviewProps {
  title: string;
  description?: string;
  items: string[];
  className?: string;
  footnote?: string;
}

/**
 * ScopePreview — used on placeholder studio pages to communicate the
 * future scope of a module without committing to a build yet. Visually
 * restrained, premium, scannable.
 */
export function ScopePreview({
  title,
  description,
  items,
  footnote,
  className,
}: ScopePreviewProps) {
  return (
    <section className={cn("surface", className)}>
      <header className="border-b border-border px-6 py-4">
        <div className="text-2xs uppercase tracking-[0.12em] font-medium text-fg-subtle">
          Future scope
        </div>
        <h2 className="text-sm font-medium text-fg tracking-tightish mt-1">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-fg-muted mt-1 max-w-2xl">{description}</p>
        )}
      </header>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 px-6 py-3.5 text-sm text-fg"
          >
            <Check
              className="h-3.5 w-3.5 text-accent shrink-0 mt-1"
              strokeWidth={2}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      {footnote && (
        <footer className="border-t border-border px-6 py-3 text-xs text-fg-subtle">
          {footnote}
        </footer>
      )}
    </section>
  );
}
