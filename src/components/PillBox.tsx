"use client";

import { motion } from "framer-motion";
import type { SupplementRec } from "@/lib/types";

type Compartment = {
  id: "am" | "pm";
  label: string;
  pills: SupplementRec[];
};

type PillBoxProps = {
  supplements: SupplementRec[];
};

function splitByTiming(recs: SupplementRec[]): Compartment[] {
  const am: SupplementRec[] = [];
  const pm: SupplementRec[] = [];
  for (const s of recs) {
    const t = s.timing.toLowerCase();
    if (t.includes("abend")) pm.push(s);
    else if (t.includes("2x")) {
      am.push(s);
      pm.push(s);
    } else am.push(s);
  }
  return [
    { id: "am", label: "Morgens", pills: am },
    { id: "pm", label: "Abends", pills: pm },
  ];
}

function Pill({
  shape,
  color,
  delay,
}: {
  shape: SupplementRec["pill_shape"];
  color: string;
  delay: number;
}) {
  const base = "inline-block shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]";
  return (
    <motion.span
      initial={{ y: -30, opacity: 0, rotate: -8 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
      className={base}
      style={{
        width: shape === "round" ? 28 : 34,
        height: shape === "capsule" ? 14 : shape === "oval" ? 18 : 28,
        borderRadius: shape === "round" ? 999 : 999,
        background: color,
      }}
      aria-hidden
    />
  );
}

export function PillBox({ supplements }: PillBoxProps) {
  const compartments = splitByTiming(supplements);

  return (
    <div className="hairline rounded-lg p-6 md:p-8 bg-bone-2/60">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {compartments.map((c) => (
          <div key={c.id} className="hairline rounded-md bg-bone overflow-hidden">
            <div className="px-4 py-2 text-xs uppercase tracking-wide text-mist font-mono border-b border-line">
              {c.label}
              <span className="float-right text-ink">{c.pills.length}</span>
            </div>
            <div className="min-h-[140px] md:min-h-[170px] p-4 flex flex-wrap gap-2 items-end justify-center">
              {c.pills.length === 0 ? (
                <span className="text-xs text-mist italic self-center">Leer</span>
              ) : (
                c.pills.map((p, i) => (
                  <Pill
                    key={`${c.id}-${p.id}`}
                    shape={p.pill_shape}
                    color={p.category_color}
                    delay={0.08 * i + (c.id === "pm" ? 0.2 : 0)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-mist text-center">
        Visualisierung deiner täglichen Pillenbox — tatsächliche Größen und Farben können
        abweichen.
      </p>
    </div>
  );
}
