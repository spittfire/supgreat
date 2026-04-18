"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { DIETS, SPORT_TYPES, SYMPTOMS } from "@/lib/lists";
import { LifestyleSchema, type Lifestyle } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

type Draft = Partial<Lifestyle>;

const BLOCKS = ["Ernährung", "Flüssigkeit", "Schlaf", "Bewegung", "Mental"] as const;

function Question({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base md:text-lg text-ink font-medium leading-snug">{label}</div>
        {hint && <p className="text-xs text-mist mt-1">{hint}</p>}
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
    if (block < BLOCKS.length - 1) {
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

  return (
    <StepFrame
      step={5}
      label={`Lifestyle · ${block + 1} / ${BLOCKS.length}`}
      title={
        <>
          Dein <span className="italic">Alltag</span>.
        </>
      }
      sub="Je ehrlicher du antwortest, desto präziser wird deine Box. 20 Fragen, ca. 4 Minuten."
    >
      <div className="max-w-2xl">
        <div className="flex gap-2 mb-10" role="tablist" aria-label="Lifestyle-Block">
          {BLOCKS.map((name, i) => (
            <div
              key={name}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= block ? "bg-moss" : "bg-line"
              }`}
              aria-label={`${i + 1}. ${name}${i === block ? " (aktuell)" : ""}`}
            />
          ))}
        </div>

        <div className="space-y-10">
          {block === 0 && (
            <>
              <Question label="1. Welche Ernährungsweise beschreibt dich am besten?">
                <ChipSelect
                  value={d.diet ?? null}
                  onChange={(v) => update("diet", v)}
                  options={DIETS}
                  cols={2}
                />
              </Question>
              <Question label="2. Wie viele Mahlzeiten isst du pro Tag im Durchschnitt?">
                <ChipSelect
                  value={d.meals_per_day ?? null}
                  onChange={(v) => update("meals_per_day", v)}
                  options={["1", "2", "3", "4+", "Unregelmäßig / Snacking"]}
                  cols={3}
                />
              </Question>
              <Question label="3. Wie oft isst du Fisch pro Woche?">
                <ChipSelect
                  value={d.fish_per_week ?? null}
                  onChange={(v) => update("fish_per_week", v)}
                  options={["Nie", "1×", "2–3×", "4+×", "Fast täglich"]}
                  cols={3}
                />
              </Question>
              <Question label="4. Wie oft isst du verarbeitete Lebensmittel? (Fast Food, Fertigprodukte, Süßigkeiten)">
                <ChipSelect
                  value={d.processed_food ?? null}
                  onChange={(v) => update("processed_food", v)}
                  options={[
                    "Täglich",
                    "Mehrmals pro Woche",
                    "1× pro Woche",
                    "Selten",
                    "Nie",
                  ]}
                  cols={2}
                />
              </Question>
              <Question label="5. Wie viel Gemüse und Obst isst du am Tag? (Hand-Portionen)">
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
              <Question label="6. Wie viel Wasser trinkst du pro Tag?">
                <ChipSelect
                  value={d.water ?? null}
                  onChange={(v) => update("water", v)}
                  options={["<1 L", "1–1,5 L", "1,5–2 L", "2–3 L", "3+ L"]}
                  cols={3}
                />
              </Question>
              <Question label="7. Wie viele Tassen Kaffee pro Tag?">
                <ChipSelect
                  value={d.coffee ?? null}
                  onChange={(v) => update("coffee", v)}
                  options={["0", "1–2", "3–4", "5+"]}
                  cols={4}
                />
              </Question>
              <Question label="8. Wie oft trinkst du Alkohol?">
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
              <Question label="9. Rauchst du?">
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
              <Question label="10. Wie viele Stunden schläfst du im Durchschnitt pro Nacht?">
                <ChipSelect
                  value={d.sleep_hours ?? null}
                  onChange={(v) => update("sleep_hours", v)}
                  options={["<5", "5–6", "6–7", "7–8", "8+"]}
                  cols={3}
                />
              </Question>
              <Question label="11. Wie würdest du deine Schlafqualität bewerten?">
                <ScaleInput
                  value={d.sleep_quality ?? 3}
                  onChange={(v) => update("sleep_quality", v)}
                  leftLabel="schlecht"
                  rightLabel="sehr gut"
                />
              </Question>
              <Question label="12. Wachst du nachts häufig auf?">
                <ChipSelect
                  value={d.night_wake ?? null}
                  onChange={(v) => update("night_wake", v)}
                  options={["Nie", "Selten", "1–2×/Nacht", "Mehrmals", "Ständig"]}
                  cols={3}
                />
              </Question>
              <Question label="13. Wie fit fühlst du dich morgens beim Aufstehen?">
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
              <Question label="14. Wie oft treibst du Sport pro Woche? (mind. 30 Min)">
                <ChipSelect
                  value={d.sport_frequency ?? null}
                  onChange={(v) => update("sport_frequency", v)}
                  options={["0×", "1–2×", "3–4×", "5–6×", "Täglich"]}
                  cols={3}
                />
              </Question>
              <Question label="15. Welche Art von Sport überwiegt?" hint="Mehrfachauswahl möglich.">
                <MultiSelectChips
                  values={d.sport_type ?? []}
                  onChange={(v) => update("sport_type", v)}
                  options={SPORT_TYPES}
                  cols={3}
                />
              </Question>
              <Question label="16. Wie viele Stunden am Tag sitzt du (Beruf + Freizeit)?">
                <ChipSelect
                  value={d.sitting_hours ?? null}
                  onChange={(v) => update("sitting_hours", v)}
                  options={["<4", "4–6", "6–8", "8–10", "10+"]}
                  cols={3}
                />
              </Question>
              <Question label="17. Wie hoch ist dein Stresslevel im Alltag?">
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
              <Question label="18. Wie oft verbringst du Zeit im Freien / in der Natur?">
                <ChipSelect
                  value={d.outdoor_time ?? null}
                  onChange={(v) => update("outdoor_time", v)}
                  options={["Täglich", "Mehrmals pro Woche", "Wöchentlich", "Selten", "Fast nie"]}
                  cols={2}
                />
              </Question>
              <Question label="19. Wie oft fühlst du dich energielos oder antriebsarm?">
                <ScaleInput
                  value={d.energy_low ?? 3}
                  onChange={(v) => update("energy_low", v)}
                  leftLabel="nie"
                  rightLabel="ständig"
                />
              </Question>
              <Question
                label="20. Hast du konkrete Beschwerden, die dich aktuell stören?"
                hint="Mehrfachauswahl möglich. Wähle bewusst was passt — oder lasse leer, wenn nichts zutrifft."
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

        <div className="flex justify-between items-center pt-10">
          {block === 0 ? (
            <Link href="/health">
              <Button type="button" variant="secondary">
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                Zurück
              </Button>
            </Link>
          ) : (
            <Button type="button" variant="secondary" onClick={prevBlock}>
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Button>
          )}
          <Button type="button" size="lg" onClick={nextBlock}>
            {block < BLOCKS.length - 1 ? "Weiter" : "Ergebnisse anzeigen"}
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </StepFrame>
  );
}
