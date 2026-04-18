"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileSearch } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
      <main className="flex-1 relative">
        <section className="mx-auto max-w-3xl px-4 md:px-10 py-20 md:py-32 flex flex-col items-center text-center min-h-[60vh] justify-center">
          {state === "working" && (
            <>
              <Eyebrow>Schritt 02 · Analyse</Eyebrow>
              <div className="mt-14">
                <LoadingAnalysis durationMs={15000} />
              </div>
              <p className="mt-10 text-sm text-silver">
                {fileCount > 1
                  ? `${fileCount} Dateien werden kombiniert analysiert.`
                  : fileCount === 1
                    ? filesMeta[0].name
                    : "Datei wird verarbeitet."}
              </p>
            </>
          )}

          {state === "done" && (
            <>
              <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime mb-6 shadow-glow-lime">
                <CheckCircle2 strokeWidth={1.3} className="w-7 h-7" />
              </div>
              <Eyebrow>Erkennung abgeschlossen</Eyebrow>
              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight tracking-tight text-pearl">
                <span className="italic text-silver">Extrahiert:</span>{" "}
                <span className="text-lime">{markerCount} Biomarker</span>
              </h1>
              <p className="mt-5 text-silver max-w-prose">
                Aus {fileCount} Datei{fileCount === 1 ? "" : "en"}. Weiter zum Profil …
              </p>
            </>
          )}

          {state === "no-markers" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center text-amber mb-6">
                <FileSearch strokeWidth={1.3} className="w-7 h-7" />
              </div>
              <Eyebrow>Keine Werte erkannt</Eyebrow>
              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight tracking-tight text-pearl">
                <span className="italic text-silver">Hmm.</span> Das Foto war schwer zu
                lesen.
              </h1>
              <p className="mt-5 text-silver max-w-prose">
                {wasRawFound
                  ? "Wir haben Zahlen gelesen, aber keinem unserer Referenzmarker eindeutig zugeordnet. Das Layout ist vermutlich ungewöhnlich."
                  : "Die Dokumente scheinen keinen lesbaren deutschen Bluttest zu enthalten. Ein schärferes Foto oder PDF hilft."}
              </p>
              <div className="mt-10 flex gap-3 justify-center flex-wrap">
                <Link href="/">
                  <Button variant="secondary">Andere Dateien hochladen</Button>
                </Link>
                <Link href="/profile">
                  <Button>Ohne Bluttest weiter</Button>
                </Link>
              </div>
            </>
          )}

          {state === "missing-file" && (
            <>
              <Eyebrow>Session abgelaufen</Eyebrow>
              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight tracking-tight text-pearl">
                Keine Datei gefunden.
              </h1>
              <p className="mt-5 text-silver max-w-prose">
                Beim Seitenneuladen geht der Upload verloren. Bitte lade deinen
                Bluttest erneut hoch.
              </p>
              <div className="mt-10 flex gap-3 justify-center">
                <Link href="/">
                  <Button>Zurück zum Upload</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="secondary">Ohne Bluttest weiter</Button>
                </Link>
              </div>
            </>
          )}

          {state === "error" && (
            <>
              <div className="rounded-2xl border border-coral/40 bg-coral/5 p-5 flex items-start gap-3 text-left max-w-xl">
                <AlertTriangle
                  className="w-5 h-5 text-coral shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <div className="text-sm text-pearl/90">
                  <div className="font-medium text-coral">Analyse fehlgeschlagen</div>
                  <p className="mt-1 text-silver">{error}</p>
                </div>
              </div>
              <div className="mt-10 flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="secondary">Zurück zum Upload</Button>
                </Link>
                <Link href="/profile">
                  <Button>Ohne Bluttest weiter</Button>
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
