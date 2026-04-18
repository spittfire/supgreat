"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  CircleDashed,
  FlaskConical,
  HeartPulse,
  Leaf,
  Pill,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UserRound,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { CategoryGroup } from "@/components/CategoryGroup";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { TextArea } from "@/components/ui/TextField";
import {
  ALLERGIES,
  COMMON_SUPPLEMENTS,
  CONDITION_GROUPS,
  MEDICATIONS,
} from "@/lib/lists";
import { HealthSchema, type Health, type Pregnancy } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

const CONDITION_GROUP_ICON: Record<string, LucideIcon> = {
  "Herz-Kreislauf": HeartPulse,
  Stoffwechsel: FlaskConical,
  Autoimmun: ShieldAlert,
  "Hormonell (Frauen)": UserRound,
  "Hormonell (Männer)": UserRound,
  Psyche: Brain,
  "Magen-Darm": Utensils,
  "Niere & Leber": CircleDashed,
  "Knochen & Gelenke": Bone,
  Sonstige: Sparkles,
};

const PREGNANCY_OPTIONS: { value: NonNullable<Pregnancy>; label: string }[] = [
  { value: "none", label: "Keine" },
  { value: "pregnant", label: "Schwanger" },
  { value: "breastfeeding", label: "Stillend" },
  { value: "trying", label: "Kinderwunsch aktiv" },
];

function SectionHeader({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span
        aria-hidden
        className="shrink-0 w-10 h-10 rounded-xl border border-steel bg-graphite flex items-center justify-center text-lime"
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </span>
      <div>
        <h2 className="font-display text-2xl text-pearl leading-tight">{title}</h2>
        {hint && <p className="text-xs text-ash mt-1">{hint}</p>}
      </div>
    </div>
  );
}

