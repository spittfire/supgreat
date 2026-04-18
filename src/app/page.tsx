import Link from "next/link";
import { FileText, Pill, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";
import { LandingForm } from "@/components/LandingForm";

const STEPS = [
  {
    icon: FileText,
    label: "Upload",
    hint: "Bluttest als PDF oder Foto — auch mehrere Seiten.",
    bg: "bg-brand-amber/15",
    text: "text-brand-amber",
  },
  {
    icon: Sparkles,
    label: "Fragebogen",
    hint: "Profil, Anamnese, 20 Lifestyle-Signale.",
    bg: "bg-sage/20",
    text: "text-sage",
  },
  {
    icon: Pill,
    label: "Deine Box",
    hint: "Personalisierte Supplements mit Begründung.",
    bg: "bg-coral/15",
    text: "text-coral",
  },
];

const TRUSTS = [
  { icon: ShieldCheck, label: "DSGVO-konform", bg: "bg-sage/15", text: "text-sage" },
  {
    icon: Stethoscope,
    label: "Keine Diagnose",
    bg: "bg-coral/10",
    text: "text-coral",
  },
  { icon: Sparkles, label: "Kostenlos", bg: "bg-brand-amber/15", text: "text-brand-amber" },
];

export default function Home() {
  return (
    <>
      <Header currentStep={1} />

      <main className="flex-1">
        {/* HERO — farbige Primary-Tile, mobile-first */}
        <section className="mx-auto w-full max-w-6xl px-4 md:px-10 pt-4 md:pt-10">
          <div className="hero-moss relative rounded-3xl p-6 md:p-12 overflow-hidden shadow-pop">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs tracking-[0.22em] uppercase text-brand-amber font-mono">
                Longevity · Schritt 1
              </p>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-bone">
                Dein Blut. <br />
                <span className="text-brand-amber italic">Dein Protokoll.</span>
              </h1>
              <p className="mt-5 text-bone/85 text-base md:text-lg leading-relaxed max-w-lg">
                Lade deinen Bluttest hoch, beantworte ein paar Fragen — und erhalte
                deine personalisierte SUPGREAT Box. In 5 Minuten.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {TRUSTS.map(({ icon: Icon, label, bg, text }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-bone/95 ${text}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${text}`} strokeWidth={1.6} />
                    {label}
                    {/* bg class is unused visually — keep tokens tree-shakable */}
                    <span className={`sr-only ${bg}`} />
                  </span>
                ))}
              </div>
            </div>

            {/* Dekor-Pille rechts oben */}
            <div
              aria-hidden
              className="hidden md:block absolute -right-10 -top-10 w-60 h-60 rounded-full bg-brand-amber/30 blur-2xl"
            />
            <div
              aria-hidden
              className="hidden md:block absolute -right-20 bottom-0 w-72 h-72 rounded-full bg-sage/40 blur-3xl"
            />
          </div>
        </section>

        {/* UPLOAD CARD */}
        <section className="mx-auto w-full max-w-6xl px-4 md:px-10 mt-6 md:-mt-8 relative z-10">
          <div className="rounded-3xl bg-paper shadow-pop hairline p-5 md:p-8 md:max-w-2xl md:mx-auto">
            <LandingForm />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto w-full max-w-6xl px-4 md:px-10 pt-14 md:pt-20 pb-16 md:pb-24">
          <h2 className="text-xs tracking-[0.2em] uppercase text-mist font-mono mb-5">
            So funktioniert&apos;s
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {STEPS.map((s, i) => (
              <li
                key={s.label}
                className="rounded-2xl bg-paper hairline shadow-soft p-5 flex items-start gap-4"
              >
                <span
                  aria-hidden
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg} ${s.text} shrink-0`}
                >
                  <s.icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-mist">0{i + 1}</span>
                    <span className="font-semibold text-ink">{s.label}</span>
                  </div>
                  <p className="text-sm text-ink/70 mt-1 leading-snug">{s.hint}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="mt-auto">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10 py-8 flex flex-wrap justify-between items-center gap-4 text-xs text-mist">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-amber" />
            <span>© {new Date().getFullYear()} SUPGREAT · Longevity Lab</span>
          </div>
          <nav className="flex gap-5">
            <Link href="/impressum" className="hover:text-ink">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-ink">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-ink">
              AGB
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
