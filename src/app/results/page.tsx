"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, FileWarning } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { BiomarkerCard } from "@/components/BiomarkerCard";
import { LongevityScore } from "@/components/LongevityScore";
import { ProfileSummary } from "@/components/ProfileSummary";
import { lifestylePenalty } from "@/lib/lifestyle-triggers";
import { computeLongevityScore } from "@/lib/optimal-ranges";
import type { Biomarker } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

export default function ResultsPage() {
  const analysis = useFlowStore((s) => s.analysis);
  const profile = useFlowStore((s) => s.profile);
  const health = useFlowStore((s) => s.health);
  const lifestyle = useFlowStore((s) => s.lifestyle);
  const setStep = useFlowStore((s) => s.setStep);

  useEffect(() => {
    setStep(6);
  }, [setStep]);

  const { grouped, finalScore, bioAgeDelta } = useMemo(() => {
    const markers = analysis?.biomarkers ?? [];
    const byCat = new Map<string, Biomarker[]>();
    for (const m of markers) {
      const arr = byCat.get(m.category) ?? [];
      arr.push(m);
      byCat.set(m.category, arr);
    }
    const penalty = lifestyle ? lifestylePenalty(lifestyle) : 0;
    const finalScore = computeLongevityScore(markers, penalty);
    // Rough biological age delta: normalized around score 75.
    const bioAgeDelta = (75 - finalScore) / 3;
    return { grouped: byCat, finalScore, bioAgeDelta };
  }, [analysis, lifestyle]);

  const hasAnalysis = (analysis?.biomarkers.length ?? 0) > 0;

  return (
    <StepFrame
      step={6}
      label="Ergebnisse"
      title={
        <>
          Dein <span className="italic">Protokoll</span>.
        </>
      }
      sub="Diese Übersicht ist keine medizinische Diagnose — sie dient der Orientierung für deine SUPGREAT Box."
    >
      {!hasAnalysis && (
        <div className="hairline rounded-lg p-5 bg-brand-amber/10 flex gap-3 items-start mb-10">
          <FileWarning className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="text-sm">
            <div className="font-medium text-ink">Kein Bluttest erkannt</div>
            <p className="text-ink/70 mt-1">
              Wir haben keine Biomarker-Werte. Die Box wird dennoch auf Basis von
              Anamnese und Lifestyle erstellt — lade ideal vorher deinen Bluttest hoch,
              um präziser zu werden.
            </p>
          </div>
        </div>
      )}

      {/* Score */}
      <LongevityScore
        score={finalScore}
        chronologicalAge={profile?.age}
        bioAgeDelta={hasAnalysis ? bioAgeDelta : undefined}
      />

      {/* Profile summary */}
      {profile && health && lifestyle && (
        <div className="mt-10">
          <ProfileSummary profile={profile} health={health} lifestyle={lifestyle} />
        </div>
      )}

      {/* Biomarker groups */}
      {hasAnalysis && (
        <div className="mt-14 space-y-12">
          <h2 className="font-display text-2xl md:text-3xl">Deine Biomarker</h2>
          {Array.from(grouped.entries()).map(([cat, markers]) => (
            <section key={cat}>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-sm tracking-wide uppercase text-mist font-mono">
                  {cat}
                </h3>
                <span className="text-xs text-mist font-mono">
                  {markers.filter((m) => m.status === "optimal").length} / {markers.length}{" "}
                  optimal
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {markers.map((m) => (
                  <BiomarkerCard key={m.key} marker={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-14 text-xs text-mist max-w-prose">
        Hinweis: Dieses Protokoll ersetzt keine ärztliche Beratung. Bei kritischen
        Auffälligkeiten empfehlen wir, die Werte mit deinem Arzt zu besprechen.
      </p>

      <div className="flex justify-between items-center mt-10 pt-6 hairline-b">
        <Link href="/lifestyle">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Zurück
          </Button>
        </Link>
        <Link href="/box">
          <Button size="lg">
            Meine SUPGREAT Box zusammenstellen
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </Link>
      </div>
    </StepFrame>
  );
}
