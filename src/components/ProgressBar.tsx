import { cn } from "@/lib/utils";

type ProgressBarProps = {
  current: number;
  total: number;
  className?: string;
};

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, ((current - 1) / Math.max(1, total - 1)) * 100));
  return (
    <div
      className={cn("w-full h-1 bg-bone-2 relative", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label="Fortschritt"
    >
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #C4964A 0%, #8FA68E 55%, #2F3E32 100%)",
        }}
      />
    </div>
  );
}
