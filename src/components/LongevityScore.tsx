import { Eyebrow } from "./ui/Eyebrow";

type LongevityScoreProps = {
  score: number;
  bioAgeDelta?: number;
  chronologicalAge?: number;
};

export function LongevityScore({
  score,
  bioAgeDelta,
  chronologicalAge,
}: LongevityScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const showBio =
    typeof bioAgeDelta === "number" && typeof chronologicalAge === "number";
  const bioAge = showBio ? chronologicalAge! + bioAgeDelta! : undefined;

  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {/* Main score card */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-steel bg-onyx p-6 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-radial-lime opacity-60"
        />
        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative h-44 w-44 shrink-0">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#2A2E36"
                strokeWidth="3"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#C9F25C"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-1000 ease-out"
                style={{ filter: "drop-shadow(0 0 8px rgba(201,242,92,0.5))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-6xl font-light tabular-nums text-pearl">
                {Math.round(clamped)}
              </span>
              <span className="text-[10px] tracking-[0.24em] uppercase text-silver mt-1">
                Score
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left">
            <Eyebrow>Longevity Score</Eyebrow>
            <p className="mt-4 font-display text-2xl md:text-3xl leading-tight text-pearl">
              {clamped >= 80
                ? "Dein Profil wirkt sehr stark."
                : clamped >= 60
                  ? "Solide Basis mit klaren Stellschrauben."
                  : "Mehrere Werte zeigen Spielraum."}
            </p>
            <p className="mt-3 text-sm md:text-base text-silver leading-relaxed max-w-md mx-auto md:mx-0">
              {clamped >= 80
                ? "Fokus auf Erhalt und Feinjustierung."
                : clamped >= 60
                  ? "Die SUPGREAT Box adressiert gezielt deine Lücken."
                  : "Mit der passenden Box und Lifestyle-Routine lässt sich das bewegen."}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Age card */}
      <div className="relative overflow-hidden rounded-3xl border border-steel bg-onyx p-6 md:p-8 flex flex-col justify-between">
        <Eyebrow>Biologisches Alter</Eyebrow>
        <div className="mt-6">
          {showBio ? (
            <>
              <div className="font-mono text-6xl md:text-7xl text-pearl tabular-nums leading-none">
                {bioAge!.toFixed(0)}
              </div>
              <div className="mt-3 text-sm text-silver">
                {bioAgeDelta! >= 0 ? (
                  <>
                    <span className="text-amber">+{bioAgeDelta!.toFixed(1)} Jahre</span>{" "}
                    über deinem Alter
                  </>
                ) : (
                  <>
                    <span className="text-lime">{bioAgeDelta!.toFixed(1)} Jahre</span>{" "}
                    unter deinem Alter
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-5xl text-ash tabular-nums leading-none">
                —
              </div>
              <div className="mt-3 text-sm text-silver">
                Bluttest-Daten fehlen für eine präzise Schätzung.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
