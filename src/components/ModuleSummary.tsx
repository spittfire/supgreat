"use client";

import { Moon, Sparkles, Sun, Sunrise, Sunset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  summarizeByCategory,
  summarizeByTiming,
  type TimingSlot,
} from "@/lib/category-summary";
import type { SupplementRec } from "@/lib/types";
import { Eyebrow } from "@/components/ui/Eyebrow";

type ModuleSummaryProps = {
  modules: SupplementRec[];
};

const TIMING_ICON: Record<TimingSlot, LucideIcon> = {
  Morgens: Sunrise,
  Mittags: Sun,
  Abends: Sunset,
  Nachts: Moon,
};

const TIMING_TINT: Record<TimingSlot, string> = {
  Morgens: "text-amber",
  Mittags: "text-lime",
  Abends: "text-coral",
  Nachts: "text-sky",
};

export function ModuleSummary({ modules }: ModuleSummaryProps) {
  if (modules.length === 0) return null;
  const byTiming = summarizeByTiming(modules);
  const byCategory = summarizeByCategory(modules);

  return (
    <section className="rounded-3xl border border-steel bg-onyx p-6 md:p-10 shadow-glow-soft">
      <div className="flex items-center gap-3">
        <Eyebrow>Deine Zusatz-Module</Eyebrow>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] font-mono text-lime">
          <Sparkles className="h-3 w-3" strokeWidth={1.6} />
          {modules.length} {modules.length === 1 ? "Modul" : "Module"} on top
        </span>
      </div>

      <p className="mt-4 max-w-prose text-pearl leading-relaxed">
        Zusätzlich zur Core Box bekommst du gezielt auf dein Profil abgestimmte
        Wirkstoff-Module. Welche das genau sind, erfährst du nach dem Kauf in deinem
        persönlichen Bericht.
      </p>

      {/* Timing-Slots */}
      <div className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-silver font-mono mb-3">
          Verteilung über den Tag
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["Morgens", "Mittags", "Abends", "Nachts"] as TimingSlot[]).map((slot) => {
            const found = byTiming.find((t) => t.slot === slot);
            const count = found?.count ?? 0;
            const Icon = TIMING_ICON[slot];
            const tint = TIMING_TINT[slot];
            const active = count > 0;
            return (
              <div
                key={slot}
                className={`rounded-2xl border p-4 ${
                  active
                    ? "border-steel bg-graphite/60"
                    : "border-steel/60 bg-onyx/60 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${tint}`} strokeWidth={1.6} />
                  <span className="text-xs uppercase tracking-[0.18em] font-mono text-silver">
                    {slot}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-medium text-pearl tabular-nums">
                    {count}
                  </span>
                  <span className="text-xs text-ash">
                    {count === 1 ? "Wirkstoff" : "Wirkstoffe"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kategorien */}
      <div className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-silver font-mono mb-3">
          Wirkstoff-Klassen
        </div>
        <div className="flex flex-wrap gap-2">
          {byCategory.map(({ bucket, count }) => (
            <span
              key={bucket}
              className="inline-flex items-center gap-2 rounded-full border border-steel bg-graphite px-4 py-2 text-sm text-pearl"
            >
              <span className="font-mono font-medium text-lime tabular-nums">
                {count}
              </span>
              <span className="text-silver">×</span>
              <span>{bucket}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
