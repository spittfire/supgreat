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
  // Gradient-Farben: 1 coral → 3 amber → 5 sage/moss (visuelle Stufung)
  const colors = [
    "bg-coral text-bone",
    "bg-coral/80 text-bone",
    "bg-brand-amber text-bone",
    "bg-sage text-bone",
    "bg-moss text-bone",
  ];

  return (
    <div aria-label={ariaLabel}>
      <div className="flex items-center justify-between gap-2">
        {dots.map((n, idx) => {
          const active = value === n;
          const activeColor = colors[idx] ?? colors[colors.length - 1];
          return (
            <button
              type="button"
              key={n}
              aria-label={`${n}`}
              aria-pressed={active}
              onClick={() => onChange(n)}
              className={cn(
                "flex-1 h-12 rounded-lg text-sm font-mono transition-all",
                active
                  ? `${activeColor} border border-transparent scale-[1.02]`
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
