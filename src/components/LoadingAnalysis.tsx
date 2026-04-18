"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "./Logo";

const MESSAGES = [
  "Lese deinen Bluttest",
  "Extrahiere Biomarker",
  "Vergleiche mit Referenzwerten",
  "Erstelle dein Protokoll",
];

type LoadingAnalysisProps = {
  onDone?: () => void;
  durationMs?: number;
};

export function LoadingAnalysis({ onDone, durationMs = 3800 }: LoadingAnalysisProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const rotate = setInterval(
      () => setIdx((i) => (i + 1) % MESSAGES.length),
      Math.max(900, Math.floor(durationMs / MESSAGES.length)),
    );
    const done = setTimeout(() => onDone?.(), durationMs);
    return () => {
      clearInterval(rotate);
      clearTimeout(done);
    };
  }, [durationMs, onDone]);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Animated dual-ring with glow */}
      <div className="relative h-36 w-36 md:h-44 md:w-44">
        <div
          aria-hidden
          className="absolute inset-0 bg-lime/25 blur-3xl rounded-full"
        />
        <div className="absolute inset-0 rounded-full border border-steel" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-lime animate-spin"
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-4 rounded-full border border-steel" />
        <div
          className="absolute inset-4 rounded-full border border-transparent border-t-lime/60 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Logo className="h-8 md:h-10 w-auto text-lime" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-[11px] uppercase tracking-[0.24em] text-silver font-mono">
          Analyse läuft
        </div>
        <div
          key={idx}
          className="font-display italic text-2xl md:text-3xl text-pearl animate-[fadeIn_400ms_ease]"
        >
          {MESSAGES[idx]} …
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-silver font-mono">
        <CheckCircle2 className="h-4 w-4 text-lime" strokeWidth={1.6} />
        <span>Dokument erkannt</span>
        <span className="text-steel">·</span>
        <Loader2 className="h-4 w-4 text-lime animate-spin" strokeWidth={1.6} />
        <span>Biomarker werden extrahiert</span>
      </div>
    </div>
  );
}
