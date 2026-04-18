import type { Biomarker, BiomarkerStatus, Sex } from "./types";

/**
 * Reference ranges used for deterministic biomarker scoring.
 * "reference" = standard lab normal range. "optimal" = longevity-oriented tighter target.
 * Values are the common German lab units. Sources: DGE / Labor Lademannbogen / longevity literature.
 * NOTE: Not medical advice — used only for orientation. HWG-safe wording lives in UI.
 */

export type Range = {
  min?: number;
  max?: number;
};

export type MarkerDef = {
  key: string;
  /** Display name (German). */
  name: string;
  /** Aliases that may appear on lab reports — matched case-insensitively against extracted names. */
  aliases: string[];
  unit: string;
  /** Alternative units accepted from labs; value will be converted using `convert` if present. */
  altUnits?: Array<{ unit: string; factor: number }>;
  category:
    | "Vitamine"
    | "Mineralstoffe"
    | "Fettstoffwechsel"
    | "Zuckerstoffwechsel"
    | "Schilddrüse"
    | "Leber & Niere"
    | "Entzündung"
    | "Hormone"
    | "Blutbild"
    | "Sonstige";
  reference: Range;
  optimal: Range;
  /** Sex-specific override (overrides reference + optimal when provided). */
  bySex?: Partial<Record<Sex, { reference?: Range; optimal?: Range }>>;
};

