import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 md:px-10 py-16 md:py-24">
          <Eyebrow>Rechtliches</Eyebrow>
          <h1 className="mt-5 font-display text-4xl md:text-5xl tracking-tight text-pearl">
            Datenschutz.
          </h1>
          <div className="mt-10 space-y-6 text-silver leading-relaxed">
            <p>
              SUPGREAT verarbeitet die von dir hochgeladenen Bluttest-Daten
              ausschließlich zum Zweck der Biomarker-Extraktion und
              Supplement-Empfehlung innerhalb dieser Session.
            </p>
            <section>
              <h2 className="font-display text-xl text-pearl mb-2">
                Verarbeitete Daten
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Hochgeladener Bluttest (PDF / Bild) — wird an das Anthropic-Claude-API
                  zur Extraktion übermittelt und nicht dauerhaft auf unseren Servern
                  gespeichert.
                </li>
                <li>
                  Profil-, Anamnese- und Lifestyle-Angaben — verbleiben lokal im
                  Session-Speicher deines Browsers (sessionStorage).
                </li>
                <li>
                  Empfehlungs-Ergebnisse werden nicht persistiert und nicht an Dritte
                  weitergegeben.
                </li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-xl text-pearl mb-2">Auftragsverarbeiter</h2>
              <p>
                Für die Bluttest-Analyse setzen wir Anthropic (Claude API) als
                Auftragsverarbeiter ein. Siehe Anthropic Privacy Policy.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-pearl mb-2">Deine Rechte</h2>
              <p>
                Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch —
                jederzeit per E-Mail an{" "}
                <a
                  href="mailto:privacy@supgreat.example"
                  className="text-lime hover:underline"
                >
                  privacy@supgreat.example
                </a>
                .
              </p>
            </section>
            <p className="text-xs text-ash pt-4">
              Platzhalter-Text. Vor Live-Gang juristisch prüfen und an tatsächliche
              Datenverarbeitung anpassen.
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
