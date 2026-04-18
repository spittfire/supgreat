"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "moss" | "sage" | "brand-amber" | "coral";

const ACCENT: Record<Accent, { icon: string; iconActive: string; ring: string; bg: string }> = {
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

type SexCardProps = {
  label: string;
  icon: LucideIcon;
  accent?: Accent;
  active: boolean;
  onClick: () => void;
};

export function SexCard({
  label,
  icon: Icon,
  accent = "moss",
  active,
  onClick,
}: SexCardProps) {
  const a = ACCENT[accent];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl transition-all shadow-soft active:scale-[0.98]",
        "bg-paper hairline",
        active
          ? `ring-2 ${a.ring} ring-offset-2 ring-offset-bone border-transparent ${a.bg} shadow-pop`
          : "hover:bg-bone-2 hover:shadow-pop",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
          active ? a.iconActive : a.icon,
        )}
      >
        <Icon className="w-7 h-7" strokeWidth={1.4} />
      </span>
      <span className="text-base font-medium text-ink">{label}</span>
    </button>
  );
}