export const MARKER_DEFS: MarkerDef[] = [
  // ── Vitamine ──
  {
    key: "vitamin_d",
    name: "Vitamin D (25-OH)",
    aliases: ["vitamin d", "25-oh", "25(oh)d", "calcidiol"],
    unit: "ng/ml",
    altUnits: [{ unit: "nmol/l", factor: 0.4 }],
    category: "Vitamine",
    reference: { min: 20, max: 100 },
    optimal: { min: 40, max: 70 },
  },
  {
    key: "vitamin_b12",
    name: "Vitamin B12 (Holo-TC)",
    aliases: ["vitamin b12", "b12", "holotranscobalamin", "holo-tc", "cobalamin"],
    unit: "pmol/l",
    category: "Vitamine",
    reference: { min: 50, max: 150 },
    optimal: { min: 70, max: 130 },
  },
  {
    key: "folate",
    name: "Folsäure",
    aliases: ["folat", "folsäure", "folate", "folic acid"],
    unit: "ng/ml",
    category: "Vitamine",
    reference: { min: 4, max: 20 },
    optimal: { min: 8, max: 20 },
  },
  // ── Mineralstoffe ──
  {
    key: "ferritin",
    name: "Ferritin",
    aliases: ["ferritin"],
    unit: "µg/l",
    altUnits: [{ unit: "ng/ml", factor: 1 }],
    category: "Mineralstoffe",
    reference: { min: 30, max: 300 },
    optimal: { min: 70, max: 200 },
    bySex: {
      female: { reference: { min: 15, max: 200 }, optimal: { min: 50, max: 150 } },
      male: { reference: { min: 30, max: 400 }, optimal: { min: 70, max: 200 } },
    },
  },
  {
    key: "iron",
    name: "Eisen",
    aliases: ["eisen", "iron", "fe"],
    unit: "µg/dl",
    category: "Mineralstoffe",
    reference: { min: 60, max: 170 },
    optimal: { min: 80, max: 140 },
  },
  {
    key: "transferrin_saturation",
    name: "Transferrinsättigung",
    aliases: ["transferrinsättigung", "tfs", "transferrin saturation"],
    unit: "%",
    category: "Mineralstoffe",
    reference: { min: 16, max: 45 },
    optimal: { min: 25, max: 40 },
  },
  {
    key: "magnesium",
    name: "Magnesium",
    aliases: ["magnesium", "mg"],
    unit: "mmol/l",
    category: "Mineralstoffe",
    reference: { min: 0.75, max: 1.05 },
    optimal: { min: 0.85, max: 1.05 },
  },
  {
    key: "zinc",
    name: "Zink",
    aliases: ["zink", "zinc", "zn"],
    unit: "µg/dl",
    category: "Mineralstoffe",
    reference: { min: 60, max: 120 },
    optimal: { min: 85, max: 115 },
  },
  {
    key: "selenium",
    name: "Selen",
    aliases: ["selen", "selenium", "se"],
    unit: "µg/l",
    category: "Mineralstoffe",
    reference: { min: 80, max: 140 },
    optimal: { min: 110, max: 140 },
  },
  // ── Zuckerstoffwechsel ──
  {
    key: "hba1c",
    name: "HbA1c",
    aliases: ["hba1c", "glykohämoglobin", "hb a1c"],
    unit: "%",
    category: "Zuckerstoffwechsel",
    reference: { max: 5.7 },
    optimal: { max: 5.3 },
  },
  {
    key: "glucose_fasting",
    name: "Nüchternglukose",
    aliases: ["glukose", "glucose", "blutzucker nüchtern", "nüchternglukose"],
    unit: "mg/dl",
    altUnits: [{ unit: "mmol/l", factor: 18.02 }],
    category: "Zuckerstoffwechsel",
    reference: { min: 70, max: 99 },
    optimal: { min: 75, max: 90 },
  },
  {
    key: "insulin_fasting",
    name: "Nüchtern-Insulin",
    aliases: ["insulin", "nüchterninsulin"],
    unit: "µU/ml",
    category: "Zuckerstoffwechsel",
    reference: { min: 2, max: 25 },
    optimal: { min: 2, max: 8 },
  },
  // ── Fettstoffwechsel ──
  {
    key: "ldl",
    name: "LDL-Cholesterin",
    aliases: ["ldl", "ldl-cholesterin"],
    unit: "mg/dl",
    altUnits: [{ unit: "mmol/l", factor: 38.67 }],
    category: "Fettstoffwechsel",
    reference: { max: 160 },
    optimal: { max: 115 },
  },
  {
    key: "hdl",
    name: "HDL-Cholesterin",
    aliases: ["hdl", "hdl-cholesterin"],
    unit: "mg/dl",
    altUnits: [{ unit: "mmol/l", factor: 38.67 }],
    category: "Fettstoffwechsel",
    reference: { min: 40 },
    optimal: { min: 55 },
    bySex: {
      female: { reference: { min: 45 }, optimal: { min: 60 } },
    },
  },
  {
    key: "triglycerides",
    name: "Triglyzeride",
    aliases: ["triglyzeride", "triglyceride"],
    unit: "mg/dl",
    altUnits: [{ unit: "mmol/l", factor: 88.57 }],
    category: "Fettstoffwechsel",
    reference: { max: 150 },
    optimal: { max: 100 },
  },
  {
    key: "total_cholesterol",
    name: "Gesamt-Cholesterin",
    aliases: ["gesamtcholesterin", "cholesterin gesamt", "total cholesterol"],
    unit: "mg/dl",
    altUnits: [{ unit: "mmol/l", factor: 38.67 }],
    category: "Fettstoffwechsel",
    reference: { max: 200 },
    optimal: { max: 180 },
  },
  // ── Entzündung ──
  {
    key: "crp_hs",
    name: "CRP (hochsensitiv)",
    aliases: ["crp", "hs-crp", "c-reaktives protein"],
    unit: "mg/l",
    category: "Entzündung",
    reference: { max: 5 },
    optimal: { max: 1 },
  },
  {
    key: "homocysteine",
    name: "Homocystein",
    aliases: ["homocystein", "homocysteine", "hcy"],
    unit: "µmol/l",
    category: "Entzündung",
    reference: { max: 15 },
    optimal: { max: 8 },
  },
  // ── Schilddrüse ──
  {
    key: "tsh",
    name: "TSH",
    aliases: ["tsh", "thyreotropin"],
    unit: "mU/l",
    altUnits: [{ unit: "µu/ml", factor: 1 }],
    category: "Schilddrüse",
    reference: { min: 0.4, max: 4.0 },
    optimal: { min: 0.8, max: 2.0 },
  },
  {
    key: "ft3",
    name: "fT3",
    aliases: ["ft3", "freies t3"],
    unit: "pg/ml",
    category: "Schilddrüse",
    reference: { min: 2.3, max: 4.2 },
    optimal: { min: 3.0, max: 4.0 },
  },
  {
    key: "ft4",
    name: "fT4",
    aliases: ["ft4", "freies t4"],
    unit: "ng/dl",
    category: "Schilddrüse",
    reference: { min: 0.8, max: 1.9 },
    optimal: { min: 1.1, max: 1.6 },
  },
  // ── Leber & Niere ──
  {
    key: "creatinine",
    name: "Kreatinin",
    aliases: ["kreatinin", "creatinine"],
    unit: "mg/dl",
    category: "Leber & Niere",
    reference: { min: 0.6, max: 1.3 },
    optimal: { min: 0.7, max: 1.1 },
  },
  {
    key: "egfr",
    name: "eGFR",
    aliases: ["egfr", "gfr"],
    unit: "ml/min",
    category: "Leber & Niere",
    reference: { min: 60 },
    optimal: { min: 90 },
  },
  {
    key: "uric_acid",
    name: "Harnsäure",
    aliases: ["harnsäure", "uric acid"],
    unit: "mg/dl",
    category: "Leber & Niere",
    reference: { min: 2.5, max: 7.0 },
    optimal: { min: 3.5, max: 5.5 },
  },
  {
    key: "alt",
    name: "GPT (ALT)",
    aliases: ["alt", "gpt", "alat"],
    unit: "U/l",
    category: "Leber & Niere",
    reference: { max: 45 },
    optimal: { max: 25 },
  },
  {
    key: "ast",
    name: "GOT (AST)",
    aliases: ["ast", "got", "asat"],
    unit: "U/l",
    category: "Leber & Niere",
    reference: { max: 45 },
    optimal: { max: 25 },
  },
  {
    key: "ggt",
    name: "GGT",
    aliases: ["ggt", "gamma-gt", "γ-gt"],
    unit: "U/l",
    category: "Leber & Niere",
    reference: { max: 60 },
    optimal: { max: 25 },
  },
  // ── Hormone ──
  {
    key: "testosterone",
    name: "Testosteron",
    aliases: ["testosteron", "testosterone"],
    unit: "ng/dl",
    category: "Hormone",
    reference: { min: 250, max: 1000 },
    optimal: { min: 500, max: 900 },
    bySex: {
      female: { reference: { min: 15, max: 70 }, optimal: { min: 30, max: 60 } },
      male: { reference: { min: 250, max: 1000 }, optimal: { min: 500, max: 900 } },
    },
  },
  {
    key: "estradiol",
    name: "Östradiol",
    aliases: ["östradiol", "estradiol", "e2"],
    unit: "pg/ml",
    category: "Hormone",
    reference: { min: 15, max: 350 },
    optimal: { min: 50, max: 250 },
  },
  // ── Blutbild ──
  {
    key: "hemoglobin",
    name: "Hämoglobin",
    aliases: ["hämoglobin", "hemoglobin", "hb"],
    unit: "g/dl",
    category: "Blutbild",
    reference: { min: 12, max: 17.5 },
    optimal: { min: 13.5, max: 16 },
    bySex: {
      female: { reference: { min: 12, max: 16 }, optimal: { min: 13, max: 15 } },
      male: { reference: { min: 13.5, max: 17.5 }, optimal: { min: 14, max: 16.5 } },
    },
  },
  {
    key: "omega_3_index",
    name: "Omega-3-Index",
    aliases: ["omega-3-index", "omega 3 index", "o3-index"],
    unit: "%",
    category: "Sonstige",
    reference: { min: 4 },
    optimal: { min: 8 },
  },
];

