import Link from "next/link";
import { Header } from "@/components/Header";

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">Datenschutz</h1>
          <div className="mt-8 space-y-6 text-ink/80 leading-relaxed">
            <p>
              SUPGREAT verarbeitet die von dir hochgeladenen Bluttest-Daten ausschließlich zum Zweck der Biomarker-Extraktion und Supplement-Empfehlung innerhalb dieser Session.
            </p>
            <section>
              <h2 className="font-medium text-ink mb-2">Verarbeitete Daten</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hochgeladener Bluttest (PDF / Bild) — wird an das Anthropic-Claude-API zur Extraktion übermittelt und nicht dauerhaft auf unseren Servern gespeichert.</li>
                <li>Profil-, Anamnese- und Lifestyle-Angaben — verbleiben lokal im Session-Speicher deines Browsers (sessionStorage).</li>
                <li>Empfehlungs-Ergebnisse werden nicht persistiert und nicht an Dritte weitergegeben.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-medium text-ink mb-2">Auftragsverarbeiter</h2>
              <p>
                Für die Bluttest-Analyse setzen wir Anthropic (Claude API) als Auftragsverarbeiter ein. Siehe Anthropic Privacy Policy.
              </p>
            </section>
            <section>
              <h2 className="font-medium text-ink mb-2">Deine Rechte</h2>
              <p>
                Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch — jederzeit per E-Mail an{" "}
                <a href="mailto:privacy@supgreat.example" className="underline">
                  privacy@supgreat.example
                </a>.
              </p>
            </section>
            <p className="text-xs text-mist pt-4">
              Platzhalter-Text. Vor Live-Gang juristisch prüfen und an tatsächliche Datenverarbeitung anpassen.
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
