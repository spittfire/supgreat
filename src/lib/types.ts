import { z } from "zod";

export const SexSchema = z.enum(["male", "female", "diverse"]);
export type Sex = z.infer<typeof SexSchema>;

export const BiomarkerStatusSchema = z.enum([
  "optimal",
  "suboptimal",
  "low",
  "high",
  "critical",
  "unknown",
]);
export type BiomarkerStatus = z.infer<typeof BiomarkerStatusSchema>;

export const BiomarkerSchema = z.object({
  key: z.string(), // normalized id, e.g. "vitamin_d"
  name: z.string(), // display name
  value: z.number(),
  unit: z.string(),
  reference_min: z.number().nullable(),
  reference_max: z.number().nullable(),
  optimal_min: z.number().nullable(),
  optimal_max: z.number().nullable(),
  status: BiomarkerStatusSchema,
  category: z.string(),
});
export type Biomarker = z.infer<typeof BiomarkerSchema>;

export const AnalysisSchema = z.object({
  biomarkers: z.array(BiomarkerSchema),
  lab_name: z.string().nullable().optional(),
  collected_at: z.string().nullable().optional(),
  longevity_score: z.number().min(0).max(100).nullable().optional(),
  biological_age_delta: z.number().nullable().optional(),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

export const ProfileSchema = z.object({
  first_name: z.string().min(1).max(60),
  sex: SexSchema,
  age: z.number().int().min(18).max(100),
  height_cm: z.number().min(120).max(230),
  weight_kg: z.number().min(30).max(250),
  goals: z.array(z.string()).min(1).max(3),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const PregnancySchema = z
  .enum(["none", "pregnant", "breastfeeding", "trying"])
  .nullable();
export type Pregnancy = z.infer<typeof PregnancySchema>;

export const HealthSchema = z.object({
  conditions: z.array(z.string()).default([]),
  surgeries: z.string().default(""),
  medications: z.array(z.string()).default([]),
  medications_freetext: z.string().default(""),
  allergies: z.array(z.string()).default([]),
  pregnancy: PregnancySchema.default(null),
  current_supplements: z.array(z.string()).default([]),
});
export type Health = z.infer<typeof HealthSchema>;

export const LifestyleSchema = z.object({
  // Block A — Ernährung
  diet: z.string(),
  meals_per_day: z.string(),
  fish_per_week: z.string(),
  processed_food: z.string(),
  veg_fruit: z.string(),
  // Block B — Flüssigkeit & Substanzen
  water: z.string(),
  coffee: z.string(),
  alcohol: z.string(),
  smoking: z.string(),
  // Block C — Schlaf
  sleep_hours: z.string(),
  sleep_quality: z.number().int().min(1).max(5),
  night_wake: z.string(),
  morning_energy: z.number().int().min(1).max(5),
  // Block D — Bewegung & Stress
  sport_frequency: z.string(),
  sport_type: z.array(z.string()).default([]),
  sitting_hours: z.string(),
  stress_level: z.number().int().min(1).max(5),
  // Block E — Mental & Umwelt
  outdoor_time: z.string(),
  energy_low: z.number().int().min(1).max(5),
  symptoms: z.array(z.string()).default([]),
});
export type Lifestyle = z.infer<typeof LifestyleSchema>;

export const SupplementRecSchema = z.object({
  id: z.string(),
  name: z.string(),
  dosage: z.string(),
  timing: z.string(),
  category_color: z.string(),
  pill_shape: z.enum(["capsule", "round", "oval"]),
  reason_short: z.string(),
  reason_detail: z.string(),
  data_sources_used: z.array(z.string()),
  warning: z.string().nullable(),
});
export type SupplementRec = z.infer<typeof SupplementRecSchema>;

export const RecommendationSchema = z.object({
  supplements: z.array(SupplementRecSchema),
  overall_assessment: z.string(),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;
