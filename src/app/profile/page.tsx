"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Cake, Ruler, Scale } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { GoalTile } from "@/components/ui/GoalTile";
import { SexCard } from "@/components/ui/SexCard";
import { TextField } from "@/components/ui/TextField";
import { GOAL_META, SEX_META } from "@/lib/visuals";
import { ProfileSchema, type Profile, type Sex } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

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

  const hasAnalysis = !!analysis;

  const toggleGoal = (label: string) => {
    setGoals((prev) => {
      if (prev.includes(label)) return prev.filter((g) => g !== label);
      if (prev.length >= 3) return prev;
      return [...prev, label];
    });
  };

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
          Ein paar <span className="italic text-brand-amber">Grunddaten</span>.
        </>
      }
      sub="Damit wir deine Werte richtig einordnen — Alter und Geschlecht beeinflussen viele Referenzbereiche."
    >
      <form onSubmit={onSubmit} className="space-y-12">
        {/* Vorname */}
        <section className="max-w-md">
          <TextField
            label="Wie sollen wir dich nennen?"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Dein Vorname"
            required
            autoFocus
          />
        </section>

        {/* Geschlecht */}
        <section>
          <div className="text-sm text-ink font-medium mb-3">Geschlecht</div>
          <div role="radiogroup" className="grid grid-cols-3 gap-3 max-w-xl">
            {SEX_META.map((s) => (
              <SexCard
                key={s.value}
                label={s.label}
                icon={s.icon}
                accent={s.accent as "moss" | "sage" | "brand-amber" | "coral"}
                active={sex === s.value}
                onClick={() => setSex(s.value)}
              />
            ))}
          </div>
        </section>

        {/* Numeric-Trio mit Icons */}
        <section>
          <div className="text-sm text-ink font-medium mb-3">Über dich</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            <NumberCard
              icon={Cake}
              accent="text-brand-amber bg-brand-amber/15"
              label="Alter"
              unit="Jahre"
              value={age}
              onChange={(v) => setAge(v.replace(/\D/g, ""))}
              placeholder="38"
            />
            <NumberCard
              icon={Ruler}
              accent="text-sage bg-sage/15"
              label="Größe"
              unit="cm"
              value={height}
              onChange={(v) => setHeight(v.replace(/\D/g, ""))}
              placeholder="178"
            />
            <NumberCard
              icon={Scale}
              accent="text-coral bg-coral/10"
              label="Gewicht"
              unit="kg"
              value={weight}
              onChange={(v) => setWeight(v.replace(/\D/g, ""))}
              placeholder="75"
            />
          </div>
        </section>

        {/* Ziele */}
        <section>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-sm text-ink font-medium">Deine wichtigsten Ziele</div>
            <div className="text-xs text-mist font-mono">
              {goals.length} / 3 gewählt
            </div>
          </div>
          <p className="text-xs text-mist mb-4">
            Wähle bis zu 3 — danach sind weitere Karten gesperrt.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GOAL_META.map((g) => {
              const active = goals.includes(g.label);
              const disabled = !active && goals.length >= 3;
              return (
                <GoalTile
                  key={g.label}
                  label={g.label}
                  hint={g.hint}
                  icon={g.icon}
                  accent={g.accent}
                  active={active}
                  disabled={disabled}
                  onClick={() => toggleGoal(g.label)}
                />
              );
            })}
          </div>
        </section>

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
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
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

function NumberCard({
  icon: Icon,
  accent,
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  icon: typeof Cake;
  accent: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="hairline rounded-xl bg-bone p-4 flex items-center gap-3 cursor-text hover:border-moss transition-colors">
      <span
        aria-hidden
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-mist">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full font-mono text-2xl tabular-nums text-ink bg-transparent focus:outline-none focus:ring-0 placeholder:text-mist/60"
          />
          <span className="text-xs text-mist font-mono shrink-0">{unit}</span>
        </div>
      </div>
    </label>
  );
}
