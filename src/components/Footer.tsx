import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 md:mt-32 border-t border-steel bg-carbon">
      <div className="mx-auto max-w-6xl px-4 md:px-10 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <Logo className="h-6 text-lime mb-4" />
            <p className="text-sm text-silver leading-relaxed max-w-xs">
              Longevity-Protokolle, gebaut auf echten Daten.
            </p>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-silver mb-4 font-medium">
              Rechtliches
            </div>
            <ul className="space-y-2 text-sm text-pearl">
              <li>
                <Link href="/impressum" className="hover:text-lime transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-lime transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-lime transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-silver mb-4 font-medium">
              Kontakt
            </div>
            <ul className="space-y-2 text-sm text-pearl">
              <li>
                <a
                  href="mailto:hello@supgreat.de"
                  className="hover:text-lime transition-colors"
                >
                  hello@supgreat.de
                </a>
              </li>
              <li className="text-silver">Support auf Anfrage</li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-silver mb-4 font-medium">
              Hinweis
            </div>
            <p className="text-sm text-silver leading-relaxed">
              Keine medizinische Diagnose. Ersetzt keinen Arztbesuch.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-steel flex flex-wrap items-center justify-between gap-3 text-xs text-ash">
          <span>© {year} SUPGREAT</span>
          <span className="font-mono">Longevity Lab · v0.2 · by KG</span>
        </div>
      </div>
    </footer>
  );
}
