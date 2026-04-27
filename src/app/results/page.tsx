"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, FileWarning, ShieldCheck } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LongevityScore } from "@/components/LongevityScore";
import { ProfileSummary } from "@/components/ProfileSummary";
import { PostPurchasePromise } from "@/components/PostPurchasePromise";
import { lifestylePenalty } from "@/lib/lifestyle-triggers";
import { computeLongevityScore } from "@/lib/optimal-ranges";
import type { BiomarkerStatus } from "@/lib/types";
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

  const { totals, finalScore, bioAgeDelta } = useMemo(() => {
    const markers = analysis?.biomarkers ?? [];
    const totals: Record<BiomarkerStatus, number> = {
      optimal: 0,
      suboptimal: 0,
      low: 0,
      high: 0,
      critical: 0,
      unknown: 0,
    };
    for (const m of markers) totals[m.status] = (totals[m.status] ?? 0) + 1;
    const penalty = lifestyle ? lifestylePenalty(lifestyle) : 0;
    const finalScore = computeLongevityScore(markers, penalty);
    const bioAgeDelta = (75 - finalScore) / 3;
    return { totals, finalScore, bioAgeDelta };
  }, [analysis, lifestyle]);

  const totalMarkers = analysis?.biomarkers.length ?? 0;
  const hasAnalysis = totalMarkers > 0;
  const optimal = totals.optimal;
  const attention = totals.suboptimal + totals.low + totals.high;
  const critical = totals.critical;

  return (
    <StepFrame
      step={6}
      label="Schritt 06 · Ergebnisse"
      title={
        <>
          Dein <span className="italic text-lime">Protokoll</span>.
        </>
      }
      sub="Die Detail-Auswertung deines Bluttests bekommst du nach dem Kauf per E-Mail — hier siehst du den groben Stand."
    >
      {!hasAnalysis && (
        <div className="rounded-2xl border border-amber/30 bg-amber/5 p-5 flex gap-3 items-start mb-10">
          <FileWarning className="w-5 h-5 text-amber shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="text-sm">
            <div className="font-medium text-amber">Kein Bluttest erkannt</div>
            <p className="text-silver mt-1">
              Keine Biomarker-Werte erkannt. Die Box wird dennoch auf Basis von
              Anamnese und Lifestyle erstellt — ideal lädst du vorher deinen Bluttest hoch.
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
        <section className="mt-12 rounded-3xl border border-steel bg-onyx p-6 md:p-10 shadow-glow-soft">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-lime" strokeWidth={1.6} />
            <Eyebrow>Bluttest-Stand</Eyebrow>
          </div>
          <h2 className="mt-4 font-display text-3xl md:text-4xl text-pearl">
            <span className="text-lime">{totalMarkers}</span>{" "}
            <span className="italic text-silver">Werte analysiert.</span>
          </h2>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-lime/30 bg-lime/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-silver font-mono">
                Im Zielbereich
              </div>
              <div className="mt-2 font-mono text-3xl text-lime tabular-nums">
                {optimal}
              </div>
            </div>
            <div className="rounded-2xl border border-amber/30 bg-amber/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-silver font-mono">
                Mit Spielraum
              </div>
              <div className="mt-2 font-mono text-3xl text-amber tabular-nums">
                {attention}
              </div>
            </div>
            <div
              className={`rounded-2xl border p-4 ${
                critical > 0
                  ? "border-coral/40 bg-coral/5"
                  : "border-steel bg-graphite/40"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-silver font-mono">
                Mit Auffälligkeit
              </div>
              <div
                className={`mt-2 font-mono text-3xl tabular-nums ${
                  critical > 0 ? "text-coral" : "text-ash"
                }`}
              >
                {critical}
              </div>
            </div>
          </div>

          <p className="mt-7 max-w-prose text-pearl leading-relaxed">
            Welche Werte konkret betroffen sind, wo deine Referenzbereiche liegen
            und was wir daraus für dich ableiten, schicken wir dir nach dem Kauf
            in deinem persönlichen PDF-Bericht.
          </p>
        </section>
      )}

      <div className="mt-10">
        <PostPurchasePromise />
      </div>

      <p className="mt-12 text-xs text-ash max-w-prose">
        Hinweis: Diese Übersicht ersetzt keine ärztliche Beratung. Bei kritischen
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
