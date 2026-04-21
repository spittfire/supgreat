import type { Biomarker, CoreBoxRec, Health, Lifestyle, Profile } from "./types";
import { CORE_BOX, PRODUCTS, type Product, type Trigger, type LifestyleScoreField } from "./products";
import { hasContraindication } from "./contraindications";

export type RecommendContext = {
  biomarkers: Biomarker[];
  profile: Profile;
  health: Health;
  lifestyle: Lifestyle;
};

function matchTrigger(t: Trigger, ctx: RecommendContext): boolean {
  const { biomarkers, profile, health, lifestyle } = ctx;
  switch (t.kind) {
    case "biomarker_status": {
      const marker = biomarkers.find((b) => b.key === t.key);
      return !!marker && t.statuses.includes(marker.status as never);
    }
    case "goal":
      return profile.goals.includes(t.value);
    case "symptom":
      return lifestyle.symptoms.includes(t.value);
    case "condition":
      return health.conditions.includes(t.value);
    case "medication":
      return health.medications.includes(t.value);
    case "allergy":
      return health.allergies.includes(t.value);
    case "pregnancy":
      return health.pregnancy === t.value;
    case "diet":
      return lifestyle.diet === t.value;
    case "lifestyle_score": {
      const v = lifestyle[t.field as LifestyleScoreField];
      if (typeof v !== "number") return false;
      if (t.op === "<=") return v <= t.value;
      if (t.op === ">=") return v >= t.value;
      return v === t.value;
    }
    case "lifestyle_category": {
      const v = lifestyle[t.field];
      return typeof v === "string" && t.values.includes(v);
    }
    case "lifestyle_multi": {
      const v = lifestyle[t.field];
      if (!Array.isArray(v)) return false;
      return t.values.some((needle) => v.includes(needle));
    }
    default:
      return false;
  }
}

/** Score a product by number of matching triggers, plus its base_score weight. */
function scoreProduct(p: Product, ctx: RecommendContext): number {
  const matches = p.triggers.filter((t) => matchTrigger(t, ctx)).length;
  if (matches === 0) return 0;
  return matches * 2 + p.base_score;
}

/** Apply sex/age gating and user's existing supplements (de-duplication). */
function isEligible(p: Product, ctx: RecommendContext): boolean {
  if (p.sex && !p.sex.includes(ctx.profile.sex)) return false;
  if (p.min_age && ctx.profile.age < p.min_age) return false;
  // Dedup: if user already takes an overlapping supplement by name, skip.
  const already = ctx.health.current_supplements.map((s) => s.toLowerCase());
  const nameTokens = p.name.toLowerCase().split(/[\s\-()]+/).filter(Boolean);
  if (nameTokens.some((tok) => tok.length > 3 && already.some((s) => s.includes(tok)))) {
    return false;
  }
  return true;
}

export type RankedProduct = {
  product: Product;
  score: number;
  matched_triggers: Trigger[];
};

/** Main entry: produce ranked recommendations, already filtered for contraindications. */
export function recommendProducts(ctx: RecommendContext, limit = 8): RankedProduct[] {
  const ranked: RankedProduct[] = [];
  for (const product of PRODUCTS) {
    if (!isEligible(product, ctx)) continue;
    if (product.contraindications.some((id) => hasContraindication(id, { health: ctx.health }))) {
      continue;
    }
    const score = scoreProduct(product, ctx);
    if (score <= 0) continue;
    const matched_triggers = product.triggers.filter((t) => matchTrigger(t, ctx));
    ranked.push({ product, score, matched_triggers });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}

/**
 * Produce a Core Box recommendation (always included) plus a ranked list of
 * add-on Module recommendations. Core Box carries the constitutional
 * foundation; modules address the specific gaps in the user's profile.
 */
export function recommendBox(
  ctx: RecommendContext,
  moduleLimit = 12,
): { core_box: CoreBoxRec; modules: RankedProduct[] } {
  const modules = recommendProducts(ctx, moduleLimit);
  const core_box: CoreBoxRec = {
    sku: CORE_BOX.sku,
    name: CORE_BOX.name,
    tagline: CORE_BOX.tagline,
    price_single: CORE_BOX.price_single,
    price_subscription: CORE_BOX.price_subscription,
    reason_short: CORE_BOX.tagline,
    ingredient_count: CORE_BOX.ingredient_count,
    episodes: CORE_BOX.episodes.map((e) => ({
      id: e.id,
      label: e.label,
      goal: e.goal,
      ingredients: e.ingredients.map((i) => ({ ...i })),
    })),
  };
  return { core_box, modules };
}

/** Build a compact, human-readable summary of what drove the selection — used in Claude prompt. */
export function explainTriggers(
  matched: Trigger[],
  biomarkers: Biomarker[],
): string[] {
  const out: string[] = [];
  for (const t of matched) {
    switch (t.kind) {
      case "biomarker_status": {
        const b = biomarkers.find((x) => x.key === t.key);
        if (b) out.push(`Biomarker: ${b.name} ${b.value} ${b.unit} (${b.status})`);
        break;
      }
      case "goal":
        out.push(`Ziel: ${t.value}`);
        break;
      case "symptom":
        out.push(`Beschwerde: ${t.value}`);
        break;
      case "condition":
        out.push(`Anamnese: ${t.value}`);
        break;
      case "medication":
        out.push(`Medikation: ${t.value}`);
        break;
      case "allergy":
        out.push(`Allergie: ${t.value}`);
        break;
      case "pregnancy":
        out.push(`Schwangerschaftsstatus: ${t.value}`);
        break;
      case "diet":
        out.push(`Ernährung: ${t.value}`);
        break;
      case "lifestyle_score":
        out.push(`Lifestyle: ${t.field} ${t.op} ${t.value}`);
        break;
      case "lifestyle_category":
        out.push(`Lifestyle: ${t.field} ∈ {${t.values.join(", ")}}`);
        break;
      case "lifestyle_multi":
        out.push(`Lifestyle: ${t.field} enthält {${t.values.join(", ")}}`);
        break;
    }
  }
  return out;
}
