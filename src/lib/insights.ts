import type { Analysis, Health, Lifestyle, Profile } from "./types";
import { recommendProducts, type RecommendContext } from "./supplement-rules";

/**
 * Micro-feedback for the multi-block lifestyle questionnaire.
 * The goal is to give the user a small "detected → addressed" signal at the
 * end of each block — a light-touch dopamine hit without naming specific
 * products (that's reserved for the final box page).
 */

export type BlockInsight = {
  /** Short chip shown above the highlights ("Block A · Ernährung ✓"). */
  blockLabel: string;
  /** 1–3 highlights derived from the answers the user just gave. */
  highlights: string[];
  /** Rough count of modules currently triggered by the partial context. */
  moduleCount: number;
  /** Soft encouragement line, adapts to whether highlights were found. */
  encouragement: string;
};

const BLOCK_LABELS: Record<number, string> = {
  0: "Block A · Ernährung ✓",
  1: "Block B · Flüssigkeit & Substanzen ✓",
  2: "Block C · Schlaf ✓",
  3: "Block D · Bewegung & Stress ✓",
};

type PartialCtx = {
  draft: Partial<Lifestyle>;
  profile: Profile | null;
  health: Health | null;
  analysis: Analysis | null;
};

/**
 * Turn the partial draft into a Lifestyle shape that satisfies the strict
 * schema *structurally* — missing answers become empty strings / zero-like
 * values so no trigger fires on them. Existing matchers already handle
 * undefined gracefully, but we keep this wrapper to avoid TS type gymnastics
 * at call sites.
 */
function asLifestyle(draft: Partial<Lifestyle>): Lifestyle {
  return {
    diet: draft.diet ?? "",
    meals_per_day: draft.meals_per_day ?? "",
    fish_per_week: draft.fish_per_week ?? "",
    processed_food: draft.processed_food ?? "",
    veg_fruit: draft.veg_fruit ?? "",
    water: draft.water ?? "",
    coffee: draft.coffee ?? "",
    alcohol: draft.alcohol ?? "",
    smoking: draft.smoking ?? "",
    sleep_hours: draft.sleep_hours ?? "",
    sleep_quality: draft.sleep_quality ?? 3,
    night_wake: draft.night_wake ?? "",
    morning_energy: draft.morning_energy ?? 3,
    sport_frequency: draft.sport_frequency ?? "",
    sport_type: draft.sport_type ?? [],
    sitting_hours: draft.sitting_hours ?? "",
    stress_level: draft.stress_level ?? 3,
    outdoor_time: draft.outdoor_time ?? "",
    energy_low: draft.energy_low ?? 3,
    symptoms: draft.symptoms ?? [],
  };
}

/**
 * Run the real rule engine against the partial context to give the user a
 * rough count of modules that already match. No names exposed — just the
 * number, so there's no spoiler or pressure effect.
 */
export function estimateModuleCount(partial: PartialCtx): number {
  if (!partial.profile || !partial.health) return 0;
  const ctx: RecommendContext = {
    biomarkers: partial.analysis?.biomarkers ?? [],
    profile: partial.profile,
    health: partial.health,
    lifestyle: asLifestyle(partial.draft),
  };
  return recommendProducts(ctx, 20).length;
}

/**
 * Highlights specific to the block the user just finished. Each entry is a
 * narrative observation ("was detected", not "what we recommend"). Tone is
 * reassuring and neutral — avoid naming supplements.
 */
