import type { Health, Lifestyle, Profile } from "@/lib/types";
import { lifestyleHighlights } from "@/lib/lifestyle-triggers";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";

type ProfileSummaryProps = {
  profile: Profile;
  health: Health;
  lifestyle: Lifestyle;
};

export function ProfileSummary({ profile, health, lifestyle }: ProfileSummaryProps) {
  const highlights = lifestyleHighlights(lifestyle);
  const sexLabel =
    profile.sex === "male" ? "Mann" : profile.sex === "female" ? "Frau" : "Divers";

  const chips: Array<{ label: string; value: string }> = [
    { label: "Name", value: profile.first_name },
    { label: "Alter", value: `${profile.age}` },
    { label: "Geschlecht", value: sexLabel },
    { label: "Ziele", value: profile.goals.join(" · ") },
  ];

  return (
    <div className="rounded-3xl border border-steel bg-onyx p-6 md:p-8">
      <Eyebrow>Dein Gesundheitsprofil</Eyebrow>
      <p className="text-xs text-ash mt-2">
        Diese Daten fließen in deine Box-Empfehlung ein.
      </p>

      <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
        {chips.map((c) => (
          <div key={c.label}>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-silver">
              {c.label}
            </dt>
            <dd className="text-pearl mt-1.5">{c.value}</dd>
          </div>
        ))}
      </dl>

      {(health.conditions.length > 0 ||
        health.medications.length > 0 ||
        health.allergies.length > 0 ||
        highlights.length > 0) && (
        <div className="border-t border-steel mt-6 pt-5 space-y-4">
          {health.conditions.length > 0 && (
            <div className="flex gap-3 text-sm">
              <div className="text-silver w-28 shrink-0 text-[11px] uppercase tracking-[0.2em] pt-1">
                Anamnese
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {health.conditions.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </div>
          )}
          {health.medications.length > 0 && (
            <div className="flex gap-3 text-sm">
              <div className="text-silver w-28 shrink-0 text-[11px] uppercase tracking-[0.2em] pt-1">
                Medikation
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {health.medications.map((m) => (
                  <Badge key={m}>{m}</Badge>
                ))}
              </div>
            </div>
          )}
          {health.allergies.length > 0 && (
            <div className="flex gap-3 text-sm">
              <div className="text-silver w-28 shrink-0 text-[11px] uppercase tracking-[0.2em] pt-1">
                Allergien
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {health.allergies.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
          )}
          {highlights.length > 0 && (
            <div className="flex gap-3 text-sm">
              <div className="text-silver w-28 shrink-0 text-[11px] uppercase tracking-[0.2em] pt-1">
                Lifestyle
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {highlights.map((h) => (
                  <Badge key={h}>{h}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
