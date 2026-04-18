import Link from "next/link";
import { Header } from "@/components/Header";

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">Impressum</h1>
          <div className="mt-8 space-y-4 text-ink/80">
            <p>
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
              Registernummer: HRB 000000 (Platzhalter)
              <br />
              USt-IdNr.: DE000000000 (Platzhalter)
            </p>
            <p>
              Kontakt: <a href="mailto:hello@supgreat.example" className="underline">hello@supgreat.example</a>
            </p>
            <p className="text-xs text-mist pt-8">
              Dieses Impressum ist ein Platzhalter und muss vor Live-Gang mit den tatsächlichen Unternehmensdaten ersetzt werden.
            </p>
          </div>
          <div className="mt-12">
            <Link href="/" className="text-sm text-moss underline">← Zurück</Link>
          </div>
        </section>
      </main>
    </>
  );
}
