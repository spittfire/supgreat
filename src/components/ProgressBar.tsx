"use client";

import { cn } from "@/lib/utils";

type ProgressBarProps = {
  current: number;
  total: number;
  className?: string;
  /** When provided, segments up to `current` become clickable. */
  onStepClick?: (step: number) => void;
};

export function ProgressBar({ current, total, className, onStepClick }: ProgressBarProps) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label="Fortschritt"
    >
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const state = step < current ? "done" : step === current ? "active" : "upcoming";
        const reachable = step <= current;
        const className = cn(
          "h-[2px] w-6 md:w-10 rounded-full transition-all duration-500",
          state === "done" && "bg-pearl/40",
          state === "active" && "bg-lime shadow-glow-lime",
          state === "upcoming" && "bg-iron",
        );
        if (onStepClick && reachable && step !== current) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onStepClick(step)}
              aria-label={`Zu Schritt ${step}`}
              className={cn(
                className,
                "cursor-pointer hover:h-[3px] hover:bg-pearl/70",
              )}
            />
          );
        }
        return <span key={i} className={className} />;
      })}
    </div>
  );
}
