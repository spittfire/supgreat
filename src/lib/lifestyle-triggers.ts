import type { Lifestyle } from "./types";

/** Map lifestyle answers to a qualitative "penalty" for the longevity score. Range 0–25. */
export function lifestylePenalty(l: Lifestyle): number {
  let p = 0;
  if (["Täglich", "Fast täglich"].includes(l.alcohol)) p += 6;
  if (["Täglich", "Vapen/E-Zigarette"].includes(l.smoking)) p += 8;
  if (l.sleep_quality <= 2) p += 4;
  if (l.stress_level >= 4) p += 3;
  if (["0×", "1–2×"].includes(l.sport_frequency)) p += 2;
  if (["Täglich", "Mehrmals pro Woche"].includes(l.processed_food)) p += 2;
  if (["0–1", "2–3"].includes(l.veg_fruit)) p += 2;
  return Math.min(25, p);
}

/**
 * Surface "highlights" from the lifestyle answers — short German strings
 * used in the results dashboard "Dein Gesundheitsprofil" summary.
 */
export function lifestyleHighlights(l: Lifestyle): string[] {
  const out: string[] = [];
  if (l.sleep_quality <= 2) out.push("Schlafqualität niedrig");
  if (l.stress_level >= 4) out.push("Stresslevel erhöht");
  if (["Täglich", "Fast täglich"].includes(l.alcohol)) out.push("Alkoholkonsum hoch");
  if (["Täglich", "Vapen/E-Zigarette"].includes(l.smoking)) out.push("Raucher");
  if (["Nie", "1×"].includes(l.fish_per_week)) out.push("Kaum Fisch in der Ernährung");
  if (["0–1", "2–3"].includes(l.veg_fruit)) out.push("Wenig Obst & Gemüse");
  if (["Selten", "Fast nie"].includes(l.outdoor_time)) out.push("Wenig Tageslicht");
  if (["3–4×", "5–6×", "Täglich"].includes(l.sport_frequency)) out.push("Hohes Trainingsvolumen");
  return out;
}
