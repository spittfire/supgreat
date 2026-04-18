"use client";

import { motion } from "framer-motion";
import { Moon, Sunrise } from "lucide-react";
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
  return (
    <motion.span
      initial={{ y: -80, opacity: 0, rotate: -12 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 14,
        delay,
      }}
      className="inline-block"
      style={{
        width: shape === "round" ? 30 : 38,
        height: shape === "capsule" ? 14 : shape === "oval" ? 18 : 30,
        borderRadius: 999,
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 6px 18px ${color}60, inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      aria-hidden
    />
  );
}

export function PillBox({ supplements }: PillBoxProps) {
  const compartments = splitByTiming(supplements);

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Lime glow behind box */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-lime/25 blur-3xl"
      />

      <div className="relative rounded-3xl border border-steel bg-gradient-to-b from-onyx via-onyx to-carbon p-6 md:p-10 shadow-glow-soft">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {compartments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-steel bg-graphite/60 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-4 py-2.5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-silver font-mono border-b border-steel">
                {c.id === "am" ? (
                  <Sunrise className="w-3.5 h-3.5 text-amber" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-sky" strokeWidth={1.5} />
                )}
                <span className="flex-1">{c.label}</span>
                <span className="text-pearl">{c.pills.length}</span>
              </div>
              <div className="min-h-[140px] md:min-h-[180px] p-4 md:p-5 flex flex-wrap gap-2 items-end justify-center">
                {c.pills.length === 0 ? (
                  <span className="text-xs text-ash italic self-center">Leer</span>
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
        <p className="mt-5 text-xs text-ash text-center">
          Visualisierung deiner täglichen Pillenbox — Größen und Farben sind
          schematisch.
        </p>
      </div>
    </div>
  );
}
