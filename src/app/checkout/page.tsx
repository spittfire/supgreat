"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PRODUCT_BY_ID } from "@/lib/products";
import { useFlowStore } from "@/store/flow-store";

const PLANS = {
  once: { label: "Einmalkauf", factor: 1.0, discount: 0, subscription: false },
  subscription: { label: "Abo (monatlich)", factor: 1.0, discount: 0.15, subscription: true },
  coaching: { label: "Coaching + Box", factor: 1.0, discount: 0, subscription: false, addOn: 79 },
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
        label="Bestätigung"
        title={<>Danke, {name || "wir sind dran"}!</>}
        sub="Wir melden uns per E-Mail mit dem Zahlungs-Link und der Versandbestätigung, sobald der Checkout freigeschaltet ist."
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
      label="Checkout"
      title={
        <>
          Fast geschafft, {profile?.first_name || "du"}.
        </>
      }
      sub="Wähle dein Modell, wir reservieren deine Box. Die eigentliche Zahlung kommt in der nächsten Iteration über den Shopify-Checkout."
    >
      <form onSubmit={onSubmit} className="grid md:grid-cols-5 gap-8">
        <section className="md:col-span-3 space-y-6">
          <div role="radiogroup" aria-label="Plan" className="grid gap-3">
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
                  className={`text-left p-5 rounded-lg transition-colors ${
                    active
                      ? "bg-ink text-bone border border-ink"
                      : "hairline hover:bg-bone-2 text-ink"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-medium">{info.label}</div>
                    {"discount" in info && info.discount > 0 && (
                      <span className="text-xs font-mono opacity-80">
                        −{Math.round(info.discount * 100)} %
                      </span>
                    )}
                  </div>
                  <div className="text-sm opacity-80 mt-1">
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
          <div className="hairline rounded-lg p-5 md:p-6 bg-bone-2/60 sticky top-6">
            <div className="text-xs uppercase tracking-wide text-mist font-mono">
              Zusammenfassung
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {recommendation?.supplements.map((r) => (
                <li key={r.id} className="flex justify-between gap-3">
                  <span className="text-ink">{r.name}</span>
                  <span className="font-mono text-mist tabular-nums">
                    {(PLANS[plan].subscription
                      ? (PRODUCT_BY_ID.get(r.id)?.price_subscription ?? 0)
                      : (PRODUCT_BY_ID.get(r.id)?.price_single ?? 0)
                    )
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    €
                  </span>
                </li>
              ))}
              {summary.addOn > 0 && (
                <li className="flex justify-between gap-3">
                  <span className="text-ink">Coaching-Termin</span>
                  <span className="font-mono text-mist tabular-nums">
                    {summary.addOn.toFixed(2).replace(".", ",")} €
                  </span>
                </li>
              )}
            </ul>
            <div className="hairline-b my-4" />
            <div className="flex justify-between items-baseline">
              <div className="text-sm text-mist">Gesamt</div>
              <div className="font-mono text-2xl tabular-nums">
                {summary.total.toFixed(2).replace(".", ",")} €
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full mt-5">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              Bestellung reservieren
            </Button>
            <p className="text-xs text-mist mt-3 text-center">
              Noch keine Zahlung. Du erhältst eine Bestätigung per E-Mail.
            </p>
          </div>
        </aside>
      </form>

      <div className="mt-12 pt-6 hairline-b">
        <Link href="/box">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Zurück zur Box
          </Button>
        </Link>
      </div>
    </StepFrame>
  );
}
