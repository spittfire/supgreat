"use client";

import { FileText, Mail, Package } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Reassures the customer that the detailed analysis and the personal
 * box composition arrive after purchase — so the value is captured,
 * not given away on the configurator page.
 */
export function PostPurchasePromise() {
  return (
    <section className="rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/5 via-onyx to-onyx p-6 md:p-10 shadow-glow-soft">
      <Eyebrow>Was du nach dem Kauf bekommst</Eyebrow>
      <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight tracking-tight text-pearl">
        Dein <span className="italic text-lime">vollständiger</span> Bericht.
      </h2>
      <p className="mt-4 max-w-prose text-silver leading-relaxed">
        Sobald deine Bestellung eingegangen ist, schicken wir dir per E-Mail die
        komplette Auswertung deines Bluttests und die exakte Zusammensetzung
        deiner persönlichen Box. Laut deinem Bluttest ist das alles, was du
        brauchst — nicht mehr, nicht weniger.
      </p>

      <ul className="mt-7 grid gap-3 sm:grid-cols-3">
        <li className="rounded-2xl border border-steel bg-onyx/60 p-4">
          <Mail className="h-5 w-5 text-lime mb-3" strokeWidth={1.6} />
          <div className="text-sm text-pearl font-medium">Detailbericht per Mail</div>
          <p className="mt-1 text-xs text-silver leading-relaxed">
            Alle Werte mit Referenzbereichen, Einordnung und Empfehlungen als PDF.
          </p>
        </li>
        <li className="rounded-2xl border border-steel bg-onyx/60 p-4">
          <FileText className="h-5 w-5 text-lime mb-3" strokeWidth={1.6} />
          <div className="text-sm text-pearl font-medium">Persönliche Zusammensetzung</div>
          <p className="mt-1 text-xs text-silver leading-relaxed">
            Wirkstoffe, Dosierungen, Einnahmezeitpunkte und Begründung pro Modul.
          </p>
        </li>
        <li className="rounded-2xl border border-steel bg-onyx/60 p-4">
          <Package className="h-5 w-5 text-lime mb-3" strokeWidth={1.6} />
          <div className="text-sm text-pearl font-medium">4 Tagespacks geliefert</div>
          <p className="mt-1 text-xs text-silver leading-relaxed">
            Morning · Midday · Afternoon · Night — vorportioniert, mit Anleitung.
          </p>
        </li>
      </ul>
    </section>
  );
}
