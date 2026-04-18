type LongevityScoreProps = {
  score: number;
  /** Optional derived biological-age delta in years (can be negative). */
  bioAgeDelta?: number;
  chronologicalAge?: number;
};

export function LongevityScore({ score, bioAgeDelta, chronologicalAge }: LongevityScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = clamped >= 80 ? "#2F3E32" : clamped >= 60 ? "#C4964A" : "#D4736B";

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
      <div className="relative w-48 h-48 md:w-52 md:h-52 shrink-0">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#E4E1D9"
            strokeWidth="4"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-light tabular-nums text-ink">
            {Math.round(clamped)}
          </span>
          <span className="text-xs tracking-wide uppercase text-mist mt-1">
            Longevity Score
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-mist font-mono uppercase tracking-wide">
          Deine Einordnung
        </div>
        <div className="mt-3 grid grid-cols-2 gap-5 text-ink">
          {typeof chronologicalAge === "number" && (
            <div>
              <div className="text-xs text-mist">Kalendarisches Alter</div>
              <div className="font-mono text-2xl mt-1 tabular-nums">
                {chronologicalAge}
              </div>
            </div>
          )}
          {typeof bioAgeDelta === "number" && typeof chronologicalAge === "number" && (
            <div>
              <div className="text-xs text-mist">Biologisches Alter</div>
              <div className="font-mono text-2xl mt-1 tabular-nums">
                {(chronologicalAge + bioAgeDelta).toFixed(0)}
                <span className="text-sm text-mist ml-2">
                  ({bioAgeDelta >= 0 ? "+" : ""}
                  {bioAgeDelta.toFixed(1)} J)
                </span>
              </div>
            </div>
          )}
        </div>
        <p className="mt-6 text-sm text-ink/70 max-w-prose">
          {clamped >= 80
            ? "Dein Profil wirkt insgesamt sehr stark. Fokus auf Erhalt und Feinjustierung."
            : clamped >= 60
              ? "Solide Basis mit klaren Stellschrauben. Die SUPGREAT Box adressiert gezielt die Lücken."
              : "Mehrere Werte zeigen Spielraum. Mit der passenden Box und Lifestyle-Routine lässt sich das gut bewegen."}
        </p>
      </div>
    </div>
  );
}
