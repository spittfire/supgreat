import { AlertTriangle, Clock, Pill as PillIcon } from "lucide-react";
import type { SupplementRec } from "@/lib/types";

type SupplementCardProps = {
  rec: SupplementRec;
  index: number;
};

export function SupplementCard({ rec, index }: SupplementCardProps) {
  return (
    <article className="hairline rounded-lg p-5 md:p-6 bg-bone">
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-bone"
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
          <div className="flex gap-4 mt-1 text-sm text-mist font-mono">
            <span>{rec.dosage}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              {rec.timing}
            </span>
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
