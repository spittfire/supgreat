import { AlertTriangle, Clock, Moon, Pill as PillIcon, Sun, Utensils } from "lucide-react";
import type { SupplementRec } from "@/lib/types";

type SupplementCardProps = {
  rec: SupplementRec;
  index: number;
};

function TimingBadge({ timing }: { timing: string }) {
  const t = timing.toLowerCase();
  const meta = t.includes("abend")
    ? { icon: Moon, bg: "bg-moss/10", text: "text-moss" }
    : t.includes("mahlzeit")
      ? { icon: Utensils, bg: "bg-brand-amber/15", text: "text-brand-amber" }
      : t.includes("2x")
        ? { icon: Clock, bg: "bg-coral/10", text: "text-coral" }
        : { icon: Sun, bg: "bg-brand-amber/15", text: "text-brand-amber" };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs ${meta.bg} ${meta.text}`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      {timing}
    </span>
  );
}

export function SupplementCard({ rec, index }: SupplementCardProps) {
  return (
    <article
      className="hairline rounded-xl p-5 md:p-6 bg-bone relative overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-1"
        style={{ background: rec.category_color }}
      />
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-bone shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]"
          style={{ background: rec.category_color }}
          aria-hidden
        >
          <PillIcon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-tight tracking-tight">
              {rec.name}
            </h3>
            <span className="text-xs font-mono text-mist shrink-0">#{index + 1}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <span className="text-sm font-mono text-ink">{rec.dosage}</span>
            <TimingBadge timing={rec.timing} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink">{rec.reason_short}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{rec.reason_detail}</p>

      {rec.data_sources_used.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {rec.data_sources_used.map((src) => (
            <span
              key={src}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono text-mist hairline"
            >
              {src}
            </span>
          ))}
        </div>
      )}

      {rec.warning && (
        <div className="mt-5 hairline rounded-md p-3 bg-coral/10 flex gap-2 items-start">
          <AlertTriangle
            className="w-4 h-4 text-coral shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <p className="text-sm text-ink/85">{rec.warning}</p>
        </div>
      )}
    </article>
  );
}
