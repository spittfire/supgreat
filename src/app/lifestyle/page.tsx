"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { InsightCard } from "@/components/InsightCard";
import { DIETS, SPORT_TYPES, SYMPTOMS } from "@/lib/lists";
import { LifestyleSchema, type Lifestyle } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";
import { BLOCK_META } from "@/lib/visuals";
import { buildBlockInsight } from "@/lib/insights";

type Draft = Partial<Lifestyle>;
type LifestyleField = keyof Lifestyle;

const FIELD_TO_BLOCK: Record<LifestyleField, number> = {
  diet: 0,
  meals_per_day: 0,
  fish_per_week: 0,
  processed_food: 0,
  veg_fruit: 0,
  water: 1,
  coffee: 1,
  alcohol: 1,
  smoking: 1,
  sleep_hours: 2,
  sleep_quality: 2,
  night_wake: 2,
  morning_energy: 2,
  sport_frequency: 3,
  sport_type: 3,
  sitting_hours: 3,
  stress_level: 3,
  outdoor_time: 4,
  energy_low: 4,
  symptoms: 4,
};

function Question({
  number,
  label,
  children,
  hint,
  error = false,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 transition-colors ${
        error
          ? "border-coral bg-coral/5 shadow-glow-coral"
          : "border-steel bg-onyx"
      }`}
    >
      <div className="flex items-start gap-4 mb-5">
        <span
          aria-hidden
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm ${
            error
              ? "border border-coral bg-coral/10 text-coral"
              : "border border-steel bg-graphite text-lime"
          }`}
        >
          {String(number).padStart(2, "0")}
        </span>
        <div className="pt-1">
          <div
            className={`text-[11px] uppercase tracking-[0.2em] font-medium mb-1 ${
              error ? "text-coral" : "text-silver"
            }`}
          >
            {error ? `Frage ${number} · noch offen` : `Frage ${number}`}
          </div>
          <h3 className="text-lg md:text-xl text-pearl leading-snug">{label}</h3>
          {hint && <p className="text-xs text-ash mt-1">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function LifestylePage() {
  const router = useRouter();
  const stored = useFlowStore((s) => s.lifestyle);
  const profile = useFlowStore((s) => s.profile);
  const health = useFlowStore((s) => s.health);
  const analysis = useFlowStore((s) => s.analysis);
  const setLifestyle = useFlowStore((s) => s.setLifestyle);
  const setStep = useFlowStore((s) => s.setStep);

  const [block, setBlock] = useState(0);
  // Sliders + Multi-Selects starten bewusst ohne Vorauswahl, damit der User
  // jede Skala aktiv setzen muss (auch eine '3' als Antwort).
  const [d, setD] = useState<Draft>(stored ?? { sport_type: [], symptoms: [] });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Set<LifestyleField>>(new Set());

  useEffect(() => {
    setStep(5);
  }, [setStep]);

  const update = <K extends keyof Lifestyle>(key: K, value: Lifestyle[K]) => {
    setD((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const validateAll = () => {
    const draft: Draft = {
      ...d,
      sport_type: d.sport_type ?? [],
      symptoms: d.symptoms ?? [],
    };
    const parsed = LifestyleSchema.safeParse(draft);
    if (parsed.success) return { ok: true as const, data: parsed.data, missing: [] };
    const missing = parsed.error.issues
      .map((i) => i.path[0])
      .filter((p): p is LifestyleField => typeof p === "string" && p in FIELD_TO_BLOCK);
    return { ok: false as const, data: null, missing };
  };

  const goToBlock = (i: number) => {
    setBlock(i);
    setError(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextBlock = () => {
    const result = validateAll();
    const missingInCurrentBlock = result.missing.filter(
      (f) => FIELD_TO_BLOCK[f] === block,
    );

    // Mid-flow: aktueller Block muss vollständig sein, sonst rote Markierung
    // und kein Weitergehen. Andere Blöcke werden ebenfalls markiert, damit
    // der User sieht, was insgesamt noch fehlt.
    if (block < BLOCK_META.length - 1) {
      if (missingInCurrentBlock.length > 0) {
        setFieldErrors(new Set(result.missing));
        setError(
          `Bitte beantworte ${missingInCurrentBlock.length} offene ${
            missingInCurrentBlock.length === 1 ? "Frage" : "Fragen"
          } in diesem Block.`,
        );
        return;
      }
      setFieldErrors(new Set(result.missing));
      setError(null);
      goToBlock(block + 1);
      return;
    }

    // Letzter Block: alles muss valide sein. Sonst springen wir zur ersten
    // offenen Frage und markieren alle fehlenden Felder.
    if (!result.ok) {
      setFieldErrors(new Set(result.missing));
      const firstMissingBlock = Math.min(
        ...result.missing.map((f) => FIELD_TO_BLOCK[f]),
      );
      setError(
        `Es fehlen noch ${result.missing.length} Antworten — wir sind zur ersten gesprungen.`,
      );
      goToBlock(firstMissingBlock);
      return;
    }

    setFieldErrors(new Set());
    setError(null);
    setLifestyle(result.data);
    router.push("/results");
  };

  const prevBlock = () => {
    setError(null);
    if (block > 0) goToBlock(block - 1);
  };

  const current = BLOCK_META[block];
  const blockLetter = String.fromCharCode(65 + block);

  // Insight für den gerade abgeschlossenen Block — nur ab Block 1 (B..E)
  // gibt es eine Zwischen-Auswertung zu zeigen.
  const insight = useMemo(() => {
    if (block === 0) return null;
    return buildBlockInsight(block - 1, {
      draft: d,
      profile,
      health,
      analysis,
    });
  }, [block, d, profile, health, analysis]);

  return (
    <StepFrame
      step={5}
      label={`Schritt 05 · Lifestyle · Block ${blockLetter} / E`}
      title={
        <>
          <span className="italic text-silver">Block {blockLetter}:</span>{" "}
          <span className="text-pearl">{current.label}</span>.
        </>
      }
      sub="Je ehrlicher du antwortest, desto präziser wird deine Box. 20 Fragen, ca. 4 Minuten."
    >
      <div className="max-w-2xl">
        {/* Block tabs — clickable */}
        <div className="flex gap-2 mb-10" role="tablist" aria-label="Lifestyle-Block">
          {BLOCK_META.map((meta, i) => {
            const Icon = meta.icon;
            const isActive = i === block;
            const isDone = i < block;
            const hasError = Array.from(fieldErrors).some(
              (f) => FIELD_TO_BLOCK[f] === i,
            );
            return (
              <button
                key={meta.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Block ${String.fromCharCode(65 + i)}`}
                onClick={() => goToBlock(i)}
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-all duration-300 active:scale-[0.97] ${
                  isActive
                    ? hasError
                      ? "border-coral bg-coral/10 text-coral"
                      : "border-lime bg-lime/10 text-lime shadow-glow-lime"
                    : hasError
                      ? "border-coral/60 bg-coral/5 text-coral hover:border-coral"
                      : isDone
                        ? "border-steel bg-graphite text-pearl/70 hover:border-iron hover:text-pearl"
                        : "border-steel bg-onyx text-ash hover:border-iron hover:text-pearl"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-[10px] font-medium font-mono uppercase tracking-wider">
                  {String.fromCharCode(65 + i)}
                </span>
              </button>
            );
          })}
        </div>

        {insight && <InsightCard insight={insight} />}

        <div className="space-y-4">
          {block === 0 && (
            <>
              <Question number={1} label="Welche Ernährungsweise beschreibt dich am besten?" error={fieldErrors.has("diet")}>
                <ChipSelect
                  value={d.diet ?? null}
                  onChange={(v) => update("diet", v)}
                  options={DIETS}
                  cols={2}
                />
              </Question>
              <Question number={2} label="Wie viele Mahlzeiten pro Tag im Durchschnitt?" error={fieldErrors.has("meals_per_day")}>
                <ChipSelect
                  value={d.meals_per_day ?? null}
                  onChange={(v) => update("meals_per_day", v)}
                  options={["1", "2", "3", "4+", "Unregelmäßig / Snacking"]}
                  cols={3}
                />
              </Question>
              <Question number={3} label="Wie oft isst du Fisch pro Woche?" error={fieldErrors.has("fish_per_week")}>
                <ChipSelect
                  value={d.fish_per_week ?? null}
                  onChange={(v) => update("fish_per_week", v)}
                  options={["Nie", "1×", "2–3×", "4+×", "Fast täglich"]}
                  cols={3}
                />
              </Question>
              <Question number={4} label="Wie oft isst du verarbeitete Lebensmittel?" hint="Fast Food, Fertigprodukte, Süßigkeiten" error={fieldErrors.has("processed_food")}>
                <ChipSelect
                  value={d.processed_food ?? null}
                  onChange={(v) => update("processed_food", v)}
                  options={["Nie", "Selten", "1× pro Woche", "Mehrmals pro Woche", "Täglich"]}
                  cols={2}
                />
              </Question>
              <Question number={5} label="Wie viel Gemüse und Obst am Tag?" hint="Hand-Portionen" error={fieldErrors.has("veg_fruit")}>
                <ChipSelect
                  value={d.veg_fruit ?? null}
                  onChange={(v) => update("veg_fruit", v)}
                  options={["0–1", "2–3", "4–5", "6+"]}
                  cols={4}
                />
              </Question>
            </>
          )}

          {block === 1 && (
            <>
              <Question number={6} label="Wie viel Wasser trinkst du pro Tag?" error={fieldErrors.has("water")}>
                <ChipSelect
                  value={d.water ?? null}
                  onChange={(v) => update("water", v)}
                  options={["<1 L", "1–1,5 L", "1,5–2 L", "2–3 L", "3+ L"]}
                  cols={3}
                />
              </Question>
              <Question number={7} label="Wie viele Tassen Kaffee pro Tag?" error={fieldErrors.has("coffee")}>
                <ChipSelect
                  value={d.coffee ?? null}
                  onChange={(v) => update("coffee", v)}
                  options={["0", "1–2", "3–4", "5+"]}
                  cols={4}
                />
              </Question>
              <Question number={8} label="Wie oft trinkst du Alkohol?" error={fieldErrors.has("alcohol")}>
                <ChipSelect
                  value={d.alcohol ?? null}
                  onChange={(v) => update("alcohol", v)}
                  options={[
                    "Nie",
                    "Selten (1–2×/Monat)",
                    "Wöchentlich (1–3×)",
                    "Fast täglich",
                    "Täglich",
                  ]}
                  cols={2}
                />
              </Question>
              <Question number={9} label="Rauchst du?" error={fieldErrors.has("smoking")}>
                <ChipSelect
                  value={d.smoking ?? null}
                  onChange={(v) => update("smoking", v)}
                  options={["Nie", "Ex-Raucher", "Gelegentlich", "Täglich", "Vapen/E-Zigarette"]}
                  cols={2}
                />
              </Question>
            </>
          )}

          {block === 2 && (
            <>
              <Question number={10} label="Wie viele Stunden Schlaf pro Nacht?" error={fieldErrors.has("sleep_hours")}>
                <ChipSelect
                  value={d.sleep_hours ?? null}
                  onChange={(v) => update("sleep_hours", v)}
                  options={["<5", "5–6", "6–7", "7–8", "8+"]}
                  cols={3}
                />
              </Question>
              <Question number={11} label="Wie würdest du deine Schlafqualität bewerten?" error={fieldErrors.has("sleep_quality")}>
                <ScaleInput
                  value={d.sleep_quality ?? null}
                  onChange={(v) => update("sleep_quality", v)}
                  leftLabel="schlecht"
                  rightLabel="sehr gut"
                  error={fieldErrors.has("sleep_quality")}
                />
              </Question>
              <Question number={12} label="Wachst du nachts häufig auf?" error={fieldErrors.has("night_wake")}>
                <ChipSelect
                  value={d.night_wake ?? null}
                  onChange={(v) => update("night_wake", v)}
                  options={["Nie", "Selten", "1–2×/Nacht", "Mehrmals", "Ständig"]}
                  cols={3}
                />
              </Question>
              <Question number={13} label="Wie fit fühlst du dich morgens?" error={fieldErrors.has("morning_energy")}>
                <ScaleInput
                  value={d.morning_energy ?? null}
                  onChange={(v) => update("morning_energy", v)}
                  leftLabel="erschöpft"
                  rightLabel="ausgeruht"
                  error={fieldErrors.has("morning_energy")}
                />
              </Question>
            </>
          )}

          {block === 3 && (
            <>
              <Question number={14} label="Wie oft Sport pro Woche?" hint="mind. 30 Min" error={fieldErrors.has("sport_frequency")}>
                <ChipSelect
                  value={d.sport_frequency ?? null}
                  onChange={(v) => update("sport_frequency", v)}
                  options={["0×", "1–2×", "3–4×", "5–6×", "Täglich"]}
                  cols={3}
                />
              </Question>
              <Question number={15} label="Welche Art von Sport überwiegt?" hint="Mehrfachauswahl möglich">
                <MultiSelectChips
                  values={d.sport_type ?? []}
                  onChange={(v) => update("sport_type", v)}
                  options={SPORT_TYPES}
                  cols={3}
                />
              </Question>
              <Question number={16} label="Wie viele Stunden sitzt du pro Tag?" hint="Beruf + Freizeit" error={fieldErrors.has("sitting_hours")}>
                <ChipSelect
                  value={d.sitting_hours ?? null}
                  onChange={(v) => update("sitting_hours", v)}
                  options={["<4", "4–6", "6–8", "8–10", "10+"]}
                  cols={3}
                />
              </Question>
              <Question number={17} label="Wie hoch ist dein Stresslevel im Alltag?" error={fieldErrors.has("stress_level")}>
                <ScaleInput
                  value={d.stress_level ?? null}
                  onChange={(v) => update("stress_level", v)}
                  leftLabel="entspannt"
                  rightLabel="überlastet"
                  error={fieldErrors.has("stress_level")}
                />
              </Question>
            </>
          )}

          {block === 4 && (
            <>
              <Question number={18} label="Wie oft verbringst du Zeit im Freien?" error={fieldErrors.has("outdoor_time")}>
                <ChipSelect
                  value={d.outdoor_time ?? null}
                  onChange={(v) => update("outdoor_time", v)}
                  options={["Fast nie", "Selten", "Wöchentlich", "Mehrmals pro Woche", "Täglich"]}
                  cols={2}
                />
              </Question>
              <Question number={19} label="Wie oft fühlst du dich energielos?" error={fieldErrors.has("energy_low")}>
                <ScaleInput
                  value={d.energy_low ?? null}
                  onChange={(v) => update("energy_low", v)}
                  leftLabel="nie"
                  rightLabel="ständig"
                  error={fieldErrors.has("energy_low")}
                />
              </Question>
              <Question
                number={20}
                label="Hast du konkrete Beschwerden, die dich stören?"
                hint="Mehrfachauswahl möglich. Lasse leer, wenn nichts zutrifft."
              >
                <MultiSelectChips
                  values={d.symptoms ?? []}
                  onChange={(v) => update("symptoms", v)}
                  options={SYMPTOMS}
                  cols={2}
                />
              </Question>
            </>
          )}
        </div>

        {error && <p className="mt-6 text-sm text-coral">{error}</p>}

        <StepActions>
          {block === 0 ? (
            <Link href="/health" className="hidden md:inline-flex">
              <Button type="button" variant="secondary">
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                Zurück
              </Button>
            </Link>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={prevBlock}
              className="hidden md:inline-flex"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            onClick={nextBlock}
            block
            className="md:w-auto md:flex-none"
          >
            {block < BLOCK_META.length - 1 ? "Weiter" : "Ergebnisse anzeigen"}
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </Button>
        </StepActions>
      </div>
    </StepFrame>
  );
}
