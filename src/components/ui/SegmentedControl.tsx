"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type SegmentedControlProps<T extends string> = {
  value: T | null | undefined;
  onChange: (v: T) => void;
  options: SegmentOption<T>[];
  ariaLabel?: string;
  block?: boolean;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  block = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-2xl border border-steel bg-onyx p-1.5 shadow-inset-line",
        block && "w-full",
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all duration-300",
              block && "flex-1",
              active
                ? "bg-lime text-ink font-medium shadow-glow-lime"
                : "text-silver hover:text-pearl",
            )}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
