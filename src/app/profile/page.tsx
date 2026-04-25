"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Cake,
  Ruler,
  Scale,
  User,
  UserRound,
  Users,
  UserCircle,
  VenusAndMars,
} from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GoalTile } from "@/components/ui/GoalTile";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextField } from "@/components/ui/TextField";
import { GOAL_META } from "@/lib/visuals";
import { ProfileSchema, type Profile, type Sex } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

const SEX_OPTIONS = [
  { value: "male" as const, label: "Mann", icon: User },
  { value: "female" as const, label: "Frau", icon: UserRound },
  { value: "diverse" as const, label: "Divers", icon: Users },
];

export default function ProfilePage() {
  const router = useRouter();
  const storedProfile = useFlowStore((s) => s.profile);
  const analysis = useFlowStore((s) => s.analysis);
  const setProfile = useFlowStore((s) => s.setProfile);
  const setStep = useFlowStore((s) => s.setStep);

  type ProfileField = keyof Profile;

  const FIELD_MESSAGES: Record<ProfileField, string> = {
    first_name: "Bitte gib deinen Vornamen ein.",
    sex: "Bitte wähle dein Geschlecht aus.",
    age: "Bitte gib dein Alter ein (18–100 Jahre).",
    height_cm: "Bitte gib deine Größe in cm ein (120–230).",
    weight_kg: "Bitte gib dein Gewicht in kg ein (30–250).",
    goals: "Bitte wähle 1–3 Prioritäten aus.",
  };

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
  const [fieldErrors, setFieldErrors] = useState<Set<ProfileField>>(new Set());

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  const hasAnalysis = !!analysis;

  const clearFieldError = (field: ProfileField) => {
    setFieldErrors((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    setError(null);
  };

  const toggleGoal = (label: string) => {
    setGoals((prev) => {
      if (prev.includes(label)) return prev.filter((g) => g !== label);
      if (prev.length >= 3) return prev;
      return [...prev, label];
    });
    clearFieldError("goals");
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
      const failed = new Set<ProfileField>();
      const messages: string[] = [];
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in FIELD_MESSAGES) {
          const f = field as ProfileField;
          if (!failed.has(f)) {
            failed.add(f);
            messages.push(FIELD_MESSAGES[f]);
          }
        }
      }
      setFieldErrors(failed);
      setError(
        messages.length > 0
          ? messages[0]
          : "Bitte alle Pflichtfelder korrekt ausfüllen.",
      );
      return;
    }
    setFieldErrors(new Set());
    setError(null);
    setProfile(parsed.data as Profile);
    router.push("/health");
  };

  return (
    <StepFrame
      step={3}
      label="Schritt 03 · Profil"
      title={
        <>
          <span className="italic text-silver">Ein paar</span> Grunddaten.
        </>
      }
      sub="Damit wir deine Werte richtig einordnen — Alter und Geschlecht beeinflussen viele Referenzbereiche."
    >
      <form onSubmit={onSubmit} className="space-y-14">
        {/* Vorname + Geschlecht */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          <TextField
            icon={UserCircle}
            label="Vorname"
            name="first_name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearFieldError("first_name");
            }}
            placeholder="Wie sollen wir dich nennen?"
            error={fieldErrors.has("first_name")}
            required
            autoFocus
          />
          <div>
            <div
              className={`mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium ${
                fieldErrors.has("sex") ? "text-coral" : "text-silver"
              }`}
            >
              <VenusAndMars
                className={`w-3.5 h-3.5 ${
                  fieldErrors.has("sex") ? "text-coral" : "text-lime"
                }`}
                strokeWidth={1.5}
              />
              Geschlecht
            </div>
            <SegmentedControl<Sex>
              value={sex}
              onChange={(v) => {
                setSex(v);
                clearFieldError("sex");
              }}
              options={SEX_OPTIONS}
              ariaLabel="Geschlecht"
              error={fieldErrors.has("sex")}
              block
            />
          </div>
        </div>

        {/* Alter / Größe / Gewicht */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <TextField
            icon={Cake}
            label="Alter"
            name="age"
            inputMode="numeric"
            value={age}
            onChange={(e) => {
              setAge(e.target.value.replace(/\D/g, ""));
              clearFieldError("age");
            }}
            placeholder="38"
            unit="Jahre"
            error={fieldErrors.has("age")}
          />
          <TextField
            icon={Ruler}
            label="Größe"
            name="height"
            inputMode="numeric"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value.replace(/\D/g, ""));
              clearFieldError("height_cm");
            }}
            placeholder="178"
            unit="cm"
            error={fieldErrors.has("height_cm")}
          />
          <TextField
            icon={Scale}
            label="Gewicht"
            name="weight"
            inputMode="numeric"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value.replace(/\D/g, ""));
              clearFieldError("weight_kg");
            }}
            placeholder="75"
            unit="kg"
            error={fieldErrors.has("weight_kg")}
          />
        </div>

        {/* Ziele */}
        <section
          className={
            fieldErrors.has("goals")
              ? "rounded-2xl border border-coral/60 bg-coral/5 p-5 -m-5"
              : ""
          }
        >
          <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
            <div>
              <Eyebrow>Deine Prioritäten</Eyebrow>
              <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight tracking-tight text-pearl">
                Was möchtest du{" "}
                <span className="italic text-lime">verbessern</span>?
              </h2>
            </div>
            <div className="font-mono text-sm">
              <span className={fieldErrors.has("goals") ? "text-coral" : "text-lime"}>
                {goals.length}
              </span>{" "}
              <span className="text-ash">/ 3</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {GOAL_META.map((g) => {
              const active = goals.includes(g.label);
              const disabled = !active && goals.length >= 3;
              return (
                <GoalTile
                  key={g.label}
                  label={g.label}
                  icon={g.icon}
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
          <p className="text-xs text-ash">
            Hinweis: Du hast noch keinen Bluttest hochgeladen.{" "}
            <Link href="/" className="text-lime hover:underline">
              Hier hochladen
            </Link>{" "}
            — sonst fehlen Biomarker-Daten bei der Box-Empfehlung.
          </p>
        )}

        <StepActions>
          <Link href="/" className="hidden md:inline-flex">
            <Button type="button" variant="secondary">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Button>
          </Link>
          <Button type="submit" size="lg" block className="md:w-auto md:flex-none">
            Weiter zur Anamnese
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </Button>
        </StepActions>
      </form>
    </StepFrame>
  );
}
