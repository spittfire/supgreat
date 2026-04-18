import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-moss font-mono">
            404
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mt-4">
            Hier ist nichts zu finden.
          </h1>
          <p className="mt-4 text-ink/70 max-w-prose mx-auto">
            Die aufgerufene Seite existiert noch nicht. Wir sind mitten im Aufbau —
            starte einfach vorne.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/">
              <Button size="lg">Zurück zum Anfang</Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
