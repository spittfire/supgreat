import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** Include the leading hairline stroke for premium feel. */
  stroke?: boolean;
};

export function Eyebrow({ children, className, stroke = true }: EyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] text-silver font-sans font-medium",
        className,
      )}
    >
      {stroke && (
        <span aria-hidden className="h-px w-6 bg-steel" />
      )}
      <span>{children}</span>
    </div>
  );
}
