import Link from "next/link";
import { Header } from "@/components/Header";
import { LandingForm } from "@/components/LandingForm";
import { TrustBadges } from "@/components/TrustBadges";

export default function Home() {
  return (
    <>
      <Header currentStep={1} />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 md:px-10 pt-10 md:pt-16 pb-8">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-6">
              <p className="text-xs tracking-[0.2em] uppercase text-moss mb-6 font-mono">
                Schritt 1 · Upload
              </p>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.02] tracking-tight">
                Dein Blut.
                <br />
                <span className="italic">Dein Protokoll.</span>
              </h1>
              <p className="mt-6 text-ink/70 text-lg max-w-prose">
                Lade deinen Bluttest hoch. Beantworte ein paar Fragen. Erhalte deine
                personalisierte SUPGREAT Box — zusammengestellt aus Biomarkern, Anamnese
                und 20 Lifestyle-Signalen.
              </p>
            </div>

            <div className="md:col-span-6">
              <LandingForm />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 md:px-10 pb-16 md:pb-24">
          <div className="hairline-b pb-10 md:pb-14" />
          <div className="pt-10 md:pt-14">
            <TrustBadges />
          </div>
        </section>
      </main>

      <footer className="hairline-b-top mt-auto">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10 py-8 flex flex-wrap justify-between items-center gap-4 text-xs text-mist">
          <div>© {new Date().getFullYear()} SUPGREAT · Longevity Lab</div>
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
