"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { CollapsibleSection } from "@/components/CollapsibleSection";
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
  const [noConditions, setNoConditions] = useState<boolean>(!!stored && stored.conditions.length === 0);
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
      title={<>Deine Gesundheit im <span className="italic">Überblick</span>.</>}
      sub="Diese Angaben sind freiwillig. Sie helfen uns, Wechselwirkungen und Kontraindikationen auszuschließen. Keine Weitergabe an Dritte."
    >
      <form onSubmit={onSubmit} className="space-y-12">
        {/* 4.1 Conditions */}
        <section>
          <h2 className="text-lg font-medium text-ink">Diagnostizierte Erkrankungen</h2>
          <label className="inline-flex items-center gap-2 mt-3 cursor-pointer select-none text-sm">
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
            <div className="mt-4">
              {CONDITION_GROUPS.map((group) => {
                const selectedInGroup = conditions.filter((c) => group.items.includes(c));
                return (
                  <CollapsibleSection
                    key={group.label}
                    label={group.label}
                    count={selectedInGroup.length}
                    defaultOpen={selectedInGroup.length > 0}
                  >
                    <MultiSelectChips
                      values={conditions}
                      onChange={setConditions}
                      options={group.items}
                      cols={2}
                    />
                  </CollapsibleSection>
                );
              })}
            </div>
          )}
        </section>

        {/* 4.2 Surgeries */}
        <section>
          <h2 className="text-lg font-medium text-ink">Operationen / Eingriffe</h2>
          <p className="text-xs text-mist mt-1 mb-3">Optional — freies Textfeld.</p>
          <TextArea
            name="surgeries"
            value={surgeries}
            onChange={(e) => setSurgeries(e.target.value)}
            placeholder="z. B. Kreuzband-OP 2019, Blinddarm 2012"
          />
        </section>

        {/* 4.3 Medications */}
        <section>
          <h2 className="text-lg font-medium text-ink">Aktuelle Medikamente</h2>
          <p className="text-xs text-mist mt-1 mb-3">
            Wichtig für Wechselwirkungen. Alles auswählen, was regelmäßig eingenommen wird.
          </p>
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

        {/* 4.4 Allergies */}
        <section>
          <h2 className="text-lg font-medium text-ink">Allergien & Unverträglichkeiten</h2>
          <p className="text-xs text-mist mt-1 mb-3">
            Besonders wichtig für Omega-3 (Fisch) und Nuss-basierte Produkte.
          </p>
          <MultiSelectChips
            values={allergies}
            onChange={setAllergies}
            options={ALLERGIES}
            cols={2}
            ariaLabel="Allergien"
          />
        </section>

        {/* 4.5 Pregnancy (conditional) */}
        {showPregnancy && (
          <section>
            <h2 className="text-lg font-medium text-ink">Schwangerschaft / Stillzeit</h2>
            <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
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
                        ? "bg-ink text-bone border border-ink"
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

        {/* 4.6 Current supplements */}
        <section>
          <h2 className="text-lg font-medium text-ink">Bereits eingenommene Supplements</h2>
          <p className="text-xs text-mist mt-1 mb-3">
            Damit wir keine Doppel-Empfehlung machen.
          </p>
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
