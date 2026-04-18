"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "moss" | "sage" | "brand-amber" | "coral";

const ACCENT: Record<Accent, { icon: string; count: string }> = {
  moss: { icon: "bg-moss/10 text-moss", count: "bg-moss text-bone" },
  sage: { icon: "bg-sage/15 text-sage", count: "bg-sage text-bone" },
  "brand-amber": {
    icon: "bg-brand-amber/15 text-brand-amber",
    count: "bg-brand-amber text-bone",
  },
  coral: { icon: "bg-coral/10 text-coral", count: "bg-coral text-bone" },
};

type CategoryGroupProps = {
  label: string;
  icon: LucideIcon;
  accent?: Accent;
  selectedCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CategoryGroup({
  label,
  icon: Icon,
  accent = "moss",
  selectedCount = 0,
  defaultOpen = false,
  children,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(defaultOpen || selectedCount > 0);
  const a = ACCENT[accent];
  return (
    <div className="rounded-2xl bg-paper shadow-soft hairline overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-bone-2 transition-colors"
      >
        <span
          aria-hidden
          className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", a.icon)}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </span>
        <span className="flex-1 text-sm font-medium text-ink">{label}</span>
        {selectedCount > 0 && (
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-full",
              a.count,
            )}
          >
            {selectedCount}
          </span>
        )}
        <ChevronDown
          className={cn("w-4 h-4 text-mist transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
