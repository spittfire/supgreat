import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function AgbPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 md:px-10 py-16 md:py-24">
          <Eyebrow>Rechtliches</Eyebrow>
          <h1 className="mt-5 font-display text-4xl md:text-5xl tracking-tight text-pearl">
            AGB.
          </h1>
          <p className="mt-6 text-silver leading-relaxed">
            Die allgemeinen Geschäftsbedingungen werden mit dem Launch des
            Shopify-Shops ergänzt. Aktuell dient dieser Dienst der unverbindlichen,
            kostenlosen Orientierung.
          </p>
          <p className="mt-3 text-xs text-ash">Platzhalter.</p>
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