function highlightsForBlock(blockIndex: number, draft: Partial<Lifestyle>): string[] {
  const out: string[] = [];
  switch (blockIndex) {
    case 0: {
      const fish = draft.fish_per_week;
      if (draft.diet === "Vegan" || draft.diet === "Vegetarisch") {
        out.push("Pflanzliche Ernährung erkannt — B12, Eisen und Omega-3 im Blick.");
      }
      if (fish === "Nie" || fish === "1×") {
        out.push("Wenig Fisch auf dem Teller — Omega-3-Lücke identifiziert.");
      }
      if (draft.veg_fruit === "0–1" || draft.veg_fruit === "2–3") {
        out.push("Wenig frisches Gemüse/Obst — Mikronährstoff-Support sinnvoll.");
      }
      if (
        draft.processed_food === "Täglich" ||
        draft.processed_food === "Mehrmals pro Woche"
      ) {
        out.push("Häufig verarbeitete Kost — entzündungs-modulierende Bausteine mitgedacht.");
      }
      break;
    }
    case 1: {
      if (draft.alcohol === "Täglich" || draft.alcohol === "Fast täglich") {
        out.push("Regelmäßiger Alkoholkonsum — Leber- und B-Komplex-Support vermerkt.");
      }
      if (draft.smoking === "Täglich" || draft.smoking === "Gelegentlich") {
        out.push("Nikotin im Profil — Antioxidantien-Stack adressiert.");
      }
      if (draft.coffee === "5+") {
        out.push("Viel Koffein — Magnesium-Balance besonders relevant.");
      }
      if (draft.water === "<1 L" || draft.water === "1–1,5 L") {
        out.push("Geringe Flüssigkeitszufuhr — wir behalten Elektrolyt-Haushalt im Auge.");
      }
      break;
    }
    case 2: {
      if ((draft.sleep_quality ?? 3) <= 2) {
        out.push("Schlafqualität niedrig — Schlaf-Support wird zum Kern-Thema.");
      }
      if (draft.sleep_hours === "<5" || draft.sleep_hours === "5–6") {
        out.push("Kurze Schlafphasen — Regenerations-Bausteine priorisiert.");
      }
      if (draft.night_wake === "Mehrmals" || draft.night_wake === "Ständig") {
        out.push("Häufiges nächtliches Aufwachen — nächtliche Stabilisierung im Blick.");
      }
      if ((draft.morning_energy ?? 3) <= 2) {
        out.push("Schwacher Morgenstart — Energie-Aufbau bei der Aktivierung eingeplant.");
      }
      break;
    }
    case 3: {
      if ((draft.stress_level ?? 3) >= 4) {
        out.push("Hoher Stress-Druck — Adaptogene und Nervensystem-Support vermerkt.");
      }
      const sport = draft.sport_frequency;
      if (sport === "5–6×" || sport === "Täglich") {
        out.push("Häufiges Training — Trainings-Stack mit Mineralstoff-Fokus eingeplant.");
      }
      if (draft.sitting_hours === "8–10" || draft.sitting_hours === "10+") {
        out.push("Viel Sitzen im Alltag — Zirkulations- und Gelenk-Support im Blick.");
      }
      const types = draft.sport_type ?? [];
      if (types.includes("Kraftsport") || types.includes("HIIT")) {
        out.push("Intensive Sportart — Regenerations- und Energie-Bausteine vorgesehen.");
      }
      break;
    }
    default:
      break;
  }
  // Max 2 Highlights pro Block — sonst wird's zu viel auf einmal.
  return out.slice(0, 2);
}

const ENCOURAGEMENT_WITH_HITS = [
  "Läuft.",
  "Nimmt Form an.",
  "Das Profil wird schärfer.",
  "Gute Signale.",
];
const ENCOURAGEMENT_CLEAN = [
  "Stabiles Fundament.",
  "Unauffällig — das ist ein gutes Zeichen.",
  "Bisher alles im grünen Bereich.",
];

function pickEncouragement(blockIndex: number, hits: number): string {
  const pool = hits > 0 ? ENCOURAGEMENT_WITH_HITS : ENCOURAGEMENT_CLEAN;
  return pool[blockIndex % pool.length];
}

/**
 * Produce the insight card shown BEFORE block (blockIndex+1) renders — i.e.
 * after the user finished `blockIndex`. Returns null if there is nothing
 * meaningful to say yet (block index out of range or context incomplete).
 */
export function buildBlockInsight(
  blockIndex: number,
  partial: PartialCtx,
): BlockInsight | null {
  if (!(blockIndex in BLOCK_LABELS)) return null;
  const highlights = highlightsForBlock(blockIndex, partial.draft);
  const moduleCount = estimateModuleCount(partial);
  return {
    blockLabel: BLOCK_LABELS[blockIndex],
    highlights,
    moduleCount,
    encouragement: pickEncouragement(blockIndex, highlights.length),
  };
}
