"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, ShoppingBag, Sparkles } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { PillBox } from "@/components/PillBox";
import { CoreBoxHero } from "@/components/CoreBoxHero";
import { SupplementCard } from "@/components/SupplementCard";
import type { Recommendation } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

export default function BoxPage() {
  const analysis = useFlowStore((s) => s.analysis);
  const profile = useFlowStore((s) => s.profile);
  const health = useFlowStore((s) => s.health);
  const lifestyle = useFlowStore((s) => s.lifestyle);
  const recommendation = useFlowStore((s) => s.recommendation);
  const setRecommendation = useFlowStore((s) => s.setRecommendation);
  const setStep = useFlowStore((s) => s.setStep);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState(true);

  useEffect(() => {
    setStep(7);
  }, [setStep]);

  const requestRecommendation = useCallback(async () => {
    if (!profile || !health || !lifestyle) {
      setError("Es fehlen Daten. Bitte vorige Schritte abschließen.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biomarkers: analysis?.biomarkers ?? [],
          profile,
          health,
          lifestyle,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as Recommendation;
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Empfehlung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }, [analysis, profile, health, lifestyle, setRecommendation]);

  useEffect(() => {
    if (!recommendation && !loading && profile && health && lifestyle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void requestRecommendation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile || !health || !lifestyle) {
    return (
      <StepFrame
        step={7}
        label="Schritt 07 · Box"
        title={<>Uns fehlen noch Angaben.</>}
        sub="Bitte den Fragebogen vorher abschließen — die Box stellen wir erst daraus zusammen."
      >
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="secondary">Zum Start</Button>
          </Link>
          <Link href="/lifestyle">
            <Button>Lifestyle-Fragebogen öffnen</Button>
          </Link>
        </div>
      </StepFrame>
    );
  }

  if (loading || !recommendation) {
    return (
      <StepFrame
        step={7}
        label="Schritt 07 · Box"
        title={<>Wir stellen deine Box zusammen …</>}
        sub="Matching gegen Biomarker, Anamnese und Lifestyle."
      >
        <div className="py-10 flex flex-col items-center">
          <LoadingAnalysis durationMs={100000} />
        </div>
        {error && <p className="text-sm text-coral text-center mt-4">{error}</p>}
      </StepFrame>
    );
  }

  const { core_box, modules } = recommendation;
  const monthlyModules = modules.reduce((s, r) => s + r.price_subscription, 0);
  const onceModules = modules.reduce((s, r) => s + r.price_single, 0);
  const monthlyTotal = core_box.price_subscription + monthlyModules;
  const onceTotal = core_box.price_single + onceModules;
  const activePlanHref = subscription ? "/checkout?plan=subscription" : "/checkout?plan=once";

  return (
    <StepFrame
      step={7}
      label="Schritt 07 · Deine Box"
      title={
        <>
          <span className="italic text-silver">Zusammengestellt für</span>
          <br />
          <span className="text-lime">{profile.first_name}.</span>
        </>
      }
      sub="Core Box als tägliches Fundament plus Monats-Module gegen konkrete Lücken in deinem Profil."
    >
      {/* Plan toggle */}
      <div
        role="tablist"
        aria-label="Abrechnungsmodell"
        className="mb-6 inline-flex p-1 rounded-full border border-steel bg-onyx text-sm"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subscription}
          onClick={() => setSubscription(true)}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            subscription ? "bg-lime text-ink font-medium" : "text-silver hover:text-pearl"
          }`}
        >
          Abo · −15 %
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!subscription}
          onClick={() => setSubscription(false)}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            !subscription ? "bg-lime text-ink font-medium" : "text-silver hover:text-pearl"
          }`}
        >
          Einmalig
        </button>
      </div>

      {/* Core Box Hero */}
      <CoreBoxHero coreBox={core_box} subscription={subscription} />

      {/* Pill box visualisation of modules */}
      {modules.length > 0 && (
        <div className="mt-10">
          <PillBox supplements={modules} />
        </div>
      )}

      {/* Overall assessment */}
      <div className="mt-10 rounded-2xl border border-steel bg-onyx p-6 md:p-8">
        <Eyebrow>Gesamtbild</Eyebrow>
        <p className="mt-4 text-pearl leading-relaxed text-lg">
          {recommendation.overall_assessment}
        </p>
      </div>

      {/* Module cards */}
      {modules.length > 0 && (
        <>
          <div className="mt-10 flex items-baseline justify-between">
            <Eyebrow>Deine Module</Eyebrow>
            <span className="text-xs font-mono text-ash">
              {modules.length} Add-ons
            </span>
          </div>
          <div className="mt-4 grid gap-4">
            {modules.map((rec, i) => (
              <SupplementCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        </>
      )}

      {/* Price ribbon */}
      <div className="mt-14 relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/10 via-onyx to-onyx p-6 md:p-10 shadow-glow-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-radial-lime opacity-60"
        />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow>Deine Box</Eyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-pearl">
              Core + <span className="italic text-lime">{modules.length} Module</span>.
            </h2>
            <p className="mt-4 text-silver leading-relaxed">
              Core Box (€
              {(subscription ? core_box.price_subscription : core_box.price_single).toFixed(0)})
              {modules.length > 0
                ? ` + ${modules.length} Monats-Module (€${(subscription ? monthlyModules : onceModules).toFixed(0)})`
                : ""}
              . Kostenloser Versand, monatlich kündbar.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={activePlanHref}
              className="group flex items-center justify-between rounded-2xl bg-lime p-5 md:p-6 text-ink hover:bg-lime-2 hover:shadow-glow-lime transition-all active:scale-[0.99]"
            >
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 font-medium">
                  {subscription ? "Abo · monatlich" : "Einmalig"}
                </div>
                <div className="font-mono text-3xl md:text-4xl font-medium mt-1 tabular-nums">
                  €{(subscription ? monthlyTotal : onceTotal).toFixed(0)}
                </div>
                <div className="text-sm opacity-70">
                  {subscription ? "pro Monat · 15 % günstiger" : "einmalige Lieferung"}
                </div>
              </div>
              <ArrowRight
                className="h-6 w-6 transition-transform group-hover:translate-x-2"
                strokeWidth={1.8}
              />
            </Link>

            <Link
              href={subscription ? "/checkout?plan=once" : "/checkout?plan=subscription"}
              className="group flex items-center justify-between rounded-2xl border border-steel bg-onyx p-5 md:p-6 hover:border-iron transition-all active:scale-[0.99]"
            >
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-[0.2em] text-silver font-medium">
                  {subscription ? "Lieber einmalig" : "Im Abo sparen"}
                </div>
                <div className="font-mono text-3xl text-pearl mt-1 tabular-nums">
                  €{(subscription ? onceTotal : monthlyTotal).toFixed(0)}
                </div>
              </div>
              <ArrowRight
                className="h-5 w-5 text-silver transition-transform group-hover:translate-x-1"
                strokeWidth={1.6}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Coaching upsell */}
      <div className="mt-10 rounded-2xl border border-steel bg-onyx p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <CalendarCheck className="w-6 h-6 text-lime mt-1" strokeWidth={1.4} />
          <div>
            <div className="font-medium text-pearl">
              1:1 Coaching mit einem Longevity Coach
            </div>
            <p className="text-sm text-silver mt-1 max-w-md">
              Vertiefende Analyse deiner Werte, Timing und Kombinationen — 30 Minuten.
            </p>
          </div>
        </div>
        <Link href="/checkout?plan=coaching" className="md:ml-auto">
          <Button variant="secondary">
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            Coaching buchen
          </Button>
        </Link>
      </div>

      <StepActions>
        <Link href="/results" className="hidden md:inline-flex">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Dashboard
          </Button>
        </Link>
        <Link href={activePlanHref} className="w-full md:w-auto">
          <Button size="lg" block>
            <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
            Zum Checkout · €{(subscription ? monthlyTotal : onceTotal).toFixed(0)}
          </Button>
        </Link>
      </StepActions>
    </StepFrame>
  );
}
