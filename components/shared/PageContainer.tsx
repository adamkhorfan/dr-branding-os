import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "px-8 py-8 md:py-10 max-w-[1440px] mx-auto w-full space-y-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
