import type { Sex } from "./types";

export type Trigger =
  | { kind: "biomarker_status"; key: string; statuses: Array<"low" | "high" | "suboptimal" | "critical"> }
  | { kind: "goal"; value: string }
  | { kind: "symptom"; value: string }
  | { kind: "condition"; value: string }
  | { kind: "medication"; value: string }
  | { kind: "allergy"; value: string }
  | { kind: "pregnancy"; value: "pregnant" | "breastfeeding" | "trying" | "none" }
  | { kind: "diet"; value: string }
  | { kind: "lifestyle_score"; field: LifestyleScoreField; op: "<=" | ">=" | "=="; value: number }
  | { kind: "lifestyle_category"; field: LifestyleCategoryField; values: string[] }
  | { kind: "lifestyle_multi"; field: "sport_type" | "symptoms"; values: string[] };

export type LifestyleScoreField =
  | "sleep_quality"
  | "morning_energy"
  | "stress_level"
  | "energy_low";

export type LifestyleCategoryField =
  | "diet"
  | "meals_per_day"
  | "fish_per_week"
  | "processed_food"
  | "veg_fruit"
  | "water"
  | "coffee"
  | "alcohol"
  | "smoking"
  | "sleep_hours"
  | "night_wake"
  | "sport_frequency"
  | "sitting_hours"
  | "outdoor_time";

