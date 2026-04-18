import { cn } from "@/lib/utils";
import type { BiomarkerStatus } from "@/lib/types";

const STATUS_STYLES: Record<BiomarkerStatus, { bg: string; text: string; label: string }> = {
  optimal: { bg: "bg-moss/10", text: "text-moss", label: "Optimal" },
  suboptimal: { bg: "bg-brand-amber/15", text: "text-brand-amber", label: "Suboptimal" },
  low: { bg: "bg-brand-amber/15", text: "text-brand-amber", label: "Zu niedrig" },
  high: { bg: "bg-brand-amber/15", text: "text-brand-amber", label: "Zu hoch" },
  critical: { bg: "bg-coral/15", text: "text-coral", label: "Kritisch" },
  unknown: { bg: "bg-bone-2", text: "text-mist", label: "—" },
};

export function StatusBadge({ status }: { status: BiomarkerStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        s.bg,
        s.text,
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
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs hairline text-ink/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
