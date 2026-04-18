"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextField } from "@/components/ui/TextField";
import { PRODUCT_BY_ID } from "@/lib/products";
import { useFlowStore } from "@/store/flow-store";

const PLANS = {
  once: { label: "Einmalkauf", discount: 0, subscription: false },
  subscription: { label: "Abo · monatlich", discount: 0.15, subscription: true },
  coaching: { label: "Coaching + Box", discount: 0, subscription: false, addOn: 79 },
} as const;

type PlanKey = keyof typeof PLANS;

export default function CheckoutPage() {
  const recommendation = useFlowStore((s) => s.recommendation);
  const profile = useFlowStore((s) => s.profile);
  const setStep = useFlowStore((s) => s.setStep);

  const [plan, setPlan] = useState<PlanKey>(() => {
    if (typeof window === "undefined") return "subscription";
    const sp = new URL(window.location.href).searchParams.get("plan");
    if (sp === "once" || sp === "subscription" || sp === "coaching") return sp;
    return "subscription";
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState(profile?.first_name ?? "");
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setStep(8);
  }, [setStep]);

  const summary = useMemo(() => {
    const items = recommendation?.supplements ?? [];
    const base = items.reduce(
      (s, r) =>
        s +
        (PLANS[plan].subscription
          ? (PRODUCT_BY_ID.get(r.id)?.price_subscription ?? 0)
          : (PRODUCT_BY_ID.get(r.id)?.price_single ?? 0)),
      0,
    );
    const addOn = "addOn" in PLANS[plan] ? (PLANS[plan] as { addOn: number }).addOn : 0;
    return { base, addOn, total: base + addOn };
  }, [recommendation, plan]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <StepFrame
        step={8}
        label="Schritt 08 · Bestätigung"
        title={
          <>
            <span className="italic text-silver">Danke,</span>{" "}
            <span className="text-lime">{name || "dir"}.</span>
          </>
        }
        sub="Wir melden uns per E-Mail mit Zahlungs-Link und Versandbestätigung, sobald der Checkout freigeschaltet ist."
      >
        <Link href="/">
          <Button>Zurück zum Anfang</Button>
        </Link>
      </StepFrame>
    );
  }

  return (
    <StepFrame
      step={8}
      label="Schritt 08 · Checkout"
      title={
        <>
          Fast geschafft,{" "}
          <span className="italic text-lime">{profile?.first_name || "du"}</span>.
        </>
      }
      sub="Wähle dein Modell — die eigentliche Zahlung kommt in der nächsten Iteration über Shopify."
    >
      <form onSubmit={onSubmit} className="grid md:grid-cols-5 gap-6 md:gap-8">
        <section className="md:col-span-3 space-y-6">
          <div>
            <Eyebrow>Modell wählen</Eyebrow>
            <div role="radiogroup" aria-label="Plan" className="mt-4 grid gap-3">
              {(Object.keys(PLANS) as PlanKey[]).map((key) => {
                const info = PLANS[key];
                const active = plan === key;
                return (
                  <button
                    type="button"
                    key={key}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPlan(key)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                      active
                        ? "border-lime bg-lime/10 text-pearl shadow-glow-lime"
                        : "border-steel bg-onyx text-silver hover:border-iron hover:text-pearl"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="font-medium text-pearl">{info.label}</div>
                      {"discount" in info && info.discount > 0 && (
                        <span className="text-xs font-mono text-lime">
                          −{Math.round(info.discount * 100)} %
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-silver mt-1">
                      {key === "subscription"
                        ? "Automatische Nachlieferung, jederzeit kündbar."
                        : key === "coaching"
                          ? "30-Min-Gespräch mit einem Longevity Coach + Box."
                          : "Einmalige Lieferung, kein Abo."}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Vorname"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="PLZ"
              name="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              required
            />
          </div>
          <TextField
            label="E-Mail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </section>

        <aside className="md:col-span-2">
          <div className="rounded-3xl border border-steel bg-onyx p-6 md:p-7 sticky top-24">
            <Eyebrow>Zusammenfassung</Eyebrow>
            <ul className="mt-5 space-y-2 text-sm">
              {recommendation?.supplements.map((r) => (
                <li key={r.id} className="flex justify-between gap-3">
                  <span className="text-pearl">{r.name}</span>
                  <span className="font-mono text-silver tabular-nums">
                    €
                    {(PLANS[plan].subscription
                      ? (PRODUCT_BY_ID.get(r.id)?.price_subscription ?? 0)
                      : (PRODUCT_BY_ID.get(r.id)?.price_single ?? 0)
                    ).toFixed(0)}
                  </span>
                </li>
              ))}
              {summary.addOn > 0 && (
                <li className="flex justify-between gap-3">
                  <span className="text-pearl">Coaching-Termin</span>
                  <span className="font-mono text-silver tabular-nums">
                    €{summary.addOn.toFixed(0)}
                  </span>
                </li>
              )}
            </ul>
            <div className="border-t border-steel my-5" />
            <div className="flex justify-between items-baseline">
              <div className="text-[11px] uppercase tracking-[0.2em] text-silver">
                Gesamt
              </div>
              <div className="font-mono text-3xl text-pearl tabular-nums">
                €{summary.total.toFixed(0)}
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full mt-5">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              Bestellung reservieren
            </Button>
            <p className="text-xs text-ash mt-3 text-center">
              Noch keine Zahlung. Bestätigung per E-Mail.
            </p>
          </div>
        </aside>
      </form>

      <StepActions>
        <Link href="/box" className="hidden md:inline-flex">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Zurück zur Box
          </Button>
        </Link>
        <div className="hidden md:block md:ml-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={(e) => {
              const form = (e.currentTarget as HTMLButtonElement).closest("form");
              form?.requestSubmit();
            }}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            Reservieren
          </Button>
        </div>
      </StepActions>
    </StepFrame>
  );
}
