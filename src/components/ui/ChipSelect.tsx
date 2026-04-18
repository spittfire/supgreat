"use client";

import { cn } from "@/lib/utils";

type ChipSelectProps<T extends string> = {
  value: T | null | undefined;
  onChange: (v: T) => void;
  options: readonly T[];
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
              "text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-300 active:scale-[0.98]",
              active
                ? "border border-lime bg-lime/10 text-lime shadow-glow-lime"
                : "border border-steel bg-onyx text-silver hover:border-iron hover:text-pearl",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
