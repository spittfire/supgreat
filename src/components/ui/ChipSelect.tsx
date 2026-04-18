"use client";

import { cn } from "@/lib/utils";

type ChipSelectProps<T extends string> = {
  value: T | null | undefined;
  onChange: (v: T) => void;
  options: readonly T[];
  /** Render columns on larger screens. */
  cols?: 1 | 2 | 3 | 4;
  ariaLabel?: string;
};

export function ChipSelect<T extends string>({
  value,
  onChange,
  options,
  cols = 2,
  ariaLabel,
}: ChipSelectProps<T>) {
  const grid =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-4";
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("grid gap-2", grid)}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            type="button"
            key={opt}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "text-left px-4 py-3 rounded-lg transition-colors text-sm",
              active
                ? "bg-ink text-bone border border-ink"
                : "hairline hover:bg-bone-2 text-ink",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
