"use client";

import { cn } from "@/lib/utils";

type ScaleInputProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel?: string;
};

export function ScaleInput({
  value,
  onChange,
  min = 1,
  max = 5,
  leftLabel,
  rightLabel,
  ariaLabel,
}: ScaleInputProps) {
  const dots: number[] = [];
  for (let i = min; i <= max; i++) dots.push(i);
  return (
    <div aria-label={ariaLabel}>
      <div className="flex items-center justify-between gap-2">
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
                "flex-1 h-12 rounded-lg text-sm font-mono transition-colors",
                active
                  ? "bg-ink text-bone border border-ink"
                  : "hairline text-ink hover:bg-bone-2",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(leftLabel || rightLabel) && (
        <div className="mt-2 flex justify-between text-xs text-mist">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
