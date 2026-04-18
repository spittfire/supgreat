"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { Button } from "@/components/ui/Button";
import type { Analysis } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

type State = "working" | "done" | "missing-file" | "error";

export default function AnalyzePage() {
  const router = useRouter();
  const uploadedFile = useFlowStore((s) => s.uploadedFile);
  const uploadedFileMeta = useFlowStore((s) => s.uploadedFileMeta);
  const setAnalysis = useFlowStore((s) => s.setAnalysis);
  const setStep = useFlowStore((s) => s.setStep);
  const profile = useFlowStore((s) => s.profile);

  const [state, setState] = useState<State>("working");
  const [error, setError] = useState<string | null>(null);
  const [markerCount, setMarkerCount] = useState(0);
  const requestedRef = useRef(false);

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (!uploadedFile) {
      // File isn't persisted across reloads — user likely reloaded /analyze.
      setState("missing-file");
      return;
    }

    const run = async () => {
      const form = new FormData();
      form.append("file", uploadedFile);
      if (profile?.sex) form.append("sex", profile.sex);
      try {
        const res = await fetch("/api/analyze", { method: "POST", body: form });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as Analysis;
        setAnalysis(data);
        setMarkerCount(data.biomarkers.length);
        setState("done");
        // Navigate forward after a brief moment so the success frame is visible
        setTimeout(() => router.push("/profile"), 700);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analyse fehlgeschlagen.");
        setState("error");
      }
    };

    void run();
  }, [uploadedFile, profile, setAnalysis, router]);

  return (
    <>
      <Header currentStep={2} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 md:px-10 py-20 md:py-28 flex flex-col items-center text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-moss mb-6 font-mono">
            Schritt 2 · Analyse
          </p>

          {state === "working" && (
            <>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
                Wir lesen deinen Bluttest.
              </h1>
              <p className="mt-4 text-ink/70 max-w-prose">
                {uploadedFileMeta
                  ? `Datei: ${uploadedFileMeta.name}`
                  : "Deine Datei wird verarbeitet."}
              </p>
              <div className="mt-14">
                <LoadingAnalysis durationMs={15000} />
              </div>
            </>
          )}

          {state === "done" && (
            <>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
                Erkennung abgeschlossen.
              </h1>
              <p className="mt-4 text-ink/70 max-w-prose">
                {markerCount > 0
                  ? `${markerCount} Biomarker erkannt. Weiter zum Profil …`
                  : "Keine Biomarker eindeutig erkannt — du kannst trotzdem weitermachen; die Box wird aus Anamnese und Lifestyle abgeleitet."}
              </p>
            </>
          )}

          {state === "missing-file" && (
            <>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
                Keine Datei gefunden.
              </h1>
              <p className="mt-4 text-ink/70 max-w-prose">
                Beim Seitenneuladen geht der Upload verloren. Bitte lade deinen Bluttest
                erneut hoch.
              </p>
              <div className="mt-10 flex gap-3 justify-center">
                <Link href="/">
                  <Button>Zurück zum Upload</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="secondary">Ohne Bluttest weitermachen</Button>
                </Link>
              </div>
            </>
          )}

          {state === "error" && (
            <>
              <div className="hairline rounded-lg p-5 bg-coral/10 flex items-start gap-3 text-left max-w-xl">
                <AlertTriangle
                  className="w-5 h-5 text-coral shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <div className="text-sm text-ink/85">
                  <div className="font-medium text-ink">Analyse fehlgeschlagen</div>
                  <p className="mt-1">{error}</p>
                  <p className="mt-2 text-xs text-mist">
                    Häufige Ursache: fehlender ANTHROPIC_API_KEY in <code>.env.local</code>{" "}
                    oder beschädigtes PDF. Prüfe deinen Key, starte den Dev-Server neu und
                    versuch es erneut.
                  </p>
                </div>
              </div>
              <div className="mt-10 flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="secondary">Zurück zum Upload</Button>
                </Link>
                <Link href="/profile">
                  <Button>Ohne Bluttest weitermachen</Button>
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