const MARKER_BY_KEY: Map<string, MarkerDef> = new Map(MARKER_DEFS.map((m) => [m.key, m]));

/** Find a marker definition by extracted display name (fuzzy, case-insensitive). */
export function findMarkerDef(name: string): MarkerDef | undefined {
  const needle = name.trim().toLowerCase();
  for (const def of MARKER_DEFS) {
    if (def.name.toLowerCase() === needle) return def;
    if (def.aliases.some((a) => a.toLowerCase() === needle)) return def;
  }
  // Fallback: substring / startsWith
  for (const def of MARKER_DEFS) {
    if (
      def.aliases.some((a) => needle.includes(a.toLowerCase())) ||
      needle.includes(def.name.toLowerCase())
    ) {
      return def;
    }
  }
  return undefined;
}

export function getMarkerDef(key: string): MarkerDef | undefined {
  return MARKER_BY_KEY.get(key);
}

/** Pick ranges for this sex, falling back to the default. */
export function getRanges(def: MarkerDef, sex: Sex | undefined) {
  const sexOverride = sex && def.bySex ? def.bySex[sex] : undefined;
  return {
    reference: sexOverride?.reference ?? def.reference,
    optimal: sexOverride?.optimal ?? def.optimal,
  };
}

/** Compute status given a value, reference and optimal ranges. */
export function computeStatus(
  value: number,
  reference: Range,
  optimal: Range,
): BiomarkerStatus {
  const refMin = reference.min;
  const refMax = reference.max;
  const optMin = optimal.min;
  const optMax = optimal.max;

  // Critical: way outside reference
  if (refMin !== undefined && value < refMin * 0.7) return "critical";
  if (refMax !== undefined && value > refMax * 1.3) return "critical";

  // Outside reference
  if (refMin !== undefined && value < refMin) return "low";
  if (refMax !== undefined && value > refMax) return "high";

  // Within reference but outside optimal
  if (optMin !== undefined && value < optMin) return "suboptimal";
  if (optMax !== undefined && value > optMax) return "suboptimal";

  return "optimal";
}

