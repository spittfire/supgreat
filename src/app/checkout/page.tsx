"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { StepFrame } from "@/components/StepFrame";
import { StepActions } from "@/components/StepActions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useFlowStore } from "@/store/flow-store";

type PlanKey = "once" | "subscription" | "coaching";

const PLAN_COACHING_ADD_ON = 79;

function planLabel(p: PlanKey): string {
  if (p === "once") return "Einmalkauf";
  if (p === "subscription") return "Abo · monatlich";
  return "Coaching + Box";
}

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStep(8);
  }, [setStep]);

  const summary = useMemo(() => {
    const subscription = plan === "subscription";
    const core = recommendation?.core_box;
    const modules = recommendation?.modules ?? [];
    const corePrice = core
      ? subscription
        ? core.price_subscription
        : core.price_single
      : 0;
    const modulesPrice = modules.reduce(
      (s, r) => s + (subscription ? r.price_subscription : r.price_single),
      0,
    );
    const addOn = plan === "coaching" ? PLAN_COACHING_ADD_ON : 0;
    return {
      subscription,
      core,
      modules,
      corePrice,
      modulesPrice,
      addOn,
      total: corePrice + modulesPrice + addOn,
    };
  }, [recommendation, plan]);

  const handleShopifyCheckout = async () => {
    if (!recommendation) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          core_sku: recommendation.core_box.sku,
          module_skus: recommendation.modules.map((m) => m.sku),
          plan: plan === "coaching" ? "subscription" : plan,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        checkout_url?: string;
        error?: string;
      };
      if (!res.ok || !body.checkout_url) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      window.location.href = body.checkout_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Shopify-Checkout konnte nicht erstellt werden.",
      );
      setSubmitting(false);
    }
  };

  if (!recommendation) {
    return (
      <StepFrame
        step={8}
        label="Schritt 08 · Checkout"
        title={<>Deine Box fehlt noch.</>}
        sub="Bitte zuerst die Empfehlung erzeugen."
      >
        <Link href="/box">
          <Button>Zur Box</Button>
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
      sub="Wähle dein Modell — die Zahlung erfolgt sicher über Shopify."
    >
      <div className="grid md:grid-cols-5 gap-6 md:gap-8">
        <section className="md:col-span-3 space-y-6">
          <div>
            <Eyebrow>Modell wählen</Eyebrow>
            <div role="radiogroup" aria-label="Plan" className="mt-4 grid gap-3">
              {(["subscription", "once", "coaching"] as PlanKey[]).map((key) => {
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
                      <div className="font-medium text-pearl">{planLabel(key)}</div>
                      {key === "subscription" && (
                        <span className="text-xs font-mono text-lime">−15 %</span>
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

          {error && (
            <div className="rounded-xl border border-coral/40 bg-coral/5 p-4 text-sm text-coral">
              {error}
            </div>
          )}
        </section>

        <aside className="md:col-span-2">
          <div className="rounded-3xl border border-steel bg-onyx p-6 md:p-7 sticky top-24">
            <Eyebrow>Zusammenfassung</Eyebrow>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-pearl">
                  {summary.core?.name ?? "Core Box"}
                  <span className="ml-2 text-[10px] font-mono text-ash">
                    {summary.core?.sku}
                  </span>
                </span>
                <span className="font-mono text-silver tabular-nums">
                  €{summary.corePrice.toFixed(0)}
                </span>
              </li>
              {summary.modules.map((r) => (
                <li key={r.id} className="flex justify-between gap-3">
                  <span className="text-pearl truncate">
                    {r.name}
                    <span className="ml-2 text-[10px] font-mono text-ash">{r.sku}</span>
                  </span>
                  <span className="font-mono text-silver tabular-nums shrink-0">
                    €
                    {(summary.subscription ? r.price_subscription : r.price_single).toFixed(
                      0,
                    )}
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
                Gesamt {summary.subscription ? "/ Monat" : ""}
              </div>
              <div className="font-mono text-3xl text-pearl tabular-nums">
                €{summary.total.toFixed(0)}
              </div>
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full mt-5"
              disabled={submitting}
              onClick={handleShopifyCheckout}
            >
              {submitting ? (
                <>
                  <Lock className="w-4 h-4" strokeWidth={1.5} />
                  Weiterleiten …
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  Zum Shopify Checkout
                </>
              )}
            </Button>
            <p className="text-xs text-ash mt-3 text-center">
              Zahlung & Versand laufen über Shopify.
            </p>
          </div>
        </aside>
      </div>

      <StepActions>
        <Link href="/box" className="hidden md:inline-flex">
          <Button type="button" variant="secondary">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Zurück zur Box
          </Button>
        </Link>
      </StepActions>
    </StepFrame>
  );
}
