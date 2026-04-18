"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { DIETS, SPORT_TYPES, SYMPTOMS } from "@/lib/lists";
import { LifestyleSchema, type Lifestyle } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";
import { BLOCK_META } from "@/lib/visuals";

type Draft = Partial<Lifestyle>;

function Question({
  number,
  label,
  children,
  hint,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-steel bg-onyx p-5 md:p-6">
      <div className="flex items-start gap-4 mb-5">
        <span
          aria-hidden
          className="shrink-0 w-10 h-10 rounded-xl border border-steel bg-graphite flex items-center justify-center font-mono text-sm text-lime"
        >
          {String(number).padStart(2, "0")}
        </span>
        <div className="pt-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-silver font-medium mb-1">
            Frage {number}
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
  const setLifestyle = useFlowStore((s) => s.setLifestyle);
  const setStep = useFlowStore((s) => s.setStep);

  const [block, setBlock] = useState(0);
  const [d, setD] = useState<Draft>(stored ?? { sport_type: [], symptoms: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(5);
  }, [setStep]);

  const update = <K extends keyof Lifestyle>(key: K, value: Lifestyle[K]) =>
    setD((prev) => ({ ...prev, [key]: value }));

  const nextBlock = () => {
    setError(null);
    if (block < BLOCK_META.length - 1) {
      setBlock((b) => b + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const draft: Draft = {
      ...d,
      sport_type: d.sport_type ?? [],
      symptoms: d.symptoms ?? [],
    };
    const parsed = LifestyleSchema.safeParse(draft);
    if (!parsed.success) {
      setError(
        "Bitte alle Fragen beantworten. Fehlend: " +
          parsed.error.issues.map((i) => i.path.join(".")).join(", "),
      );
      return;
    }
    setLifestyle(parsed.data);
    router.push("/results");
  };

  const prevBlock = () => {
    setError(null);
    if (block > 0) setBlock((b) => b - 1);
  };

  const current = BLOCK_META[block];
  const blockLetter = String.fromCharCode(65 + block);

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
        {/* Block tabs */}
        <div className="flex gap-2 mb-10" role="tablist" aria-label="Lifestyle-Block">
          {BLOCK_META.map((meta, i) => {
            const Icon = meta.icon;
            const isActive = i === block;
            const isDone = i < block;
            return (
              <div
                key={meta.label}
                role="tab"
                aria-selected={isActive}
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-all duration-300 ${
                  isActive
                    ? "border-lime bg-lime/10 text-lime shadow-glow-lime"
                    : isDone
                      ? "border-steel bg-graphite text-pearl/70"
                      : "border-steel bg-onyx text-ash"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-[10px] font-medium font-mono uppercase tracking-wider">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {block === 0 && (
            <>
              <Question number={1} label="Welche Ernährungsweise beschreibt dich am besten?">
                <ChipSelect
                  value={d.diet ?? null}
                  onChange={(v) => update("diet", v)}
                  options={DIETS}
                  cols={2}
                />
              </Question>
              <Question number={2} label="Wie viele Mahlzeiten pro Tag im Durchschnitt?">
                <ChipSelect
                  value={d.meals_per_day ?? null}
                  onChange={(v) => update("meals_per_day", v)}
                  options={["1", "2", "3", "4+", "Unregelmäßig / Snacking"]}
                  cols={3}
                />
              </Question>
              <Question number={3} label="Wie oft isst du Fisch pro Woche?">
                <ChipSelect
                  value={d.fish_per_week ?? null}
                  onChange={(v) => update("fish_per_week", v)}
                  options={["Nie", "1×", "2–3×", "4+×", "Fast täglich"]}
                  cols={3}
                />
              </Question>
              <Question number={4} label="Wie oft isst du verarbeitete Lebensmittel?" hint="Fast Food, Fertigprodukte, Süßigkeiten">
                <ChipSelect
                  value={d.processed_food ?? null}
                  onChange={(v) => update("processed_food", v)}
                  options={["Täglich", "Mehrmals pro Woche", "1× pro Woche", "Selten", "Nie"]}
                  cols={2}
                />
              </Question>
              <Question number={5} label="Wie viel Gemüse und Obst am Tag?" hint="Hand-Portionen">
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
              <Question number={6} label="Wie viel Wasser trinkst du pro Tag?">
                <ChipSelect
                  value={d.water ?? null}
                  onChange={(v) => update("water", v)}
                  options={["<1 L", "1–1,5 L", "1,5–2 L", "2–3 L", "3+ L"]}
                  cols={3}
                />
              </Question>
              <Question number={7} label="Wie viele Tassen Kaffee pro Tag?">
                <ChipSelect
                  value={d.coffee ?? null}
                  onChange={(v) => update("coffee", v)}
                  options={["0", "1–2", "3–4", "5+"]}
                  cols={4}
                />
              </Question>
              <Question number={8} label="Wie oft trinkst du Alkohol?">
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
              <Question number={9} label="Rauchst du?">
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
              <Question number={10} label="Wie viele Stunden Schlaf pro Nacht?">
                <ChipSelect
                  value={d.sleep_hours ?? null}
                  onChange={(v) => update("sleep_hours", v)}
                  options={["<5", "5–6", "6–7", "7–8", "8+"]}
                  cols={3}
                />
              </Question>
              <Question number={11} label="Wie würdest du deine Schlafqualität bewerten?">
                <ScaleInput
                  value={d.sleep_quality ?? 3}
                  onChange={(v) => update("sleep_quality", v)}
                  leftLabel="schlecht"
                  rightLabel="sehr gut"
                />
              </Question>
              <Question number={12} label="Wachst du nachts häufig auf?">
                <ChipSelect
                  value={d.night_wake ?? null}
                  onChange={(v) => update("night_wake", v)}
                  options={["Nie", "Selten", "1–2×/Nacht", "Mehrmals", "Ständig"]}
                  cols={3}
                />
              </Question>
              <Question number={13} label="Wie fit fühlst du dich morgens?">
                <ScaleInput
                  value={d.morning_energy ?? 3}
                  onChange={(v) => update("morning_energy", v)}
                  leftLabel="erschöpft"
                  rightLabel="ausgeruht"
                />
              </Question>
            </>
          )}

          {block === 3 && (
            <>
              <Question number={14} label="Wie oft Sport pro Woche?" hint="mind. 30 Min">
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
              <Question number={16} label="Wie viele Stunden sitzt du pro Tag?" hint="Beruf + Freizeit">
                <ChipSelect
                  value={d.sitting_hours ?? null}
                  onChange={(v) => update("sitting_hours", v)}
                  options={["<4", "4–6", "6–8", "8–10", "10+"]}
                  cols={3}
                />
              </Question>
              <Question number={17} label="Wie hoch ist dein Stresslevel im Alltag?">
                <ScaleInput
                  value={d.stress_level ?? 3}
                  onChange={(v) => update("stress_level", v)}
                  leftLabel="entspannt"
                  rightLabel="überlastet"
                />
              </Question>
            </>
          )}

          {block === 4 && (
            <>
              <Question number={18} label="Wie oft verbringst du Zeit im Freien?">
                <ChipSelect
                  value={d.outdoor_time ?? null}
                  onChange={(v) => update("outdoor_time", v)}
                  options={["Täglich", "Mehrmals pro Woche", "Wöchentlich", "Selten", "Fast nie"]}
                  cols={2}
                />
              </Question>
              <Question number={19} label="Wie oft fühlst du dich energielos?">
                <ScaleInput
                  value={d.energy_low ?? 3}
                  onChange={(v) => update("energy_low", v)}
                  leftLabel="nie"
                  rightLabel="ständig"
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
