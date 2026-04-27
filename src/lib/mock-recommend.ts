import { interactionNote } from "./contraindications";
import { explainTriggers, recommendBox, type RecommendContext } from "./supplement-rules";
import type { Recommendation, SupplementRec } from "./types";

/**
 * Offline fallback for /api/recommend: runs the real rule engine locally and
 * synthesizes reasons from matched triggers + product short_benefit. The Core
 * Box is always included; modules address specific profile gaps.
 */
export function mockRecommend(ctx: RecommendContext): Recommendation {
  const { core_box, modules } = recommendBox(ctx, 12);

  const coreReason =
    "Die Core Box ist dein tägliches Fundament: 22 Wirkstoffe in 4 Tagespacks (Morning · Midday · Afternoon · Night), abgestimmt auf Energie, Fokus, Stoffwechsel und Regeneration.";

  const supplements: SupplementRec[] = modules.map((r) => {
    const reasons = explainTriggers(r.matched_triggers, ctx.biomarkers);
    const sources = r.matched_triggers
      .map((t) => {
        switch (t.kind) {
          case "biomarker_status":
            return `biomarker:${t.key}`;
          case "goal":
            return `goal:${t.value}`;
          case "symptom":
            return `symptom:${t.value}`;
          case "condition":
            return `condition:${t.value}`;
          case "medication":
            return `medication:${t.value}`;
          case "allergy":
            return `allergy:${t.value}`;
          case "pregnancy":
            return `pregnancy:${t.value}`;
          case "diet":
            return `diet:${t.value}`;
          case "lifestyle_score":
            return `lifestyle:${t.field}`;
          case "lifestyle_category":
            return `lifestyle:${t.field}`;
          case "lifestyle_multi":
            return `lifestyle:${t.field}`;
        }
      })
      .slice(0, 4);

    const reason_short = `${r.product.short_benefit}.`;
    const top = reasons.slice(0, 2).join(" · ");
    const reason_detail = top
      ? `Zusammenhang mit: ${top}. Das Modul ergänzt deine Core Box gezielt in diesem Bereich.`
      : `Ergänzt deine Core Box gezielt und passt zu deinem aktuellen Profil.`;

    const warning =
      r.product.interactions
        .map((i) => interactionNote(i.when, { health: ctx.health }))
        .filter((x): x is string => !!x)
        .join(" ") || null;

    return {
      id: r.product.id,
      sku: r.product.sku,
      product_type: r.product.product_type,
      name: r.product.name,
      category: r.product.category,
      dosage: r.product.dosage,
      timing: r.product.timing,
      category_color: r.product.pill_color,
      pill_shape: r.product.pill_shape,
      reason_short,
      reason_detail,
      data_sources_used: sources,
      warning,
      price_single: r.product.price_single,
      price_subscription: r.product.price_subscription,
    };
  });

  const hasCritical = ctx.biomarkers.some((b) => b.status === "critical");
  const lowCount = ctx.biomarkers.filter(
    (b) => b.status === "low" || b.status === "suboptimal",
  ).length;
  const overall_assessment = hasCritical
    ? `Bei einigen Werten sehen wir deutliche Auffälligkeiten — diese mit dem Arzt besprechen. Die Core Box deckt das tägliche Fundament ab, die Module adressieren gezielt die betroffenen Bereiche.`
    : lowCount > 3
      ? `Mehrere Werte liegen unterhalb des optimalen Bereichs. Deine Core Box bildet das Fundament; die ergänzenden Module setzen dort an, wo der größte Hebel liegt.`
      : `Dein Profil ist solide. Die Core Box feintuned den Alltag, die Module unterstützen gezielt deine persönlichen Ziele — ideal als Erhalt-Protokoll.`;

  const monthly_total =
    core_box.price_subscription +
    supplements.reduce((s, r) => s + r.price_subscription, 0);
  const onetime_total =
    core_box.price_single +
    supplements.reduce((s, r) => s + r.price_single, 0);

  return {
    core_box: { ...core_box, reason_short: coreReason },
    modules: supplements,
    overall_assessment,
    monthly_total: Math.round(monthly_total * 10) / 10,
    onetime_total: Math.round(onetime_total * 10) / 10,
  };
}
