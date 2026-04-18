"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Lese deinen Bluttest …",
  "Extrahiere Biomarker …",
  "Vergleiche mit Referenzwerten …",
  "Erstelle dein Protokoll …",
];

type LoadingAnalysisProps = {
  /** Called when the fake work is done. */
  onDone?: () => void;
  /** Total duration before onDone fires, in ms. */
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
      <div className="relative w-24 h-24" aria-hidden>
        <span className="absolute inset-0 rounded-full border border-line" />
        <span className="absolute inset-0 rounded-full border border-moss animate-ping opacity-60" />
        <span className="absolute inset-3 rounded-full bg-moss/10" />
        <span className="absolute inset-6 rounded-full bg-moss animate-pulse" />
      </div>
      <p
        key={idx}
        className="font-mono text-sm tracking-wide text-mist animate-[fadeIn_400ms_ease]"
      >
        {MESSAGES[idx]}
      </p>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
