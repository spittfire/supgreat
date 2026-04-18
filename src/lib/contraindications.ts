import type { Health } from "./types";

export type ContraindicationContext = {
  health: Health;
};

/**
 * Matches a contraindication ID against the user's health state.
 * Each ID corresponds to a class of risk used in products.ts `contraindications`.
 */
export function hasContraindication(id: string, ctx: ContraindicationContext): boolean {
  const { health } = ctx;
  const conds = new Set(health.conditions.map((c) => c.toLowerCase()));
  const meds = new Set(health.medications.map((m) => m.toLowerCase()));
  const allergies = new Set(health.allergies.map((a) => a.toLowerCase()));

  switch (id) {
    case "kidney_disease_severe":
      return (
        conds.has("chronische niereninsuffizienz") ||
        conds.has("chronische niereninsuffizienz (stadium 4-5)")
      );
    case "hemochromatosis":
      return Array.from(conds).some((c) => c.includes("hämochromatose"));
    case "blood_thinner_strict":
      return Array.from(meds).some((m) => m.includes("marcumar") || m.includes("warfarin"));
    case "high_dose_blood_thinner":
      return Array.from(meds).some(
        (m) =>
          m.includes("marcumar") ||
          m.includes("warfarin") ||
          m.includes("eliquis") ||
          m.includes("xarelto"),
      );
    case "fish_allergy":
      return Array.from(allergies).some(
        (a) => a.includes("fisch") || a.includes("meeresfrüchte"),
      );
    case "pregnancy":
      return health.pregnancy === "pregnant" || health.pregnancy === "breastfeeding";
    case "thyroid_hyper":
      return Array.from(conds).some(
        (c) => c.includes("schilddrüsenüberfunktion") || c.includes("morbus basedow"),
      );
    case "autoimmune_active":
      return Array.from(conds).some((c) =>
        [
          "rheumatoide arthritis",
          "multiple sklerose",
          "lupus",
          "morbus crohn",
          "colitis ulcerosa",
          "psoriasis",
        ].some((k) => c.includes(k)),
      );
    case "immunosuppressed":
      return Array.from(meds).some((m) => m.includes("immunsuppressiva"));
    case "hormonal_contraception":
      return Array.from(meds).some(
        (m) => m.includes("hormonelle verhütung") || m.includes("pille"),
      );
    case "prostate_cancer":
      return Array.from(conds).some((c) => c.includes("prostata") && c.includes("krebs"));
    default:
      return false;
  }
}

/** Produces a human-readable warning label for a contraindication or interaction trigger. */
export function interactionNote(
  when: string,
  ctx: ContraindicationContext,
): string | null {
  const { health } = ctx;
  const meds = health.medications.map((m) => m.toLowerCase());
  switch (when) {
    case "blood_thinner":
      return meds.some((m) => /marcumar|warfarin|eliquis|xarelto|ass/.test(m))
        ? "Achtung: Wechselwirkung mit deinem Blutverdünner möglich — bitte ärztlich abklären."
        : null;
    case "thyroid_medication":
      return meds.some((m) => m.includes("schilddrüsen") || m.includes("l-thyroxin"))
        ? "Hinweis: Bei L-Thyroxin-Einnahme zeitlichen Abstand einhalten."
        : null;
    case "hormonal_contraception":
      return meds.some(
        (m) => m.includes("hormonelle verhütung") || m.includes("pille"),
      )
        ? "Hinweis: Kann mit hormoneller Verhütung interferieren."
        : null;
    default:
      return null;
  }
}
