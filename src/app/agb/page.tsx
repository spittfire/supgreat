import Link from "next/link";
import { Header } from "@/components/Header";

export default function AgbPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">AGB</h1>
          <p className="mt-6 text-ink/70">
            Die allgemeinen Geschäftsbedingungen werden mit dem Launch des Shopify-Shops ergänzt. Aktuell dient dieser Dienst der unverbindlichen, kostenlosen Orientierung.
          </p>
          <p className="mt-4 text-xs text-mist">Platzhalter.</p>
          <div className="mt-12">
            <Link href="/" className="text-sm text-moss underline">← Zurück</Link>
          </div>
        </section>
      </main>
    </>
  );
}
