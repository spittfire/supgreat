import {
  AlertTriangle,
  Clock,
  Moon,
  Pill as PillIcon,
  Sun,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { SupplementRec } from "@/lib/types";

type SupplementCardProps = {
  rec: SupplementRec;
  index: number;
};

function TimingBadge({ timing }: { timing: string }) {
  const t = timing.toLowerCase();
  const meta: { icon: LucideIcon; text: string } = t.includes("abend")
    ? { icon: Moon, text: "text-sky" }
    : t.includes("mahlzeit")
      ? { icon: Utensils, text: "text-amber" }
      : t.includes("2x")
        ? { icon: Clock, text: "text-coral" }
        : { icon: Sun, text: "text-amber" };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-steel bg-graphite px-3 py-1 text-xs ${meta.text}`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      {timing}
    </span>
  );
}

function typeBadgeLabel(type: SupplementRec["product_type"]): string {
  switch (type) {
    case "module":
      return "Monatsration";
    case "core_box":
      return "Core Box";
    case "standalone":
      return "Einzeldose";
  }
}

export function SupplementCard({ rec, index }: SupplementCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-steel bg-onyx p-6 md:p-8 transition-all duration-500 hover:border-iron hover:bg-graphite">
      {/* Subtle product-color stripe */}
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-0.5"
        style={{ background: rec.category_color, boxShadow: "0 0 12px currentColor" }}
      />
      <div className="flex items-start gap-5">
        <div
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-ink shadow-glow-soft"
          style={{
            background: rec.category_color,
            boxShadow: `0 0 30px ${rec.category_color}60, inset 0 -2px 0 rgba(0,0,0,0.18)`,
          }}
          aria-hidden
        >
          <PillIcon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="font-display text-xl md:text-2xl leading-tight tracking-tight text-pearl">
              {rec.name}
            </h3>
            <span className="text-[11px] font-mono text-ash shrink-0">
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <span className="font-mono text-sm text-pearl">{rec.dosage}</span>
            <TimingBadge timing={rec.timing} />
            <span className="inline-flex items-center rounded-full border border-steel bg-graphite px-2.5 py-0.5 text-[11px] font-mono text-silver">
              {typeBadgeLabel(rec.product_type)}
            </span>
            <span className="font-mono text-[11px] text-ash tabular-nums">
              {rec.sku}
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-pearl">
            {rec.reason_short}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-silver">{rec.reason_detail}</p>

          {rec.data_sources_used.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {rec.data_sources_used.map((src) => (
                <span
                  key={src}
                  className="inline-flex items-center rounded-full bg-lime/5 border border-lime/20 px-2.5 py-0.5 text-[11px] font-mono text-lime"
                >
                  {src}
                </span>
              ))}
            </div>
          )}

          {rec.warning && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/5 p-3">
              <AlertTriangle
                className="w-4 h-4 text-amber shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-sm text-amber leading-relaxed">{rec.warning}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
