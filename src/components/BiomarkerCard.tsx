import type { Biomarker, BiomarkerStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { CATEGORY_ICON } from "@/lib/visuals";

type BiomarkerCardProps = {
  marker: Biomarker;
};

const STATUS_STRIPE: Record<BiomarkerStatus, string> = {
  optimal: "bg-lime",
  suboptimal: "bg-amber",
  low: "bg-amber",
  high: "bg-amber",
  critical: "bg-coral",
  unknown: "bg-steel",
};

function RangeBar({ marker }: { marker: Biomarker }) {
  const refMin = marker.reference_min ?? marker.optimal_min ?? null;
  const refMax = marker.reference_max ?? marker.optimal_max ?? null;

  if (refMin === null || refMax === null) {
    return (
      <div className="text-xs text-ash">
        {marker.unit ? `Einheit: ${marker.unit}` : "Kein Referenzbereich hinterlegt."}
      </div>
    );
  }

  const pad = (refMax - refMin) * 0.2 || 1;
  const lo = refMin - pad;
  const hi = refMax + pad;
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;

  const optMin = marker.optimal_min;
  const optMax = marker.optimal_max;

  return (
    <div className="relative h-10 mt-4">
      {/* Full range */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded bg-steel" />
      {/* Reference */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-iron"
        style={{
          left: `${pct(refMin)}%`,
          width: `${pct(refMax) - pct(refMin)}%`,
        }}
      />
      {/* Optimal band */}
      {optMin !== null && optMax !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-lime/70"
          style={{
            left: `${pct(Math.max(lo, optMin))}%`,
            width: `${pct(Math.min(hi, optMax)) - pct(Math.max(lo, optMin))}%`,
            boxShadow: "0 0 10px rgba(201,242,92,0.5)",
          }}
        />
      )}
      {/* Value tick */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: `calc(${Math.max(0, Math.min(100, pct(marker.value)))}% - 7px)`,
        }}
      >
        <span className="block w-3.5 h-3.5 rounded-full bg-pearl ring-4 ring-onyx" />
      </div>
    </div>
  );
}

export function BiomarkerCard({ marker }: BiomarkerCardProps) {
  const CatIcon = CATEGORY_ICON[marker.category];
  const stripe = STATUS_STRIPE[marker.status];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-steel bg-onyx p-5 md:p-6 transition-all duration-500 hover:border-iron hover:bg-graphite">
      {/* Top status stripe */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 ${stripe}`}
        style={{ boxShadow: "0 0 12px currentColor" }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {CatIcon && (
            <span
              aria-hidden
              className="shrink-0 w-9 h-9 rounded-lg border border-steel bg-graphite flex items-center justify-center text-lime"
            >
              <CatIcon className="w-4 h-4" strokeWidth={1.5} />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.2em] text-silver">
              {marker.category}
            </div>
            <div className="mt-1 text-base md:text-lg text-pearl truncate">
              {marker.name}
            </div>
          </div>
        </div>
        <StatusBadge status={marker.status} />
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono text-3xl md:text-4xl text-pearl tabular-nums">
          {marker.value}
        </span>
        <span className="text-sm text-silver">{marker.unit}</span>
      </div>
      <RangeBar marker={marker} />
      {(marker.optimal_min !== null || marker.optimal_max !== null) && (
        <div className="mt-2 text-[11px] font-mono text-ash flex justify-between">
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
