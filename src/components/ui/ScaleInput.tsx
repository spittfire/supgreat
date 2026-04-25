"use client";

import { cn } from "@/lib/utils";

type ScaleInputProps = {
  /** `null` means no value chosen yet — visually nothing is highlighted. */
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel?: string;
  /** Render in error state — used when the question is required and unanswered. */
  error?: boolean;
};

export function ScaleInput({
  value,
  onChange,
  min = 1,
  max = 5,
  leftLabel,
  rightLabel,
  ariaLabel,
  error = false,
}: ScaleInputProps) {
  const dots: number[] = [];
  for (let i = min; i <= max; i++) dots.push(i);
  return (
    <div aria-label={ariaLabel} className="space-y-3">
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-silver">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <div className="flex items-center gap-2 md:gap-3">
        {dots.map((n) => {
          const active = value === n;
          return (
            <button
              type="button"
              key={n}
              aria-label={`${n}`}
              aria-pressed={active}
              onClick={() => onChange(n)}
              className={cn(
                "flex-1 h-14 rounded-xl font-mono text-lg transition-all duration-300 border",
                active
                  ? "border-lime bg-lime/10 text-lime shadow-glow-lime scale-[1.04]"
                  : error
                    ? "border-coral/60 bg-coral/5 text-silver hover:border-coral hover:text-pearl"
                    : "border-steel bg-onyx text-silver hover:border-iron hover:text-pearl",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
