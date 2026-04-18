"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type GoalTileProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * Pill-shaped multi-select chip — dark surface with lime glow when active.
 * Replaces the earlier big-tile look for a more refined, app-like feel.
 */
export function GoalTile({ label, icon: Icon, active, disabled = false, onClick }: GoalTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 active:scale-[0.98]",
        active
          ? "border-lime bg-lime/10 text-lime shadow-glow-lime"
          : disabled
            ? "border-steel bg-onyx text-ash opacity-50 cursor-not-allowed"
            : "border-steel bg-onyx text-silver hover:border-iron hover:text-pearl",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      <span>{label}</span>
      {active && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
    </button>
  );
}
