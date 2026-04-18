"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "moss" | "sage" | "brand-amber" | "coral";

const ACCENT: Record<
  Accent,
  { icon: string; iconActive: string; ring: string; bg: string }
> = {
  moss: {
    icon: "bg-moss/10 text-moss",
    iconActive: "bg-moss text-bone",
    ring: "ring-moss",
    bg: "bg-moss/5",
  },
  sage: {
    icon: "bg-sage/15 text-sage",
    iconActive: "bg-sage text-bone",
    ring: "ring-sage",
    bg: "bg-sage/10",
  },
  "brand-amber": {
    icon: "bg-brand-amber/15 text-brand-amber",
    iconActive: "bg-brand-amber text-bone",
    ring: "ring-brand-amber",
    bg: "bg-brand-amber/10",
  },
  coral: {
    icon: "bg-coral/10 text-coral",
    iconActive: "bg-coral text-bone",
    ring: "ring-coral",
    bg: "bg-coral/10",
  },
};

export type GoalTileProps = {
  label: string;
  hint?: string;
  icon: LucideIcon;
  accent?: Accent;
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function GoalTile({
  label,
  hint,
  icon: Icon,
  accent = "moss",
  active,
  disabled = false,
  onClick,
}: GoalTileProps) {
  const a = ACCENT[accent];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "group text-left rounded-xl p-4 transition-all relative",
        "hairline bg-bone",
        active
          ? `ring-2 ${a.ring} ring-offset-2 ring-offset-bone border-transparent ${a.bg}`
          : disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:border-moss hover:bg-bone-2",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            active ? a.iconActive : a.icon,
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-ink">{label}</div>
          {hint && <div className="text-xs text-mist mt-0.5 leading-snug">{hint}</div>}
        </div>
        {active && (
          <span className="absolute top-3 right-3 text-moss">
            <Check className="w-4 h-4" strokeWidth={2} />
          </span>
        )}
      </div>
    </button>
  );
}
