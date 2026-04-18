import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 md:px-10 py-16 md:py-24">
          <Eyebrow>Rechtliches</Eyebrow>
          <h1 className="mt-5 font-display text-4xl md:text-5xl tracking-tight text-pearl">
            Impressum.
          </h1>
          <div className="mt-10 space-y-5 text-silver leading-relaxed">
            <p className="text-pearl">
              <strong>SUPGREAT</strong>
              <br />
              Longevity Lab GmbH (Platzhalter)
              <br />
              Musterstraße 1
              <br />
              10115 Berlin
            </p>
            <p>
              Vertreten durch: Geschäftsführung (Platzhalter)
              <br />
              Registergericht: Amtsgericht Berlin-Charlottenburg
              <br />
              Registernummer: HRB 000000
              <br />
              USt-IdNr.: DE000000000
            </p>
            <p>
              Kontakt:{" "}
              <a
                href="mailto:hello@supgreat.example"
                className="text-lime hover:underline"
              >
                hello@supgreat.example
              </a>
            </p>
            <p className="text-xs text-ash pt-8">
              Dieses Impressum ist ein Platzhalter und muss vor Live-Gang mit den
              tatsächlichen Unternehmensdaten ersetzt werden.
            </p>
          </div>
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-lime hover:underline"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Zurück
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
