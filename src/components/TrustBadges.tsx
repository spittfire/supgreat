import { ShieldCheck, Stethoscope, Sparkles } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    label: "DSGVO-konform",
    hint: "Deine Daten bleiben bei dir.",
    bg: "bg-sage/15",
    text: "text-sage",
  },
  {
    icon: Stethoscope,
    label: "Keine Diagnose",
    hint: "Nur Orientierung — ersetzt keinen Arztbesuch.",
    bg: "bg-coral/10",
    text: "text-coral",
  },
  {
    icon: Sparkles,
    label: "Kostenlos",
    hint: "Analyse und Box-Empfehlung gratis.",
    bg: "bg-brand-amber/15",
    text: "text-brand-amber",
  },
];

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {items.map(({ icon: Icon, label, hint, bg, text }) => (
        <li
          key={label}
          className="flex items-start gap-4 hairline rounded-xl bg-bone p-5"
        >
          <span
            aria-hidden
            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${bg} ${text}`}
          >
            <Icon strokeWidth={1.5} className="w-5 h-5" />
          </span>
          <div>
            <div className="font-medium text-ink">{label}</div>
            <div className="text-sm text-mist leading-snug mt-0.5">{hint}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
