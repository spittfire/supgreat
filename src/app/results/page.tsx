"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, FileWarning } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BiomarkerCard } from "@/components/BiomarkerCard";
import { LongevityScore } from "@/components/LongevityScore";
import { ProfileSummary } from "@/components/ProfileSummary";
import { lifestylePenalty } from "@/lib/lifestyle-triggers";
import { computeLongevityScore } from "@/lib/optimal-ranges";
import type { Biomarker } from "@/lib/types";
import { CATEGORY_ICON } from "@/lib/visuals";
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
    const bioAgeDelta = (75 - finalScore) / 3;
    return { grouped: byCat, finalScore, bioAgeDelta };
  }, [analysis, lifestyle]);

  const hasAnalysis = (analysis?.biomarkers.length ?? 0) > 0;

  return (
    <StepFrame
      step={6}
      label="Schritt 06 · Ergebnisse"
      title={
        <>
          Dein <span className="italic text-lime">Protokoll</span>.
        </>
      }
      sub="Diese Übersicht ist keine medizinische Diagnose — sie dient der Orientierung für deine SUPGREAT Box."
    >
      {!hasAnalysis && (
        <div className="rounded-2xl border border-amber/30 bg-amber/5 p-5 flex gap-3 items-start mb-10">
          <FileWarning className="w-5 h-5 text-amber shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="text-sm">
            <div className="font-medium text-amber">Kein Bluttest erkannt</div>
            <p className="text-silver mt-1">
              Keine Biomarker-Werte erkannt. Die Box wird dennoch auf Basis von
              Anamnese und Lifestyle erstellt — lade ideal vorher deinen Bluttest hoch.
            </p>
          </div>
        </div>
      )}

      <LongevityScore
        score={finalScore}
        chronologicalAge={profile?.age}
        bioAgeDelta={hasAnalysis ? bioAgeDelta : undefined}
      />

      {profile && health && lifestyle && (
        <div className="mt-10">
          <ProfileSummary profile={profile} health={health} lifestyle={lifestyle} />
        </div>
      )}

      {hasAnalysis && (
        <div className="mt-16 space-y-14">
          <div>
            <Eyebrow>Deine Biomarker</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-pearl">
              {analysis!.biomarkers.length}{" "}
              <span className="italic text-silver">Werte,</span> gruppiert.
            </h2>
          </div>

          {Array.from(grouped.entries()).map(([cat, markers]) => {
            const Icon = CATEGORY_ICON[cat];
            const optCount = markers.filter((m) => m.status === "optimal").length;
            return (
              <section key={cat}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <span
                        aria-hidden
                        className="w-10 h-10 rounded-xl border border-steel bg-graphite flex items-center justify-center text-lime"
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </span>
                    )}
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-silver">
                        Kategorie
                      </div>
                      <h3 className="font-display text-xl text-pearl">{cat}</h3>
                    </div>
                  </div>
                  <span className="text-xs text-ash font-mono">
                    <span className="text-lime">{optCount}</span> / {markers.length}{" "}
                    optimal
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {markers.map((m) => (
                    <BiomarkerCard key={m.key} marker={m} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-16 text-xs text-ash max-w-prose">
        Hinweis: Dieses Protokoll ersetzt keine ärztliche Beratung. Bei kritischen
        Auffälligkeiten empfehlen wir, die Werte mit deinem Arzt zu besprechen.
      </p>

      <StepActions>
        <Link href="/lifestyle" className="hidden md:inline-flex">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Zurück
          </Button>
        </Link>
        <Link href="/box" className="md:w-auto md:flex-none w-full">
          <Button size="lg" block>
            Meine SUPGREAT Box zusammenstellen
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </Button>
        </Link>
      </StepActions>
    </StepFrame>
  );
}
