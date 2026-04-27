import type { SupplementRec } from "./types";

/**
 * Customer-facing category buckets for the box page. We aggregate the
 * fine-grained product `category` strings (Vitamine, Mineralstoffe,
 * Adaptogene, Mitochondrial …) into broader, more communicative buckets
 * so the user sees the *type* of support they are getting without us
 * exposing concrete supplement names.
 */
export type CategoryBucket =
  | "Vitamine"
  | "Mineralien & Spurenelemente"
  | "Pflanzenstoffe"
  | "Aminosäuren"
  | "Coenzyme & Antioxidantien"
  | "Fettsäuren"
  | "Darmkulturen"
  | "Strukturstoffe"
  | "Longevity"
  | "Sonstiges";

const PRODUCT_CATEGORY_TO_BUCKET: Record<string, CategoryBucket> = {
  Vitamine: "Vitamine",
  Mineralstoffe: "Mineralien & Spurenelemente",
  Pflanzlich: "Pflanzenstoffe",
  Adaptogene: "Pflanzenstoffe",
  Menopause: "Pflanzenstoffe",
  Brain: "Pflanzenstoffe",
  Aminosäuren: "Aminosäuren",
  Mitochondrial: "Coenzyme & Antioxidantien",
  Antioxidantien: "Coenzyme & Antioxidantien",
  Fettsäuren: "Fettsäuren",
  Darmgesundheit: "Darmkulturen",
  Bindegewebe: "Strukturstoffe",
  Gelenke: "Strukturstoffe",
  Longevity: "Longevity",
  Sport: "Sonstiges",
};

export function bucketForProductCategory(category: string): CategoryBucket {
  return PRODUCT_CATEGORY_TO_BUCKET[category] ?? "Sonstiges";
}

export type CategoryCount = { bucket: CategoryBucket; count: number };

export function summarizeByCategory(modules: SupplementRec[]): CategoryCount[] {
  const counts = new Map<CategoryBucket, number>();
  for (const m of modules) {
    const bucket = bucketForProductCategory(m.category);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  // Stable display order matches the union type order above.
  const order: CategoryBucket[] = [
    "Vitamine",
    "Mineralien & Spurenelemente",
    "Pflanzenstoffe",
    "Aminosäuren",
    "Coenzyme & Antioxidantien",
    "Fettsäuren",
    "Darmkulturen",
    "Strukturstoffe",
    "Longevity",
    "Sonstiges",
  ];
  return order
    .filter((b) => (counts.get(b) ?? 0) > 0)
    .map((b) => ({ bucket: b, count: counts.get(b)! }));
}

/**
 * Customer-facing time-of-day buckets. The product `timing` strings
 * morgens / mittags / mit Mahlzeit / abends / 2x täglich are mapped to
 * the four episode slots customers expect (Morgens · Mittags · Abends ·
 * Nachts). 2x täglich counts in both Morgens and Abends.
 */
export type TimingSlot = "Morgens" | "Mittags" | "Abends" | "Nachts";

export type TimingCount = { slot: TimingSlot; count: number };

export function summarizeByTiming(modules: SupplementRec[]): TimingCount[] {
  const counts: Record<TimingSlot, number> = {
    Morgens: 0,
    Mittags: 0,
    Abends: 0,
    Nachts: 0,
  };
  for (const m of modules) {
    const t = m.timing.toLowerCase();
    if (t.includes("2x")) {
      counts.Morgens += 1;
      counts.Abends += 1;
    } else if (t.includes("morg")) {
      counts.Morgens += 1;
    } else if (t.includes("abend") || t.includes("nacht")) {
      counts.Abends += 1;
    } else if (t.includes("mittag") || t.includes("mahlzeit")) {
      counts.Mittags += 1;
    } else {
      counts.Mittags += 1;
    }
  }
  const order: TimingSlot[] = ["Morgens", "Mittags", "Abends", "Nachts"];
  return order
    .filter((s) => counts[s] > 0)
    .map((s) => ({ slot: s, count: counts[s] }));
}
