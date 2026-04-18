import { Gift, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";

const items: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: ShieldCheck,
    title: "DSGVO-konform",
    text: "Deine Daten bleiben bei dir.",
  },
  {
    icon: Stethoscope,
    title: "Keine Diagnose",
    text: "Nur Orientierung — ersetzt keinen Arztbesuch.",
  },
  {
    icon: Gift,
    title: "Kostenlos",
    text: "Analyse und Box-Empfehlung gratis.",
  },
];

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {items.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className="group flex items-start gap-4 rounded-2xl border border-steel bg-onyx p-5 transition-all duration-500 hover:border-iron hover:bg-graphite"
        >
          <span
            aria-hidden
            className="shrink-0 rounded-xl border border-steel bg-graphite p-2.5 transition-all group-hover:border-lime/40"
          >
            <Icon className="w-5 h-5 text-lime" strokeWidth={1.5} />
          </span>
          <div>
            <div className="font-medium text-pearl">{title}</div>
            <div className="mt-1 text-sm text-silver leading-snug">{text}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
