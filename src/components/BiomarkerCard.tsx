import type { Biomarker } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { CATEGORY_ICON, CATEGORY_STYLE } from "@/lib/visuals";

type BiomarkerCardProps = {
  marker: Biomarker;
};

/**
 * Draws a horizontal bar with reference range and optimal band; the user's
 * value is positioned as a tick on the bar.
 */
function RangeBar({ marker }: { marker: Biomarker }) {
  const refMin = marker.reference_min ?? marker.optimal_min ?? null;
  const refMax = marker.reference_max ?? marker.optimal_max ?? null;

  if (refMin === null || refMax === null) {
    return (
      <div className="text-xs text-mist">
        {marker.unit ? `Einheit: ${marker.unit}` : "Kein Referenzbereich hinterlegt."}
      </div>
    );
  }

  // Pad 20% on each side so value near bounds is visible.
  const pad = (refMax - refMin) * 0.2 || 1;
  const lo = refMin - pad;
  const hi = refMax + pad;
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;

  const optMin = marker.optimal_min;
  const optMax = marker.optimal_max;

  return (
    <div className="relative h-10 mt-3">
      {/* Full range */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded bg-line" />
      {/* Reference */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-bone-2"
        style={{
          left: `${pct(refMin)}%`,
          width: `${pct(refMax) - pct(refMin)}%`,
        }}
      />
      {/* Optimal band */}
      {optMin !== null && optMax !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-moss/60"
          style={{
            left: `${pct(Math.max(lo, optMin))}%`,
            width: `${pct(Math.min(hi, optMax)) - pct(Math.max(lo, optMin))}%`,
          }}
        />
      )}
      {/* Value tick */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(${Math.max(0, Math.min(100, pct(marker.value)))}% - 6px)` }}
      >
        <span className="block w-3 h-3 rounded-full bg-ink ring-4 ring-bone" />
      </div>
    </div>
  );
}

export function BiomarkerCard({ marker }: BiomarkerCardProps) {
  const catStyle = CATEGORY_STYLE[marker.category] ?? CATEGORY_STYLE["Sonstige"];
  const CatIcon = CATEGORY_ICON[marker.category];
  return (
    <div className="hairline rounded-xl p-4 md:p-5 bg-bone relative overflow-hidden">
      <span
        aria-hidden
        className={`absolute top-0 left-0 h-full w-1 ${catStyle.dot}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {CatIcon && (
            <span
              aria-hidden
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${catStyle.bg} ${catStyle.text}`}
            >
              <CatIcon className="w-4 h-4" strokeWidth={1.5} />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-sm text-ink/80 truncate">{marker.name}</div>
            <div className="font-mono text-2xl mt-1 tabular-nums text-ink">
              {marker.value}
              <span className="text-sm text-mist ml-1.5 font-sans">{marker.unit}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={marker.status} />
      </div>
      <RangeBar marker={marker} />
      {(marker.optimal_min !== null || marker.optimal_max !== null) && (
        <div className="mt-1 text-[11px] font-mono text-mist flex justify-between">
          <span>
            Ref{" "}
            {marker.reference_min ?? "—"}–{marker.reference_max ?? "—"}
          </span>
          <span>
            Optimal{" "}
            {marker.optimal_min ?? "—"}–{marker.optimal_max ?? "—"}
          </span>
        </div>
      )}
    </div>
  );
}
