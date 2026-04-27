"use client";

import { useState } from "react";
import { Box, ChevronDown, Moon, Sparkles, Sun, Sunrise, Sunset } from "lucide-react";
import type { CoreBoxRec } from "@/lib/types";
import { Eyebrow } from "@/components/ui/Eyebrow";

type CoreBoxHeroProps = {
  coreBox: CoreBoxRec;
  subscription: boolean;
};

const EPISODE_ICON = {
  morning: Sunrise,
  midday: Sun,
  afternoon: Sunset,
  night: Moon,
} as const;

const EPISODE_TINT = {
  morning: "text-amber",
  midday: "text-lime",
  afternoon: "text-coral",
  night: "text-sky",
} as const;

export function CoreBoxHero({ coreBox, subscription }: CoreBoxHeroProps) {
  const [openEpisode, setOpenEpisode] = useState<string>("morning");
  const price = subscription ? coreBox.price_subscription : coreBox.price_single;
  const altPrice = subscription ? coreBox.price_single : coreBox.price_subscription;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/10 via-onyx to-onyx p-6 md:p-10 shadow-glow-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-radial-lime opacity-70"
      />

      <div className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12 items-start">
        {/* Left: headline */}
        <div>
          <div className="flex items-center gap-3">
            <Eyebrow>Core Box</Eyebrow>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] font-mono text-lime">
              <Sparkles className="h-3 w-3" strokeWidth={1.6} />
              Immer dabei
            </span>
          </div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight tracking-tight text-pearl">
            <span className="italic text-silver">Dein</span>{" "}
            <span className="text-lime">Fundament.</span>
          </h2>
          <p className="mt-4 text-pearl leading-relaxed">
            {coreBox.reason_short}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 max-w-sm">
            <div className="rounded-xl border border-steel bg-onyx/60 px-4 py-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-silver font-mono">
                Wirkstoffe
              </dt>
              <dd className="mt-1 font-mono text-2xl text-pearl tabular-nums">
                {coreBox.ingredient_count}
              </dd>
            </div>
            <div className="rounded-xl border border-steel bg-onyx/60 px-4 py-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-silver font-mono">
                Tagespacks
              </dt>
              <dd className="mt-1 font-mono text-2xl text-pearl tabular-nums">
                {coreBox.episodes.length}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-mono text-5xl font-medium text-pearl tabular-nums">
              €{price.toFixed(0)}
            </span>
            <span className="text-sm text-silver">
              {subscription ? "/ Monat im Abo" : "einmalig"}
            </span>
          </div>
          <p className="mt-1 text-xs text-ash">
            {subscription
              ? `Einmalkauf €${altPrice.toFixed(0)} · monatlich kündbar`
              : `Abo ab €${altPrice.toFixed(0)} / Monat`}
          </p>
        </div>

        {/* Right: episodes */}
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.2em] text-silver font-mono flex items-center gap-2">
            <Box className="h-3.5 w-3.5" strokeWidth={1.6} />
            Die 4 Episoden
          </div>
          {coreBox.episodes.map((ep) => {
            const Icon = EPISODE_ICON[ep.id];
            const tint = EPISODE_TINT[ep.id];
            const open = openEpisode === ep.id;
            return (
              <div
                key={ep.id}
                className="rounded-xl border border-steel bg-onyx/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenEpisode(open ? "" : ep.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-graphite/60 transition-colors"
                  aria-expanded={open}
                >
                  <Icon className={`h-4 w-4 ${tint}`} strokeWidth={1.6} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-pearl font-medium truncate">
                      {ep.label}
                    </div>
                    <div className="text-[11px] text-silver truncate">{ep.goal}</div>
                  </div>
                  <span className="text-[11px] font-mono text-ash">
                    {ep.ingredients.length}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-silver transition-transform ${open ? "rotate-180" : ""}`}
                    strokeWidth={1.6}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-3 pt-2 border-t border-steel/60">
                    <p className="text-sm text-silver leading-relaxed">
                      {ep.ingredients.length}{" "}
                      {ep.ingredients.length === 1 ? "Wirkstoff" : "Wirkstoffe"} für{" "}
                      <span className="text-pearl">{ep.goal.toLowerCase()}</span>.
                      Konkrete Auflistung im Bericht nach dem Kauf.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
