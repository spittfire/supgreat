import Link from "next/link";
import { FileText, Pill, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroDecor } from "@/components/HeroDecor";
import { LandingForm } from "@/components/LandingForm";
import { TrustBadges } from "@/components/TrustBadges";

const STEPS = [
  {
    icon: FileText,
    label: "Bluttest hochladen",
    hint: "PDF oder Foto. Mehrere Seiten möglich.",
    bg: "bg-brand-amber/15",
    text: "text-brand-amber",
  },
  {
    icon: Sparkles,
    label: "Profil & Anamnese",
    hint: "Ziele, Erkrankungen, 20 Lifestyle-Signale.",
    bg: "bg-sage/15",
    text: "text-sage",
  },
  {
    icon: Pill,
    label: "Deine SUPGREAT Box",
    hint: "Personalisierte Supplements mit Begründung.",
    bg: "bg-coral/10",
    text: "text-coral",
  },
];

export default function Home() {
  return (
    <>
      <Header currentStep={1} />

      <main className="flex-1 relative">
        <HeroDecor />

        <section className="relative mx-auto w-full max-w-6xl px-6 md:px-10 pt-10 md:pt-16 pb-8">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-6">
              <p className="text-xs tracking-[0.2em] uppercase text-moss mb-6 font-mono">
                Schritt 1 · Upload
              </p>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.02] tracking-tight">
                Dein Blut.
                <br />
                <span className="italic text-brand-amber">Dein Protokoll.</span>
              </h1>
              <p className="mt-6 text-ink/70 text-lg max-w-prose">
                Lade deinen Bluttest hoch. Beantworte ein paar Fragen. Erhalte deine
                personalisierte SUPGREAT Box — zusammengestellt aus Biomarkern, Anamnese
                und 20 Lifestyle-Signalen.
              </p>

              <ol className="mt-10 space-y-3">
                {STEPS.map((s, i) => (
                  <li
                    key={s.label}
                    className="flex items-center gap-4 hairline rounded-xl bg-bone/80 backdrop-blur-sm px-4 py-3"
                  >
                    <span
                      aria-hidden
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg} ${s.text}`}
                    >
                      <s.icon className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink">
                        <span className="font-mono text-mist mr-2">0{i + 1}</span>
                        {s.label}
                      </div>
                      <div className="text-xs text-mist mt-0.5">{s.hint}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="md:col-span-6">
              <LandingForm />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 md:px-10 pb-16 md:pb-24">
          <div className="pt-10 md:pt-14">
            <TrustBadges />
          </div>
        </section>
      </main>

      <footer className="mt-auto">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10 py-8 flex flex-wrap justify-between items-center gap-4 text-xs text-mist">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-moss" />
            <span>© {new Date().getFullYear()} SUPGREAT · Longevity Lab</span>
          </div>
          <nav className="flex gap-6">
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
