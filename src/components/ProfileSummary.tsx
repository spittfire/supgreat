import type { Health, Lifestyle, Profile } from "@/lib/types";
import { lifestyleHighlights } from "@/lib/lifestyle-triggers";
import { Badge } from "@/components/ui/Badge";

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
    <div className="hairline rounded-lg p-5 md:p-6 bg-bone-2/60">
      <div className="text-sm font-medium text-ink">Dein Gesundheitsprofil</div>
      <p className="text-xs text-mist mt-1">
        Diese Daten fließen in deine Box-Empfehlung ein.
      </p>

      <dl className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
        {chips.map((c) => (
          <div key={c.label}>
            <dt className="text-xs text-mist">{c.label}</dt>
            <dd className="text-ink mt-0.5">{c.value}</dd>
          </div>
        ))}
      </dl>

      {(health.conditions.length > 0 ||
        health.medications.length > 0 ||
        health.allergies.length > 0 ||
        highlights.length > 0) && <div className="hairline-b mt-6" />}

      <div className="mt-4 space-y-3">
        {health.conditions.length > 0 && (
          <div className="flex gap-3 text-sm">
            <div className="text-mist w-28 shrink-0">Anamnese</div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {health.conditions.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
        )}
        {health.medications.length > 0 && (
          <div className="flex gap-3 text-sm">
            <div className="text-mist w-28 shrink-0">Medikation</div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {health.medications.map((m) => (
                <Badge key={m}>{m}</Badge>
              ))}
            </div>
          </div>
        )}
        {health.allergies.length > 0 && (
          <div className="flex gap-3 text-sm">
            <div className="text-mist w-28 shrink-0">Allergien</div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {health.allergies.map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </div>
          </div>
        )}
        {highlights.length > 0 && (
          <div className="flex gap-3 text-sm">
            <div className="text-mist w-28 shrink-0">Lifestyle</div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {highlights.map((h) => (
                <Badge key={h}>{h}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
