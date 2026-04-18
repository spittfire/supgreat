import { ShieldCheck, Stethoscope, Sparkles } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "DSGVO-konform", hint: "Deine Daten bleiben bei dir." },
  {
    icon: Stethoscope,
    label: "Keine Diagnose",
    hint: "Nur Orientierung — ersetzt keinen Arztbesuch.",
  },
  { icon: Sparkles, label: "Kostenlos", hint: "Analyse und Box-Empfehlung gratis." },
];

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {items.map(({ icon: Icon, label, hint }) => (
        <li key={label} className="flex items-start gap-4">
          <span
            aria-hidden
            className="shrink-0 w-10 h-10 flex items-center justify-center hairline rounded-lg text-moss"
          >
            <Icon strokeWidth={1.3} className="w-5 h-5" />
          </span>
          <div>
            <div className="font-medium text-ink">{label}</div>
            <div className="text-sm text-mist leading-snug">{hint}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
