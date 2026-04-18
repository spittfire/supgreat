import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 md:px-10 py-24 md:py-32 text-center">
          <Eyebrow>404 · Not found</Eyebrow>
          <h1 className="mt-5 font-display text-4xl md:text-6xl leading-tight tracking-tight text-pearl">
            <span className="italic text-silver">Hier ist</span> nichts zu finden.
          </h1>
          <p className="mt-4 text-silver max-w-prose mx-auto">
            Die aufgerufene Seite existiert nicht. Starte einfach vorne.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/">
              <Button size="lg">Zurück zum Anfang</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
