import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LandingForm } from "@/components/LandingForm";
import { TrustBadges } from "@/components/TrustBadges";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function Home() {
  return (
    <>
      <Header currentStep={1} />

      <main className="flex-1 relative">
        <section className="mx-auto w-full max-w-6xl px-4 md:px-10 pt-10 md:pt-20 pb-24 md:pb-32 relative">
          {/* Radial lime glow top-left */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial-lime opacity-50"
          />

          <div className="relative">
            <Eyebrow>Longevity Lab · Schritt 01 · Upload</Eyebrow>

            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-8xl font-semibold leading-[0.95] tracking-tight">
              <span className="italic text-silver">Dein Blut.</span>
              <br />
              <span className="text-pearl">Dein Protokoll.</span>
            </h1>

            <p className="mt-6 md:mt-8 max-w-2xl text-lg md:text-xl text-silver leading-relaxed">
              Lade deinen Bluttest hoch. Beantworte ein paar Fragen. Erhalte deine
              personalisierte{" "}
              <span className="text-lime">SUPGREAT Box</span> — zusammengestellt aus
              Biomarkern, Anamnese und 20 Lifestyle-Signalen.
            </p>
          </div>

          {/* Upload */}
          <div className="relative mt-10 md:mt-14 md:max-w-3xl">
            <LandingForm />
          </div>

          {/* Trust row */}
          <div className="relative mt-12 md:mt-16">
            <TrustBadges />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
