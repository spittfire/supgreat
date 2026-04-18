"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { TextField } from "@/components/ui/TextField";
import { GOALS } from "@/lib/lists";
import { ProfileSchema, type Profile, type Sex } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "male", label: "Mann" },
  { value: "female", label: "Frau" },
  { value: "diverse", label: "Divers" },
];

export default function ProfilePage() {
  const router = useRouter();
  const storedProfile = useFlowStore((s) => s.profile);
  const analysis = useFlowStore((s) => s.analysis);
  const setProfile = useFlowStore((s) => s.setProfile);
  const setStep = useFlowStore((s) => s.setStep);

  const [firstName, setFirstName] = useState(storedProfile?.first_name ?? "");
  const [sex, setSex] = useState<Sex | null>(storedProfile?.sex ?? null);
  const [age, setAge] = useState<string>(storedProfile?.age ? String(storedProfile.age) : "");
  const [height, setHeight] = useState<string>(
    storedProfile?.height_cm ? String(storedProfile.height_cm) : "",
  );
  const [weight, setWeight] = useState<string>(
    storedProfile?.weight_kg ? String(storedProfile.weight_kg) : "",
  );
  const [goals, setGoals] = useState<string[]>(storedProfile?.goals ?? []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  // If user somehow reaches /profile without an analysis, let them continue —
  // but hint they may want to upload first.
  const hasAnalysis = !!analysis;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = {
      first_name: firstName.trim(),
      sex: sex as Sex,
      age: Number(age),
      height_cm: Number(height),
      weight_kg: Number(weight),
      goals,
    };
    const parsed = ProfileSchema.safeParse(draft);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Bitte alle Pflichtfelder korrekt ausfüllen.",
      );
      return;
    }
    setProfile(parsed.data as Profile);
    router.push("/health");
  };

  return (
    <StepFrame
      step={3}
      label="Profil"
      title={
        <>
          Ein paar <span className="italic">Grunddaten</span>.
        </>
      }
      sub="Damit wir deine Werte richtig einordnen — Alter und Geschlecht beeinflussen viele Referenzbereiche."
    >
      <form onSubmit={onSubmit} className="space-y-10 max-w-2xl">
        <TextField
          label="Vorname"
          name="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="z. B. Kenan"
          required
          autoFocus
        />

        <div>
          <div className="text-sm text-ink/80 mb-2">Geschlecht</div>
          <div role="radiogroup" aria-label="Geschlecht" className="grid grid-cols-3 gap-2">
            {SEX_OPTIONS.map((s) => {
              const active = sex === s.value;
              return (
                <button
                  type="button"
                  key={s.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSex(s.value)}
                  className={`text-center px-4 py-3 rounded-lg transition-colors text-sm ${
                    active
                      ? "bg-ink text-bone border border-ink"
                      : "hairline hover:bg-bone-2 text-ink"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Alter"
            name="age"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
            placeholder="z. B. 38"
          />
          <TextField
            label="Größe (cm)"
            name="height"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))}
            placeholder="z. B. 178"
          />
          <TextField
            label="Gewicht (kg)"
            name="weight"
            inputMode="numeric"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))}
            placeholder="z. B. 75"
          />
        </div>

        <div>
          <div className="text-sm text-ink/80 mb-1">Deine wichtigsten Ziele</div>
          <p className="text-xs text-mist mb-3">Wähle bis zu 3.</p>
          <MultiSelectChips
            values={goals}
            onChange={setGoals}
            options={[...GOALS]}
            max={3}
            cols={3}
            ariaLabel="Ziele"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        {!hasAnalysis && (
          <p className="text-xs text-mist">
            Hinweis: Du hast noch keinen Bluttest hochgeladen.{" "}
            <Link href="/" className="underline hover:text-moss">
              Hier hochladen
            </Link>{" "}
            — sonst fehlen Biomarker-Daten bei der Box-Empfehlung.
          </p>
        )}

        <div className="flex justify-between items-center pt-4">
          <Link href="/">
            <Button type="button" variant="secondary">
              Zurück
            </Button>
          </Link>
          <Button type="submit" size="lg">
            Weiter zur Anamnese
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </form>
    </StepFrame>
  );
}
