"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { BlockInsight } from "@/lib/insights";

type InsightCardProps = {
  insight: BlockInsight;
};

export function InsightCard({ insight }: InsightCardProps) {
  const { blockLabel, highlights, moduleCount, encouragement } = insight;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 overflow-hidden rounded-2xl border border-lime/30 bg-gradient-to-br from-lime/10 via-onyx to-onyx p-5 md:p-6 shadow-glow-soft"
      aria-label="Zwischen-Auswertung"
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-lime">
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
        {blockLabel}
      </div>

      {highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-pearl leading-relaxed">
              <span
                aria-hidden
                className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-lime"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-silver italic">{encouragement}</p>
        {moduleCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-[11px] font-mono text-lime">
            <Sparkles className="h-3 w-3" strokeWidth={1.8} />
            <span className="tabular-nums">{moduleCount}</span>
            <span>{moduleCount === 1 ? "Modul" : "Module"} im Blick</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
