"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CountBadge } from "@/components/ui/Badge";

type CategoryGroupProps = {
  label: string;
  icon: LucideIcon;
  selectedCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CategoryGroup({
  label,
  icon: Icon,
  selectedCount = 0,
  defaultOpen = false,
  children,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(defaultOpen || selectedCount > 0);
  return (
    <div
      className={cn(
        "rounded-2xl border bg-onyx overflow-hidden transition-all duration-300",
        open ? "border-iron" : "border-steel",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-graphite transition-colors"
      >
        <span
          aria-hidden
          className="shrink-0 w-9 h-9 rounded-lg border border-steel bg-graphite flex items-center justify-center text-lime"
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </span>
        <span className="flex-1 text-sm font-medium text-pearl">{label}</span>
        <CountBadge count={selectedCount} />
        <ChevronDown
          className={cn(
            "w-4 h-4 text-silver transition-transform duration-300",
            open && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>
      {open && (
        <div className="border-t border-steel px-5 py-4">{children}</div>
      )}
    </div>
  );
}
