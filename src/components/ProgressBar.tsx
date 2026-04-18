import { cn } from "@/lib/utils";

type ProgressBarProps = {
  current: number;
  total: number;
  className?: string;
};

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label="Fortschritt"
    >
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const state = step < current ? "done" : step === current ? "active" : "upcoming";
        return (
          <span
            key={i}
            className={cn(
              "h-[2px] w-6 md:w-10 rounded-full transition-all duration-500",
              state === "done" && "bg-pearl/40",
              state === "active" && "bg-lime shadow-glow-lime",
              state === "upcoming" && "bg-iron",
            )}
          />
        );
      })}
    </div>
  );
}
