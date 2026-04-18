import { interactionNote } from "./contraindications";
import { explainTriggers, recommendProducts, type RecommendContext } from "./supplement-rules";
import type { Recommendation, SupplementRec } from "./types";

/**
 * Offline fallback for /api/recommend: runs the real rule engine locally and
 * synthesizes a readable reason_short / reason_detail from the matched triggers
 * and the product's built-in short_benefit. No Claude API call.
 */
export function mockRecommend(ctx: RecommendContext): Recommendation {
  const ranked = recommendProducts(ctx, 8);

  if (ranked.length === 0) {
    return {
      supplements: [],
      overall_assessment:
        "Deine Werte und Lebensstil-Signale wirken insgesamt sehr ausgewogen — aktuell sehen wir keinen akuten Supplement-Bedarf. Halte deine Routinen und kontrolliere in 6–12 Monaten erneut.",
    };
  }

  const supplements: SupplementRec[] = ranked.map((r) => {
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
      ? `Zusammenhang mit: ${top}. Das Produkt kann zur Regulation der betroffenen Bereiche beitragen und passt zu deinem aktuellen Profil.`
      : `Passt zu deinem aktuellen Profil und kann zur Regulation beitragen.`;

    const warning =
      r.product.interactions
        .map((i) => interactionNote(i.when, { health: ctx.health }))
        .filter((x): x is string => !!x)
        .join(" ") || null;

    return {
      id: r.product.id,
      name: r.product.name,
      dosage: r.product.dosage,
      timing: r.product.timing,
      category_color: r.product.pill_color,
      pill_shape: r.product.pill_shape,
      reason_short,
      reason_detail,
      data_sources_used: sources,
      warning,
    };
  });

  const hasCritical = ctx.biomarkers.some((b) => b.status === "critical");
  const lowCount = ctx.biomarkers.filter(
    (b) => b.status === "low" || b.status === "suboptimal",
  ).length;
  const overall_assessment = hasCritical
    ? `Bei einigen Werten sehen wir deutliche Auffälligkeiten — diese mit dem Arzt besprechen. Die empfohlenen Supplements adressieren die unterstützenden Bereiche; sie ersetzen keine ärztliche Abklärung.`
    : lowCount > 3
      ? `Mehrere Werte liegen unterhalb des optimalen Bereichs. Die Box konzentriert sich auf die Bausteine mit dem größten Hebel — parallel dazu lohnen sich gezielte Lifestyle-Anpassungen (Schlaf, Sonne, Ernährung).`
      : `Dein Profil ist solide. Die Box feintuned die Bereiche mit Spielraum und unterstützt deine persönlichen Ziele — ideal als Erhalt-Protokoll.`;

  return { supplements, overall_assessment };
}