/** Convert an extracted raw marker to our normalized Biomarker. */
export function scoreExtracted(
  extractedName: string,
  value: number,
  unit: string,
  sex: Sex | undefined,
): Biomarker | null {
  const def = findMarkerDef(extractedName);
  if (!def) return null;

  let normalizedValue = value;
  const reportedUnit = unit.trim().toLowerCase();
  if (reportedUnit !== def.unit.toLowerCase() && def.altUnits) {
    const alt = def.altUnits.find((a) => a.unit.toLowerCase() === reportedUnit);
    if (alt) normalizedValue = value * alt.factor;
  }

  const { reference, optimal } = getRanges(def, sex);
  const status = computeStatus(normalizedValue, reference, optimal);

  return {
    key: def.key,
    name: def.name,
    value: normalizedValue,
    unit: def.unit,
    reference_min: reference.min ?? null,
    reference_max: reference.max ?? null,
    optimal_min: optimal.min ?? null,
    optimal_max: optimal.max ?? null,
    status,
    category: def.category,
  };
}

/** Derive a 0–100 longevity score from biomarkers + lifestyle hints. */
export function computeLongevityScore(biomarkers: Biomarker[], lifestylePenalty = 0): number {
  if (biomarkers.length === 0) return 50;
  const weights: Record<BiomarkerStatus, number> = {
    optimal: 100,
    suboptimal: 70,
    low: 45,
    high: 45,
    critical: 15,
    unknown: 50,
  };
  const sum = biomarkers.reduce((acc, b) => acc + weights[b.status], 0);
  const avg = sum / biomarkers.length;
  return Math.round(Math.max(0, Math.min(100, avg - lifestylePenalty)));
}
