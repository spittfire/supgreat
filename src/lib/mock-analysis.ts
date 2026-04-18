import type { Analysis } from "./types";
import { scoreExtracted, computeLongevityScore } from "./optimal-ranges";
import type { Sex } from "./types";

/**
 * Deterministic demo bluttest used in mock mode, so the whole flow is clickable
 * without hitting the Claude API. Values span the full status spectrum so the
 * results dashboard has interesting content to render.
 */
const MOCK_RAW: Array<{ name: string; value: number; unit: string }> = [
  { name: "Vitamin D", value: 22, unit: "ng/ml" },
  { name: "Vitamin B12", value: 58, unit: "pmol/l" },
  { name: "Folsäure", value: 6, unit: "ng/ml" },
  { name: "Ferritin", value: 48, unit: "µg/l" },
  { name: "Eisen", value: 95, unit: "µg/dl" },
  { name: "Magnesium", value: 0.78, unit: "mmol/l" },
  { name: "Zink", value: 82, unit: "µg/dl" },
  { name: "HbA1c", value: 5.2, unit: "%" },
  { name: "Glukose", value: 88, unit: "mg/dl" },
  { name: "LDL", value: 142, unit: "mg/dl" },
  { name: "HDL", value: 58, unit: "mg/dl" },
  { name: "Triglyzeride", value: 95, unit: "mg/dl" },
  { name: "Gesamtcholesterin", value: 215, unit: "mg/dl" },
  { name: "CRP", value: 1.8, unit: "mg/l" },
  { name: "Homocystein", value: 9.5, unit: "µmol/l" },
  { name: "TSH", value: 2.3, unit: "mU/l" },
  { name: "Kreatinin", value: 0.9, unit: "mg/dl" },
  { name: "GPT", value: 28, unit: "U/l" },
  { name: "Hämoglobin", value: 14.5, unit: "g/dl" },
  { name: "Omega-3-Index", value: 5.2, unit: "%" },
];

export function mockAnalyze(sex: Sex | undefined): Analysis {
  const biomarkers = [];
  for (const raw of MOCK_RAW) {
    const scored = scoreExtracted(raw.name, raw.value, raw.unit, sex);
    if (scored) biomarkers.push(scored);
  }
  return {
    biomarkers,
    longevity_score: computeLongevityScore(biomarkers),
    lab_name: "Demo-Labor (Mock)",
    collected_at: null,
  };
}