export type Product = {
  id: string;
  name: string;
  dosage: string;
  timing: "morgens" | "mittags" | "abends" | "mit Mahlzeit" | "2x täglich";
  pill_color: string;
  pill_shape: "capsule" | "round" | "oval";
  category: string;
  short_benefit: string;
  price_single: number;
  price_subscription: number;
  /** Sex restriction — only recommend for listed sexes. If omitted, applies to all. */
  sex?: Sex[];
  /** Minimum age for recommendation. */
  min_age?: number;
  triggers: Trigger[];
  /** Contraindication IDs (see contraindications.ts) — if any matches user state, product is filtered out. */
  contraindications: string[];
  /** Interaction notes rendered in the UI when certain meds/conditions are present. */
  interactions: Array<{ when: string; note: string }>;
  /** Impact weight used for ranking inside the box. */
  base_score: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "vitamin_d3_k2",
    name: "Vitamin D3 + K2",
    dosage: "4000 IE D3 + 100 µg K2",
    timing: "mit Mahlzeit",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Vitamine",
    short_benefit: "Knochen, Immunsystem, Hormonbalance",
    price_single: 18.9,
    price_subscription: 15.9,
    triggers: [
      { kind: "biomarker_status", key: "vitamin_d", statuses: ["low", "suboptimal", "critical"] },
      { kind: "goal", value: "Immunsystem" },
      { kind: "goal", value: "Longevity" },
      { kind: "lifestyle_category", field: "outdoor_time", values: ["Selten", "Fast nie"] },
    ],
    contraindications: ["blood_thinner_strict"],
    interactions: [
      { when: "blood_thinner", note: "Bei Marcumar/Warfarin ärztliche Absprache wegen Vitamin K2." },
    ],
    base_score: 9,
  },
  {
    id: "magnesium_glycinate",
    name: "Magnesium-Glycinat",
    dosage: "400 mg",
    timing: "abends",
    pill_color: "#2F3E32",
    pill_shape: "round",
    category: "Mineralstoffe",
    short_benefit: "Schlaf, Muskelentspannung, Nervensystem",
    price_single: 14.9,
    price_subscription: 12.9,
    triggers: [
      { kind: "biomarker_status", key: "magnesium", statuses: ["low", "suboptimal"] },
      { kind: "goal", value: "Schlaf" },
      { kind: "goal", value: "Stressabbau" },
      { kind: "lifestyle_score", field: "sleep_quality", op: "<=", value: 2 },
      { kind: "lifestyle_score", field: "stress_level", op: ">=", value: 4 },
      { kind: "symptom", value: "Muskelkrämpfe" },
      { kind: "symptom", value: "Kopfschmerzen" },
    ],
    contraindications: ["kidney_disease_severe"],
    interactions: [],
    base_score: 8,
  },
  {
    id: "omega3_fish",
    name: "Omega-3 (Fischöl)",
    dosage: "2 g EPA/DHA",
    timing: "mit Mahlzeit",
    pill_color: "#D4736B",
    pill_shape: "capsule",
    category: "Fettsäuren",
    short_benefit: "Herz-Kreislauf, Entzündung, Gehirn",
    price_single: 22.9,
    price_subscription: 19.9,
    triggers: [
      { kind: "biomarker_status", key: "omega_3_index", statuses: ["low", "suboptimal"] },
      { kind: "biomarker_status", key: "crp_hs", statuses: ["high", "suboptimal"] },
      { kind: "biomarker_status", key: "triglycerides", statuses: ["high", "suboptimal"] },
      { kind: "lifestyle_category", field: "fish_per_week", values: ["Nie", "1×"] },
      { kind: "goal", value: "Longevity" },
    ],
    contraindications: ["fish_allergy", "high_dose_blood_thinner"],
    interactions: [
      { when: "blood_thinner", note: "Bei Blutverdünnern Dosis mit Arzt abstimmen." },
    ],
    base_score: 9,
  },
  {
    id: "omega3_algae",
    name: "Omega-3 (Algenöl, vegan)",
    dosage: "2 g EPA/DHA",
    timing: "mit Mahlzeit",
    pill_color: "#8FA68E",
    pill_shape: "capsule",
    category: "Fettsäuren",
    short_benefit: "Vegane Quelle für EPA/DHA",
    price_single: 29.9,
    price_subscription: 25.9,
    triggers: [
      { kind: "biomarker_status", key: "omega_3_index", statuses: ["low", "suboptimal"] },
      { kind: "diet", value: "Vegan" },
      { kind: "diet", value: "Vegetarisch" },
      { kind: "allergy", value: "Fisch-/Meeresfrüchte-Allergie" },
    ],
    contraindications: ["high_dose_blood_thinner"],
    interactions: [],
    base_score: 9,
  },
  {
    id: "b_complex_active",
    name: "B-Komplex aktiv (methyliert)",
    dosage: "1 Kapsel",
    timing: "morgens",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Vitamine",
    short_benefit: "Energiestoffwechsel, Homocystein, Nerven",
    price_single: 19.9,
    price_subscription: 16.9,
    triggers: [
      { kind: "biomarker_status", key: "homocysteine", statuses: ["high", "suboptimal"] },
      { kind: "biomarker_status", key: "vitamin_b12", statuses: ["low", "suboptimal"] },
      { kind: "biomarker_status", key: "folate", statuses: ["low", "suboptimal"] },
      { kind: "diet", value: "Vegan" },
      { kind: "diet", value: "Vegetarisch" },
      { kind: "lifestyle_category", field: "alcohol", values: ["Täglich", "Fast täglich"] },
      { kind: "symptom", value: "Müdigkeit" },
      { kind: "symptom", value: "Konzentrationsprobleme" },
    ],
    contraindications: [],
    interactions: [],
    base_score: 8,
  },
  {
    id: "vitamin_b12_methyl",
    name: "Vitamin B12 (Methylcobalamin)",
    dosage: "1000 µg",
    timing: "morgens",
    pill_color: "#D4736B",
    pill_shape: "round",
    category: "Vitamine",
    short_benefit: "Energie, Nervensystem, Hämatopoese",
    price_single: 12.9,
    price_subscription: 10.9,
    triggers: [
      { kind: "biomarker_status", key: "vitamin_b12", statuses: ["low", "suboptimal", "critical"] },
      { kind: "diet", value: "Vegan" },
      { kind: "medication", value: "Protonenpumpenhemmer (Omeprazol, Pantoprazol)" },
      { kind: "medication", value: "Insulin / Metformin" },
    ],
    contraindications: [],
    interactions: [],
    base_score: 8,
  },
  {
    id: "zinc_picolinate",
    name: "Zink-Picolinat",
    dosage: "15 mg",
    timing: "abends",
    pill_color: "#94A3A0",
    pill_shape: "round",
    category: "Mineralstoffe",
    short_benefit: "Immunsystem, Haut, Hormone",
    price_single: 11.9,
    price_subscription: 9.9,
    triggers: [
      { kind: "biomarker_status", key: "zinc", statuses: ["low", "suboptimal"] },
      { kind: "goal", value: "Immunsystem" },
      { kind: "goal", value: "Hautbild" },
      { kind: "symptom", value: "Haarausfall" },
      { kind: "symptom", value: "Hautprobleme" },
      { kind: "symptom", value: "Infektanfälligkeit" },
      { kind: "diet", value: "Vegan" },
    ],
    contraindications: [],
    interactions: [
      { when: "thyroid_medication", note: "Einnahme zeitlich zu L-Thyroxin versetzen (mind. 4 h)." },
    ],
    base_score: 7,
  },
  {
    id: "vitamin_c",
    name: "Vitamin C (liposomal)",
    dosage: "1000 mg",
    timing: "morgens",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Vitamine",
    short_benefit: "Antioxidativ, Immunsystem, Kollagen",
    price_single: 17.9,
    price_subscription: 14.9,
    triggers: [
      { kind: "goal", value: "Immunsystem" },
      { kind: "goal", value: "Hautbild" },
      { kind: "lifestyle_category", field: "smoking", values: ["Täglich", "Gelegentlich", "Vapen/E-Zigarette"] },
      { kind: "lifestyle_category", field: "veg_fruit", values: ["0–1", "2–3"] },
    ],
    contraindications: ["hemochromatosis"],
    interactions: [],
    base_score: 6,
  },
  {
    id: "probiotics",
    name: "Probiotika (10 Stämme)",
    dosage: "1 Kapsel, 20 Mrd. KBE",
    timing: "morgens",
    pill_color: "#8FA68E",
    pill_shape: "capsule",
    category: "Darmgesundheit",
    short_benefit: "Mikrobiom, Verdauung, Immunsystem",
    price_single: 24.9,
    price_subscription: 21.9,
    triggers: [
      { kind: "goal", value: "Verdauung" },
      { kind: "goal", value: "Immunsystem" },
      { kind: "symptom", value: "Verdauungsbeschwerden" },
      { kind: "condition", value: "Reizdarm" },
      { kind: "condition", value: "Reflux" },
      { kind: "medication", value: "Protonenpumpenhemmer (Omeprazol, Pantoprazol)" },
    ],
    contraindications: ["immunosuppressed"],
    interactions: [],
    base_score: 7,
  },
  {
    id: "collagen",
    name: "Kollagen-Peptide",
    dosage: "10 g",
    timing: "morgens",
    pill_color: "#EDE8DF",
    pill_shape: "capsule",
    category: "Bindegewebe",
    short_benefit: "Haut, Gelenke, Bindegewebe",
    price_single: 29.9,
    price_subscription: 24.9,
    triggers: [
      { kind: "goal", value: "Hautbild" },
      { kind: "symptom", value: "Brüchige Nägel" },
      { kind: "symptom", value: "Gelenkschmerzen" },
      { kind: "condition", value: "Arthrose" },
    ],
    contraindications: [],
    interactions: [],
    base_score: 5,
  },
  {
    id: "curcumin",
    name: "Kurkuma (Curcumin C3)",
    dosage: "500 mg + Piperin",
    timing: "mit Mahlzeit",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Pflanzlich",
    short_benefit: "Entzündungsmodulation, Gelenke",
    price_single: 19.9,
    price_subscription: 16.9,
    triggers: [
      { kind: "biomarker_status", key: "crp_hs", statuses: ["high", "suboptimal"] },
      { kind: "symptom", value: "Gelenkschmerzen" },
      { kind: "goal", value: "Longevity" },
    ],
    contraindications: ["blood_thinner_strict", "pregnancy"],
    interactions: [
      { when: "blood_thinner", note: "Kurkuma kann blutverdünnend wirken — bitte ärztliche Rücksprache." },
    ],
    base_score: 6,
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha (KSM-66)",
    dosage: "600 mg",
    timing: "abends",
    pill_color: "#2F3E32",
    pill_shape: "capsule",
    category: "Pflanzlich",
    short_benefit: "Stressadaptation, Schlaf",
    price_single: 21.9,
    price_subscription: 18.9,
    triggers: [
      { kind: "goal", value: "Stressabbau" },
      { kind: "goal", value: "Schlaf" },
      { kind: "lifestyle_score", field: "stress_level", op: ">=", value: 4 },
      { kind: "lifestyle_score", field: "sleep_quality", op: "<=", value: 2 },
      { kind: "symptom", value: "Stimmungsschwankungen" },
    ],
    contraindications: ["pregnancy", "thyroid_hyper", "autoimmune_active"],
    interactions: [
      { when: "thyroid_medication", note: "Kann Schilddrüsenaktivität erhöhen — bei Hashimoto/L-Thyroxin Rücksprache." },
    ],
    base_score: 6,
  },
  {
    id: "creatine",
    name: "Kreatin-Monohydrat",
    dosage: "5 g",
    timing: "morgens",
    pill_color: "#EDE8DF",
    pill_shape: "round",
    category: "Sport",
    short_benefit: "Kraft, Kognition, Energiestoffwechsel",
    price_single: 17.9,
    price_subscription: 14.9,
    triggers: [
      { kind: "goal", value: "Muskelaufbau" },
      { kind: "goal", value: "Fokus" },
      { kind: "goal", value: "Longevity" },
      { kind: "lifestyle_category", field: "sport_frequency", values: ["3–4×", "5–6×", "Täglich"] },
      { kind: "lifestyle_multi", field: "sport_type", values: ["Kraftsport", "HIIT"] },
    ],
    contraindications: ["kidney_disease_severe"],
    interactions: [],
    base_score: 6,
  },
  {
    id: "coq10",
    name: "CoQ10 (Ubiquinol)",
    dosage: "100 mg",
    timing: "morgens",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Mitochondrial",
    short_benefit: "Zellenergie, Herz, Kognition",
    price_single: 24.9,
    price_subscription: 21.9,
    triggers: [
      { kind: "medication", value: "Cholesterinsenker (Statine)" },
      { kind: "goal", value: "Energie" },
      { kind: "goal", value: "Longevity" },
    ],
    contraindications: [],
    interactions: [],
    base_score: 5,
    min_age: 35,
  },
  {
    id: "iron_bisglycinate",
    name: "Eisen-Bisglycinat",
    dosage: "20 mg",
    timing: "morgens",
    pill_color: "#D4736B",
    pill_shape: "capsule",
    category: "Mineralstoffe",
    short_benefit: "Sauerstofftransport, Energie",
    price_single: 15.9,
    price_subscription: 13.9,
    triggers: [
      { kind: "biomarker_status", key: "ferritin", statuses: ["low", "suboptimal"] },
      { kind: "biomarker_status", key: "iron", statuses: ["low", "suboptimal"] },
      { kind: "biomarker_status", key: "hemoglobin", statuses: ["low"] },
      { kind: "symptom", value: "Müdigkeit" },
      { kind: "symptom", value: "Haarausfall" },
      { kind: "diet", value: "Vegan" },
      { kind: "diet", value: "Vegetarisch" },
    ],
    sex: ["female"],
    contraindications: ["hemochromatosis"],
    interactions: [],
    base_score: 7,
  },
  {
    id: "folate_mthf",
    name: "Folat (5-MTHF)",
    dosage: "400 µg",
    timing: "morgens",
    pill_color: "#8FA68E",
    pill_shape: "round",
    category: "Vitamine",
    short_benefit: "Zellteilung, Homocystein, Kinderwunsch",
    price_single: 13.9,
    price_subscription: 11.9,
    triggers: [
      { kind: "biomarker_status", key: "folate", statuses: ["low", "suboptimal"] },
      { kind: "pregnancy", value: "trying" },
      { kind: "pregnancy", value: "pregnant" },
      { kind: "biomarker_status", key: "homocysteine", statuses: ["high", "suboptimal"] },
    ],
    sex: ["female"],
    contraindications: [],
    interactions: [],
    base_score: 7,
  },
  {
    id: "vitex",
    name: "Vitex (Mönchspfeffer)",
    dosage: "20 mg Extrakt",
    timing: "morgens",
    pill_color: "#C4964A",
    pill_shape: "round",
    category: "Pflanzlich",
    short_benefit: "Unterstützung im Zyklus",
    price_single: 18.9,
    price_subscription: 15.9,
    triggers: [
      { kind: "symptom", value: "Stimmungsschwankungen" },
      { kind: "condition", value: "PCOS" },
    ],
    sex: ["female"],
    contraindications: ["pregnancy", "hormonal_contraception"],
    interactions: [
      { when: "hormonal_contraception", note: "Kann mit hormoneller Verhütung interferieren — bitte Rücksprache." },
    ],
    base_score: 4,
  },
  {
    id: "inositol",
    name: "Myo-Inositol",
    dosage: "2 g",
    timing: "2x täglich",
    pill_color: "#EDE8DF",
    pill_shape: "capsule",
    category: "Pflanzlich",
    short_benefit: "Unterstützung bei PCOS, Insulinsensitivität",
    price_single: 26.9,
    price_subscription: 22.9,
    triggers: [
      { kind: "condition", value: "PCOS" },
      { kind: "biomarker_status", key: "insulin_fasting", statuses: ["high", "suboptimal"] },
      { kind: "biomarker_status", key: "hba1c", statuses: ["high", "suboptimal"] },
    ],
    sex: ["female"],
    contraindications: [],
    interactions: [],
    base_score: 5,
  },
  {
    id: "saw_palmetto",
    name: "Saw Palmetto",
    dosage: "320 mg Extrakt",
    timing: "mit Mahlzeit",
    pill_color: "#2F3E32",
    pill_shape: "capsule",
    category: "Pflanzlich",
    short_benefit: "Prostata-Unterstützung 45+",
    price_single: 22.9,
    price_subscription: 19.9,
    triggers: [{ kind: "condition", value: "Prostatavergrößerung" }],
    sex: ["male"],
    min_age: 45,
    contraindications: ["blood_thinner_strict"],
    interactions: [],
    base_score: 5,
  },
  {
    id: "boron",
    name: "Bor",
    dosage: "3 mg",
    timing: "morgens",
    pill_color: "#94A3A0",
    pill_shape: "round",
    category: "Mineralstoffe",
    short_benefit: "Knochenstoffwechsel, Testosteron-Regulation",
    price_single: 9.9,
    price_subscription: 8.9,
    triggers: [
      { kind: "biomarker_status", key: "testosterone", statuses: ["low", "suboptimal"] },
      { kind: "condition", value: "Osteopenie" },
      { kind: "condition", value: "Osteoporose" },
    ],
    sex: ["male"],
    contraindications: [],
    interactions: [],
    base_score: 4,
  },
  {
    id: "tongkat_ali",
    name: "Tongkat Ali",
    dosage: "200 mg",
    timing: "morgens",
    pill_color: "#C4964A",
    pill_shape: "capsule",
    category: "Pflanzlich",
    short_benefit: "Testosteron-Support, Energie",
    price_single: 34.9,
    price_subscription: 29.9,
    triggers: [
      { kind: "biomarker_status", key: "testosterone", statuses: ["low", "suboptimal"] },
      { kind: "goal", value: "Libido" },
      { kind: "goal", value: "Energie" },
    ],
    sex: ["male"],
    min_age: 30,
    contraindications: ["autoimmune_active", "prostate_cancer"],
    interactions: [],
    base_score: 5,
  },
];

export const PRODUCT_BY_ID: Map<string, Product> = new Map(PRODUCTS.map((p) => [p.id, p]));
