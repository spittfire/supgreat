"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, ShoppingBag } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { PillBox } from "@/components/PillBox";
import { SupplementCard } from "@/components/SupplementCard";
import type { Recommendation } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

export default function BoxPage() {
  const router = useRouter();
  const analysis = useFlowStore((s) => s.analysis);
  const profile = useFlowStore((s) => s.profile);
  const health = useFlowStore((s) => s.health);
  const lifestyle = useFlowStore((s) => s.lifestyle);
  const recommendation = useFlowStore((s) => s.recommendation);
  const setRecommendation = useFlowStore((s) => s.setRecommendation);
  const setStep = useFlowStore((s) => s.setStep);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(7);
  }, [setStep]);

  const requestRecommendation = useCallback(async () => {
    if (!profile || !health || !lifestyle) {
      setError(
        "Es fehlen Daten (Profil, Anamnese oder Lifestyle). Bitte Schritte vorher abschließen.",
      );
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

  // Kick off on mount only if we don't already have a recommendation.
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
        label="Box"
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
        label="Box"
        title={<>Wir stellen deine Box zusammen …</>}
        sub="Matching gegen Biomarker, Anamnese und Lifestyle. Gleich geht es weiter."
      >
        <div className="py-12 flex flex-col items-center">
          <LoadingAnalysis durationMs={100000} />
        </div>
        {error && <p className="text-sm text-coral text-center mt-4">{error}</p>}
      </StepFrame>
    );
  }

  const supplements = recommendation.supplements;

  return (
    <StepFrame
      step={7}
      label="Deine Box"
      title={
        <>
          Deine persönliche SUPGREAT Box,
          <br />
          <span className="italic">{profile.first_name}</span>.
        </>
      }
      sub="Zusammengestellt auf Basis deines Bluttests, deiner Anamnese und 20 Lifestyle-Signalen."
    >
      {supplements.length === 0 ? (
        <div className="hairline rounded-lg p-6 bg-bone-2/60">
          <p className="text-ink">{recommendation.overall_assessment}</p>
          <div className="mt-6">
            <Link href="/checkout">
              <Button>Trotzdem Beratung anfragen</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Pillbox */}
          <PillBox supplements={supplements} />

          {/* Overall assessment */}
          <div className="mt-8 hairline rounded-lg p-5 md:p-6 bg-bone-2/60">
            <div className="text-xs uppercase tracking-wide text-mist font-mono">
              Gesamtbild
            </div>
            <p className="mt-2 text-ink leading-relaxed">
              {recommendation.overall_assessment}
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-4">
            {supplements.map((rec, i) => (
              <SupplementCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-12 hairline rounded-lg p-6 md:p-8 bg-bone">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wide text-mist font-mono">
                  Deine Box
                </div>
                <div className="font-display text-3xl md:text-4xl leading-tight tracking-tight mt-1">
                  {supplements.length} Supplements · personalisiert
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-3xl text-ink tabular-nums">
                  {supplements
                    .reduce((s, p) => s + getProductPrice(p.id, true), 0)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  €
                </div>
                <div className="text-xs text-mist">
                  pro Monat im Abo · −15 % ggü. Einmalkauf
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Link href="/checkout?plan=once">
                <Button variant="secondary" className="w-full">
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  Einmal bestellen
                </Button>
              </Link>
              <Link href="/checkout?plan=subscription">
                <Button className="w-full">
                  Im Abo sparen
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Coaching upsell */}
          <div className="mt-10 hairline rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <CalendarCheck className="w-6 h-6 text-moss mt-1" strokeWidth={1.3} />
              <div>
                <div className="font-medium text-ink">
                  1:1 Coaching mit einem Longevity Coach
                </div>
                <p className="text-sm text-mist max-w-md mt-1">
                  Vertiefende Analyse deiner Werte, Timing und Kombinationen — 30 Minuten.
                </p>
              </div>
            </div>
            <Link href="/checkout?plan=coaching" className="md:ml-auto">
              <Button variant="secondary">Coaching buchen</Button>
            </Link>
          </div>
        </>
      )}

      <div className="pt-12 mt-12 hairline-b flex justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            router.push("/results");
          }}
        >
          Zurück zum Dashboard
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setRecommendation(null);
            void requestRecommendation();
          }}
        >
          Empfehlung neu berechnen
        </Button>
      </div>
    </StepFrame>
  );
}

// Resolve price from the product catalog (kept at the bottom so the page isolates
// business-logic details from its layout).
import { PRODUCT_BY_ID } from "@/lib/products";
function getProductPrice(id: string, subscription: boolean): number {
  const p = PRODUCT_BY_ID.get(id);
  if (!p) return 0;
  return subscription ? p.price_subscription : p.price_single;
}
