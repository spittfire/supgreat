import { cn } from "@/lib/utils";
import type { BiomarkerStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  BiomarkerStatus,
  { border: string; text: string; bg: string; label: string }
> = {
  optimal: {
    border: "border-lime/40",
    text: "text-lime",
    bg: "bg-lime/10",
    label: "Optimal",
  },
  suboptimal: {
    border: "border-amber/40",
    text: "text-amber",
    bg: "bg-amber/10",
    label: "Suboptimal",
  },
  low: {
    border: "border-amber/40",
    text: "text-amber",
    bg: "bg-amber/10",
    label: "Zu niedrig",
  },
  high: {
    border: "border-amber/40",
    text: "text-amber",
    bg: "bg-amber/10",
    label: "Zu hoch",
  },
  critical: {
    border: "border-coral/50",
    text: "text-coral",
    bg: "bg-coral/10",
    label: "Kritisch",
  },
  unknown: {
    border: "border-steel",
    text: "text-ash",
    bg: "bg-glass",
    label: "—",
  },
};

export function StatusBadge({ status }: { status: BiomarkerStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
        s.border,
        s.text,
        s.bg,
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-steel bg-onyx text-silver",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-[11px] font-mono font-medium text-lime border border-lime/30 bg-lime/10">
      {count}
    </span>
  );
}
