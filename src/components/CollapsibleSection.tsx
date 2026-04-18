"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CollapsibleSectionProps = {
  label: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleSection({
  label,
  count,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="hairline-b py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-sm font-medium text-ink">
          {label}
          {typeof count === "number" && count > 0 && (
            <span className="ml-2 text-xs font-mono text-moss">({count})</span>
          )}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-mist transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="pt-4 pb-2">{children}</div>}
    </div>
  );
}