export default function HealthPage() {
  const router = useRouter();
  const stored = useFlowStore((s) => s.health);
  const profile = useFlowStore((s) => s.profile);
  const setHealth = useFlowStore((s) => s.setHealth);
  const setStep = useFlowStore((s) => s.setStep);

  const [conditions, setConditions] = useState<string[]>(stored?.conditions ?? []);
  const [noConditions, setNoConditions] = useState<boolean>(
    !!stored && stored.conditions.length === 0,
  );
  const [surgeries, setSurgeries] = useState<string>(stored?.surgeries ?? "");
  const [medications, setMedications] = useState<string[]>(stored?.medications ?? []);
  const [medicationsFreetext, setMedicationsFreetext] = useState<string>(
    stored?.medications_freetext ?? "",
  );
  const [allergies, setAllergies] = useState<string[]>(stored?.allergies ?? []);
  const [pregnancy, setPregnancy] = useState<Pregnancy>(stored?.pregnancy ?? null);
  const [currentSupplements, setCurrentSupplements] = useState<string[]>(
    stored?.current_supplements ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(4);
  }, [setStep]);

  const showPregnancy = useMemo(() => {
    if (!profile) return false;
    return profile.sex === "female" && profile.age >= 15 && profile.age <= 55;
  }, [profile]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const draft: Health = {
      conditions: noConditions ? [] : conditions,
      surgeries: surgeries.trim(),
      medications,
      medications_freetext: medicationsFreetext.trim(),
      allergies,
      pregnancy: showPregnancy ? pregnancy : null,
      current_supplements: currentSupplements,
    };
    const parsed = HealthSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Bitte Angaben prüfen.");
      return;
    }
    setHealth(parsed.data);
    router.push("/lifestyle");
  };

  return (
    <StepFrame
      step={4}
      label="Schritt 04 · Anamnese"
      title={
        <>
          Deine Gesundheit im{" "}
          <span className="italic text-lime">Überblick</span>.
        </>
      }
      sub="Diese Angaben sind freiwillig. Sie helfen uns, Wechselwirkungen und Kontraindikationen auszuschließen. Keine Weitergabe an Dritte."
    >
      <form onSubmit={onSubmit} className="space-y-16">
        {/* 4.1 Conditions */}
        <section>
          <SectionHeader
            icon={Stethoscope}
            title="Erkrankungen"
            hint="Wir schließen damit riskante Kombinationen aus."
          />
          <label className="inline-flex items-center gap-2 mb-4 cursor-pointer select-none text-sm text-silver">
            <input
              type="checkbox"
              className="w-4 h-4 accent-lime"
              checked={noConditions}
              onChange={(e) => {
                setNoConditions(e.target.checked);
                if (e.target.checked) setConditions([]);
              }}
            />
            <span>Keine Erkrankungen</span>
          </label>
          {!noConditions && (
            <div className="space-y-2">
              {CONDITION_GROUPS.map((group) => {
                const selectedInGroup = conditions.filter((c) =>
                  group.items.includes(c),
                );
                const icon = CONDITION_GROUP_ICON[group.label] ?? Sparkles;
                return (
                  <CategoryGroup
                    key={group.label}
                    label={group.label}
                    icon={icon}
                    selectedCount={selectedInGroup.length}
                    defaultOpen={selectedInGroup.length > 0}
                  >
                    <MultiSelectChips
                      values={conditions}
                      onChange={setConditions}
                      options={group.items}
                      cols={2}
                    />
                  </CategoryGroup>
                );
              })}
            </div>
          )}
        </section>

        {/* 4.2 Surgeries */}
        <section>
          <SectionHeader
            icon={Bone}
            title="Operationen"
            hint="Optional — hilft bei Langzeit-Empfehlungen."
          />
          <TextArea
            name="surgeries"
            value={surgeries}
            onChange={(e) => setSurgeries(e.target.value)}
            placeholder="z. B. Kreuzband-OP 2019, Blinddarm 2012"
          />
        </section>

        {/* 4.3 Medications */}
        <section>
          <SectionHeader
            icon={Pill}
            title="Medikamente"
            hint="Wichtig für Wechselwirkungen."
          />
          <MultiSelectChips
            values={medications}
            onChange={setMedications}
            options={MEDICATIONS}
            cols={2}
            ariaLabel="Medikamente"
          />
          <div className="mt-4">
            <TextArea
              label="Weitere Medikamente"
              name="medications_freetext"
              value={medicationsFreetext}
              onChange={(e) => setMedicationsFreetext(e.target.value)}
              placeholder="z. B. Antibiotikum Amoxicillin, kurzfristig"
            />
          </div>
        </section>

        {/* 4.4 Allergies */}
        <section>
          <SectionHeader
            icon={Leaf}
            title="Allergien & Unverträglichkeiten"
            hint="Entscheidend bei Fischöl, Nuss-Produkten, laktosehaltigen Kapseln."
          />
          <MultiSelectChips
            values={allergies}
            onChange={setAllergies}
            options={ALLERGIES}
            cols={2}
            ariaLabel="Allergien"
          />
        </section>

        {/* 4.5 Pregnancy */}
        {showPregnancy && (
          <section>
            <SectionHeader
              icon={Baby}
              title="Schwangerschaft / Stillzeit"
              hint="Einige Pflanzenstoffe sind in dieser Zeit kontraindiziert."
            />
            <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREGNANCY_OPTIONS.map((opt) => {
                const active = pregnancy === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPregnancy(opt.value)}
                    className={`px-4 py-3 text-sm rounded-xl border transition-all duration-300 ${
                      active
                        ? "border-lime bg-lime/10 text-lime shadow-glow-lime"
                        : "border-steel bg-onyx text-silver hover:border-iron hover:text-pearl"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 4.6 Current supplements */}
        <section>
          <SectionHeader
            icon={Sparkles}
            title="Bereits eingenommene Supplements"
            hint="Damit wir keine Doppel-Empfehlung machen."
          />
          <MultiSelectChips
            values={currentSupplements}
            onChange={setCurrentSupplements}
            options={COMMON_SUPPLEMENTS}
            cols={3}
            ariaLabel="Aktuelle Supplements"
          />
        </section>

        {error && <p className="text-sm text-coral">{error}</p>}

        <StepActions>
          <Link href="/profile" className="hidden md:inline-flex">
            <Button type="button" variant="secondary">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Button>
          </Link>
          <Button type="submit" size="lg" block className="md:w-auto md:flex-none">
            Weiter zum Lifestyle
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </Button>
        </StepActions>

        {/* Eyebrow at very bottom — reassurance */}
        <div className="pt-8 flex justify-center">
          <Eyebrow>Freiwillig · Nicht weitergegeben</Eyebrow>
        </div>
      </form>
    </StepFrame>
  );
}
