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
import { CategoryGroup } from "@/components/CategoryGroup";
import { Button } from "@/components/ui/Button";
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

type Accent = "moss" | "sage" | "brand-amber" | "coral";

const CONDITION_GROUP_META: Record<
  string,
  { icon: LucideIcon; accent: Accent }
> = {
  "Herz-Kreislauf": { icon: HeartPulse, accent: "coral" },
  Stoffwechsel: { icon: FlaskConical, accent: "brand-amber" },
  Autoimmun: { icon: ShieldAlert, accent: "coral" },
  "Hormonell (Frauen)": { icon: UserRound, accent: "coral" },
  "Hormonell (Männer)": { icon: UserRound, accent: "sage" },
  Psyche: { icon: Brain, accent: "moss" },
  "Magen-Darm": { icon: Utensils, accent: "sage" },
  "Niere & Leber": { icon: CircleDashed, accent: "brand-amber" },
  "Knochen & Gelenke": { icon: Bone, accent: "sage" },
  Sonstige: { icon: Sparkles, accent: "moss" },
};

const PREGNANCY_OPTIONS: { value: NonNullable<Pregnancy>; label: string }[] = [
  { value: "none", label: "Keine" },
  { value: "pregnant", label: "Schwanger" },
  { value: "breastfeeding", label: "Stillend" },
  { value: "trying", label: "Kinderwunsch aktiv" },
];

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
      label="Anamnese"
      title={
        <>
          Deine Gesundheit im <span className="italic text-coral">Überblick</span>.
        </>
      }
      sub="Diese Angaben sind freiwillig. Sie helfen uns, Wechselwirkungen und Kontraindikationen auszuschließen. Keine Weitergabe an Dritte."
    >
      <form onSubmit={onSubmit} className="space-y-14">
        {/* Conditions */}
        <section>
          <SectionHeader
            icon={Stethoscope}
            accent="coral"
            title="Diagnostizierte Erkrankungen"
            hint="Wir schließen damit riskante Kombinationen aus."
          />
          <label className="inline-flex items-center gap-2 mt-1 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 accent-moss"
              checked={noConditions}
              onChange={(e) => {
                setNoConditions(e.target.checked);
                if (e.target.checked) setConditions([]);
              }}
            />
            <span>Keine</span>
          </label>
          {!noConditions && (
            <div className="mt-4 space-y-2">
              {CONDITION_GROUPS.map((group) => {
                const selectedInGroup = conditions.filter((c) =>
                  group.items.includes(c),
                );
                const meta = CONDITION_GROUP_META[group.label] ?? {
                  icon: Sparkles,
                  accent: "moss" as Accent,
                };
                return (
                  <CategoryGroup
                    key={group.label}
                    label={group.label}
                    icon={meta.icon}
                    accent={meta.accent}
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

        {/* Surgeries */}
        <section>
          <SectionHeader
            icon={Bone}
            accent="sage"
            title="Operationen / Eingriffe"
            hint="Optional — hilft bei Langzeit-Empfehlungen."
          />
          <TextArea
            name="surgeries"
            value={surgeries}
            onChange={(e) => setSurgeries(e.target.value)}
            placeholder="z. B. Kreuzband-OP 2019, Blinddarm 2012"
          />
        </section>

        {/* Medications */}
        <section>
          <SectionHeader
            icon={Pill}
            accent="brand-amber"
            title="Aktuelle Medikamente"
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
              label="Weitere Medikamente (optional)"
              name="medications_freetext"
              value={medicationsFreetext}
              onChange={(e) => setMedicationsFreetext(e.target.value)}
              placeholder="z. B. Antibiotikum Amoxicillin, kurzfristig"
            />
          </div>
        </section>

        {/* Allergies */}
        <section>
          <SectionHeader
            icon={Leaf}
            accent="sage"
            title="Allergien & Unverträglichkeiten"
            hint="Entscheidend bei Fischöl, Nuss-Produkten, Laktose-haltigen Kapseln."
          />
          <MultiSelectChips
            values={allergies}
            onChange={setAllergies}
            options={ALLERGIES}
            cols={2}
            ariaLabel="Allergien"
          />
        </section>

        {/* Pregnancy */}
        {showPregnancy && (
          <section>
            <SectionHeader
              icon={Baby}
              accent="coral"
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
                    className={`px-4 py-3 text-sm rounded-lg transition-colors ${
                      active
                        ? "bg-coral text-bone border border-coral"
                        : "hairline hover:bg-bone-2 text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Current supplements */}
        <section>
          <SectionHeader
            icon={Sparkles}
            accent="moss"
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

        <div className="flex justify-between items-center pt-4">
          <Link href="/profile">
            <Button type="button" variant="secondary">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Button>
          </Link>
          <Button type="submit" size="lg">
            Weiter zum Lifestyle
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </form>
    </StepFrame>
  );
}

function SectionHeader({
  icon: Icon,
  accent,
  title,
  hint,
}: {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  hint?: string;
}) {
  const bg = {
    moss: "bg-moss/10 text-moss",
    sage: "bg-sage/15 text-sage",
    "brand-amber": "bg-brand-amber/15 text-brand-amber",
    coral: "bg-coral/10 text-coral",
  }[accent];
  return (
    <div className="flex items-start gap-3 mb-4">
      <span
        aria-hidden
        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </span>
      <div>
        <h2 className="text-lg font-medium text-ink leading-tight">{title}</h2>
        {hint && <p className="text-xs text-mist mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}
