import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Slightly lighter surface for emphasis. */
  elevated?: boolean;
};

export function Card({ className, children, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-steel p-6 md:p-8 transition-all duration-500",
        elevated ? "bg-graphite" : "bg-onyx",
        "shadow-glow-soft",
        className,
      )}
      {...props}
    >
      {/* Top highlight line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel to-transparent"
      />
      {children}
    </div>
  );
}
