"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileSearch } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { Button } from "@/components/ui/Button";
import type { Analysis } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

type AnalyzeResponse = Analysis & {
  _mock?: boolean;
  raw_found?: boolean;
  file_count?: number;
};

type State = "working" | "done" | "no-markers" | "missing-file" | "error";

export default function AnalyzePage() {
  const router = useRouter();
  const files = useFlowStore((s) => s.uploadedFiles);
  const filesMeta = useFlowStore((s) => s.uploadedFilesMeta);
  const setAnalysis = useFlowStore((s) => s.setAnalysis);
  const setStep = useFlowStore((s) => s.setStep);
  const profile = useFlowStore((s) => s.profile);

  const [state, setState] = useState<State>("working");
  const [error, setError] = useState<string | null>(null);
  const [markerCount, setMarkerCount] = useState(0);
  const [wasRawFound, setWasRawFound] = useState(true);
  const requestedRef = useRef(false);

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (files.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("missing-file");
      return;
    }

    const run = async () => {
      const form = new FormData();
      for (const file of files) form.append("file", file);
      if (profile?.sex) form.append("sex", profile.sex);
      try {
        const res = await fetch("/api/analyze", { method: "POST", body: form });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as AnalyzeResponse;
        setAnalysis(data);
        const count = data.biomarkers.length;
        setMarkerCount(count);
        setWasRawFound(data.raw_found !== false);
        if (count > 0) {
          setState("done");
          setTimeout(() => router.push("/profile"), 900);
        } else {
          setState("no-markers");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analyse fehlgeschlagen.");
        setState("error");
      }
    };

    void run();
  }, [files, profile, setAnalysis, router]);

  const fileCount = filesMeta.length;

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
                {fileCount > 1
                  ? `${fileCount} Dateien werden kombiniert analysiert.`
                  : fileCount === 1
                    ? `Datei: ${filesMeta[0].name}`
                    : "Deine Datei wird verarbeitet."}
              </p>
              <div className="mt-14">
                <LoadingAnalysis durationMs={15000} />
              </div>
            </>
          )}

          {state === "done" && (
            <>
              <div className="w-14 h-14 rounded-full bg-moss/10 flex items-center justify-center text-moss mb-5">
                <CheckCircle2 strokeWidth={1.3} />
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
                Erkennung abgeschlossen.
              </h1>
              <p className="mt-4 text-ink/70 max-w-prose">
                <strong className="font-mono text-ink">{markerCount}</strong>{" "}
                Biomarker aus {fileCount} Datei{fileCount === 1 ? "" : "en"} erkannt.
                Weiter zum Profil …
              </p>
            </>
          )}

          {state === "no-markers" && (
            <>
              <div className="w-14 h-14 rounded-full bg-brand-amber/15 flex items-center justify-center text-brand-amber mb-5">
                <FileSearch strokeWidth={1.3} />
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
                Keine Werte eindeutig erkannt.
              </h1>
              <p className="mt-4 text-ink/70 max-w-prose">
                {wasRawFound
                  ? "Wir konnten zwar Zahlen lesen, aber keinem unserer bekannten Referenzmarker sicher zuordnen. Das Foto/PDF zeigt möglicherweise ein ungewöhnliches Labor-Layout oder Marker außerhalb unseres Katalogs."
                  : "Die Dokumente scheinen keinen lesbaren deutschen Bluttest zu enthalten. Versuch ein schärferes Foto oder lade das PDF direkt hoch."}
              </p>
              <div className="mt-10 flex gap-3 justify-center flex-wrap">
                <Link href="/">
                  <Button variant="secondary">Andere Dateien hochladen</Button>
                </Link>
                <Link href="/profile">
                  <Button>Ohne Bluttest weitermachen</Button>
                </Link>
              </div>
              <p className="text-xs text-mist mt-6">
                Hinweis: Die Box kann auch rein auf Anamnese + Lifestyle-Fragebogen basieren.
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
